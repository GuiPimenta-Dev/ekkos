import BadRequest from "../../application/http/BadRequest";
import Forbidden from "../../application/http/Forbidden";
import CommentDTO from "../../dto/CommentDTO";

export default class Video {
  constructor(
    readonly videoId: string,
    readonly profileId: string,
    readonly title: string,
    readonly description: string,
    readonly url: string,
    private likes: string[] = [],
    private comments: CommentDTO[] = []
  ) {}

  like(profileId: string): void {
    if (this.likes.includes(profileId)) throw new BadRequest("User already liked this video");
    this.likes.push(profileId);
  }

  unlike(profileId: string): void {
    if (!this.likes.includes(profileId)) throw new BadRequest("User did not like this video");
    this.likes = this.likes.filter((id) => id !== profileId);
  }

  comment(comment: CommentDTO): void {
    this.comments.push(comment);
  }

  deleteComment(profileId: string, commentId: string): void {
    const comment = this.comments.find((comment) => comment.commentId === commentId);
    if (comment.profileId !== profileId) throw new Forbidden("You can't delete this comment");
    this.comments = this.comments.filter((comment) => comment.commentId !== commentId);
  }

  getLikes(): string[] {
    return this.likes;
  }

  getComments(): CommentDTO[] {
    return this.comments;
  }
}
