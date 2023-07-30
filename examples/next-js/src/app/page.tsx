"use client";
import useTelegramAuth, {
  type TelegramAuthState,
} from "@use-telegram-auth/hook";

const validateAuthResult = (authResult: TelegramAuthState["authResult"]) =>
  fetch("/validate-telegram-auth-result", {
    method: "POST",
    body: JSON.stringify(authResult),
  }).then((res) => res.json());

export default function Home() {
  const { isLoading, onAuth } = useTelegramAuth(
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID!,
    { windowFeatures: { popup: true } },
    {
      onError: console.error,
      onSuccess(authResult) {
        validateAuthResult(authResult).then(console.log);
      },
    }
  );

  return (
    <main className="flex gap-6">
      <button onClick={() => onAuth()}>Login</button>
      {isLoading && <span>Authenticating...</span>}
    </main>
  );
}
