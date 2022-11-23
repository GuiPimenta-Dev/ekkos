import HttpError from "../../application/error/HttpError";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class LikeVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, videoId: string): Promise<void> {
    const video = await this.videoRepository.getVideoById(videoId);
    if (!video) throw new HttpError(400, "Video not found");
    if (video.likes.includes(userId)) throw new HttpError(400, "You already like this video");
    video.likes.push(userId);
    await this.videoRepository.update(video);
  }
}
