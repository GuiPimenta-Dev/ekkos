import request from "supertest";
import app from "../../src/infra/http/Router";

let authorization: string;
let id: string;
beforeEach(async () => {
  await request(app).post("/user/create").send({ email: "first_user@gmail.com", password: "123456" });
  const firstResponse = await request(app)
    .post("/user/login")
    .send({ email: "first_user@gmail.com", password: "123456" });
  authorization = `Bearer ${firstResponse.body.token}`;
  await request(app)
    .post("/profile")
    .send({ email: "second_user@gmail.com", password: "123456", nickname: "first_nickname" })
    .set({ authorization });
  const { body } = await request(app).post("/user/create").send({ email: "second_user@gmail.com", password: "123456" });
  id = body.id;
  const secondResponse = await request(app)
    .post("/user/login")
    .send({ email: "second_user@gmail.com", password: "123456" });
  await request(app)
    .post("/profile")
    .send({ email: "second_user@gmail.com", password: "123456", nickname: "second_nickname" })
    .set({ authorization: `Bearer ${secondResponse.body.token}` });
});

test("It should be able to create a profile", async () => {
  await request(app).post("/user/create").send({ email: "random_user@gmail.com", password: "123456" });
  const { body } = await request(app).post("/user/login").send({ email: "random_user@gmail.com", password: "123456" });
  const response = await request(app)
    .post("/profile")
    .send({ email: "random_user@gmail.com", password: "123456", nickname: "random_nickname" })
    .set({ authorization: `Bearer ${body.token}` });

  expect(response.statusCode).toBe(201);
  expect(response.body).toBe(null);
});

test("It should not be able to create a profile if nickname is already taken", async () => {
  await request(app)
    .post("/profile")
    .send({ email: "random_email@gmail.com", password: "123456", nickname: "random_nickname" })
    .set({ authorization });
  const response = await request(app)
    .post("/profile")
    .send({ email: "random_email@gmail.com", password: "123456", nickname: "random_nickname" })
    .set({ authorization });
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({ message: "Nickname is already taken" });
});

test("It should not be able to create a profile if user id does not exists", async () => {
  await request(app)
    .post("/profile")
    .send({ email: "random_email@gmail.com", password: "123456", nickname: "random_nickname" })
    .set({ authorization });
  const response = await request(app)
    .post("/profile")
    .send({ email: "random_email@gmail.com", password: "123456", nickname: "random_nickname" })
    .set({
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ZjE4OGNlLTg0OTAtNGYxNS1hZGM4LWQ3YzBkYWY3MGFlNSIsImlhdCI6MTY2OTIwMTcwOCwiZXhwIjoxNjY5MjA0MTA4fQ.UrrKYYpIp3ydtVmpnTyojrFciYjuuf30jMI0ki6jgTI",
    });
  expect(response.statusCode).toBe(401);
  expect(response.body).toEqual({ message: "User not found" });
});

test("It should be able to get a profile", async () => {
  const response = await request(app).get(`/profile/${id}`).set({ authorization });
  expect(response.statusCode).toBe(200);
  expect(Object.keys(response.body)).toEqual(["id", "nickname", "followers", "following", "videos"]);
});
