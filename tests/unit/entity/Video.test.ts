import Video from "../../../src/domain/entity/video/Video";

test("It should be able to like a video", async () => {
  const video = new Video("videoId", "profileId", "title", "description", "url", [], []);

  video.like("profileId");

  expect(video.getLikes()).toHaveLength(1);
});

test("It should not be able to like a video twice", async () => {
  const video = new Video("videoId", "profileId", "title", "description", "url", [], []);

  video.like("profileId");

  expect(() => video.like("profileId")).toThrow("User already liked this video");
});

test("It should be able to unlike a video", async () => {
  const video = new Video("videoId", "profileId", "title", "description", "url", [], []);
  video.like("profileId");

  video.unlike("profileId");

  expect(video.getLikes()).toHaveLength(0);
});

test("It should not be able to unlike a video you don't like", async () => {
  const video = new Video("videoId", "profileId", "title", "description", "url", [], []);

  expect(() => video.unlike("profileId")).toThrow("User did not like this video");
});

test("It should be able to comment a video", async () => {
  const video = new Video("videoId", "profileId", "title", "description", "url", [], []);

  const comment = { id: "commentId", videoId: "videoId", ownerId: "profileId", text: "text" };
  video.comment(comment);

  expect(video.getComments()).toHaveLength(1);
});

test("It should be able to delete a comment on a video", async () => {
  const video = new Video("videoId", "profileId", "title", "description", "url", [], []);
  const comment = { id: "commentId", videoId: "videoId", ownerId: "profileId", text: "text" };
  const comment2 = { id: "comment2Id", videoId: "videoId", ownerId: "profileId", text: "text" };
  video.comment(comment);
  video.comment(comment2);

  video.deleteComment("profileId", comment);

  expect(video.getComments()).toHaveLength(1);
});

test("It should not be able to delete a comment on a video you don't own", async () => {
  const video = new Video("videoId", "profileId", "title", "description", "url", [], []);
  const comment = { id: "commentId", videoId: "videoId", ownerId: "profileId", text: "text" };
  video.comment(comment);

  expect(() => video.deleteComment("profileId2", comment)).toThrow("You can't delete this comment");
});
