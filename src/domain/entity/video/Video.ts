import BadRequest from "../../../application/http/BadRequest";
import Forbidden from "../../../application/http/Forbidden";
import Comment from "./Comment";

export default class Video {
  constructor(
    readonly videoId: string,
    readonly profileId: string,
    readonly title: string,
    readonly description: string,
    readonly url: string,
    private likes: string[] = [],
    private comments: Comment[] = [],
  ) {}

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
    this.comments = this.comments.filter((c) => c.commentId !== comment.commentId);
  }

  getLikes(): string[] {
    return this.likes;
  }

  getComments(): Comment[] {
    return this.comments;
  }
}
