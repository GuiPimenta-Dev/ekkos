import Video from "../../../src/domain/entity/Video";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepository";
import Profile from "../../../src/domain/entity/Profile";
import { v4 as uuid } from "uuid";

export default class VideoRepository implements VideoRepositoryInterface {
  readonly videos: Video[] = [];

  async save(input: Video): Promise<void> {
    if (await this.isDuplicated(input.url)) throw new Error("Duplicated video");
    this.videos.push(input);
  }

  async getVideos(profileId: string): Promise<Video[]> {
    const videos = this.videos.filter((video) => video.profileId === profileId);
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

  async commentVideo(profile: Profile, videoId: string, comment: string): Promise<void> {
    const video = await this.getVideo(videoId);
    video.comments.push({ id: uuid(), profile, comment });
  }
}
