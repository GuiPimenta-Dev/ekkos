import Comment from "../../domain/entity/Comment";
import NotFound from "../../application/http/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";
import { v4 as uuid } from "uuid";

export default class CommentVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, videoId: string, text: string): Promise<string> {
    const video = await this.videoRepository.getVideoById(videoId);
    if (!video) throw new NotFound("Video not found");
    const comment = new Comment(uuid(), video.videoId, userId, text);
    video.comments.push(comment);
    await this.videoRepository.update(video);
    return comment.commentId;
  }
}
