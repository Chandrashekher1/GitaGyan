import type {
  AnalyzeResponse,
  PoseLandmark,
  YogaPose,
  YogaSessionData,
} from './types';

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function normalizeBase(value: string): string {
  return value.replace(/\/$/, '');
}

function getApiRoots(): string[] {
  const envBase = import.meta.env.VITE_API_BASE_URL?.trim();

  if (envBase) {
    return [normalizeBase(envBase)];
  }

  if (import.meta.env.DEV) {
    return unique([
      '/api',
      'http://127.0.0.1:3000/api',
      'http://localhost:3000/api',
      'https://gitagyan-c4zq.onrender.com/api',
    ]);
  }

  return unique([
    '/api',
    'https://gitagyan-c4zq.onrender.com/api',
  ]);
}

async function fetchYoga<T>(path: string, init?: RequestInit): Promise<T> {
  const apiRoots = getApiRoots();
  const errors: string[] = [];

  for (const apiRoot of apiRoots) {
    try {
      const response = await fetch(`${apiRoot}/yoga${path}`, init);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        errors.push(`${apiRoot}: ${body?.error || response.statusText || `HTTP ${response.status}`}`);
        continue;
      }

      const data = (await response.json()) as T;
      if (Array.isArray(data)) {
        return data;
      }

      if (typeof data === 'object' && data !== null) {
        return {
          ...(data as Record<string, unknown>),
          apiBaseUsed: apiRoot,
        } as T;
      }
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed';
      errors.push(`${apiRoot}: ${message}`);
    }
  }

  throw new Error(errors[0] || 'Yoga API is unavailable');
}

export async function getYogaPoses(): Promise<YogaPose[]> {
  return fetchYoga<YogaPose[]>('/poses', {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  });
}

export async function analyzePose(
  payload: {
    poseName: string;
    userId: string;
    landmarks: PoseLandmark[];
  }
): Promise<AnalyzeResponse> {
  return fetchYoga<AnalyzeResponse>('/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function getYogaHistory(
  userId: string
): Promise<{ sessions: YogaSessionData[]; streak: number }> {
  return fetchYoga<{ sessions: YogaSessionData[]; streak: number }>(
    `/history/${userId}`
  );
}
