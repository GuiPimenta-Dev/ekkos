import FeedRepositoryInterface from "../../domain/infra/repository/FeedRepositoryInterface";
import FeedDTO from "../../dto/FeedDTO";

export default class MemoryFeedRepository implements FeedRepositoryInterface {
  feeds: FeedDTO[];

  constructor() {
    this.feeds = [];
  }

  async save(input: FeedDTO): Promise<void> {
    this.feeds.push(input);
  }

  async getFeedByProfileId(profileId: string): Promise<FeedDTO[]> {
    return this.feeds.filter((feed) => feed.profileId === profileId);
  }

  async deleteFeedById(postId: string): Promise<void> {
    this.feeds = this.feeds.filter((feed) => feed.postId !== postId);
  }
}
