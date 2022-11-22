import Video from "./Video";

export default class Profile {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly followers: Profile[],
    readonly following: Profile[],
    readonly videos: Video[]
  ) {}
}
