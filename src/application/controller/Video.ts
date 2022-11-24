import { config } from "../../Config";
import InputDTO from "../../dto/InputDTO";
import CommentVideo from "../../usecase/video/CommentVideo";
import DeleteComment from "../../usecase/video/DeleteComment";
import LikeVideo from "../../usecase/video/LikeVideo";
import PostVideo from "../../usecase/video/PostVideo";
import UnlikeVideo from "../../usecase/video/UnlikeVideo";
import Success from "../http/Success";

export default class VideoController {
  static async post(input: InputDTO): Promise<Success> {
    const { body, headers } = input;
    body.userId = headers.id;
    const controller = new PostVideo(config.videoRepository);
    const id = await controller.execute(body);
    return new Success({ id });
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
    const id = await controller.execute(headers.id, path.id, body.text);
    return new Success({ id });
  }

  static async deleteComment(input: InputDTO): Promise<Success> {
    const { path, headers } = input;
    const controller = new DeleteComment(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return new Success();
  }
}
