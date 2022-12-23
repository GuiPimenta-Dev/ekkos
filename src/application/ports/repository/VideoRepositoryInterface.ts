import Video from "../../../domain/entity/video/Video";

export default interface VideoRepositoryInterface {
  create(video: Video): Promise<void>;
  findVideosByProfileId(profileId: string): Promise<Video[]>;
  findVideoById(id: string): Promise<Video>;
  update(video: Video): Promise<void>;
  isUrlTaken(url: string): Promise<Boolean>;
}
