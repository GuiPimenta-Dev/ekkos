import FeedRepositoryInterface from "../../application/ports/repository/FeedRepositoryInterface";
import FeedDTO from "../../dto/FeedDTO";

export default class MemoryFeedRepository implements FeedRepositoryInterface {
  posts: FeedDTO[];

  constructor() {
    this.posts = [{ postId: "1", profileId: "2", videoId: "videoId" }];
  }

  async save(input: FeedDTO): Promise<void> {
    this.posts.push(input);
  }

  async getFeedByProfileId(profileId: string): Promise<FeedDTO[]> {
    return this.posts.filter((feed) => feed.profileId === profileId);
  }

  async deletePostById(postId: string): Promise<void> {
    this.posts = this.posts.filter((feed) => feed.postId !== postId);
  }
}
