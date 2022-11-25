import CommentVideo from "../../../src/usecase/video/CommentVideo";
import CreateProfile from "../../../src/usecase/profile/CreateProfile";
import DeleteComment from "../../../src/usecase/video/DeleteComment";
import GetVideo from "../../../src/usecase/video/GetVideo";
import LikeVideo from "../../../src/usecase/video/LikeVideo";
import MemoryProfileRepository from "../../../src/infra/repository/memory/MemoryProfileRepository";
import MemoryVideoRepository from "../../../src/infra/repository/memory/MemoryVideoRepository";
import PostVideo from "../../../src/usecase/video/PostVideo";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";
import UnlikeVideo from "../../../src/usecase/video/UnlikeVideo";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepository";

let videoRepository: VideoRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
let videoId: string;

beforeEach(async () => {
  profileRepository = new MemoryProfileRepository();
  const createProfileUseCase = new CreateProfile(profileRepository);
  await createProfileUseCase.execute("userId", "nick", "avatar_url");
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

test("It should be able to get a video by the id", async () => {
  await new LikeVideo(videoRepository).execute("userId", videoId);
  await new CommentVideo(videoRepository).execute("userId", videoId, "This is a really nice video");
  const usecase = new GetVideo(videoRepository, profileRepository);
  const video = await usecase.execute(videoId);
  expect(video).toBeDefined();
});

test("It should throw an error if video id does not exists", async () => {
  const usecase = new GetVideo(videoRepository, profileRepository);
  expect(usecase.execute("videoId")).rejects.toThrow("Video not found");
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
  await new LikeVideo(videoRepository).execute("userId", videoId);
  const usecase = new UnlikeVideo(videoRepository);
  await usecase.execute("userId", videoId);
  const video = await videoRepository.getVideoById(videoId);
  expect(video.likes).toHaveLength(0);
});

test("It should not be able to unlike a video you don't like", async () => {
  const usecase = new UnlikeVideo(videoRepository);
  expect(usecase.execute("userId", videoId)).rejects.toThrow("You can't unlike a video you don't like");
});

test("It should not be able to unlike a video that doesnt exists", async () => {
  const usecase = new UnlikeVideo(videoRepository);
  expect(usecase.execute("userId", "videoId")).rejects.toThrow("Video not found");
});

test("It has to be able to comment a video", async () => {
  const usecase = new CommentVideo(videoRepository);
  await usecase.execute("userId", videoId, "This is a really nice video");
  const video = await videoRepository.getVideoById(videoId);
  expect(video.comments).toHaveLength(1);
});

test("It should not be able to comment a not found video", async () => {
  const usecase = new CommentVideo(videoRepository);
  expect(usecase.execute("userId", "videoId", "text")).rejects.toThrow("Video not found");
});

test("It has to be able to delete a comment on a video", async () => {
  const commentVideoUseCase = new CommentVideo(videoRepository);
  const commentId = await commentVideoUseCase.execute("userId", videoId, "This is a really nice video");
  const usecase = new DeleteComment(videoRepository);
  await usecase.execute("userId", commentId);
  const video = await videoRepository.getVideoById(videoId);
  expect(video.comments).toHaveLength(0);
});

test("It should not to be able to delete a comment on a video if you are not the owner of the comment", async () => {
  const commentId = await new CommentVideo(videoRepository).execute("userId", videoId, "This is a really nice video");
  const usecase = new DeleteComment(videoRepository);
  expect(usecase.execute("anotherUserId", commentId)).rejects.toThrow("You can't delete this comment");
});
