import { v4 as uuid } from "uuid";

export default class Comment {
  constructor(readonly id: string, readonly ownerId: string, readonly text: string) {}

  static create(ownerId: string, text: string) {
    return new Comment(uuid(), ownerId, text);
  }
}
