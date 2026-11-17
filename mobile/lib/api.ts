import Constants from "expo-constants";
import { Platform } from "react-native";

function defaultApiBase() {
  // iOS Simulator / web → localhost. Android emulator → 10.0.2.2.
  if (Platform.OS === "android") return "http://10.0.2.2:3000";
  return "http://localhost:3000";
}

const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;

export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || extra?.apiUrl || defaultApiBase();

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE}/api${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      typeof data?.error === "string" ? data.error : "Request failed",
      res.status,
    );
  }
  return data as T;
}
