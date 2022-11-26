import NotFound from "../../application/http/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class DeleteComment {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, commentId: string): Promise<void> {
    const comment = await this.videoRepository.getCommentById(commentId);
    const video = await this.videoRepository.findVideoById(comment.videoId);
    if (!video) throw new NotFound("Video not found");
    video.deleteComment(userId, commentId);
    await this.videoRepository.update(video);
  }
}
