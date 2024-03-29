import ProfileRepositoryInterface from "../ports/repository/ProfileRepositoryInterface";
import VideoRepositoryInterface from "../ports/repository/VideoRepositoryInterface";

export default class VideoPresenter {
  constructor(
    private videoRepository: VideoRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface,
  ) {}

  async present(videoId: string) {
    const video = await this.videoRepository.findVideoById(videoId);
    return {
      videoId: video.id,
      ownerId: video.ownerId,
      title: video.title,
      description: video.description,
      url: video.url,
      likes: video.getLikes().length,
      comments: await Promise.all(
        video.getComments().map(async (comment) => {
          const profile = await this.profileRepository.findProfileById(comment.ownerId);
          return {
            commentId: comment.id,
            ownerId: comment.ownerId,
            nick: profile.nick,
            avatar: profile.avatar,
            text: comment.text,
          };
        }),
      ),
    };
  }
}
