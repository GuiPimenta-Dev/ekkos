import BadRequest from "../../application/http/BadRequest";
import PostVideoDTO from "../../dto/PostVideoDTO";
import Video from "../../domain/entity/Video";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";
import { v4 as uuid } from "uuid";
import BrokerInterface from "../../domain/infra/broker/BrokerInterface";
import EventFactory from "../../domain/event/EventFactory";

export default class PostVideo {
  constructor(private videoRepository: VideoRepositoryInterface, private broker: BrokerInterface) {}

  async execute(input: PostVideoDTO): Promise<string> {
    if (await this.videoRepository.isUrlTaken(input.url)) throw new BadRequest("Video url already in use");
    const videoId = uuid();
    const video = new Video(videoId, input.profileId, input.title, input.description, input.url);
    await this.videoRepository.save(video);
    await this.broker.publish(EventFactory.emitVideoPosted({ profileId: input.profileId, videoId }));
    return videoId;
  }
}
