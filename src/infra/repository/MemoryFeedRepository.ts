import FeedRepositoryInterface from "../../domain/infra/repository/FeedRepositoryInterface";
import FeedDTO from "../../dto/FeedDTO";

export default class MemoryFeedRepository implements FeedRepositoryInterface {
  readonly feeds: FeedDTO[];

  constructor() {
    this.feeds = [];
  }

  async save(input: FeedDTO): Promise<void> {
    this.feeds.push(input);
  }
}
