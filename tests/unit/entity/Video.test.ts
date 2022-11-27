import Video from "../../../src/domain/entity/Video";
import Comment from "../../../src/domain/entity/Comment";

test("It should be able to like a video", async () => {
  const video = new Video("videoId", "userId", "title", "description", "url", [], []);
  video.like("userId");
  expect(video.getLikes()).toHaveLength(1);
});

test("It should not be able to like a video twice", async () => {
  const video = new Video("videoId", "userId", "title", "description", "url", [], []);
  video.like("userId");
  expect(() => video.like("userId")).toThrow("User already liked this video");
});

test("It should be able to unlike a video", async () => {
  const video = new Video("videoId", "userId", "title", "description", "url", [], []);
  video.like("userId");
  video.unlike("userId");
  expect(video.getLikes()).toHaveLength(0);
});

test("It should not be able to unlike a video you don't like", async () => {
  const video = new Video("videoId", "userId", "title", "description", "url", [], []);
  expect(() => video.unlike("userId")).toThrow("User did not like this video");
});

test("It should be able to comment a video", async () => {
  const video = new Video("videoId", "userId", "title", "description", "url", [], []);
  const comment = new Comment("commentId", "videoId", "userId", "text");
  video.comment(comment);
  expect(video.getComments()).toHaveLength(1);
});

test("It should be able to delete a comment on a video", async () => {
  const video = new Video("videoId", "userId", "title", "description", "url", [], []);
  const comment = new Comment("commentId", "videoId", "userId", "text");
  video.comment(comment);
  video.deleteComment("userId", "commentId");
  expect(video.getComments()).toHaveLength(0);
});

test("It should not be able to delete a comment on a video you don't own", async () => {
  const video = new Video("videoId", "userId", "title", "description", "url", [], []);
  const comment = new Comment("commentId", "videoId", "userId", "text");
  video.comment(comment);
  expect(() => video.deleteComment("userId2", "commentId")).toThrow("You can't delete this comment");
});
