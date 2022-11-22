import Profile from "./Profile";

export default class Video {
  constructor(
    readonly id: string,
    readonly profileId: string,
    readonly title: string,
    readonly description: string,
    readonly url: string,
    readonly likes: Profile[] = [],
    readonly comments: { id: string; profile: Profile; comment: string }[] = []
  ) {}
}
