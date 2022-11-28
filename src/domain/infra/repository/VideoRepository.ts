import Video from "../../entity/Video";
import CommentDTO from "../../../dto/CommentDTO";

export default interface VideoRepositoryInterface {
  save(video: Video): Promise<void>;
  findVideosByProfileId(profileId: string): Promise<Video[]>;
  findVideoById(id: string): Promise<Video>;
  update(video: Video): Promise<void>;
  getCommentById(id: string): Promise<CommentDTO>;
  isVideoDuplicated(url: string): Promise<Boolean>;
}
