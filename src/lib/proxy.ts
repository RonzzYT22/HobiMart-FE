const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const FORWARDED_HEADERS = [
  'content-type',
  'authorization',
  'x-request-id',
  'accept',
  'accept-language',
];

export function getBackendUrl(): string {
  const url = process.env.BACKEND_URL;
  if (!url) {
    throw new Error(
      'BACKEND_URL is not configured. Set it in .env or .env.local'
    );
  }
  return url.replace(/\/+$/, '');
}

export function buildProxyRequest(
  method: string,
  path: string,
  headers: Headers,
  body: string | null
): { url: string; init: RequestInit } {
  const backend = getBackendUrl();
  const url = `${backend}${path}`;

  const proxyHeaders: Record<string, string> = {};
  headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (FORWARDED_HEADERS.includes(lower)) {
      proxyHeaders[key] = value;
    }
  });

  proxyHeaders['x-forwarded-for'] =
    headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown';
  proxyHeaders['x-proxy-source'] = 'hobimart-frontend';

  return {
    url,
    init: {
      method,
      headers: proxyHeaders,
      body,
    },
  };
}

export function sanitizePath(path: string): string {
  const decoded = decodeURIComponent(path);
  if (decoded.includes('..') || decoded.includes('//') || decoded.includes('\\')) {
    throw new Error('Invalid path: path traversal detected');
  }
  return decoded;
}

export function validateMethod(method: string): void {
  if (!ALLOWED_METHODS.includes(method.toUpperCase())) {
    throw new Error(`Method not allowed: ${method}`);
  }
}
