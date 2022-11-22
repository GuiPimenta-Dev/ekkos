import Video from "../../../src/domain/entity/Video";
import Comment from "../../../src/domain/entity/Comment";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepository";
import Profile from "../../../src/domain/entity/Profile";

export default class VideoRepository implements VideoRepositoryInterface {
  readonly videos: Video[] = [];

  async save(input: Video): Promise<void> {
    if (await this.isDuplicated(input.url)) throw new Error("Duplicated video");
    this.videos.push(input);
  }

  async getVideos(profileId: string): Promise<Video[]> {
    const videos = this.videos.filter((video) => video.userId === profileId);
    if (!videos) throw new Error("Profile not found");
    return videos;
  }

  async getVideo(id: string): Promise<Video> {
    const video = this.videos.find((video) => video.id === id);
    if (!video) throw new Error("Video not found");
    return video;
  }

  async isDuplicated(url: string): Promise<Boolean> {
    const video = this.videos.find((video) => video.url === url);
    return video !== undefined;
  }

  async likeVideo(profile: Profile, videoId: string): Promise<void> {
    const video = await this.getVideo(videoId);
    video.likes.push(profile);
  }

  async unlikeVideo(profile: Profile, videoId: string): Promise<void> {
    const video = await this.getVideo(videoId);
    const profileIndex = video.likes.indexOf(profile);
    video.likes.splice(profileIndex, 1);
  }

  async commentVideo(videoId: string, comment: Comment): Promise<void> {
    const video = await this.getVideo(videoId);
    video.comments.push(comment);
  }
}
