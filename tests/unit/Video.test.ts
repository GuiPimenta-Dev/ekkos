import VideoRepository from "../mocks/repository/VideoRepository";
import PostVideo from "../../src/usecase/Video/PostVideo";
import VideoRepositoryInterface from "../../src/domain/infra/repository/VideoRepository";
import LikeVideo from "../../src/usecase/Video/LikeVideo";
import ProfileRepositoryInterface from "../../src/domain/infra/repository/ProfileRepository";
import ProfileRepository from "../mocks/repository/ProfileRepository";
import CreateProfile from "../../src/usecase/Profile/CreateProfile";
import CommentVideo from "../../src/usecase/Video/CommentVideo";
import UnlikeVideo from "../../src/usecase/Video/UnlikeVideo";

let videoRepository: VideoRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
let videoId: string;
beforeEach(async () => {
  profileRepository = new ProfileRepository();
  const createProfileUseCase = new CreateProfile(profileRepository);
  await createProfileUseCase.execute("profileId", "userId");
  videoRepository = new VideoRepository();
  const postVideoUseCase = new PostVideo(videoRepository);
  videoId = await postVideoUseCase.execute({
    profileId: "profileId",
    title: "title",
    description: "description",
    url: "url",
  });
});

test("It should be able to post a video", async () => {
  const videoRepository = new VideoRepository();
  const usecase = new PostVideo(videoRepository);
  await usecase.execute({
    profileId: "profileId",
    title: "title",
    description: "description",
    url: "url",
  });
  expect(videoRepository.videos).toHaveLength(1);
});

test("It should not be able to post a duplicated video", async () => {
  const videoRepository = new VideoRepository();
  const usecase = new PostVideo(videoRepository);
  const info = { profileId: "profileId", title: "title", description: "description", url: "url" };
  await usecase.execute(info);
  await expect(usecase.execute(info)).rejects.toThrow("Duplicated video");
});

test("It has to be able to like a video", async () => {
  const usecase = new LikeVideo(profileRepository, videoRepository);
  await usecase.execute("profileId", videoId);
  const video = await videoRepository.getVideo(videoId);
  expect(video.likes).toHaveLength(1);
});

test("It has to be able to unlike a video", async () => {
  const likeVideoUseCase = new LikeVideo(profileRepository, videoRepository);
  await likeVideoUseCase.execute("profileId", videoId);
  const unlikeVideoUseCase = new UnlikeVideo(profileRepository, videoRepository);
  await unlikeVideoUseCase.execute("profileId", videoId);
  const video = await videoRepository.getVideo(videoId);
  expect(video.likes).toHaveLength(0);
});

test("It has to be able to comment a video", async () => {
  const usecase = new CommentVideo(profileRepository, videoRepository);
  await usecase.execute("profileId", videoId, "This is a really nice video");
  const video = await videoRepository.getVideo(videoId);
  expect(video.comments).toHaveLength(1);
  expect(video.comments[0].comment).toBe("This is a really nice video");
});

test("It has to be able to delete a comment on a video", async () => {
  const usecase = new CommentVideo(profileRepository, videoRepository);
  await usecase.execute("profileId", videoId, "This is a really nice video");
  const video = await videoRepository.getVideo(videoId);
  expect(video.comments).toHaveLength(1);
  expect(video.comments[0].comment).toBe("This is a really nice video");
});
