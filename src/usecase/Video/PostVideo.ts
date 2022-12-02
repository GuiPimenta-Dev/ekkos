import BadRequest from "../../application/http/BadRequest";
import PostVideoDTO from "../../dto/PostVideoDTO";
import Video from "../../domain/entity/Video";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";
import { v4 as uuid } from "uuid";

export default class PostVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(input: PostVideoDTO): Promise<string> {
    if (await this.videoRepository.isUrlTaken(input.url)) throw new BadRequest("Video url already in use");
    const videoId = uuid();
    const video = new Video(videoId, input.profileId, input.title, input.description, input.url);
    await this.videoRepository.save(video);
    return videoId;
  }
}
