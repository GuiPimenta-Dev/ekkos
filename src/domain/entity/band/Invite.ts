export enum Status {
  pending = "pending",
  accepted = "accepted",
  declined = "declined",
}

export default class Invite {
  constructor(
    readonly inviteId: string,
    readonly bandId: string,
    readonly profileId: string,
    readonly role: string,
    private status: Status,
  ) {}

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
