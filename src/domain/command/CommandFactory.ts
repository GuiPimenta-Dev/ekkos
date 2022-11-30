import { InviteMemberPayload } from "./Types";

export type Command<T = unknown> = {
  name: string;
  payload: T;
};

export type InviteMember = Command<InviteMemberPayload>;

export default class CommandFactory {
  static inviteMember(payload: InviteMemberPayload): InviteMember {
    return {
      name: "InviteMember",
      payload,
    };
  }
}
