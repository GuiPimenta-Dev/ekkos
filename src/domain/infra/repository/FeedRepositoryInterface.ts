import FeedDTO from "../../../dto/FeedDTO";

export default interface FeedRepositoryInterface {
  save(input: FeedDTO): Promise<void>;
}
