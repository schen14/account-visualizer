export async function fetchJson<T>(input: RequestInfo, init?: RequestInit, errorMessage?: string): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) throw new Error(errorMessage ?? 'faiied to fetch data');
  return response.json() as Promise<T>;
}