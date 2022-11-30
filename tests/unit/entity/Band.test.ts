import Band from "../../../src/domain/entity/Band";

test("It should be able to add member to band", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", []);
  band.addMember("adminId", { profileId: "profileId", bandId: "bandId", role: "guitarist" });
  expect(band.getMembers()).toHaveLength(1);
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
  expect(() => band.removeMember("user", "profileId")).toThrow("Only the admin can perform this action");
});

test("The admin should not be able to leave", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", [
    { profileId: "profileId", bandId: "bandId", role: "guitarist" },
  ]);
  expect(() => band.removeMember("adminId", "adminId")).toThrow("Admin cannot leave the band");
});

test("It should be able to open a vacancy", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", [
    { profileId: "profileId", bandId: "bandId", role: "guitarist" },
  ]);
  band.openVacancy("adminId", "guitarist");
  expect(band.getVacancies()).toHaveLength(1);
});

test("It should be able to remove a vacancy", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", [
    { profileId: "profileId", bandId: "bandId", role: "guitarist" },
  ]);
  band.openVacancy("adminId", "guitarist");
  expect(band.getVacancies()).toHaveLength(1);
  band.removeVacancy("adminId", "guitarist");
  expect(band.getVacancies()).toHaveLength(0);
});

test("It should remove only one vacancy if there are repeated roles", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", [
    { profileId: "profileId", bandId: "bandId", role: "guitarist" },
  ]);
  band.openVacancy("adminId", "guitarist");
  band.openVacancy("adminId", "guitarist");
  expect(band.getVacancies()).toHaveLength(2);
  band.removeVacancy("adminId", "guitarist");
  expect(band.getVacancies()).toHaveLength(1);
});

test("It should remove a vacancy when adding a member to band", async () => {
  const band = new Band("bandId", "name", "description", "logo", "adminId", [], ["guitarist"]);
  band.addMember("adminId", { profileId: "profileId", bandId: "bandId", role: "guitarist" });
  expect(band.getMembers()).toHaveLength(1);
  expect(band.getVacancies()).toHaveLength(0);
});
