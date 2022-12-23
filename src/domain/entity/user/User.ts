import { v4 as uuid } from "uuid";

export default class User {
  constructor(readonly id: string, readonly email: string, readonly password: string) {}

  static create(email: string, password: string) {
    return new User(uuid(), email, password);
  }
}
