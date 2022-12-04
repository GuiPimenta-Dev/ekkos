import InputDTO from "../../dto/InputDTO";
import { config } from "../../Config";
import GetFeed from "../../usecase/feed/GetFeed";
import Success from "../http/Success";
import HttpSuccess from "../http/extends/HttpSuccess";
import VideoPresenter from "../presenter/VideoPresenter";

export default class FeedController {
  static async get(input: InputDTO): Promise<HttpSuccess> {
    const { headers } = input;
    const usecase = new GetFeed(config.feedRepository);
    const feed = await usecase.execute(headers.id);
    const presenter = new VideoPresenter(config.videoRepository, config.profileRepository);
    const data = await Promise.all(
      feed.map(async (post) => {
        return await presenter.present(post.videoId);
      })
    );
    return new Success({ feed: data });
  }
}
