import ky, { HTTPError } from "ky";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

// Default NestJS error shape
export interface NestError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
      }
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          console.error("API Error:", await response.json());
        }
      }
    ]
  }
});

type RequestBody = Record<string, unknown> | undefined;

async function handleRequest<T, E>(promise: Promise<T>) {
  try {
    return await promise;
  } catch (error: unknown) {
    throw error;
  }
}

export const http = {
  get: <T = unknown, E = NestError>(url: string) =>
    handleRequest<T, E>(api.get(url).json<T>()),

  post: <T = unknown, B extends RequestBody = undefined, E = NestError>(
    url: string,
    data?: B
  ) => handleRequest<T, E>(api.post(url, { json: data }).json<T>()),

  postForm: <T = unknown, E = NestError>(url: string, formData: FormData) =>
    handleRequest<T, E>(
      api
        .post(url, {
          body: formData,
          headers: { "Content-Type": undefined }
        })
        .json<T>()
    ),

  put: <T = unknown, B extends RequestBody = undefined, E = NestError>(
    url: string,
    data?: B
  ) => handleRequest<T, E>(api.put(url, { json: data }).json<T>()),

  delete: <T = unknown, E = NestError>(url: string) =>
    handleRequest<T, E>(api.delete(url).json<T>())
};
