import Video from "../../../src/domain/entity/Video";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepository";

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
}
