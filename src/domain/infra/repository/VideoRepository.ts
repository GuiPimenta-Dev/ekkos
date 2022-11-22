import Video from "../../entity/Video";
import Profile from "../../entity/Profile";
import Comment from "../../entity/Comment";

export default interface VideoRepositoryInterface {
  save(video: Video): Promise<void>;
  getVideos(userId: string): Promise<Video[]>;
  getVideo(id: string): Promise<Video>;
  likeVideo(profile: Profile, video: Video): Promise<void>;
  unlikeVideo(profile: Profile, video: Video): Promise<void>;
  commentVideo(videoId: string, comment: Comment): Promise<void>;
  deleteComment(videoId: string, comment: Comment): Promise<void>;
  getComment(videoId: string, commentId: string): Promise<Comment>;
}
