// Server-only: Telegram-Push an den Betreiber-Chat.
// No-op, solange TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID nicht gesetzt sind.

export async function notifyTelegram(text: string, opts?: { parseMode?: "HTML" | "MarkdownV2" }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...(opts?.parseMode ? { parse_mode: opts.parseMode } : {}),
        disable_web_page_preview: true,
      }),
      signal: ctrl.signal,
    });
  } catch (err) {
    console.error("[notify] telegram failed", (err as Error)?.message);
  } finally {
    clearTimeout(t);
  }
}

// Send a PNG as a Telegram photo (forwardable to WhatsApp). Optional HTML caption.
export async function notifyTelegramPhoto(png: ArrayBuffer, caption?: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const form = new FormData();
    form.append("chat_id", chatId);
    if (caption) {
      form.append("caption", caption);
      form.append("parse_mode", "HTML");
    }
    form.append("photo", new Blob([png], { type: "image/png" }), "auswertung.png");
    await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      body: form,
      signal: ctrl.signal,
    });
  } catch (err) {
    console.error("[notify] telegram photo failed", (err as Error)?.message);
  } finally {
    clearTimeout(t);
  }
}
