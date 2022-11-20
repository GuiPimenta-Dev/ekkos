import Video from "../../entity/Video";

export default interface VideoRepositoryInterface {
  save(input: Video): Promise<void>;
  getVideos(profileId: string): Promise<Video[]>;
  getVideo(id: string): Promise<Video>;
  isDuplicated(url: string): Promise<Boolean>;
}
