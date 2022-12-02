import Video from "../../domain/entity/Video";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";

export default class MemoryVideoRepository implements VideoRepositoryInterface {
  videos: Video[];

  constructor() {
    const comment = { commentId: "commentId", profileId: "1", text: "text" };
    this.videos = [new Video("videoId", "1", "title", "description", "url", ["2"], [comment])];
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
