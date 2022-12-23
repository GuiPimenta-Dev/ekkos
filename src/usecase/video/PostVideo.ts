import BadRequest from "../../application/http/BadRequest";
import PostVideoDTO from "../../dto/PostVideoDTO";
import Video from "../../domain/entity/video/Video";
import VideoRepositoryInterface from "../../application/ports/repository/VideoRepositoryInterface";
import { v4 as uuid } from "uuid";
import BrokerInterface from "../../application/ports/broker/BrokerInterface";
import EventFactory from "../../domain/event/EventFactory";

export default class PostVideo {
  constructor(private videoRepository: VideoRepositoryInterface, private broker: BrokerInterface) {}

  async execute(input: PostVideoDTO): Promise<string> {
    if (await this.videoRepository.isUrlTaken(input.url)) throw new BadRequest("Video url already in use");
    const videoId = uuid();
    const video = new Video(videoId, input.profileId, input.title, input.description, input.url);
    await this.videoRepository.create(video);
    await this.broker.publish(EventFactory.emitVideoPosted({ profileId: input.profileId, videoId }));
    return videoId;
  }
}
