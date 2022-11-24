import Profile from "../../domain/entity/Profile";

export default class ProfilePresenter {
  static get(profile: Profile) {
    return {
      nickname: profile.nickname,
      followers: profile.followers.length,
      following: profile.following.length,
      videos: profile.videos.map((video) => ({
        title: video.title,
        description: video.description,
        url: video.url,
        likes: video.likes.length,
        comments: video.comments.length,
      })),
    };
  }
}
