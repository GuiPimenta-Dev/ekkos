import NotFound from "../../application/http/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";

export default class DeleteComment {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(profileId: string, videoId: string, commentId: string): Promise<void> {
    const video = await this.videoRepository.findVideoById(videoId);
    const comment = video.getComments().find((c) => c.commentId == commentId);
    if (!comment) throw new NotFound("Comment not found");
    video.deleteComment(profileId, comment);
    await this.videoRepository.update(video);
  }
}
