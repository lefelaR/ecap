import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

export class HttpService {
  readonly #client: AxiosInstance;

  constructor(baseUrl?: string) {
    this.#client = axios.create({
      baseURL: (baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, ''),
      withCredentials: true,
    });
  }

  #path(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
  }

  get<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.#client.get<T>(this.#path(path), config);
  }

  post<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.#client.post<T>(this.#path(path), data, config);
  }

  put<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.#client.put<T>(this.#path(path), data, config);
  }

  patch<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.#client.patch<T>(this.#path(path), data, config);
  }

  delete<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.#client.delete<T>(this.#path(path), config);
  }

  static getErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
      const body = error.response?.data;
      if (body && typeof body === 'object' && 'error' in body) {
        return String((body as { error: string }).error);
      }
    }
    return error instanceof Error ? error.message : fallback;
  }
}

export const http = new HttpService();
