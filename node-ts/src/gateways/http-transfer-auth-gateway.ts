import { HttpClient } from "./application/interfaces/http/http-client";
import { TransferAuthorizationGateway } from "./gateways/transfer-auth-gateway";

interface HttpResponse {
  message: string;
}

export class HttpTransferAuthorizationGateway implements TransferAuthorizationGateway {
  constructor(private readonly httpClient: HttpClient) {}

  async authorize() {
    const response = await this.httpClient.get<HttpResponse>(
      "https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6",
    );
    return response.message === "Autorizado";
  }
}
