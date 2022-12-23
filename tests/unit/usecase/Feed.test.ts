import MemoryFeedRepository from "../../../src/infra/repository/MemoryFeedRepository";
import GetFeed from "../../../src/usecase/feed/GetFeed";
import FeedRepositoryInterface from "../../../src/application/ports/repository/FeedRepositoryInterface";

let feedRepository: FeedRepositoryInterface;

beforeEach(async () => {
  feedRepository = new MemoryFeedRepository();
  await feedRepository.create({ postId: "1", profileId: "1", videoId: "1" });
});

test("It should be able to get a feed", async () => {
  const usecase = new GetFeed(feedRepository);
  const feed = await usecase.execute("1");

  expect(feed).toHaveLength(1);
});

test("It should delete a post when the video is already seen", async () => {
  await new GetFeed(feedRepository).execute("1");

  const usecase = new GetFeed(feedRepository);
  const feed = await usecase.execute("1");

  expect(feed).toHaveLength(0);
});
