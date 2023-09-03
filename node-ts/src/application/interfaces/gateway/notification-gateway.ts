export interface NotificationGateway {
  notify(message: string): Promise<void>;
}
