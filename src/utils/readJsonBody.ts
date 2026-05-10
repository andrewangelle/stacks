/** Safe JSON parse for handlers (empty body → {}). */
export async function readJsonBody(
  request: Request,
): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}
