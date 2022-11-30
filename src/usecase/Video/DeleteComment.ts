import NotFound from "../../application/http/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";

export default class DeleteComment {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(profileId: string, commentId: string): Promise<void> {
    const comment = await this.videoRepository.getCommentById(commentId);
    if (!comment) throw new NotFound("Comment not found");
    const video = await this.videoRepository.findVideoById(comment.videoId);
    video.deleteComment(profileId, commentId);
    await this.videoRepository.update(video);
  }
}
