import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepository";
import Comment from "../../domain/entity/Comment";
import { v4 as uuid } from "uuid";

export default class CommentVideo {
  constructor(
    private profileRepository: ProfileRepositoryInterface,
    private videoRepository: VideoRepositoryInterface
  ) {}

  async execute(id: string, videoId: string, text: string): Promise<string> {
    const profile = await this.profileRepository.getProfileById(id);
    const video = await this.videoRepository.getVideoById(videoId);
    const comment = new Comment(uuid(), profile, text);
    video.comments.push(comment);
    await this.videoRepository.update(video);
    return comment.id;
  }
}
