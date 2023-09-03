export interface HttpClient {
  get: <T>(url: string, params?: Record<string, any>) => Promise<T>;
  post: <T>(url: string, body: Record<string, any>) => Promise<T>;
}
