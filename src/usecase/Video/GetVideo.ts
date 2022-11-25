import NotFound from "../../application/http/NotFound";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class GetVideo {
  constructor(
    private videoRepository: VideoRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface
  ) {}

  async execute(id: string): Promise<any> {
    const video = await this.videoRepository.getVideoById(id);
    if (!video) throw new NotFound("Video not found");
    const likes = await Promise.all(
      video.likes.map(async (id) => {
        const profile = await this.profileRepository.findProfileById(id);
        return { userId: id, nick: profile.nick };
      })
    );
    const comments = await Promise.all(
      video.comments.map(async (comment) => {
        const profile = await this.profileRepository.findProfileById(comment.userId);
        return { commentId: comment.commentId, userId: comment.userId, text: comment.text, nick: profile.nick };
      })
    );
    return { ...video, likes, comments };
  }
}
