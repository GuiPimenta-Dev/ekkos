import VideoRepository from "../../mocks/repository/VideoRepository";
import PostVideo from "../../../src/domain/usecase/PostVideo";

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
  await usecase.execute({
    profileId: "profileId",
    title: "title",
    description: "description",
    url: "url",
  });
  await expect(
    usecase.execute({
      profileId: "profileId",
      title: "title",
      description: "description",
      url: "url",
    })
  ).rejects.toThrow("Duplicated video");
});
