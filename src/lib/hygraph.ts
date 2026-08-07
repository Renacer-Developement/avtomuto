/**
 * Мінімальний GraphQL-клієнт для Hygraph. Використовується для контенту, що змінюється
 * часто (блог, авто в наявності) — решта сайту лишається на статичних TS-файлах у src/data.
 *
 * Якщо HYGRAPH_ENDPOINT не заданий (CMS ще не підключено) або запит впав — повертає null,
 * і виклик коду переходить на локальний fallback-контент. Це гарантує, що `astro build`
 * ніколи не падає через відсутню чи тимчасово недоступну CMS.
 */
const ENDPOINT = import.meta.env.HYGRAPH_ENDPOINT;
const TOKEN = import.meta.env.HYGRAPH_TOKEN;

export function isHygraphConfigured(): boolean {
  return Boolean(ENDPOINT);
}

export async function hygraphFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!ENDPOINT) return null;

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      console.warn(`[hygraph] запит не вдався: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    if (json.errors) {
      console.warn('[hygraph] GraphQL помилки:', json.errors);
      return null;
    }

    return json.data as T;
  } catch (err) {
    console.warn('[hygraph] не вдалося з’єднатися з CMS, використовується локальний контент:', err);
    return null;
  }
}
