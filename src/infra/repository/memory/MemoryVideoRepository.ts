import Video from "../../../domain/entity/Video";
import Comment from "../../../domain/entity/Comment";
import VideoRepositoryInterface from "../../../domain/infra/repository/VideoRepository";

export default class MemoryVideoRepository implements VideoRepositoryInterface {
  readonly videos: Video[] = [];

  async save(input: Video): Promise<void> {
    this.videos.push(input);
  }

  async getVideosByUserId(userId: string): Promise<Video[]> {
    const videos = this.videos.filter((video) => video.userId === userId);
    if (!videos) throw new Error("Profile not found");
    return videos;
  }

  async getVideoById(id: string): Promise<Video> {
    const video = this.videos.find((video) => video.id === id);
    if (!video) throw new Error("Video not found");
    return video;
  }

  async update(video: Video): Promise<void> {
    const index = this.videos.indexOf(video);
    this.videos[index] = video;
  }

  async getCommentById(id: string): Promise<Comment> {
    for (let index = 0; index < this.videos.length; index++) {
      const video = this.videos[index];
      const comment = video.comments.find((comment) => comment.id === id);
      if (comment) return comment;
    }
  }

  async isVideoDuplicated(url: string): Promise<Boolean> {
    const video = this.videos.find((video) => video.url === url);
    return video !== undefined;
  }
}
