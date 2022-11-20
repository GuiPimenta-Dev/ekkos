import Video from "./Video";

export default class Profile {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly followers: number,
    readonly following: number,
    readonly videos: Video[]
  ) {}
}
