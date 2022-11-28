import NotFound from "../../application/http/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";
import { v4 as uuid } from "uuid";

export default class CommentVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(profileId: string, videoId: string, text: string): Promise<string> {
    const video = await this.videoRepository.findVideoById(videoId);
    if (!video) throw new NotFound("Video not found");
    const comment = { commentId: uuid(), videoId, profileId, text };
    video.comment(comment);
    await this.videoRepository.update(video);
    return comment.commentId;
  }
}
