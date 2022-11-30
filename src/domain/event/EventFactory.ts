import Band from "../entity/Band";

export interface Event<T = unknown> {
  name: string;
  payload: T;
}

export interface InviteAccepted {
  profileId: string;
  band: Band;
  role: string;
}

export interface InviteDeclined {
  profileId: string;
  band: Band;
  role: string;
}

export interface MemberInvited {
  profileId: string;
  bandName: string;
  role: string;
}

export interface UserCreated {
  email: string;
}

export default class EventFactory {
  static emitInvitationAccepted(payload: InviteAccepted): Event<InviteAccepted> {
    return {
      name: "InviteAccepted",
      payload,
    };
  }

  static emitInvitationDeclined(payload: InviteDeclined): Event<InviteDeclined> {
    return {
      name: "InviteDeclined",
      payload,
    };
  }

  static emitMemberInvited(payload: MemberInvited): Event<MemberInvited> {
    return {
      name: "MemberInvited",
      payload,
    };
  }

  static emitUserCreated(payload: UserCreated): Event<UserCreated> {
    return {
      name: "UserCreated",
      payload,
    };
  }
}
