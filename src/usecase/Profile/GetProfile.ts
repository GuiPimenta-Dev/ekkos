import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class GetProfile {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface
  ) {}

  async execute(id: string): Promise<any> {
    const profile = await this.profileRepository.getProfileById(id);
    const videos = await this.videoRepository.getVideosByUserId(id);
    return {
      nickname: profile.nickname,
      followers: profile.followers.length,
      following: profile.following.length,
      videos: videos.map((video) => ({
        id: video.videoId,
        title: video.title,
        description: video.description,
        url: video.url,
        likes: video.likes.length,
        comments: video.comments.length,
      })),
    };
  }
}
