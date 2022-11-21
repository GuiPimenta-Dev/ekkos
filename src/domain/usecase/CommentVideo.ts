import ProfileRepositoryInterface from "../infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../infra/repository/VideoRepository";

export default class CommentVideo {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface
  ) {}

  async execute(profileId: string, videoId: string, comment: string): Promise<void> {
    const profile = await this.profileRepository.getProfile(profileId);
    if (!profile) throw new Error("Profile does not exist");
    const video = await this.videoRepository.getVideo(videoId);
    if (!video) throw new Error("Video does not exist");
    await this.videoRepository.commentVideo(profile, videoId, comment);
  }
}
