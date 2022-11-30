import Band from "../entity/Band";

export interface Event<T = unknown> {
  name: string;
  payload: T;
}

interface InviteAcceptedPayload {
  profileId: string;
  band: Band;
  role: string;
}

interface InviteDeclinedPayload {
  profileId: string;
  band: Band;
  role: string;
}

interface UserCreatedPayload {
  email: string;
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
