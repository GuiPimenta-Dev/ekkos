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
import FeedRepositoryInterface from "../../../src/domain/infra/repository/FeedRepositoryInterface";
import MemoryFeedRepository from "../../../src/infra/repository/MemoryFeedRepository";

interface Repositories {
  userRepository?: UserRepositoryInterface | null;
  profileRepository?: ProfileRepositoryInterface | null;
  videoRepository?: VideoRepositoryInterface | null;
  bandRepository?: BandRepositoryInterface | null;
  feedRepository?: FeedRepositoryInterface | null;
}

export default class RepositoryFactory {
  id = 1;
  userRepository: UserRepositoryInterface;
  profileRepository: ProfileRepositoryInterface;
  videoRepository: VideoRepositoryInterface;
  bandRepository: BandRepositoryInterface;
  feedRepository: FeedRepositoryInterface;

  constructor(repositories: Repositories) {
    this.userRepository = repositories.userRepository || new MemoryUserRepository();
    this.profileRepository = repositories.profileRepository || new MemoryProfileRepository();
    this.videoRepository = repositories.videoRepository || new MemoryVideoRepository();
    this.bandRepository = repositories.bandRepository || new MemoryBandRepository();
    this.feedRepository = repositories.feedRepository || new MemoryFeedRepository();
  }

  createUser() {
    const user = { userId: uuid(), email: `email_${this.id}@test.com`, password: "password" };
    this.userRepository.save(user);
    this.id += 1;
    return user;
  }

  createProfile(profileId?: string, latitude: number = 0, longitude: number = 0): Profile {
    const profile = new Profile(profileId || uuid(), `nick_${this.id}`, "avatar", latitude, longitude, [], []);
    this.profileRepository.save(profile);
    this.id += 1;
    return profile;
  }

  createVideo(profileId?: string): Video {
    const video = new Video(uuid(), profileId || uuid(), "title", "description", "url");
    this.videoRepository.save(video);
    return video;
  }

  createBand(adminId: string = uuid(), member?: MemberDTO): Band {
    const members = [{ memberId: uuid(), profileId: adminId, role: "admin" }];
    if(member) members.push(member);
    const band = new Band(uuid(), "name", "description", "logo", adminId, members);
    this.bandRepository.save(band);
    return band;
  }

  createInvite(): { user: User; profile: Profile; band: Band; invite: InviteDTO } {
    const user = this.createUser();
    const profile = this.createProfile(user.userId);
    const band = this.createBand(user.userId);
    const invite = {
      inviteId: uuid(),
      bandId: band.bandId,
      profileId: profile.profileId,
      role: "guitarist",
      status: Status.pending,
    };
    this.bandRepository.createInvite(invite);
    return { user, profile, band, invite };
  }

  createFeed(profileId: string): Video {
    const video = this.createVideo(profileId);
    const feed = { postId: uuid(), profileId, videoId: video.videoId };
    this.feedRepository.save(feed);
    return video;
  }
}
