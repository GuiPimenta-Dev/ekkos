import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class MatchProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(profileId: string, distance: number): Promise<Profile[]> {
    const kmDistance = distance * 1000;
    const profile = await this.profileRepository.findProfileById(profileId);
    if (!profile) throw new Error("Profile not found");
    let profiles = await this.profileRepository.getAllProfiles();
    profiles = profiles.filter((profile) => profile.profileId !== profileId);
    const matches = profiles.filter((match) => {
      const distanceBetween = this.getDistanceFromLatLonInKm(
        profile.latitude,
        profile.longitude,
        match.latitude,
        match.longitude
      );
      return distanceBetween <= kmDistance;
    });
    return matches;
  }

  private getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      const degreesDistance = dist * 60 * 1.1515;
      const kmDistance = degreesDistance * 1.609344;
      return kmDistance;
    }
  }
}
