import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class GetProfile {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface,
    private bandRepository: BandRepositoryInterface
  ) {}

  async execute(userId: string): Promise<any> {
    const profile = await this.profileRepository.findProfileById(userId);
    const videos = await this.videoRepository.findVideosByUserId(userId);
    const bands = await this.bandRepository.findBandsByUserId(userId);
    return {
      nick: profile.nick,
      avatar: profile.avatar,
      followers: profile.getFollowers(),
      following: profile.getFollowing(),
      videos: videos.map((video) => ({
        videoId: video.videoId,
        title: video.title,
        description: video.description,
        url: video.url,
        likes: video.getLikes().length,
        comments: video.getComments().length,
      })),
      bands: bands.map((band) => ({
        bandId: band.bandId,
        name: band.name,
        logo: band.logo,
      })),
    };
  }
}
