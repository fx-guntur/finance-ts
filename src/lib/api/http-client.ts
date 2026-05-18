export type ApiErrorShape = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error: ApiErrorShape };

export class HttpError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, status: number, code: string, details?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function parseJsonResponse<T>(response: Response): Promise<ApiEnvelope<T>> {
  const text = await response.text();

  if (!text) {
    return { success: false, error: { code: "EMPTY_RESPONSE", message: "The server returned an empty response." } };
  }

  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    return {
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "The server returned an invalid JSON response.",
      },
    };
  }
}

export async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = await parseJsonResponse<T>(response);

  if (!response.ok || !payload.success) {
    const error = payload.success
      ? { code: "HTTP_ERROR", message: "Request failed" }
      : payload.error;

    throw new HttpError(error.message, response.status, error.code, error.details);
  }

  return payload.data;
}
