export interface Command<T = unknown> {
  name: string;
  payload: T;
}

export type InviteMember = Command<{
  profileId: string;
  bandName: string;
  role: string;
}>;

export default class CommandFactory {
  static inviteMember(payload: InviteMember["payload"]): InviteMember {
    return {
      name: "InviteMember",
      payload,
    };
  }
}
