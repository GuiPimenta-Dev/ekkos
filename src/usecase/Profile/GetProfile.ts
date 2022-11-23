import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class GetProfile {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface
  ) {}

  async execute(id: string): Promise<Profile> {
    const profile = await this.profileRepository.getProfileById(id);
    const videos = await this.videoRepository.getVideosByUserId(id);
    return { ...profile, videos };
  }
}
