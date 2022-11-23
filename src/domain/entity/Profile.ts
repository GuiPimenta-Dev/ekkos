import Video from "./Video";

export default class Profile {
  constructor(
    readonly userId: string,
    readonly nickname: string,
    readonly followers: string[],
    readonly following: string[],
    readonly videos: Video[]
  ) {}
}
