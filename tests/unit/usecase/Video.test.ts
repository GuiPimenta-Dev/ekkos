import DeleteComment from "../../../src/usecase/video/DeleteComment";
import MemoryVideoRepository from "../../../src/infra/repository/MemoryVideoRepository";
import PostVideo from "../../../src/usecase/video/PostVideo";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import CommentVideo from "../../../src/usecase/video/CommentVideo";
import VideoBuilder from "../../utils/builder/VideoBuilder";
import LikeVideo from "../../../src/usecase/video/LikeVideo";
import UnlikeVideo from "../../../src/usecase/video/UnlikeVideo";

let videoRepository: MemoryVideoRepository;
let videoBuilder: VideoBuilder;
const broker = new MemoryBroker();

beforeEach(async () => {
  videoRepository = new MemoryVideoRepository();
  videoBuilder = new VideoBuilder(videoRepository);
});

test("It should be able to post a video", async () => {
  const videoRepository = new MemoryVideoRepository();

  const usecase = new PostVideo(videoRepository, broker);
  await usecase.execute({ profileId: "profileId", title: "title", description: "description", url: "some_url" });

  expect(videoRepository.videos).toHaveLength(1);
});

test("It should not be able to post a duplicated video", async () => {
  const video = videoBuilder.createVideo();

  const usecase = new PostVideo(videoRepository, broker);
  const input = { profileId: "profileId", title: "title", description: "description", url: video.url };

  await expect(usecase.execute(input)).rejects.toThrow("Video url already in use");
});

test("It should be able to comment a video", async () => {
  const video = videoBuilder.createVideo();

  const usecase = new CommentVideo(videoRepository);
  await usecase.execute("profile", video.videoId, "comment");

  expect(videoRepository.videos[0].getComments()).toHaveLength(1);
});

test("It should be able to delete a comment", async () => {
  const video = videoBuilder.createVideo().withComment({ id: "comment-id", profileId: "profile", text: "comment" });

  const usecase = new DeleteComment(videoRepository);
  await usecase.execute("profile", video.videoId, "comment-id");

  expect(videoRepository.videos[0].getComments()).toHaveLength(0);
});

test("It should be able to like a video", async () => {
  const video = videoBuilder.createVideo();

  const usecase = new LikeVideo(videoRepository);
  await usecase.execute("profile", video.videoId);

  expect(videoRepository.videos[0].getLikes()).toHaveLength(1);
});

test("It should be able to unlike a video", async () => {
  const video = videoBuilder.createVideo().withLike("profile");

  const usecase = new UnlikeVideo(videoRepository);
  await usecase.execute("profile", video.videoId);

  expect(videoRepository.videos[0].getLikes()).toHaveLength(0);
});

test("It should not to be able to delete a comment that does not exists", async () => {
  const video = videoBuilder.createVideo();

  const usecase = new DeleteComment(videoRepository);
  expect(usecase.execute("profile", video.videoId, "invalid-comment-id")).rejects.toThrow("Comment not found");
});
