import BadRequest from "../../application/http/BadRequest";
import Comment from "./Comment";
import Forbidden from "../../application/http/Forbidden";
import NotFound from "../../application/http/NotFound";

export default class Video {
  constructor(
    readonly videoId: string,
    readonly userId: string,
    readonly title: string,
    readonly description: string,
    readonly url: string,
    private likes: string[] = [],
    private comments: Comment[] = []
  ) {}

  like(userId: string): void {
    if (this.likes.includes(userId)) throw new BadRequest("User already liked this video");
    this.likes.push(userId);
  }

  unlike(userId: string): void {
    if (!this.likes.includes(userId)) throw new BadRequest("User did not like this video");
    this.likes = this.likes.filter((id) => id !== userId);
  }

  comment(comment: Comment): void {
    this.comments.push(comment);
  }

  deleteComment(userId: string, commentId: string): void {
    const comment = this.comments.find((comment) => comment.commentId === commentId);
    if (!comment) throw new NotFound("Comment not found");
    if (comment.userId !== userId) throw new Forbidden("You can't delete this comment");
    this.comments = this.comments.filter((comment) => comment.commentId !== commentId);
  }

  getLikes(): string[] {
    return this.likes;
  }

  getComments(): Comment[] {
    return this.comments;
  }
}
