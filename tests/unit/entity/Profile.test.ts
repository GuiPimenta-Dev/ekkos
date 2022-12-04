import Profile from "../../../src/domain/entity/Profile";
import ProfileService from "../../../src/domain/service/ProfileService";

test("It should be able to follow a profile", async () => {
  const follower = new Profile("follower", "nick", "avatar", 1, 1, [], []);
  const followee = new Profile("following", "nick", "avatar", 1, 1, [], []);
  ProfileService.follow(follower, followee);
  expect(follower.getFollowing()).toEqual(["following"]);
  expect(followee.getFollowers()).toEqual(["follower"]);
});

test("It should not be able to follow yourself", async () => {
  const profile = new Profile("id", "nick", "avatar", 1, 1, [], []);
  expect(() => ProfileService.follow(profile, profile)).toThrow("You can't follow yourself");
});

test("It should not be able to follow someone you are already following", async () => {
  const follower = new Profile("follower", "nick", "avatar", 1, 1, [], []);
  const followee = new Profile("following", "nick", "avatar", 1, 1, [], []);
  ProfileService.follow(follower, followee);
  expect(() => ProfileService.follow(follower, followee)).toThrow("You are already following this profile");
});

test("It should not be able to unfollow yourself", async () => {
  const profile = new Profile("id", "nick", "avatar", 1, 1, [], []);
  expect(() => ProfileService.unfollow(profile, profile)).toThrow("You can't unfollow yourself");
});

test("It should not be able to unfollow someone you are not following", async () => {
  const follower = new Profile("follower", "nick", "avatar", 1, 1, [], []);
  const followee = new Profile("following", "nick", "avatar", 1, 1, [], []);
  expect(() => ProfileService.unfollow(follower, followee)).toThrow("You are not following this profile");
});

test("It should be able to unfollow a profile", async () => {
  const follower = new Profile("id", "nick", "avatar", 1, 1, ["id2"], []);
  const followee = new Profile("id2", "nick", "avatar", 1, 1, [], ["id"]);
  ProfileService.follow(follower, followee);
  ProfileService.unfollow(follower, followee);
  expect(follower.getFollowing()).toEqual([]);
  expect(followee.getFollowers()).toEqual([]);
});
