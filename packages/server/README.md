# @use-telegram-auth/server

Utility package for validating Telegram authentication results

## Installation

`npm i @use-telegram-auth/server`

## Usage

Using hashed token:

```ts
import verifyAuthResult from "@use-telegram-auth/server";
import { createHash } from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN;
const HASHED_BOT_TOKEN = createHash("sha256").update(rawBotToken).digest();

const result = verifyAuthResult(tgAuthResult, HASHED_BOT_TOKEN);
```

Using raw non-hashed token:

```ts
import { verifyFromRawBotToken } from "@use-telegram-auth/server";

const BOT_TOKEN = process.env.BOT_TOKEN;

const result = verifyFromRawBotToken(tgAuthResult, BOT_TOKEN);
```
