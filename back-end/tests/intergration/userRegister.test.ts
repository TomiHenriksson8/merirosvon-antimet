import request from "supertest";
import app from "../../src/app"; // Import your Express app


describe("User Registration", () => {
  it("registers a new user successfully", async () => {
    const userData = {
      id: 99,
      username: "intergrationtest44",
      password: "newpassword",
      email: "intergrationtest44@example.com",
      role: "user",
    };
    const response = await request(app)
      .post("/api/users/register")
      .send(userData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("username", userData.username);
    expect(response.body).toHaveProperty("email", userData.email);
  });
  it("fails to register a user with an existing username or email", async () => {
    const userData = {
        id: 99,
        username: "intergrationtest44",
        password: "newpassword",
        email: "intergrationtest44@example.com",
        role: "user",
    };
    const response = await request(app)
      .post("/api/users/register")
      .send(userData);
    expect(response.statusCode).toBe(500);
  });
});
