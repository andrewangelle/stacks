export function data(data: unknown, init?: ResponseInit) {
  const options = init ?? {
    status: 200,
  };
  return new Response(JSON.stringify(data), {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });
}
