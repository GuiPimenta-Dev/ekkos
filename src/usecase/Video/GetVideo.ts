import NotFound from "../../application/http/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class GetVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(id: string): Promise<any> {
    const video = await this.videoRepository.findVideoById(id);
    if (!video) throw new NotFound("Video not found");
    return video;
  }
}
