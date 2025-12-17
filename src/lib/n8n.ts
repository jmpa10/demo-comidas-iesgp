type N8nPayload = {
  event: string;
  data: unknown;
  timestamp: string;
};

export async function sendToN8n(event: string, data: unknown) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  const payload: N8nPayload = {
    event,
    data,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    // No bloquea la operación principal (crear pedido/menú).
    console.error('n8n webhook error:', error);
  } finally {
    clearTimeout(timeout);
  }
}
