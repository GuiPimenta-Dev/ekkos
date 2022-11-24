import BadRequest from "../../application/http_status/BadRequest";
import NotFound from "../../application/http_status/NotFound";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class UnlikeVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, videoId: string): Promise<void> {
    const video = await this.videoRepository.getVideoById(videoId);
    if (!video) throw new NotFound("Video not found");
    if (!video.likes.includes(userId)) throw new BadRequest("You can't unlike a video you don't like");
    const profileIndex = video.likes.indexOf(userId);
    video.likes.splice(profileIndex, 1);
    await this.videoRepository.update(video);
  }
}
