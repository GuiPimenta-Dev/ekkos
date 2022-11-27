import Profile from "../../../src/domain/entity/Profile";
import ProfileService from "../../../src/domain/service/Profile";
test("It should be able to follow a profile", async () => {
  const follower = new Profile("id", "nick", "avatar", [], [], []);
  const followee = new Profile("id2", "nick", "avatar", [], [], []);
  ProfileService.follow(follower, followee);
  expect(follower.getFollowing()).toBe(1);
  expect(followee.getFollowers()).toBe(1);
});

test("It should not be able to follow yourself", async () => {
  const profile = new Profile("id", "nick", "avatar", [], [], []);
  expect(() => ProfileService.follow(profile, profile)).toThrow("You can't follow yourself");
});

test("It should not be able to unfollow yourself", async () => {
  const profile = new Profile("id", "nick", "avatar", [], [], []);
  expect(() => ProfileService.unfollow(profile, profile)).toThrow("You can't unfollow yourself");
});

test("It should be able to unfollow a profile", async () => {
  const follower = new Profile("id", "nick", "avatar", ["id2"], [], []);
  const followee = new Profile("id2", "nick", "avatar", [], ["id"], []);
  ProfileService.follow(follower, followee);
  ProfileService.unfollow(follower, followee);
  expect(follower.getFollowing()).toBe(0);
  expect(followee.getFollowers()).toBe(0);
});
