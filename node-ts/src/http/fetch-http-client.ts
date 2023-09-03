import { HttpClient } from "../application/interfaces/http/http-client";

export class FetchHttpClient implements HttpClient {
  async get<T>(url: string, params?: Record<string, any> | undefined): Promise<T> {
    const response = await fetch(url, {
      method: "GET",
      body: JSON.stringify(params),
    });

    return response.json() as T;
  }

  async post<T>(url: string, body: Record<string, any>): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return response.json() as T;
  }
}
