import { v4 as uuid } from "uuid";

export default class Member {
  constructor(readonly id: string, readonly profileId: string, readonly role: string) {}

  static create(profileId: string, role: string) {
    return new Member(uuid(), profileId, role);
  }
}
