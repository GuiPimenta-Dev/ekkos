export default class Video {
  constructor(
    readonly id: string,
    readonly profileId: string,
    readonly title: string,
    readonly description: string,
    readonly url: string
  ) {}
}
