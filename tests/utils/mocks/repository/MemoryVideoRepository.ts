import Comment from "../../../../src/domain/entity/Comment";
import Video from "../../../../src/domain/entity/Video";
import VideoRepositoryInterface from "../../../../src/domain/infra/repository/VideoRepository";

export default class MemoryVideoRepository implements VideoRepositoryInterface {
  readonly videos: Video[] = [];

  async save(video: Video): Promise<void> {
    this.videos.push(video);
  }

  async findVideosByUserId(userId: string): Promise<Video[]> {
    return this.videos.filter((video) => video.userId === userId);
  }

  async findVideoById(id: string): Promise<Video> {
    const video = this.videos.find((video) => video.videoId === id);
    return video;
  }

  async update(video: Video): Promise<void> {
    const index = this.videos.indexOf(video);
    this.videos[index] = video;
  }

  async getCommentById(id: string): Promise<Comment> {
    for (let index = 0; index < this.videos.length; index++) {
      const video = this.videos[index];
      const comment = video.getComments().find((comment) => comment.commentId === id);
      if (comment) return comment;
    }
  }

  async isVideoDuplicated(url: string): Promise<Boolean> {
    const video = this.videos.find((video) => video.url === url);
    return video !== undefined;
  }
}
