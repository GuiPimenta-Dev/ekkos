import FeedDTO from "../../../dto/FeedDTO";

export default interface FeedRepositoryInterface {
  create(input: FeedDTO): Promise<void>;
  getFeedByProfileId(profileId: string): Promise<FeedDTO[]>;
  deletePostById(postId: string): Promise<void>;
}
