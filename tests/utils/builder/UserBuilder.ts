import User from "../../../src/domain/entity/user/User";

export default class UserBuilder {
  public id = "userId";
  public email = "email@test.com";
  public password = "password";

  static createUser() {
    return new UserBuilder();
  }

  withId(id: string) {
    this.id = id;
    return this;
  }

  withEmail(email: string) {
    this.email = email;
    return this;
  }

  build() {
    return new User(this.id, this.email, this.password);
  }
}
