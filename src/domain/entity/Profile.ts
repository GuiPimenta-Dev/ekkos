import Video from "./Video";

export default class Profile {
  constructor(
    readonly id: string,
    readonly nickname: string,
    readonly followers: Profile[],
    readonly following: Profile[],
    readonly videos: Video[]
  ) {}
}
