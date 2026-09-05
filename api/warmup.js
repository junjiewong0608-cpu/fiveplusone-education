const JSON_HEADERS = {
  'Content-Type': 'application/json;charset=utf-8',
  'Cache-Control': 'no-store'
};

const SUPABASE_FUNCTION_URL = process.env.SUPABASE_FUNCTION_URL || 'https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/fiveplusone-education-api';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_PUBLIC_FUNCTION_KEY';
const WARMUP_TIMEOUT_MS = 25000;

function json(res, status, payload) {
  res.statusCode = status;
  Object.entries(JSON_HEADERS).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(payload));
}

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed.' });
  }
  const startedAt = Date.now();
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), WARMUP_TIMEOUT_MS) : null;
  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ action: 'listInteractionRooms', studentId: 'CY0000' }),
      signal: controller ? controller.signal : undefined
    });
    return json(res, response.ok ? 200 : 502, {
      ok: response.ok,
      source: 'warmup',
      status: response.status,
      elapsedMs: Date.now() - startedAt
    });
  } catch (error) {
    return json(res, 502, {
      ok: false,
      source: 'warmup',
      retryable: true,
      error: error?.name === 'AbortError'
        ? `Warmup exceeded ${Math.round(WARMUP_TIMEOUT_MS / 1000)} seconds.`
        : String(error?.message || error),
      elapsedMs: Date.now() - startedAt
    });
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

module.exports = handler;
