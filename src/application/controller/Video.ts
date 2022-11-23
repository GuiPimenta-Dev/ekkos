import InputDTO from "../../dto/InputDTO";
import OutputDTO from "../../dto/OutputDTO";
import { config } from "../../Config";
import PostVideo from "../../usecase/Video/PostVideo";
import LikeVideo from "../../usecase/Video/LikeVideo";

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
}
