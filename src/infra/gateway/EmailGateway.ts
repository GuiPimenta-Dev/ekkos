import nodemailer from "nodemailer";
import EmailGatewayInterface from "../../domain/infra/gateway/EmailGateway";

export default class EmailGateway implements EmailGatewayInterface {
  transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(to: string, subject: string, body: string): Promise<void> {
    var mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text: body,
    };
    console.log(mailOptions);
    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
    });
  }
}
