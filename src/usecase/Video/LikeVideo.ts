import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class LikeVideo {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface
  ) {}

  async execute(userId: string, videoId: string): Promise<void> {
    const profile = await this.profileRepository.getProfileById(userId);
    const video = await this.videoRepository.getVideoById(videoId);
    if (video.likes.includes(profile)) throw new Error("You already liked this video");
    video.likes.push(profile);
    await this.videoRepository.update(video);
  }
}
