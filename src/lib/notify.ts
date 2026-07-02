// Server-only: Telegram-Push an den Betreiber-Chat.
// Prüft die ECHTE Telegram-Antwort (kein stilles Schlucken) und gibt {ok,error}
// zurück, damit der Aufrufer weiß, ob wirklich zugestellt wurde. No-op-Fehler,
// solange TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID nicht gesetzt sind.
export type SendResult = { ok: boolean; error?: string };

export async function notifyTelegram(
  text: string,
  opts?: { parseMode?: "HTML" | "MarkdownV2" },
): Promise<SendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, error: "TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID fehlt" };

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; description?: string };
    if (!res.ok || body?.ok === false) {
      const error = body?.description || `HTTP ${res.status}`;
      console.error("[notify] telegram sendMessage failed:", error);
      return { ok: false, error };
    }
    return { ok: true };
  } catch (err) {
    const error = (err as Error)?.message ?? "unknown";
    console.error("[notify] telegram sendMessage failed:", error);
    return { ok: false, error };
  } finally {
    clearTimeout(t);
  }
}

// Send a PNG as a Telegram photo (forwardable to WhatsApp). Optional HTML caption.
export async function notifyTelegramPhoto(png: ArrayBuffer, caption?: string): Promise<SendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, error: "TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID fehlt" };

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
    const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      body: form,
      signal: ctrl.signal,
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; description?: string };
    if (!res.ok || body?.ok === false) {
      const error = body?.description || `HTTP ${res.status}`;
      console.error("[notify] telegram sendPhoto failed:", error);
      return { ok: false, error };
    }
    return { ok: true };
  } catch (err) {
    const error = (err as Error)?.message ?? "unknown";
    console.error("[notify] telegram sendPhoto failed:", error);
    return { ok: false, error };
  } finally {
    clearTimeout(t);
  }
}
