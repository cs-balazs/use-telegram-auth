export type TGAuthResult = {
  id: number;
  first_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
};

type TGAuthEvent = {
  event: "auth_result";
  result: TGAuthResult;
  origin: string;
};

export type WindowFeatures = Partial<{
  popup: boolean;
  width: number;
  height: number;
  left: number;
  top: number;
  noopener: boolean;
  noreferrer: boolean;
}>;

export type Options<
  Target extends string = "_self" | "_blank" | "_parent" | "_top"
> = Partial<{
  requestAccess: "read" | "write";
  windowTarget: Target;
  windowFeatures: WindowFeatures;
  authTimeoutMs: number;
  windowClosedPollMs: number;
}>;

const timeoutPromise = <ResolveData>(
  promise: Promise<ResolveData>,
  authTimeoutMs: number
) =>
  Promise.race([
    promise,
    new Promise<ResolveData>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Telegram authentication timed out"));
      }, authTimeoutMs);
    }),
  ]);

const telegramAuth = async (botId: string, options: Options = {}) => {
  const {
    requestAccess = "read",
    windowFeatures = {},
    windowTarget = "_blank",
    authTimeoutMs = 120_000,
    windowClosedPollMs = 300,
  } = options;

  const getTgListener =
    (
      resolve: (value: TGAuthResult | PromiseLike<TGAuthResult>) => void,
      reject: (reason?: any) => void
    ) =>
    (event: MessageEvent<any>) => {
      if (event.isTrusted && event.origin === "https://oauth.telegram.org") {
        try {
          const { origin, result } = JSON.parse(event.data) as TGAuthEvent;
          if (origin === window.origin) {
            resolve(result);
          } else {
            reject(
              new Error(
                `Received data contains invalid origin. Expected ${window.origin}, received ${origin}`
              )
            );
          }
        } catch {
          reject(new Error(`Received unexpected message from Telegram`));
        }
      }
    };

  let tgListener: (event: MessageEvent<any>) => void;

  const hasReceivedResponse = new Promise<TGAuthResult>((resolve, reject) => {
    tgListener = getTgListener(resolve, reject);
    window.addEventListener("message", tgListener);
  });

  const searchParams = new URLSearchParams({
    bot_id: botId,
    request_access: requestAccess,
    origin: window.origin,
    lang: "en", // TODO: Should this be a parameter? If so, what is the proper typing?
  });

  const features = Object.entries(windowFeatures)
    .map(([key, val]) => {
      if (typeof val === "number") {
        return `${key}=${val}`;
      }
      return key;
    })
    .join(",");

  const win = window.open(
    `https://oauth.telegram.org/auth?${searchParams}`,
    windowTarget,
    features
  );

  let isClosedInterval: NodeJS.Timer;
  const isClosedPoll = new Promise<void>((resolve, reject) => {
    isClosedInterval = setInterval(() => {
      if (win?.closed) {
        reject(new Error("The authentication window has been closed"));
      }
    }, windowClosedPollMs);
  });

  const result = await Promise.race([
    authTimeoutMs === 0
      ? hasReceivedResponse
      : timeoutPromise(hasReceivedResponse, authTimeoutMs),
    isClosedPoll,
  ]).finally(() => {
    window.removeEventListener("message", tgListener);
    clearInterval(isClosedInterval);
  });

  return result;
};

export default telegramAuth;
