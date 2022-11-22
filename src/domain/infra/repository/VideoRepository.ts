import Video from "../../entity/Video";
import Profile from "../../entity/Profile";
import Comment from "../../entity/Comment";

export default interface VideoRepositoryInterface {
  save(input: Video): Promise<void>;
  getVideos(profileId: string): Promise<Video[]>;
  getVideo(id: string): Promise<Video>;
  likeVideo(profile: Profile, videoId: string): Promise<void>;
  unlikeVideo(profile: Profile, videoId: string): Promise<void>;
  commentVideo(videoId: string, comment: Comment): Promise<void>;
}
