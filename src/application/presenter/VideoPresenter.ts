import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepositoryInterface";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";

export default class VideoPresenter {
  constructor(
    private videoRepository: VideoRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface
  ) {}

  async present(videoId: string) {
    const video = await this.videoRepository.findVideoById(videoId);
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
