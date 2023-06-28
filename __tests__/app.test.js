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
    return request(app).get("/api/wrongendpoint").expect(404);
  });
});
describe("200: /api", () => {
  test("should return an key value pairs of endpoint objects", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { api } = body;
        for (let key in api) {
          expect(api[key]).toHaveProperty("description", expect.any(String));
          expect(api[key]).toHaveProperty("queries", expect.any(Array));
          expect(api[key]).toHaveProperty("format", expect.any(String));
          expect(api[key]).toHaveProperty(
            "exampleResponse",
            expect.any(Object)
          );
        }
      });
  });
});
describe("200: /api/articles", () => {
  test("should get an article by its id", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_id", 5);
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("should return error with msg Not Found for request not in database", () => {
    return request(app)
      .get("/api/articles/99999999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
  test("should return error with msg Invalid Input for wrong user input", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Input");
      });
  });
  test("200: should return an array of article objects, each of which should have specific properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
  test("should return an array with specific length", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(5);
      });
  });
  test("should ensure articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
});
describe.skip("/api/comments", () => {
  test("204: should return no content if succesfully deleted", () => {
    return request(app).delete("/api/comments/:comment_id").expect(204);
  });
});
