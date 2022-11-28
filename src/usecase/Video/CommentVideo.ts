import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";
import { v4 as uuid } from "uuid";

export default class CommentVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(profileId: string, videoId: string, text: string): Promise<string> {
    const video = await this.videoRepository.findVideoById(videoId);
    const commentId = uuid();
    const comment = { commentId, videoId, profileId, text };
    video.comment(comment);
    await this.videoRepository.update(video);
    return commentId;
  }
}
