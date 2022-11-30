import CommentVideo from "../../usecase/video/CommentVideo";
import DeleteComment from "../../usecase/video/DeleteComment";
import GetVideo from "../../usecase/video/GetVideo";
import InputDTO from "../../dto/InputDTO";
import LikeVideo from "../../usecase/video/LikeVideo";
import PostVideo from "../../usecase/video/PostVideo";
import Success from "../http/Success";
import UnlikeVideo from "../../usecase/video/UnlikeVideo";
import { config } from "../../Config";
import VideoPresenter from "../presenter/Video";
import HttpSuccess from "../http/extends/HttpSuccess";

export default class VideoController {
  static async post(input: InputDTO): Promise<HttpSuccess> {
    const { body, headers, file } = input;
    const data = { profileId: headers.id, title: body.title, description: body.description, url: file.location };
    const usecase = new PostVideo(config.videoRepository);
    const videoId = await usecase.execute(data);
    return new Success({ videoId });
  }

  static async get(input: InputDTO): Promise<HttpSuccess> {
    const { path } = input;
    const usecase = new GetVideo(config.videoRepository);
    const video = await usecase.execute(path.id);
    const presenter = new VideoPresenter(config.profileRepository);
    const data = await presenter.present(video);
    return new Success(data);
  }

  static async like(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const usecase = new LikeVideo(config.videoRepository);
    await usecase.execute(headers.id, path.id);
    return new Success();
  }

  static async unlike(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const usecase = new UnlikeVideo(config.videoRepository);
    await usecase.execute(headers.id, path.id);
    return new Success();
  }

  static async comment(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers, body } = input;
    const usecase = new CommentVideo(config.videoRepository);
    const commentId = await usecase.execute(headers.id, path.id, body.text);
    return new Success({ commentId });
  }

  static async deleteComment(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const usecase = new DeleteComment(config.videoRepository);
    await usecase.execute(headers.id, path.id);
    return new Success();
  }
}
