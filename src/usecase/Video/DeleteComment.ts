import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class DeleteComment {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, videoId: string, commentId: string): Promise<void> {
    const video = await this.videoRepository.getVideo(videoId);
    const comment = video.comments.find((comment) => comment.id === commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.profile.userId !== userId) {
      throw new Error("You can't delete this comment");
    }
    await this.videoRepository.deleteComment(videoId, commentId);
  }
}
