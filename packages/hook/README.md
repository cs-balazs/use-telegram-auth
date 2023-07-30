# @use-telegram-auth/hook

React hook wrapper around [@use-telegram-auth/client](https://github.com/cs-balazs/use-telegram-auth/tree/main/packages/client)

## Installation

`npm i @use-telegram-auth/hook`

## Usage

Using default options:

```tsx
import useTelegramAuth from "@use-telegram-auth/hook";

const BOT_ID = "123";

const { onAuth, isLoading } = await useTelegramAuth(BOT_ID);

// Validate the result on server-side!

<button onClick={() => onAuth()}>
  {isLoading ? "Authenticating..." : "Login"}
</button>;
```

Tweaking some options:

```tsx
import useTelegramAuth from "@use-telegram-auth/hook";

const BOT_ID = "123";

const { onAuth, isLoading } = await useTelegramAuth(BOT_ID, {
  windowFeatures: { popup: true },
});

// Validate the result on server-side!

<button onClick={() => onAuth()}>
  {isLoading ? "Authenticating..." : "Login"}
</button>;
```

Using callbacks:

```tsx
import useTelegramAuth from "@use-telegram-auth/hook";

const BOT_ID = "123";

const { onAuth, isLoading } = await useTelegramAuth(
  BOT_ID,
  {
    windowFeatures: { popup: true },
  },
  {
    onSuccess: (result) => {
      // Send the result to the server
    },
  }
);

// Validate the result on server-side!

<button onClick={() => onAuth()}>
  {isLoading ? "Authenticating..." : "Login"}
</button>;
```
