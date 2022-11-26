import NotFound from "../../application/http/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class LikeVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, videoId: string): Promise<void> {
    const video = await this.videoRepository.findVideoById(videoId);
    if (!video) throw new NotFound("Video not found");
    video.like(userId);
    await this.videoRepository.update(video);
  }
}
