import DeleteComment from "../../../src/usecase/video/DeleteComment";
import MemoryVideoRepository from "../../../src/infra/repository/MemoryVideoRepository";
import PostVideo from "../../../src/usecase/video/PostVideo";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepositoryInterface";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import RepositoryFactory from "../../utils/factory/RepositoryFactory";

let videoRepository: VideoRepositoryInterface;
let factory: RepositoryFactory;
const broker = new MemoryBroker();

beforeEach(async () => {
  videoRepository = new MemoryVideoRepository();
  factory = new RepositoryFactory({ videoRepository });
});

test("It should be able to post a video", async () => {
  const videoRepository = new MemoryVideoRepository();

  const usecase = new PostVideo(videoRepository, broker);
  await usecase.execute({ profileId: "profileId", title: "title", description: "description", url: "some_url" });

  expect(videoRepository.videos).toHaveLength(1);
});

test("It should not be able to post a duplicated video", async () => {
  const video = factory.createVideo();

  const usecase = new PostVideo(videoRepository, broker);
  const input = { profileId: "profileId", title: "title", description: "description", url: video.url };

  await expect(usecase.execute(input)).rejects.toThrow("Video url already in use");
});

test("It should not to be able to delete a comment that does not exists", async () => {
  const video = factory.createVideo();

  const usecase = new DeleteComment(videoRepository);
  expect(usecase.execute("profile", video.videoId, "invalid-comment-id")).rejects.toThrow("Comment not found");
});
