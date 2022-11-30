import DeleteComment from "../../../src/usecase/video/DeleteComment";
import GetVideo from "../../../src/usecase/video/GetVideo";
import MemoryVideoRepository from "../../../src/infra/repository/MemoryVideoRepository";
import PostVideo from "../../../src/usecase/video/PostVideo";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepository";

let videoRepository: VideoRepositoryInterface;

beforeEach(async () => {
  videoRepository = new MemoryVideoRepository();
});

test("It should be able to post a video", async () => {
  const videoRepository = new MemoryVideoRepository();
  const usecase = new PostVideo(videoRepository);
  await usecase.execute({ profileId: "profileId", title: "title", description: "description", url: "some_url" });
  expect(videoRepository.videos).toHaveLength(2);
});

test("It should not be able to post a duplicated video", async () => {
  const usecase = new PostVideo(videoRepository);
  const input = { profileId: "profileId", title: "title", description: "description", url: "url" };
  await expect(usecase.execute(input)).rejects.toThrow("Video url already in use");
});

test("It should be able to get a video by the id", async () => {
  const usecase = new GetVideo(videoRepository);
  const video = await usecase.execute("videoId");
  expect(video).toBeDefined();
});

test("It should not to be able to delete a comment that does not exists", async () => {
  const usecase = new DeleteComment(videoRepository);
  expect(usecase.execute("anotherprofileId", "commentID")).rejects.toThrow("Comment not found");
});
