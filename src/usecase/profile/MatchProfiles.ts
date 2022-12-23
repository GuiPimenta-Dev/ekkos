import Profile from "../../domain/entity/profile/Profile";
import ProfileRepositoryInterface from "../../application/ports/repository/ProfileRepositoryInterface";

export default class MatchProfiles {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(profileId: string, distance: number): Promise<{ profile: Profile; distance: number }[]> {
    const profile = await this.profileRepository.findProfileById(profileId);
    let profiles = await this.profileRepository.getAllProfiles();
    profiles = profiles.filter((profile) => profile.id !== profileId);
    const matches = profiles
      .map((match) => {
        const distanceBetween = this.getDistanceFromLatLonInKm(
          match.latitude,
          match.longitude,
          profile.latitude,
          profile.longitude,
        );

        return distanceBetween <= distance ? { profile: match, distance: distanceBetween } : null;
      })
      .filter((match) => match !== null);
    return matches;
  }

  private getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
      return parseFloat(kmDistance.toFixed(1));
    }
  }
}
