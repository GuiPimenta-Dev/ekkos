export enum Status {
  pending = "pending",
  accepted = "accepted",
  declined = "declined",
}

export interface InvitationDTO {
  invitationId: string;
  bandId: string;
  profileId: string;
  role: string;
  status: Status;
}
