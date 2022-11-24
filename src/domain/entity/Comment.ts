export default class Comment {
  constructor(readonly commentId: string, readonly videoId: string, readonly userId: string, readonly text: string) {}
}
