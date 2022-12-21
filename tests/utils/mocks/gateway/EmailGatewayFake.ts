import EmailGatewayInterface from "../../../../src/application/ports/gateway/EmailGatewayInterface";

export default class EmailGatewayFake implements EmailGatewayInterface {
  emails: { to: string; subject: string; body: string }[] = [];

  async send(to: string, subject: string, body: string): Promise<void> {
    this.emails.push({ to, subject, body });
  }
}
