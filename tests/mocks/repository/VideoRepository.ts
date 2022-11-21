import Video from "../../../src/domain/entity/Video";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepository";
import Profile from "../../../src/domain/entity/Profile";

export default class VideoRepository implements VideoRepositoryInterface {
  readonly videos: Video[] = [];

  async save(input: Video): Promise<void> {
    this.videos.push(input);
  }

  async getVideos(profileId: string): Promise<Video[]> {
    return this.videos.filter((video) => video.profileId === profileId);
  }

  async getVideo(id: string): Promise<Video> {
    return this.videos.find((video) => video.id === id);
  }

  async isDuplicated(url: string): Promise<Boolean> {
    const video = this.videos.find((video) => video.url === url);
    return video !== undefined;
  }

  async likeVideo(profile: Profile, videoId: string): Promise<void> {
    const video = await this.getVideo(videoId);
    video.likes.push(profile);
  }

  async commentVideo(profile: Profile, videoId: string, comment: string): Promise<void> {
    const video = await this.getVideo(videoId);
    video.comments.push({ profile, comment });
  }
}
