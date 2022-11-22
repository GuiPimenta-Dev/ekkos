import Video from "../../entity/Video";
import Comment from "../../entity/Comment";

export default interface VideoRepositoryInterface {
  save(video: Video): Promise<void>;
  getVideosByUserId(userId: string): Promise<Video[]>;
  getVideoById(id: string): Promise<Video>;
  update(video: Video): Promise<void>;
  getCommentById(id: string): Promise<Comment>;
  isVideoDuplicated(url: string): Promise<Boolean>;
}
