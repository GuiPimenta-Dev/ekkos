import VideoRepositoryInterface from "../../../src/application/ports/repository/VideoRepositoryInterface";
import { v4 as uuid } from "uuid";
import Video from "../../../src/domain/entity/video/Video";
import Comment from "../../../src/domain/entity/video/Comment";

export default class VideoBuilder {
  public videoId: string;
  public profileId: string;
  public title: string;
  public description: string;
  public url: string;
  public likes: string[];
  public comments: Comment[];

  constructor(private videoRepository: VideoRepositoryInterface) {}

  createVideo(profileId: string = uuid()) {
    this.videoId = uuid();
    this.profileId = profileId;
    this.title = "title";
    this.description = "description";
    this.url = "url";
    this.likes = [];
    this.comments = [];
    this.videoRepository.create(this.video);
    return this;
  }

  withLike(like: string) {
    this.likes.push(like);
    this.videoRepository.update(this.video);
    return this;
  }

  withComment(comment: Comment) {
    this.comments.push(comment);
    this.videoRepository.update(this.video);
    return this;
  }

  private get video() {
    return new Video(this.videoId, this.profileId, this.title, this.description, this.url, this.likes, this.comments);
  }
}
