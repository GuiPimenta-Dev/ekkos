export default class Comment {
  constructor(
    readonly commentId: string,
    readonly videoId: string,
    readonly profileId: string,
    readonly text: string
  ) {}
}
