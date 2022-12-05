import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepositoryInterface";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepositoryInterface";

export default class ProfilePresenter {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface,
    private bandRepository: BandRepositoryInterface
  ) {}

  async present(profileId: string) {
    const profile = await this.profileRepository.findProfileById(profileId);
    const videos = await this.videoRepository.findVideosByProfileId(profileId);
    const bands = await this.bandRepository.findBandsByProfileId(profileId);
    return {
      nick: profile.nick,
      avatar: profile.avatar,
      followers: profile.getFollowers().length,
      following: profile.getFollowing().length,
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