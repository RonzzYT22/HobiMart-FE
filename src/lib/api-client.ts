type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiClientOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

interface EncryptedResponse {
  __encrypted: boolean;
  iv: string;
  tag: string;
  data: string;
}

const PROXY_BASE = '/api/proxy';
const DEFAULT_TIMEOUT = 15000;

async function decryptResponse<T>(body: unknown): Promise<T> {
  if (
    body &&
    typeof body === 'object' &&
    (body as Record<string, unknown>).__encrypted === true
  ) {
    const encrypted = body as EncryptedResponse;
    const { iv, tag, data } = encrypted;

    const keyHex = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    if (!keyHex) {
      throw new Error('NEXT_PUBLIC_ENCRYPTION_KEY not configured for decryption');
    }

    const keyData = hexToArrayBuffer(keyHex);
    const ivData = hexToArrayBuffer(iv);
    const tagData = hexToArrayBuffer(tag);
    const encryptedData = base64ToArrayBuffer(data);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const combined = new Uint8Array(encryptedData.byteLength + tagData.byteLength);
    combined.set(new Uint8Array(encryptedData), 0);
    combined.set(new Uint8Array(tagData), encryptedData.byteLength);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivData, tagLength: 128 },
      cryptoKey,
      combined
    );

    const text = new TextDecoder().decode(decrypted);
    return JSON.parse(text) as T;
  }

  return body as T;
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function createAbortSignal(timeout: number, externalSignal?: AbortSignal): AbortController {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('Request timeout')), timeout);

  if (externalSignal) {
    externalSignal.addEventListener('abort', () => {
      clearTimeout(timer);
      controller.abort(externalSignal.reason);
    });
  }

  const originalAbort = controller.abort.bind(controller);
  controller.abort = (reason?: any) => {
    clearTimeout(timer);
    return originalAbort(reason);
  };

  return controller;
}

export async function apiClient<T = unknown>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: ApiClientOptions = {}
): Promise<ApiResult<T>> {
  const { headers = {}, signal, timeout = DEFAULT_TIMEOUT } = options;
  const controller = createAbortSignal(timeout, signal);

  const isForm = body instanceof FormData;
  const hasBody = body !== undefined && body !== null;

  const defaultHeaders: Record<string, string> = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  try {
    const response = await fetch(`${PROXY_BASE}${path}`, {
      method,
      headers: defaultHeaders,
      body: hasBody ? (isForm ? (body as FormData) : JSON.stringify(body)) : undefined,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const text = await response.text();
      return { ok: response.ok, status: response.status, data: text as unknown as T, error: response.ok ? null : text };
    }

    const rawBody = await response.json();
    const data = await decryptResponse<T>(rawBody);

    return { ok: response.ok, status: response.status, data, error: response.ok ? null : (data as any)?.error || null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    return { ok: false, status: 0, data: null, error: message };
  }
}

export const api = {
  get: <T = unknown>(path: string, options?: ApiClientOptions) =>
    apiClient<T>('GET', path, undefined, options),

  post: <T = unknown>(path: string, body?: unknown, options?: ApiClientOptions) =>
    apiClient<T>('POST', path, body, options),

  put: <T = unknown>(path: string, body?: unknown, options?: ApiClientOptions) =>
    apiClient<T>('PUT', path, body, options),

  patch: <T = unknown>(path: string, body?: unknown, options?: ApiClientOptions) =>
    apiClient<T>('PATCH', path, body, options),

  delete: <T = unknown>(path: string, options?: ApiClientOptions) =>
    apiClient<T>('DELETE', path, undefined, options),
};
