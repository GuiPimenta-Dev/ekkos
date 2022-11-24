import Comment from "./Comment";

export default class Video {
  constructor(
    readonly videoId: string,
    readonly userId: string,
    readonly title: string,
    readonly description: string,
    readonly url: string,
    readonly likes: string[] = [],
    readonly comments: Comment[] = []
  ) {}
}
