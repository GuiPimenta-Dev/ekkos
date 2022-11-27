import Band from "../../../src/domain/entity/Band";

test("It should be able to add member to band", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", []);
  band.addMember("adminId", { profileId: "profileId", bandId: "bandId", role: "guitarist" });
  expect(band.getMembers()).toHaveLength(1);
});

test("It should not be able to add a member if you are not the adminId", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", []);
  expect(() => band.addMember("user", { profileId: "profileId", bandId: "bandId", role: "guitarist" })).toThrow(
    "Only the adminId can perform this action"
  );
});

test("It should not be able to add a member if member already exists", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", [
    { profileId: "profileId", bandId: "bandId", role: "guitarist" },
  ]);
  expect(() => band.addMember("adminId", { profileId: "profileId", bandId: "bandId", role: "guitarist" })).toThrow(
    "User already in band"
  );
});

test("It should be able to remove member from band", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", [
    { profileId: "profileId", bandId: "bandId", role: "guitarist" },
  ]);
  band.removeMember("adminId", "profileId");
  expect(band.getMembers()).toHaveLength(0);
});

test("It should not be able to remove a member if you are not the adminId", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", [
    { profileId: "profileId", bandId: "bandId", role: "guitarist" },
  ]);
  expect(() => band.removeMember("user", "profileId")).toThrow("Only the adminId can perform this action");
});

test("The admin should not be able to leave", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", [
    { profileId: "profileId", bandId: "bandId", role: "guitarist" },
  ]);
  expect(() => band.removeMember("adminId", "adminId")).toThrow("Admin cannot leave the band");
});