import BadRequest from "../../application/http/BadRequest";
import NotFound from "../../application/http/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class LikeVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, videoId: string): Promise<void> {
    const video = await this.videoRepository.findVideoById(videoId);
    if (!video) throw new NotFound("Video not found");
    if (video.likes.includes(userId)) throw new BadRequest("You already like this video");
    video.likes.push(userId);
    await this.videoRepository.update(video);
  }
}
