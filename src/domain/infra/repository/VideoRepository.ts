import Video from "../../entity/Video";
import Profile from "../../entity/Profile";

export default interface VideoRepositoryInterface {
  save(input: Video): Promise<void>;
  getVideos(profileId: string): Promise<Video[]>;
  getVideo(id: string): Promise<Video>;
  isDuplicated(url: string): Promise<Boolean>;
  likeVideo(profile: Profile, videoId: string): Promise<void>;
  commentVideo(profile: Profile, videoId: string, comment: string): Promise<void>;
}
