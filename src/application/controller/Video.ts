import CommentVideo from "../../usecase/Video/CommentVideo";
import DeleteComment from "../../usecase/Video/DeleteComment";
import GetVideo from "../../usecase/Video/GetVideo";
import InputDTO from "../../dto/InputDTO";
import LikeVideo from "../../usecase/Video/LikeVideo";
import PostVideo from "../../usecase/Video/PostVideo";
import Success from "../http/Success";
import UnlikeVideo from "../../usecase/Video/UnlikeVideo";
import { config } from "../../Config";
import VideoPresenter from "../presenter/Video";
import HttpSuccess from "../http/extends/HttpSuccess";

export default class VideoController {
  static async post(input: InputDTO): Promise<HttpSuccess> {
    const { body, headers, file } = input;
    const data = { profileId: headers.id, title: body.title, description: body.description, url: file.location };
    const controller = new PostVideo(config.videoRepository);
    const videoId = await controller.execute(data);
    return new Success({ videoId });
  }

  static async get(input: InputDTO): Promise<HttpSuccess> {
    const { path } = input;
    const controller = new GetVideo(config.videoRepository);
    const video = await controller.execute(path.id);
    const presenter = new VideoPresenter(config.profileRepository);
    const data = await presenter.present(video);
    return new Success(data);
  }

  static async like(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const controller = new LikeVideo(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return new Success();
  }

  static async unlike(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const controller = new UnlikeVideo(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return new Success();
  }

  static async comment(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers, body } = input;
    const controller = new CommentVideo(config.videoRepository);
    const commentId = await controller.execute(headers.id, path.id, body.text);
    return new Success({ commentId });
  }

  static async deleteComment(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const controller = new DeleteComment(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return new Success();
  }
}
