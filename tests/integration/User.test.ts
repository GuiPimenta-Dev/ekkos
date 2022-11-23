import request from "supertest";
import app from "../../src/infra/http/Router";

test("It should be able to create a user", async () => {
  const response = await request(app)
    .post("/user/create")
    .send({ email: "random_email@gmail.com", password: "123456" });
  expect(response.statusCode).toBe(201);
  expect(response.body).toHaveProperty("id");
});

test("It should be able to login a user", async () => {
  await request(app).post("/user/create").send({ email: "random_email@gmail.com", password: "123456" });
  const response = await request(app).post("/user/login").send({ email: "random_email@gmail.com", password: "123456" });
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("token");
});
