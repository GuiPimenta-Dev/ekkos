import { v4 as uuid } from "uuid";

export default class Comment {
  constructor(readonly id: string, readonly profileId: string, readonly text: string) {}

  static create(profileId: string, text: string) {
    return new Comment(uuid(), profileId, text);
  }
}
