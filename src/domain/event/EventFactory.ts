import { InviteAcceptedPayload, InviteDeclinedPayload, UserCreatedPayload } from "./Types";

export interface Event<T = unknown> {
  name: string;
  payload: T;
}

export type InviteAccepted = Event<InviteAcceptedPayload>;
export type InviteDeclined = Event<InviteDeclinedPayload>;
export type UserCreated = Event<UserCreatedPayload>;

export default class EventFactory {
  static emitInviteAccepted(payload: InviteAcceptedPayload): InviteAccepted {
    return {
      name: "InviteAccepted",
      payload,
    };
  }

  static emitInviteDeclined(payload: InviteDeclinedPayload): InviteDeclined {
    return {
      name: "InviteDeclined",
      payload,
    };
  }

  static emitUserCreated(payload: UserCreatedPayload): UserCreated {
    return {
      name: "UserCreated",
      payload,
    };
  }
}
