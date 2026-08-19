import { NextRequest, NextResponse } from 'next/server';
import { sanitizePath, validateMethod, buildProxyRequest } from '@/lib/proxy';
import { wrapResponse } from '@/lib/crypto';

const PROXY_TIMEOUT = 15000;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
      'Access-Control-Max-Age': '86400',
    },
  });
}

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const method = request.method;
    validateMethod(method);

    const rawPath = '/' + path.join('/');
    const safePath = sanitizePath(rawPath);
    const queryString = request.nextUrl.search.toString();
    const fullPath = queryString ? `${safePath}${queryString}` : safePath;

    const body = ['GET', 'HEAD'].includes(method) ? null : await request.text();

    const { url, init } = buildProxyRequest(method, fullPath, request.headers, body);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT);

    let response: Response;
    try {
      response = await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      // Skip wrapping if encryption is disabled (dummy mode)
      const shouldEncrypt = process.env.NODE_ENV === 'production' && !!process.env.ENCRYPTION_KEY;
      if (shouldEncrypt) {
        const wrapped = wrapResponse(data);
        return NextResponse.json(wrapped, {
          status: response.status,
          headers: {
            'X-Proxy-Status': 'ok',
            'X-Encrypted': 'true',
          },
        });
      }
      return NextResponse.json(data, {
        status: response.status,
        headers: {
          'X-Proxy-Status': 'ok',
          'X-Encrypted': 'false',
        },
      });
    }

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'connection', 'keep-alive'].includes(key)) {
        responseHeaders.set(key, value);
      }
    });
    responseHeaders.set('X-Proxy-Status', 'passthrough');

    const responseBlob = await response.blob();
    return new NextResponse(responseBlob, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proxy error';
    const status = message.includes('not allowed') ? 405
      : message.includes('not configured') ? 502
      : message.includes('traversal') ? 400
      : message.includes('abort') ? 504
      : 500;

    return NextResponse.json(
      { error: message, status },
      { status }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
