import Video from "../../domain/entity/video/Video";
import VideoRepositoryInterface from "../../application/ports/repository/VideoRepositoryInterface";

export default class MemoryVideoRepository implements VideoRepositoryInterface {
  videos: Video[];

  constructor() {
    this.videos = [];
  }

  async create(video: Video): Promise<void> {
    this.videos.push(video);
  }

  async findVideosByOwnerId(ownerId: string): Promise<Video[]> {
    return this.videos.filter((video) => video.ownerId === ownerId);
  }

  async findVideoById(id: string): Promise<Video> {
    const video = this.videos.find((video) => video.id === id);
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
