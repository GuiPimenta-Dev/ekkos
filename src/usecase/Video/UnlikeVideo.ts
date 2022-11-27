import NotFound from "../../application/http/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class UnlikeVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(profileId: string, videoId: string): Promise<void> {
    const video = await this.videoRepository.findVideoById(videoId);
    if (!video) throw new NotFound("Video not found");
    video.unlike(profileId);
    await this.videoRepository.update(video);
  }
}
