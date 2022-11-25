import EmailGatewayInterface from "../../../src/domain/infra/gateway/EmailGateway";

export default class EmailGatewayFake implements EmailGatewayInterface {
  emailSent: { to: string; subject: string; body: string };

  async send(to: string, subject: string, body: string): Promise<void> {
    this.emailSent = { to, subject, body };
  }
}
