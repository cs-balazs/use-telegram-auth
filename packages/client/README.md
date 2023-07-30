# @use-telegram-auth/client

Perform Telegram user authentication without using the [Telegram login widget](https://core.telegram.org/widgets/login)

## Installation

`npm i @use-telegram-auth/client`

## Usage

Using default options:

```ts
import telegramAuth from "@use-telegram-auth/client";

const BOT_ID = "123";

const result = await telegramAuth(BOT_ID);

// Validate the result on server-side!
```

Tweaking some options:

```ts
import telegramAuth from "@use-telegram-auth/client";

const BOT_ID = "123";

const result = await telegramAuth(BOT_ID, { windowFeatures: { popup: true } });

// Validate the result on server-side!
```
