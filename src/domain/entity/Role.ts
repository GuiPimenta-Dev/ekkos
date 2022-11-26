import BadRequest from "../../application/http/BadRequest";

export default class Role {
  value: string;
  readonly roles = ["vocalist", "guitarist", "bassist", "drummer", "keyboard", "manager"];

  constructor(value: string) {
    const lowerCaseValue = value.toLowerCase();
    if (!this.roles.includes(lowerCaseValue)) throw new BadRequest("Invalid role");
    this.value = lowerCaseValue;
  }
}
