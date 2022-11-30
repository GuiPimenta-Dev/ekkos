import Band from "../entity/Band";

export type InviteAcceptedPayload = {
  profileId: string;
  band: Band;
  role: string;
};

export type InviteDeclinedPayload = {
  profileId: string;
  band: Band;
  role: string;
};

export type UserCreatedPayload = {
  email: string;
};
