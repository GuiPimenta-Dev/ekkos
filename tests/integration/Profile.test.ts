import request from "supertest";
import app from "../../src/infra/http/Router";
import { faker } from "@faker-js/faker";

let authorization: string;
let id: string;
const password = faker.random.word();

beforeAll(async () => {
  let email = faker.internet.email();
  await request(app).post("/user/create").send({ email, password });
  const response = await request(app).post("/user/login").send({ email, password });
  authorization = `Bearer ${response.body.token}`;
  await request(app)
    .post("/profile")
    .send({ email, password, nickname: faker.name.firstName() })
    .set({ authorization });
  email = faker.internet.email();
  const { body } = await request(app).post("/user/create").send({ email, password });
  id = body.id;
  const secondResponse = await request(app).post("/user/login").send({ email, password });
  await request(app)
    .post("/profile")
    .send({ email, password, nickname: faker.name.firstName() })
    .set({ authorization: `Bearer ${secondResponse.body.token}` });
});

test("It should be able to create a profile", async () => {
  const email = faker.internet.email();
  const nickname = faker.name.firstName();
  await request(app).post("/user/create").send({ email, password });
  const { body } = await request(app).post("/user/login").send({ email, password });
  const response = await request(app)
    .post("/profile")
    .send({ email, password, nickname })
    .set({ authorization: `Bearer ${body.token}` });

  expect(response.statusCode).toBe(201);
  expect(response.body).toBe("");
});

test("It should be able to get a profile", async () => {
  const response = await request(app).get(`/profile/${id}`).set({ authorization });
  expect(response.statusCode).toBe(200);
  expect(Object.keys(response.body)).toEqual(["id", "nickname", "followers", "following", "videos"]);
});

test("It should be able to follow a profile", async () => {
  const response = await request(app).post(`/profile/${id}/follow`).set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to unfollow a profile", async () => {
  await request(app).post(`/profile/${id}/follow`).set({ authorization });
  const { statusCode } = await request(app).post(`/profile/${id}/unfollow`).set({ authorization });
  expect(statusCode).toBe(200);
});
