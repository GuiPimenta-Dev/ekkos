import DeleteComment from "../../../src/usecase/video/DeleteComment";
import MemoryVideoRepository from "../../../src/infra/repository/MemoryVideoRepository";
import PostVideo from "../../../src/usecase/video/PostVideo";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import CommentVideo from "../../../src/usecase/video/CommentVideo";
import VideoBuilder from "../../utils/builder/VideoBuilder";
import LikeVideo from "../../../src/usecase/video/LikeVideo";
import UnlikeVideo from "../../../src/usecase/video/UnlikeVideo";
import Builder from "../../utils/builder/Builder";

let videoRepository: MemoryVideoRepository;
let videoBuilder: VideoBuilder;
const broker = new MemoryBroker();
let A: Builder;

beforeEach(async () => {
  videoRepository = new MemoryVideoRepository();
  A = new Builder();
});

test("It should be able to post a video", async () => {
  const videoRepository = new MemoryVideoRepository();

  const usecase = new PostVideo(videoRepository, broker);
  await usecase.execute({ profileId: "profileId", title: "title", description: "description", url: "some_url" });

  expect(videoRepository.videos).toHaveLength(1);
});

test("It should not be able to post a duplicated video", async () => {
  videoRepository.create(A.Video.withUrl("some-random-url").build());

  const usecase = new PostVideo(videoRepository, broker);
  const input = { profileId: "profileId", title: "title", description: "description", url: "some-random-url" };

  await expect(usecase.execute(input)).rejects.toThrow("Video url already in use");
});

test("It should be able to comment a video", async () => {
  videoRepository.create(A.Video.build());

  const usecase = new CommentVideo(videoRepository);
  await usecase.execute("profile", "videoId", "comment");

  expect(videoRepository.videos[0].getComments()).toHaveLength(1);
});

test("It should be able to delete a comment", async () => {
  videoRepository.create(A.Video.withComment({ id: "comment-id", ownerId: "profile", text: "comment" }).build());

  const usecase = new DeleteComment(videoRepository);
  await usecase.execute("profile", "videoId", "comment-id");

  expect(videoRepository.videos[0].getComments()).toHaveLength(0);
});

test("It should be able to like a video", async () => {
  videoRepository.create(A.Video.build());

  const usecase = new LikeVideo(videoRepository);
  await usecase.execute("profile", "videoId");

  expect(videoRepository.videos[0].getLikes()).toHaveLength(1);
});

test("It should be able to unlike a video", async () => {
  videoRepository.create(A.Video.withLike("profile").build());

  const usecase = new UnlikeVideo(videoRepository);
  await usecase.execute("profile", "videoId");

  expect(videoRepository.videos[0].getLikes()).toHaveLength(0);
});

test("It should not to be able to delete a comment that does not exists", async () => {
  videoRepository.create(A.Video.build());

  const usecase = new DeleteComment(videoRepository);
  expect(usecase.execute("profile", "videoId", "invalid-comment-id")).rejects.toThrow("Comment not found");
});
