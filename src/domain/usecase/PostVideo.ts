import PostVideoDTO from "../dto/PostVideo";
import VideoRepositoryInterface from "../infra/repository/VideoRepository";
import { v4 as uuid } from "uuid";
import Video from "../entity/Video";

export default class PostVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(input: PostVideoDTO): Promise<string> {
    if (await this.videoRepository.isDuplicated(input.url)) throw new Error("Duplicated video");
    const videoId = uuid();
    const video = new Video(videoId, input.profileId, input.title, input.description, input.url);
    await this.videoRepository.save(video);
    return videoId;
  }
}
