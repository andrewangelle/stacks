type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function resourceRequest<ResponseType>(
  path: string,
  method: RequestMethod = 'GET',
  body?: unknown,
): Promise<ResponseType> {
  const response = await fetch(`/resources/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status}) for /resources/${path}`,
    );
  }

  return response.json() as Promise<ResponseType>;
}
