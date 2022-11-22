import Profile from "./Profile";
import Comment from "./Comment";

export default class Video {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly title: string,
    readonly description: string,
    readonly url: string,
    readonly likes: Profile[] = [],
    readonly comments: Comment[] = []
  ) {}
}
