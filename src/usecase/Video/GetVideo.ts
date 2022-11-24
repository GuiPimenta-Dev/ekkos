import NotFound from "../../application/http/NotFound";
import Video from "../../domain/entity/Video";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class GetVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(id: string): Promise<Video> {
    const video = await this.videoRepository.getVideoById(id);
    if (!video) throw new NotFound("Video not found");
    return video;
  }
}
