import Forbidden from "../../application/http/Forbidden";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class DeleteComment {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, commentId: string): Promise<void> {
    const comment = await this.videoRepository.getCommentById(commentId);
    if (comment.userId !== userId) throw new Forbidden("You can't delete this comment");
    const video = await this.videoRepository.findVideoById(comment.videoId);
    const commentIndex = video.comments.indexOf(comment);
    video.comments.splice(commentIndex, 1);
    await this.videoRepository.update(video);
  }
}
