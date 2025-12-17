import crypto from 'crypto';

type N8nPayload = {
  event: string;
  data: unknown;
  timestamp: string;
  requestId: string;
};

function isSafeHttpUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function signPayload(secret: string, timestamp: string, requestId: string, body: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${timestamp}.${requestId}.${body}`);
  return `v1=${hmac.digest('hex')}`;
}

export async function sendToN8n(event: string, data: unknown) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;
  if (!isSafeHttpUrl(url)) {
    console.error('n8n webhook error: invalid N8N_WEBHOOK_URL (must be http/https)');
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  const timestamp = new Date().toISOString();
  const requestId = crypto.randomUUID();

  const payload: N8nPayload = {
    event,
    data,
    timestamp,
    requestId,
  };

  const body = JSON.stringify(payload);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-Event': event,
    'X-Webhook-Timestamp': timestamp,
    'X-Webhook-Request-Id': requestId,
  };

  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (secret) {
    headers['X-Webhook-Signature'] = signPayload(secret, timestamp, requestId, body);
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    });
  } catch (error) {
    // No bloquea la operación principal (crear pedido/menú).
    console.error('n8n webhook error:', error);
  } finally {
    clearTimeout(timeout);
  }
}
