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
describe("200: /api/users", () => {
  test("200: should return an array of user objects, each of which should have specific properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
  test("should return an array with specific length", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
      });
  });
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
  describe("GET: /api/articles", () => {
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
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
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
  describe("GET: /api/articles/:article_id", () => {
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
          expect(article).toHaveProperty("comment_count", expect.any(String));
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
  });

  describe("PATCH: /api/articles/:article_id", () => {
    test("should increment the vote of an article", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 5 })
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.votes).toBe(5);
        });
    });
    test("should decrement the vote of an article", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: -3 })
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.votes).toBe(-3);
        });
    });
    test("should respond with the updated article", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({ inc_votes: 3 })
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("article_id", 4);
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", 3);
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
    });
    test("should return a 404 for valid id not in database", () => {
      return request(app)
        .patch("/api/articles/99999")
        .send({ inc_votes: -3 })
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("No Resource Found");
        });
    });
    test("should return a 400 for article_id NaN", () => {
      return request(app)
        .patch("/api/articles/banana")
        .send({ inc_votes: -3 })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Id NaN");
        });
    });
    test("should return a 400 for malformed request", () => {
      return request(app)
        .patch("/api/articles/12")
        .send({ hello: -3 })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Malformed Request");
        });
    });
  });
});
describe("POST: /api/articles/:article_id/comments", () => {
  test("should return the posted comment", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "rogersop",
        body: "Hello I am new Here",
      })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.body).toBe("Hello I am new Here");
      });
  });
  test("should return an error if user does not exist", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "kayphaz007",
        body: "Hello I am new Here",
      })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("User not found");
      });
  });
  test("should return an error if article does not exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        username: "rogersop",
        body: "Hello I am new Here",
      })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article not found");
      });
  });
  test("should return an error if body is empty", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "kayphaz007",
        body: "",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Request");
      });
  });
  test("should ignore extra properties on the post body", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "rogersop",
        body: "Hello I am new Here",
        inc_votes: 5,
      })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.body).toBe("Hello I am new Here");
      });
  });
  test("should return an error if article_id is invalid", () => {
    return request(app)
      .post("/api/articles/notanid/comments")
      .send({
        username: "rogersop",
        body: "Hello I am new Here",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Id");
      });
  });
  test("should return an error if username is missing", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        body: "Hello I am new Here",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("User not defined");
      });
  });
  test("should ensure comments have the specific properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
      });
  });
  test("should return 200 with empty array for request with no comments", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("should return 400 with msg Invalid Request for request with invalid id", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Request");
      });
  });
  test("should return 404 with msg No Resource Found for request with valid id but not in database", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("No Resource Found");
      });
  });
});
describe("/api/comments", () => {
  test("204: should return no content if succesfully deleted", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  test("400: should return error for comment_id NaN", () => {
    return request(app).delete("/api/comments/hello").expect(400);
  });
  test("404: should return error for valid comment_id but no resource found", () => {
    return request(app).delete("/api/comments/9999").expect(404);
  });
});
