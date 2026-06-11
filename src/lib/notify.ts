// Server-only: Telegram-Push an den Betreiber-Chat.
// No-op, solange TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID nicht gesetzt sind.

export async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 4000);
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: ctrl.signal,
    });
  } catch (err) {
    console.error("[notify] telegram failed", (err as Error)?.message);
  } finally {
    clearTimeout(t);
  }
}
