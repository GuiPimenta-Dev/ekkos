export default interface EmailGatewayInterface {
  send(to: string, subject: string, body: string): Promise<void>;
}
