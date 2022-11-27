import Video from "../../domain/entity/Video";

export default class VideoPresenter {
  static present(video: Video) {
    return {
      videoId: video.videoId,
      title: video.title,
      description: video.description,
      url: video.url,
      likes: video.getLikes().length,
      comments: video.getComments(),
    };
  }
}
