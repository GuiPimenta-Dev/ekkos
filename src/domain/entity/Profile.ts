import Video from "./Video";

export default class Profile {
  constructor(
    readonly id: string,
    readonly nickname: string,
    readonly followers: string[],
    readonly following: string[],
    readonly videos: Video[]
  ) {}
}
