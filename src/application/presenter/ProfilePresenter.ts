import VideoRepositoryInterface from "../ports/repository/VideoRepositoryInterface";
import BandRepositoryInterface from "../ports/repository/BandRepositoryInterface";
import ProfileRepositoryInterface from "../ports/repository/ProfileRepositoryInterface";

export default class ProfilePresenter {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface,
    private bandRepository: BandRepositoryInterface,
  ) {}

  async present(profileId: string) {
    const profile = await this.profileRepository.findProfileById(profileId);
    const videos = await this.videoRepository.findVideosByOwnerId(profileId);
    const bands = await this.bandRepository.findBandsByProfileId(profileId);
    return {
      nick: profile.nick,
      avatar: profile.avatar,
      followers: profile.getFollowers().length,
      following: profile.getFollowing().length,
      videos: videos.map((video) => ({
        videoId: video.id,
        title: video.title,
        description: video.description,
        url: video.url,
        likes: video.getLikes().length,
        comments: video.getComments().length,
      })),
      bands: bands.map((band) => ({
        bandId: band.id,
        name: band.name,
        logo: band.logo,
      })),
    };
  }
}
