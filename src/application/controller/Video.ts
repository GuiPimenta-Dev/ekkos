import InputDTO from "../../dto/InputDTO";
import OutputDTO from "../../dto/OutputDTO";
import { config } from "../../Config";
import PostVideo from "../../usecase/Video/PostVideo";
import LikeVideo from "../../usecase/Video/LikeVideo";
import UnlikeVideo from "../../usecase/Video/UnlikeVideo";
import CommentVideo from "../../usecase/Video/CommentVideo";
import DeleteComment from "../../usecase/Video/DeleteComment";

export default class VideoController {
  static async post(input: InputDTO): Promise<OutputDTO> {
    const { body, headers } = input;
    body.userId = headers.id;
    const controller = new PostVideo(config.videoRepository);
    const id = await controller.execute(body);
    return { statusCode: 201, data: { id } };
  }

  static async like(input: InputDTO): Promise<OutputDTO> {
    const { path, headers } = input;
    const controller = new LikeVideo(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return { statusCode: 200 };
  }

  static async unlike(input: InputDTO): Promise<OutputDTO> {
    const { path, headers } = input;
    const controller = new UnlikeVideo(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return { statusCode: 200 };
  }

  static async comment(input: InputDTO): Promise<OutputDTO> {
    const { path, headers, body } = input;
    const controller = new CommentVideo(config.videoRepository);
    const id = await controller.execute(headers.id, path.id, body.text);
    return { statusCode: 200, data: { id } };
  }

  static async deleteComment(input: InputDTO): Promise<OutputDTO> {
    const { path, headers } = input;
    const controller = new DeleteComment(config.videoRepository);
    await controller.execute(headers.id, path.id);
    return { statusCode: 200 };
  }
}
