import Profile from "./Profile";

export default class Comment {
  constructor(readonly id: string, readonly videoId: string, readonly userId: string, readonly text: string) {}
}
