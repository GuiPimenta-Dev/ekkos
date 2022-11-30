import Video from "../../domain/entity/Video";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepositoryInterface";

export default class VideoPresenter {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async present(video: Video) {
    return {
      videoId: video.videoId,
      profileId: video.profileId,
      title: video.title,
      description: video.description,
      url: video.url,
      likes: video.getLikes().length,
      comments: await Promise.all(
        video.getComments().map(async (comment) => {
          const profile = await this.profileRepository.findProfileById(comment.profileId);
          return {
            commentId: comment.commentId,
            profileId: comment.profileId,
            nick: profile.nick,
            avatar: profile.avatar,
            text: comment.text,
          };
        })
      ),
    };
  }
}
