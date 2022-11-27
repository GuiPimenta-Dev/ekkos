import NotFound from "../../application/http/NotFound";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";

export default class GetVideo {
  constructor(
    private videoRepository: VideoRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface
  ) {}

  async execute(id: string): Promise<any> {
    const video = await this.videoRepository.findVideoById(id);
    if (!video) throw new NotFound("Video not found");
    const comments = await Promise.all(
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
    );
    return { ...video, likes: video.getLikes().length, comments };
  }
}
