import { HttpClient } from "./application/interfaces/http/http-client";
import { NotificationGateway } from "./application/interfaces/gateway/notification-gateway";

export class HttpNotificationGateway implements NotificationGateway {
  pendingNotifications: string[] = [];

  constructor(private readonly httpClient: HttpClient) {}

  async notify(message: string): Promise<void> {
    this.pendingNotifications.push(message);
    const notifications = this.pendingNotifications.slice();
    this.pendingNotifications = [];
    for (const pendingMessage of notifications) {
      try {
        await this.httpClient.post("/notify", { message: pendingMessage });
      } catch (error) {
        this.pendingNotifications.push(pendingMessage);
      }
    }
  }
}
