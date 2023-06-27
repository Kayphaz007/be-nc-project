const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const { app } = require("../app");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  if (db.end) db.end();
});
describe("200: /api/topics", () => {
  test("should return an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("404: should return an error if wrong endpoint is called", () => {
    return request(app)
      .get("/api/wrongendpoint")
      .expect(404)
  });
});
describe("200: /api", () => {
  test("should return an key value pairs of endpoint objects", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({body})=>{
        const { api } = body
        for(let key in api){
          expect(api[key]).toHaveProperty("description", expect.any(String));
          expect(api[key]).toHaveProperty("queries", expect.any(Array));
          expect(api[key]).toHaveProperty("format", expect.any(String));
          expect(api[key]).toHaveProperty("exampleResponse", expect.any(Object));
        }
      })

  });
});