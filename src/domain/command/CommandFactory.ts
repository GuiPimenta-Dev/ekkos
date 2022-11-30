export interface Command<T = unknown> {
  name: string;
  payload: T;
}

interface InviteMemberPayload {
  profileId: string;
  bandName: string;
  role: string;
}

export type InviteMember = Command<InviteMemberPayload>;

export default class CommandFactory {
  static inviteMember(payload: InviteMemberPayload): InviteMember {
    return {
      name: "InviteMember",
      payload,
    };
  }
}
