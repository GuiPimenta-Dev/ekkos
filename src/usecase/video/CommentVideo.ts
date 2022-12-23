import VideoRepositoryInterface from "../../application/ports/repository/VideoRepositoryInterface";
import { v4 as uuid } from "uuid";
import Comment from "../../domain/entity/video/Comment";

export default class CommentVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(profileId: string, videoId: string, text: string): Promise<string> {
    const video = await this.videoRepository.findVideoById(videoId);
    const comment = new Comment(uuid(), profileId, text);
    video.comment(comment);
    await this.videoRepository.update(video);
    return comment.commentId;
  }
}
