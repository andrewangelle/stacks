import { fetchToken } from '~/auth/middleware';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestOptions = {
  method: RequestMethod;
  searchParams?: Record<string, string>;
  headers?: Record<string, string>;
};

function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:3000';
}

export async function resourceRequest<ResponseType>(
  path: string,
  requestOptions: RequestOptions = {
    method: 'GET',
  },
  body?: unknown,
): Promise<ResponseType> {
  const endpoint = new URL(`/resources/${path}`, getBaseUrl());

  if (requestOptions.searchParams) {
    Object.entries(requestOptions.searchParams).forEach(([key, value]) => {
      endpoint.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${await fetchToken()}`,
  };

  const response = await fetch(endpoint.toString(), {
    method: requestOptions.method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status}) for /resources/${path}`,
    );
  }

  return response.json() as Promise<ResponseType>;
}
