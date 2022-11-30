import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";

export default class UnlikeVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(profileId: string, videoId: string): Promise<void> {
    const video = await this.videoRepository.findVideoById(videoId);
    video.unlike(profileId);
    await this.videoRepository.update(video);
  }
}
