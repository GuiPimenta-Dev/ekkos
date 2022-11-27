import Comment from "../../entity/Comment";
import Video from "../../entity/Video";

export default interface VideoRepositoryInterface {
  save(video: Video): Promise<void>;
  findVideosByProfileId(profileId: string): Promise<Video[]>;
  findVideoById(id: string): Promise<Video>;
  update(video: Video): Promise<void>;
  getCommentById(id: string): Promise<Comment>;
  isVideoDuplicated(url: string): Promise<Boolean>;
}
