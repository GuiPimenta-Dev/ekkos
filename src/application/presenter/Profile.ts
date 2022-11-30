import Profile from "../../domain/entity/Profile";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepositoryInterface";

export default class ProfilePresenter {
  constructor(private videoRepository: VideoRepositoryInterface, private bandRepository: BandRepositoryInterface) {}

  async present(profile: Profile) {
    const videos = await this.videoRepository.findVideosByProfileId(profile.profileId);
    const bands = await this.bandRepository.findBandsByProfileId(profile.profileId);
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
