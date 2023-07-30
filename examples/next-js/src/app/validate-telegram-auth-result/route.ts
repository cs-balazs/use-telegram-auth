import { createHash } from "crypto";
import { NextResponse } from "next/server";
import verify from "@use-telegram-auth/server";
import { TGAuthResult } from "@use-telegram-auth/hook";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const SECRET = createHash("sha256").update(BOT_TOKEN).digest();

export async function POST(request: Request) {
  const tgAuthData: TGAuthResult = await request.json();

  if (!tgAuthData) {
    return NextResponse.json({ message: "No auth data received" });
  }

  const isValid = verify(tgAuthData, SECRET); // verofyFromRawBotToken(BOT_TOKEN)

  return NextResponse.json(isValid);
}
