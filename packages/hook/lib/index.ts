import telegramAuth, {
  type TGAuthResult,
  type Options,
  type WindowFeatures,
} from "@use-telegram-auth/client";
import { useState } from "react";

type Params = [
  ...Parameters<typeof telegramAuth>,
  Partial<{
    onSuccess: (authResult: TGAuthResult) => void;
    onError: (error: any) => void;
  }>
];

export type TelegramAuthState =
  | { authResult: TGAuthResult; error: undefined }
  | { error: any; authResult: undefined };

const useTelegramAuth = (
  botId: string,
  options: Options = {},
  {
    onSuccess,
    onError,
  }: Partial<{
    onSuccess: (authResult: TGAuthResult) => void;
    onError: (error: any) => void;
  }> = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authState, setAuthState] = useState<TelegramAuthState>();

  const onAuth = () => {
    setIsLoading(true);
    telegramAuth(botId, options)
      .then((authResult) => {
        setAuthState({ authResult, error: undefined });
        onSuccess?.(authResult);
      })
      .catch((error) => {
        setAuthState({ error, authResult: undefined });
        onError?.(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { onAuth, isLoading, ...authState };
};

export { telegramAuth, type TGAuthResult, type Options, type WindowFeatures };
export default useTelegramAuth;
