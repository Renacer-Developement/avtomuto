import type { APIRoute } from 'astro';
import { CONTACT_TOPICS } from '../../data/contact-topics';

export const prerender = false;

// Ім'я: 2-80 символів, хоча б одна літера (блокує спам на кшталт "123" чи "...").
const NAME_RE = /^(?=.*[A-Za-zА-Яа-яІіЇїЄєҐґ]).{2,80}$/;
// Телефон: дозволені символи +, цифри, пробіли, дужки, дефіс; 7-15 цифр всередині.
const PHONE_RE = /^(?=(?:\D*\d){7,15}\D*$)[+0-9 ()-]{7,20}$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
  }

  // Honeypot — приховане поле, яке живі користувачі ніколи не заповнюють.
  // Якщо воно непорожнє — це бот; тихо повертаємо "успіх", нічого не надсилаючи,
  // щоб не підказувати боту, що його відфільтровано.
  const honeypot = typeof body.company === 'string' ? body.company.trim() : '';
  if (honeypot) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) : '';
  const topic = typeof body.topic === 'string' ? body.topic.trim().slice(0, 200) : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : '';

  if (!name || !phone || !topic) {
    return new Response(JSON.stringify({ error: 'missing_fields' }), { status: 422 });
  }

  if (!NAME_RE.test(name)) {
    return new Response(JSON.stringify({ error: 'invalid_name' }), { status: 422 });
  }

  if (!PHONE_RE.test(phone)) {
    return new Response(JSON.stringify({ error: 'invalid_phone' }), { status: 422 });
  }

  if (!(CONTACT_TOPICS as readonly string[]).includes(topic)) {
    return new Response(JSON.stringify({ error: 'invalid_topic' }), { status: 422 });
  }

  const botToken = import.meta.env.TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured');
    return new Response(JSON.stringify({ error: 'not_configured' }), { status: 500 });
  }

  const text = [
    '📩 <b>Нова заявка з сайту AvtoMuto</b>',
    `👤 Ім'я: ${escapeHtml(name)}`,
    `📞 Телефон: ${escapeHtml(phone)}`,
    `🛠 Тема: ${escapeHtml(topic)}`,
    message ? `💬 Повідомлення: ${escapeHtml(message)}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      console.error('Telegram API error', errText);
      return new Response(JSON.stringify({ error: 'telegram_failed' }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to reach Telegram API', err);
    return new Response(JSON.stringify({ error: 'network_error' }), { status: 502 });
  }
};
