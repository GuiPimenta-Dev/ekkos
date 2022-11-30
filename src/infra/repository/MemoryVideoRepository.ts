import Video from "../../domain/entity/Video";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";
import CommentDTO from "../../dto/CommentDTO";

export default class MemoryVideoRepository implements VideoRepositoryInterface {
  videos: Video[];

  constructor() {
    const comment = { commentId: "commentId", videoId: "videoId", profileId: "1", text: "text" };
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

  async getCommentById(id: string): Promise<CommentDTO> {
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
