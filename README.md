# use-telegram-auth

This repo contains 3 packages that can be used to perform user authentication with Telegram, without using the [Telegram login widget](https://core.telegram.org/widgets/login). These packages are:

## `@use-telegram-auth/client`

`npm i @use-telegram-auth/client`

The core client-sige functionality. Exports 3 types, and one function (as the default export)

### `TGAuthResult`

This type represents the auth result object that comes from the Telegram auth api

### `WindowFeatures`

This type represents the possible window features [according to MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#parameters)

### `Options`

This type represents all the possible options that can be passed to `telegramAuth`

### `telegramAuth`

This is the default export of the package. It handles the whole authentication flow, and returns a `Promise` that resolves to the authentication result provided by Telegram. Keep in mind that the result should be validated on the server side with `@use-telegram-auth/server` (or with any alternative implementation)

## `@use-telegram-auth/hook`

`npm i @use-telegram-auth/hook`

A react hook wrapper around `@use-telegram-auth/client`. The defult export is the hook, and also re-exports the types from `@use-telegram-auth/client`

### `useTelegramAuth`

The hook uses the same parameters, as the `telegramAuth` function of `@use-telegram-auth/client`, plus optionally takes an `onSubmit` and/or an `onError` callback.
Returns an object with 4 fields. An `onAuth` function, that starts the auth process, an `isLoading` field, and the authentication result, and an error

## `@use-telegram-auth/server`

`npm i @use-telegram-auth/server`

Can be used to validate the authentication result on the server side. Exports two almost identical functions. The default export expects the sha256 hash of the bot token, and the named export `verofyFromRawBotToken` expects the actual bot token, and persorms the hashing itself. Since the bot token is likely static in most applications, hashing the token multiple times means unnecessary computation, that is why the default export is the one that expects the hashed token. In node you can perform the hashing like this:

```ts
import { createHash } from "crypto";
createHash("sha256").update(rawBotToken).digest();
```

These functions also take the authentication result, and return a boolean indicating if the auth result is valid or not
