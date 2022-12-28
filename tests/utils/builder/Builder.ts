import BandBuilder from "./BandBuilder";
import ProfileBuilder from "./ProfileBuilder";
import UserBuilder from "./UserBuilder";
import VideoBuilder from "./VideoBuilder";

export default class Builder {
  Band = BandBuilder.createBand();
  Profile = ProfileBuilder.createProfile();
  User = UserBuilder.createUser();
  Video = VideoBuilder.createVideo();
}
