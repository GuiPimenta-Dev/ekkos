import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class UnlikeVideo {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface
  ) {}

  async execute(userId: string, videoId: string): Promise<void> {
    const profile = await this.profileRepository.getProfileById(userId);
    const video = await this.videoRepository.getVideoById(videoId);
    if (!video.likes.includes(profile)) throw new Error("You can't unlike this video");
    const profileIndex = video.likes.indexOf(profile);
    video.likes.splice(profileIndex, 1);
    await this.videoRepository.update(video);
  }
}
