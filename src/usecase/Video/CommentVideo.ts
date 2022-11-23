import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";
import Comment from "../../domain/entity/Comment";
import { v4 as uuid } from "uuid";
import HttpError from "../../application/error/HttpError";

export default class CommentVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, videoId: string, text: string): Promise<string> {
    const video = await this.videoRepository.getVideoById(videoId);
    if (!video) throw new HttpError(400, "Video not found");
    const comment = new Comment(uuid(), video.id, userId, text);
    video.comments.push(comment);
    await this.videoRepository.update(video);
    return comment.id;
  }
}
