import MemoryVideoRepository from "../../../src/infra/repository/memory/MemoryVideoRepository";
import PostVideo from "../../../src/usecase/Video/PostVideo";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepository";
import LikeVideo from "../../../src/usecase/Video/LikeVideo";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";
import MemoryProfileRepository from "../../../src/infra/repository/memory/MemoryProfileRepository";
import CreateProfile from "../../../src/usecase/Profile/CreateProfile";
import CommentVideo from "../../../src/usecase/Video/CommentVideo";
import DeleteComment from "../../../src/usecase/Video/DeleteComment";
import UnlikeVideo from "../../../src/usecase/Video/UnlikeVideo";
import GetVideos from "../../../src/usecase/Video/GetVideos";

let videoRepository: VideoRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
let videoId: string;

beforeEach(async () => {
  profileRepository = new MemoryProfileRepository();
  const createProfileUseCase = new CreateProfile(profileRepository);
  await createProfileUseCase.execute("userId", "nickname");
  videoRepository = new MemoryVideoRepository();
  const usecase = new PostVideo(videoRepository);
  videoId = await usecase.execute({ userId: "userId", title: "title", description: "description", url: "url" });
});

test("It should be able to post a video", async () => {
  const videoRepository = new MemoryVideoRepository();
  const usecase = new PostVideo(videoRepository);
  await usecase.execute({ userId: "userId", title: "title", description: "description", url: "url" });
  expect(videoRepository.videos).toHaveLength(1);
});

test("It should not be able to post a duplicated video", async () => {
  const videoRepository = new MemoryVideoRepository();
  const usecase = new PostVideo(videoRepository);
  const input = { userId: "userId", title: "title", description: "description", url: "url" };
  await usecase.execute(input);
  await expect(usecase.execute(input)).rejects.toThrow("Video url already in use");
});

test("It should be able to get videos of a user", async () => {
  const usecase = new GetVideos(videoRepository);
  const videos = await usecase.execute("userId");
  expect(videos).toHaveLength(1);
});

test("It has to be able to like a video", async () => {
  const usecase = new LikeVideo(videoRepository);
  await usecase.execute("userId", videoId);
  const video = await videoRepository.getVideoById(videoId);
  expect(video.likes).toHaveLength(1);
});

test("It should not to be able to like a video twice", async () => {
  const usecase = new LikeVideo(videoRepository);
  await usecase.execute("userId", videoId);
  expect(usecase.execute("userId", videoId)).rejects.toThrow("You already like this video");
});

test("It should not to be able to like a non existent video", async () => {
  const usecase = new LikeVideo(videoRepository);
  await usecase.execute("userId", videoId);
  expect(usecase.execute("userId", "videoId")).rejects.toThrow("Video not found");
});

test("It has to be able to unlike a video", async () => {
  const likeVideoUseCase = new LikeVideo(videoRepository);
  await likeVideoUseCase.execute("userId", videoId);
  const usecase = new UnlikeVideo(videoRepository);
  await usecase.execute("userId", videoId);
  const video = await videoRepository.getVideoById(videoId);
  expect(video.likes).toHaveLength(0);
});

test("It should not be able to unlike a video you don't like", async () => {
  const usecase = new UnlikeVideo(videoRepository);
  expect(usecase.execute("userId", videoId)).rejects.toThrow("You can't unlike a video you don't like");
});

test("It has to be able to comment a video", async () => {
  const usecase = new CommentVideo(videoRepository);
  await usecase.execute("userId", videoId, "This is a really nice video");
  const video = await videoRepository.getVideoById(videoId);
  expect(video.comments).toHaveLength(1);
});

test("It has to be able to delete a comment on a video", async () => {
  const commentVideoUseCase = new CommentVideo(videoRepository);
  const commentId = await commentVideoUseCase.execute("userId", videoId, "This is a really nice video");
  const usecase = new DeleteComment(videoRepository);
  await usecase.execute("userId", videoId, commentId);
  const video = await videoRepository.getVideoById(videoId);
  expect(video.comments).toHaveLength(0);
});

test("It should not to be able to delete a comment on a video if you are not the owner of the comment", async () => {
  const commentVideoUseCase = new CommentVideo(videoRepository);
  const commentId = await commentVideoUseCase.execute("userId", videoId, "This is a really nice video");
  const usecase = new DeleteComment(videoRepository);
  expect(usecase.execute("anotherUserId", videoId, commentId)).rejects.toThrow("You can't delete this comment");
});
