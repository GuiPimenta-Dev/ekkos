import BadRequest from "../../../application/http/BadRequest";
import Forbidden from "../../../application/http/Forbidden";
import Comment from "./Comment";
import { v4 as uuid } from "uuid";

export default class Video {
  constructor(
    readonly id: string,
    readonly profileId: string,
    readonly title: string,
    readonly description: string,
    readonly url: string,
    private likes: string[],
    private comments: Comment[],
  ) {}

  static create(profileId: string, title: string, description: string, url: string) {
    return new Video(uuid(), profileId, title, description, url, [], []);
  }

  like(profileId: string): void {
    if (this.likes.includes(profileId)) throw new BadRequest("User already liked this video");
    this.likes.push(profileId);
  }

  unlike(profileId: string): void {
    if (!this.likes.includes(profileId)) throw new BadRequest("User did not like this video");
    this.likes = this.likes.filter((id) => id !== profileId);
  }

  comment(comment: Comment): void {
    this.comments.push(comment);
  }

  deleteComment(profileId: string, comment: Comment): void {
    if (comment.profileId !== profileId) throw new Forbidden("You can't delete this comment");
    this.comments = this.comments.filter((c) => c.id !== comment.id);
  }

  getLikes(): string[] {
    return this.likes;
  }

  getComments(): Comment[] {
    return this.comments;
  }
}
