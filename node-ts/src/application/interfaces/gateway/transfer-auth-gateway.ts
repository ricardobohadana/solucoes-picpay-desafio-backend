export interface TransferAuthorizationGateway {
  authorize(): Promise<boolean>;
}
