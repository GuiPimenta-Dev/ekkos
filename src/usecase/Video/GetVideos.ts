import Video from "../../domain/entity/Video";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class GetVideos {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(id: string): Promise<Video[]> {
    return await this.videoRepository.getVideosByUserId(id);
  }
}
