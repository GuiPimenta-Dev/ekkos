import Band from "../entity/Band";

export interface Event<T = unknown> {
  name: string;
  payload: T;
}

export type InviteAccepted = Event<{
  profileId: string;
  band: Band;
  role: string;
}>;

export type InviteDeclined = Event<{
  profileId: string;
  band: Band;
  role: string;
}>;

export type UserCreated = Event<{
  email: string;
}>;

export default class EventFactory {
  static emitInviteAccepted(payload: InviteAccepted["payload"]): InviteAccepted {
    return {
      name: "InviteAccepted",
      payload,
    };
  }

  static emitInviteDeclined(payload: InviteDeclined["payload"]): InviteDeclined {
    return {
      name: "InviteDeclined",
      payload,
    };
  }

  static emitUserCreated(payload: UserCreated["payload"]): UserCreated {
    return {
      name: "UserCreated",
      payload,
    };
  }
}
