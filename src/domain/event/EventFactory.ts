import Band from "../entity/band/Band";

export interface Event<T = unknown> {
  name: string;
  payload: T;
}

export type Memberinvited = Event<{
  profileId: string;
  bandName: string;
  role: string;
}>;

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

export type VideoPosted = Event<{
  profileId: string;
  videoId: string;
}>;

export default class EventFactory {
  static emitMemberInvited(payload: Memberinvited["payload"]): Memberinvited {
    return {
      name: "MemberInvited",
      payload,
    };
  }

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

  static emitVideoPosted(payload: VideoPosted["payload"]): VideoPosted {
    return {
      name: "VideoPosted",
      payload,
    };
  }
}
