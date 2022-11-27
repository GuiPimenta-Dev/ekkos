import CommentVideo from "../../../src/usecase/video/CommentVideo";
import CreateProfile from "../../../src/usecase/profile/CreateProfile";
import DeleteComment from "../../../src/usecase/video/DeleteComment";
import GetVideo from "../../../src/usecase/video/GetVideo";
import LikeVideo from "../../../src/usecase/video/LikeVideo";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import MemoryVideoRepository from "../../../src/infra/repository/MemoryVideoRepository";
import PostVideo from "../../../src/usecase/video/PostVideo";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";
import UnlikeVideo from "../../../src/usecase/video/UnlikeVideo";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepository";

let videoRepository: VideoRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
let videoId: string;

beforeEach(async () => {
  profileRepository = new MemoryProfileRepository();
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
  const usecase = new GetVideo(videoRepository, profileRepository);
  const video = await usecase.execute("videoId");
  expect(video).toBeDefined();
});

test("It should throw an error if video id does not exists", async () => {
  const usecase = new GetVideo(videoRepository, profileRepository);
  expect(usecase.execute("some_videoId")).rejects.toThrow("Video not found");
});

test("It should not to be able to like a non existent video", async () => {
  const usecase = new LikeVideo(videoRepository);
  expect(usecase.execute("profileId", "some_videoId")).rejects.toThrow("Video not found");
});

test("It should not be able to unlike a video that doesnt exists", async () => {
  const usecase = new UnlikeVideo(videoRepository);
  expect(usecase.execute("profileId", "some_videoId")).rejects.toThrow("Video not found");
});

test("It should not be able to comment a not found video", async () => {
  const usecase = new CommentVideo(videoRepository);
  expect(usecase.execute("profileId", "some_videoId", "text")).rejects.toThrow("Video not found");
});

test("It should not to be able to delete a comment that does not exists", async () => {
  const usecase = new DeleteComment(videoRepository);
  expect(usecase.execute("anotherprofileId", "commentID")).rejects.toThrow("Comment not found");
});
