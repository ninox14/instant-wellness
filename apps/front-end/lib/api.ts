import ky from 'ky';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: 'include', // send cookies if needed
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Example: attach auth token if stored in localStorage
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          // Optional global error handling
          console.error('API Error:', response.status);
        }
      },
    ],
  },
});

export const http = {
  get: <T>(url: string) => api.get(url).json<T>(),

  post: <T>(url: string, data?: unknown) =>
    api.post(url, { json: data }).json<T>(),

  postForm: <T>(url: string, formData: FormData) =>
    api
      .post(url, {
        body: formData,
        headers: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'Content-Type': undefined as any,
        },
      })
      .json<T>(),

  put: <T>(url: string, data?: unknown) =>
    api.put(url, { json: data }).json<T>(),

  delete: <T>(url: string) => api.delete(url).json<T>(),
};
