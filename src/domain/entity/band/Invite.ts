import { v4 as uuid } from "uuid";

export enum Status {
  pending = "pending",
  accepted = "accepted",
  declined = "declined",
}

export default class Invite {
  constructor(
    readonly id: string,
    readonly bandId: string,
    readonly profileId: string,
    readonly role: string,
    private status: Status,
  ) {}

  static create(bandId: string, profileId: string, role: string): Invite {
    return new Invite(uuid(), bandId, profileId, role, Status.pending);
  }

  accept(): void {
    this.status = Status.accepted;
  }

  decline(): void {
    this.status = Status.declined;
  }

  getStatus(): Status {
    return this.status;
  }
}
