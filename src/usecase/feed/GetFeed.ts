import FeedRepositoryInterface from "../../domain/infra/repository/FeedRepositoryInterface";

export default class GetFeed {
  constructor(private feedRepository: FeedRepositoryInterface) {}

  async execute(profileId: string): Promise<any> {
    const feed = await this.feedRepository.getFeedByProfileId(profileId);
    await Promise.all(
      feed.map(async (feed) => {
        await this.feedRepository.deletePostById(feed.postId);
      })
    );
    return feed;
  }
}
