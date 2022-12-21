import Video from "../../../domain/entity/Video";

export default interface VideoRepositoryInterface {
  save(video: Video): Promise<void>;
  findVideosByProfileId(profileId: string): Promise<Video[]>;
  findVideoById(id: string): Promise<Video>;
  update(video: Video): Promise<void>;
  isUrlTaken(url: string): Promise<Boolean>;
}
