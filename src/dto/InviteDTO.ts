export enum Status {
  pending = "pending",
  accepted = "accepted",
  declined = "declined",
}

export interface InviteDTO {
  inviteId: string;
  bandId: string;
  profileId: string;
  role: string;
  status: Status;
}
