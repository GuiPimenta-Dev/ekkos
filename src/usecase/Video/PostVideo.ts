import PostVideoDTO from "../../dto/PostVideoDTO";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";
import { v4 as uuid } from "uuid";
import Video from "../../domain/entity/Video";

export default class PostVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(input: PostVideoDTO): Promise<string> {
    if (await this.videoRepository.isVideoDuplicated(input.url)) throw new Error("Video url already in use");
    const videoId = uuid();
    const video = new Video(videoId, input.userId, input.title, input.description, input.url);
    await this.videoRepository.save(video);
    return videoId;
  }
}
