import type { TGAuthResult } from "@use-telegram-auth/client";
import { createHash, createHmac, timingSafeEqual } from "crypto";

const verifyFromHashedBotToken = (
  tgAuthResult: TGAuthResult,
  hashedBotToken: Buffer
): boolean => {
  const { hash, ...authParams } = tgAuthResult;

  const params = (
    Object.keys(authParams) as Array<Exclude<keyof TGAuthResult, "hash">>
  )
    .sort()
    .map((key) => `${key}=${authParams[key]}`)
    .join("\n");

  const recreated = createHmac("sha256", hashedBotToken)
    .update(params)
    .digest();

  const isValid = timingSafeEqual(recreated, Buffer.from(hash, "hex"));

  return isValid;
};

const verofyFromRawBotToken = (
  tgAuthResult: TGAuthResult,
  rawBotToken: string
): boolean => {
  const hashedBotToken = createHash("sha256").update(rawBotToken).digest();
  return verifyFromHashedBotToken(tgAuthResult, hashedBotToken);
};

export { verofyFromRawBotToken };
export default verifyFromHashedBotToken;
