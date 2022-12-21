import { v4 as uuid } from "uuid";
import Profile from "../../../src/domain/entity/Profile";
import User from "../../../src/domain/entity/User";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepositoryInterface";
import UserRepositoryInterface from "../../../src/domain/infra/repository/UserRepositoryInterface";
import MemoryUserRepository from '../../../src/infra/repository/MemoryUserRepository';
import MemoryProfileRepository from '../../../src/infra/repository/MemoryProfileRepository';

interface Repositories {
    userRepository?: UserRepositoryInterface | null;
    profileRepository?: ProfileRepositoryInterface | null;
  }


export default class ProfileBuilder {
    private userRepository: UserRepositoryInterface;
    private profileRepository: ProfileRepositoryInterface;
    public profileId: string;
    public nick: string;
    public avatar: string;
    public latitude: number;
    public longitude: number;
    public following: string[];
    public followers: string[];

    constructor (repositories: Repositories) {
        this.userRepository = repositories.userRepository || new MemoryUserRepository();
        this.profileRepository = repositories.profileRepository || new MemoryProfileRepository();
    }

    createProfile() {
        this.profileId = uuid();
        this.nick = `nick_${this.profileId}`;
        this.avatar = "avatar";
        this.latitude = 0;
        this.longitude = 0;
        this.following = [];
        this.followers = [];
        this.userRepository.save(new User(this.profileId, `email_${this.profileId}`, "password"));
        this.profileRepository.save(new Profile(this.profileId, `nick_${this.profileId}`, "avatar", 0, 0, [], []));
        return this
    }
    
    withNick(nick: string) {
        this.nick = nick;
        this.profileRepository.update(this.profile);
        return this
    }

    withLatitudeAndLongitude(latitude:number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.profileRepository.update(this.profile);
        return this
    }

    withFollowing(following: string[]) {
        this.following = following;
        this.profileRepository.update(this.profile);
        return this
    }

    withFollowers(followers: string[]) {
        this.followers = followers;
        this.profileRepository.update(this.profile);
        return this
    }

    private get profile() {
        return new Profile(this.profileId, this.nick, this.avatar, this.latitude, this.longitude, this.following, this.followers);
    }
   
}