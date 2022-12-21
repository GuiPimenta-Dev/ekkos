import { VideoPosted } from "../../domain/event/EventFactory";
import FeedRepositoryInterface from "../ports/repository/FeedRepositoryInterface";
import HandlerInterface from "./implements/Handler";
import ProfileRepositoryInterface from "../ports/repository/ProfileRepositoryInterface";
import { v4 as uuid } from "uuid";

export default class VideoPostedHandler implements HandlerInterface {
  name: string;
  constructor(private feedRepository: FeedRepositoryInterface, private profileRepository: ProfileRepositoryInterface) {
    this.name = "VideoPosted";
  }

  async handle({ payload }: VideoPosted): Promise<void> {
    const profile = await this.profileRepository.findProfileById(payload.profileId);
    const followers = profile.getFollowers();
    await Promise.all(
      followers.map(async (follower) => {
        await this.feedRepository.save({
          postId: uuid(),
          profileId: follower,
          videoId: payload.videoId,
        });
      })
    );
  }
}
