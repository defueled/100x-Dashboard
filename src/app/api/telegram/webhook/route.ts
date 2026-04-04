import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { getGhlLevelFromTags } from '@/lib/ghlLevels';

interface TelegramUpdate {
  message?: {
    message_id: number;
    from: { id: number; username?: string; first_name: string };
    text?: string;
  };
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const DAO_CHAT_ID = process.env.TELEGRAM_DAO_CHAT_ID!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId: number, text: string): Promise<void> {
  await fetch(`${TG_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}

async function createInviteLink(): Promise<string> {
  const res = await fetch(`${TG_API}/createChatInviteLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: DAO_CHAT_ID,
      member_limit: 1,
      expire_date: Math.floor(Date.now() / 1000) + 3600,
    }),
  });
  const data = await res.json();
  return data.result?.invite_link as string;
}

function verifyToken(token: string): { valid: false } | { valid: true; userId: string } {
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false };

  const [userId, timestampStr, providedHmac] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return { valid: false };

  // Check 10-minute expiry
  if (Date.now() - timestamp > 10 * 60 * 1000) return { valid: false };

  // Verify HMAC
  const expectedHmac = crypto
    .createHmac('sha256', NEXTAUTH_SECRET)
    .update(`${userId}:${timestamp}`)
    .digest('hex');

  let hmacMatch = false;
  try {
    hmacMatch = crypto.timingSafeEqual(
      Buffer.from(providedHmac, 'hex'),
      Buffer.from(expectedHmac, 'hex')
    );
  } catch {
    return { valid: false };
  }

  if (!hmacMatch) return { valid: false };

  return { valid: true, userId };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let update: TelegramUpdate;

  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const message = update.message;
  if (!message || !message.text || !message.from) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const fromId = message.from.id;
  const text = message.text.trim();

  // Only handle /start TOKEN commands
  if (!text.startsWith('/start ')) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const token = text.slice('/start '.length).trim();
  const verification = verifyToken(token);

  if (!verification.valid) {
    await sendMessage(
      fromId,
      '⚠️ Saite ir novecojusi. Lūdzu, iegūsti jaunu no 100x Dashboard profila lapas.'
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { userId } = verification;

  // Look up user in Supabase
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('socials, email')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    await sendMessage(
      fromId,
      '⚠️ Saite ir novecojusi. Lūdzu, iegūsti jaunu no 100x Dashboard profila lapas.'
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Check if already a DAO member
  const { data: memberCheck } = await supabase
    .from('profiles')
    .select('dao_member, telegram_user_id')
    .eq('id', userId)
    .single();

  if (memberCheck?.dao_member) {
    await sendMessage(
      fromId,
      '✅ Tu jau esi 100x DAO biedrs! Meklē grupu savos Telegram kontaktos.'
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Re-check GHL level from stored tags
  const tags: string[] = profile.socials?.ghl_tags ?? [];
  const level = getGhlLevelFromTags(tags);

  if (level < 4) {
    await sendMessage(
      fromId,
      '❌ Nepieciešams GHL Līmenis 4+. Piesakies kursos un paaugstini savu līmeni uz 100x platformas!'
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Create one-time invite link
  const inviteLink = await createInviteLink();

  if (!inviteLink) {
    await sendMessage(
      fromId,
      '⚠️ Saite ir novecojusi. Lūdzu, iegūsti jaunu no 100x Dashboard profila lapas.'
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Send success message with invite link
  await sendMessage(
    fromId,
    `🎉 Apsveicu! Tu esi verificēts kā 100x DAO biedrs.\n\n👇 Pievienojies privātajai grupai:\n${inviteLink}\n\n⏰ Saite derīga 1 stundu.`
  );

  // Update Supabase profile
  await supabase
    .from('profiles')
    .update({ telegram_user_id: String(fromId), dao_member: true })
    .eq('id', userId);

  return NextResponse.json({ ok: true }, { status: 200 });
}
