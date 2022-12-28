import Band from "../../../src/domain/entity/band/Band";
import Member from "../../../src/domain/entity/band/Member";

export default class BandBuilder {
  public id: string = "bandId";
  public name: string = "name";
  public description: string = "description";
  public logo: string = "logo";
  public adminId: string = "adminId";
  public members: Member[] = [];
  public vacancies: string[] = [];

  static createBand() {
    return new BandBuilder();
  }

  withAdminId(adminId: string) {
    this.adminId = adminId;
    return this;
  }

  withMember(member: Member) {
    this.members.push(member);
    return this;
  }

  withVacancy(vacancy: string) {
    this.vacancies.push(vacancy);
    return this;
  }

  build() {
    return new Band(this.id, this.name, this.description, this.logo, this.adminId, this.members, this.vacancies);
  }
}
