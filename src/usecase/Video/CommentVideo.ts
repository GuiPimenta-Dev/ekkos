import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";
import Comment from "../../domain/entity/Comment";
import { v4 as uuid } from "uuid";

export default class CommentVideo {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface
  ) {}

  async execute(userId: string, videoId: string, content: string): Promise<string> {
    const profile = await this.profileRepository.getProfile(userId);
    const comment = new Comment(uuid(), profile, content);
    await this.videoRepository.commentVideo(videoId, comment);
    return comment.id;
  }
}
