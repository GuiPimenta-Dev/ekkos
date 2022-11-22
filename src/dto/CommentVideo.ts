import Profile from "../domain/entity/Profile";

export default interface CommentVideoDTO {
  id: string;
  profile: Profile;
  videoId: string;
  comment: string;
}
