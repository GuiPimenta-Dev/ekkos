import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class DeleteComment {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, videoId: string, commentId: string): Promise<void> {
    const comment = await this.videoRepository.getComment(videoId, commentId);
    if (comment.profile.userId !== userId) {
      throw new Error("You can't delete this comment");
    }
    await this.videoRepository.deleteComment(videoId, comment);
  }
}
