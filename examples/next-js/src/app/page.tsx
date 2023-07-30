"use client";
import useTelegramAuth, {
  type TelegramAuthState,
} from "@use-telegram-auth/hook";
import { useEffect } from "react";

const validateAuthResult = (authResult: TelegramAuthState["authResult"]) =>
  fetch("/validate-telegram-auth-result", {
    method: "POST",
    body: JSON.stringify(authResult),
  }).then((res) => res.json());

export default function Home() {
  useEffect(() => {
    window.addEventListener("message", (event) => console.log(event));
  }, []);

  const { isLoading, onAuth } = useTelegramAuth(
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID!,
    { windowFeatures: {} },
    {
      onError: console.error,
      onSuccess(authResult) {
        console.log({ authResult });
        validateAuthResult(authResult).then(console.log);
      },
    }
  );

  return (
    <main className="flex h-screen justify-center items-center">
      <button
        className="bg-blue-500 p-2 text-white rounded-md"
        onClick={() => onAuth()}
      >
        {isLoading ? "Authenticating..." : "Login"}
      </button>
    </main>
  );
}
