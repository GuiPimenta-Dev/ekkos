import Profile from "../../../src/domain/entity/Profile";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepositoryInterface";
import { v4 as uuid } from "uuid";
import BandRepositoryInterface from "../../../src/domain/infra/repository/BandRepositoryInterface";
import Band from "../../../src/domain/entity/Band";
import { InviteDTO, Status } from "../../../src/dto/InviteDTO";
import UserRepositoryInterface from "../../../src/domain/infra/repository/UserRepositoryInterface";
import VideoRepositoryInterface from "../../../src/domain/infra/repository/VideoRepositoryInterface";
import Video from "../../../src/domain/entity/Video";
import User from "../../../src/domain/entity/User";
import MemberDTO from "../../../src/dto/MemberDTO";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import MemoryVideoRepository from "../../../src/infra/repository/MemoryVideoRepository";
import MemoryBandRepository from "../../../src/infra/repository/MemoryBandRepository";

interface Repositories {
  userRepository?: UserRepositoryInterface | null;
  profileRepository?: ProfileRepositoryInterface | null;
  videoRepository?: VideoRepositoryInterface | null;
  bandRepository?: BandRepositoryInterface | null;
}

export default class RepositoryFactory {
  userRepository: UserRepositoryInterface;
  profileRepository: ProfileRepositoryInterface;
  videoRepository: VideoRepositoryInterface;
  bandRepository: BandRepositoryInterface;

  constructor(repositories: Repositories) {
    this.userRepository = repositories.userRepository || new MemoryUserRepository();
    this.profileRepository = repositories.profileRepository || new MemoryProfileRepository();
    this.videoRepository = repositories.videoRepository || new MemoryVideoRepository();
    this.bandRepository = repositories.bandRepository || new MemoryBandRepository();
  }

  createUser() {
    const user = { userId: uuid(), email: `email_${uuid()}@test.com`, password: "password" };
    this.userRepository.save(user);
    this.createProfile(user.userId);
    return user;
  }

  createProfile(profileId: string = uuid()): Profile {
    const profile = new Profile(profileId, `nick_${uuid()}`, "avatar", 0, 0, [], []);
    this.profileRepository.save(profile);
    return profile;
  }

  createVideo(profileId: string = uuid()): Video {
    const video = new Video(uuid(), profileId, "title", "description", "url");
    this.videoRepository.save(video);
    return video;
  }

  createBand(adminId: string = uuid()): Band {
    const members = [{ memberId: uuid(), profileId: adminId, role: "admin" }];
    const band = new Band(uuid(), "name", "description", "logo", adminId, members);
    this.bandRepository.save(band);
    return band;
  }

}
