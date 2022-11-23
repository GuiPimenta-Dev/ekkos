import HttpError from "../../application/error/HttpError";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class UnlikeVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(userId: string, videoId: string): Promise<void> {
    const video = await this.videoRepository.getVideoById(videoId);
    if (!video) throw new HttpError(400, "Video not found");
    if (!video.likes.includes(userId)) throw new HttpError(400, "You can't unlike a video you don't like");
    const profileIndex = video.likes.indexOf(userId);
    video.likes.splice(profileIndex, 1);
    await this.videoRepository.update(video);
  }
}
