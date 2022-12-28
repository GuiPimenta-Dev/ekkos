import Video from "../../../src/domain/entity/video/Video";
import Comment from "../../../src/domain/entity/video/Comment";

export default class VideoBuilder {
  public videoId: string = "videoId";
  public ownerId: string = "ownerId";
  public title: string = "title";
  public description: string = "description";
  public url: string = "url";
  public likes: string[] = [];
  public comments: Comment[] = [];

  static createVideo() {
    return new VideoBuilder();
  }

  withOwnerId(ownerId: string) {
    this.ownerId = ownerId;
    return this;
  }

  withUrl(url: string) {
    this.url = url;
    return this;
  }

  withLike(like: string) {
    this.likes.push(like);
    return this;
  }

  withComment(comment: Comment) {
    this.comments.push(comment);
    return this;
  }

  build() {
    return new Video(this.videoId, this.ownerId, this.title, this.description, this.url, this.likes, this.comments);
  }
}
