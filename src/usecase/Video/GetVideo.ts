import VideoRepositoryInterface from "../../domain/infra/repository/VideoRepositoryInterface";

export default class GetVideo {
  constructor(private videoRepository: VideoRepositoryInterface) {}

  async execute(id: string): Promise<any> {
    return await this.videoRepository.findVideoById(id);
  }
}
