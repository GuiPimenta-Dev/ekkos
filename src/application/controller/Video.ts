import CommentVideo from "../../usecase/video/CommentVideo";
import DeleteComment from "../../usecase/video/DeleteComment";
import GetVideo from "../../usecase/video/GetVideo";
import InputDTO from "../../dto/InputDTO";
import LikeVideo from "../../usecase/video/LikeVideo";
import PostVideo from "../../usecase/video/PostVideo";
import Success from "../http/Success";
import UnlikeVideo from "../../usecase/video/UnlikeVideo";
import { config } from "../../Config";

export default class VideoController {
  static async post(input: InputDTO): Promise<Success> {
    const { body, headers, file } = input;
    const data = { userId: headers.id, title: body.title, description: body.description, url: file.location };
    const controller = new PostVideo(config.videoRepository);
    const videoId = await controller.execute(data);
    return new Success({ videoId });
  }

  static async get(input: InputDTO): Promise<Success> {
    const { path } = input;
    const controller = new GetVideo(config.videoRepository, config.profileRepository);
    const data = await controller.execute(path.id);
    return new Success(data);
  }

  static async like(input: InputDTO): Promise<Success> {
    const { path, headers } = input;
    const controller = new LikeVideo(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return new Success();
  }

  static async unlike(input: InputDTO): Promise<Success> {
    const { path, headers } = input;
    const controller = new UnlikeVideo(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return new Success();
  }

  static async comment(input: InputDTO): Promise<Success> {
    const { path, headers, body } = input;
    const controller = new CommentVideo(config.videoRepository);
    const videoId = await controller.execute(headers.id, path.id, body.text);
    return new Success({ videoId });
  }

  static async deleteComment(input: InputDTO): Promise<Success> {
    const { path, headers } = input;
    const controller = new DeleteComment(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return new Success();
  }
}
