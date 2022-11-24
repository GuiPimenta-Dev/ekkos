import request from "supertest";
import app from "../../src/infra/http/Router";

let authorization: string;
let id: string;
beforeAll(async () => {
  const email = "email@gmail.com";
  const password = "123456";
  await request(app).post("/user/create").send({ email, password });
  const response = await request(app).post("/user/login").send({ email, password });
  authorization = `Bearer ${response.body.token}`;
  await request(app).post("/profile").send({ email, password, nickname: "nickname" }).set({ authorization });
  const { body } = await request(app)
    .post("/video")
    .send({ title: "title", description: "description", url: "url" })
    .set({ authorization });
  id = body.id;
});

test("It should be able to post a video", async () => {
  const { statusCode } = await request(app)
    .post("/video")
    .send({ title: "title", description: "description", url: "second_url" })
    .set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to like a video", async () => {
  const { statusCode } = await request(app).post(`/video/${id}/like`).set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to unlike a video", async () => {
  await request(app).post(`/video/${id}/like`).set({ authorization });
  const { statusCode } = await request(app).post(`/video/${id}/unlike`).set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to comment a video", async () => {
  const { statusCode } = await request(app).post(`/video/${id}/comment`).send({ text: "text" }).set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to delete a comment in a video", async () => {
  const { body } = await request(app).post(`/video/${id}/comment`).send({ text: "text" }).set({ authorization });
  const { statusCode } = await request(app).delete(`/video/${body.id}/comment`).set({ authorization });
  expect(statusCode).toBe(200);
});
