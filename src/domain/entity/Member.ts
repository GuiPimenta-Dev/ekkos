import Role from "./Role";

export default class Member {
  role: string;
  constructor(readonly userId: string, readonly bandId: string, role: Role) {
    this.role = role.role;
  }
}
