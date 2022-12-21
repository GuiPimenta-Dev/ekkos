import Video from "../../domain/entity/Video";
import VideoRepositoryInterface from "../../application/ports/repository/VideoRepositoryInterface";

export default class MemoryVideoRepository implements VideoRepositoryInterface {
  videos: Video[];

  constructor() {
    this.videos = [];
  }

  async save(video: Video): Promise<void> {
    this.videos.push(video);
  }

  async findVideosByProfileId(profileId: string): Promise<Video[]> {
    return this.videos.filter((video) => video.profileId === profileId);
  }

  async findVideoById(id: string): Promise<Video> {
    const video = this.videos.find((video) => video.videoId === id);
    return video;
  }

  async update(video: Video): Promise<void> {
    const index = this.videos.indexOf(video);
    this.videos[index] = video;
  }

  async isUrlTaken(url: string): Promise<Boolean> {
    const video = this.videos.find((video) => video.url === url);
    return video !== undefined;
  }
}
