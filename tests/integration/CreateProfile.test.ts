import request from "supertest";
import app from "../../src/infra/http/Router";

let authorization: string;
beforeEach(async () => {
  await request(app).post("/user/create").send({ email: "random_email@gmail.com", password: "123456" });
  const { body } = await request(app).post("/user/login").send({ email: "random_email@gmail.com", password: "123456" });
  authorization = `Bearer ${body.token}`;
});

test("It should be able to create a profile", async () => {
  const response = await request(app)
    .post("/profile")
    .send({ email: "random_email@gmail.com", password: "123456", nickname: "nickname" })
    .set({ authorization });

  expect(response.statusCode).toBe(201);
  expect(response.body).toBe(null);
});

test("It should not be able to create a profile if nickname is already taken", async () => {
  await request(app)
    .post("/profile")
    .send({ email: "random_email@gmail.com", password: "123456", nickname: "nickname" })
    .set({ authorization });
  const response = await request(app)
    .post("/profile")
    .send({ email: "random_email@gmail.com", password: "123456", nickname: "nickname" })
    .set({ authorization });

  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({ message: "Nickname is already taken" });
});
