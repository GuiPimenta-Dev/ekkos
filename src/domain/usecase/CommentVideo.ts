import ProfileRepositoryInterface from "../infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../infra/repository/VideoRepository";

export default class CommentVideo {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface
  ) {}

  async execute(profileId: string, videoId: string, comment: string): Promise<void> {
    const profile = await this.profileRepository.getProfile(profileId);
    await this.videoRepository.commentVideo(profile, videoId, comment);
  }
}
