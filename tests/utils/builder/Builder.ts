import BandBuilder from "./BandBuilder";
import ProfileBuilder from "./ProfileBuilder";
import UserBuilder from "./UserBuilder";

export default class Builder {
  Band = BandBuilder.createBand();
  Profile = ProfileBuilder.createProfile();
  User = UserBuilder.createUser();
}
