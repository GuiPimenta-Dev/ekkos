import Band from "../entity/Band";

export interface Event<T = unknown> {
  name: string;
  payload: T;
}

export interface InviteAcceptedPayload {
  profileId: string;
  band: Band;
  role: string;
}

export interface InviteDeclinedPayload {
  profileId: string;
  band: Band;
  role: string;
}

export interface MemberInvitedPayload {
  profileId: string;
  bandName: string;
  role: string;
}

export interface UserCreatedPayload {
  email: string;
}

export default class EventFactory {
  static emitInviteAcceptedEvent(payload: InviteAcceptedPayload): Event<InviteAcceptedPayload> {
    return {
      name: "InviteAccepted",
      payload,
    };
  }

  static emitInviteDeclinedEvent(payload: InviteDeclinedPayload): Event<InviteDeclinedPayload> {
    return {
      name: "InviteDeclined",
      payload,
    };
  }

  static emitMemberInvitedEvent(payload: MemberInvitedPayload): Event<MemberInvitedPayload> {
    return {
      name: "MemberInvited",
      payload,
    };
  }

  static emitUserCreatedEvent(payload: UserCreatedPayload): Event<UserCreatedPayload> {
    return {
      name: "UserCreated",
      payload,
    };
  }
}
