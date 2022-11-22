import Profile from "./Profile";

export default class Comment {
  constructor(readonly id: string, readonly profile: Profile, readonly text: string) {}
}
