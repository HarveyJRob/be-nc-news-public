const request = require("supertest");
const app = require("../app");

const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("", () => {
  test("app.tests is running...", () => {});
});

describe("/api/invalidRoute", () => {
  test("GET: status 404 & 'route not found' message", () => {
    return request(app)
      .get("/api/invalidRoute")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});

describe("/api", () => {
  test("GET: status 200 & 'all ok' message", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body.msg).toBe("all ok");
      });
  });
});

describe("/api/topics", () => {
  test("GET: status 200 & array of topic objects with slug and description keys", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toBeInstanceOf(Array);
        expect(res.body.topics).toHaveLength(3);
        res.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/topics", () => {
  test("POST: status 201 & returns new topic object", () => {
    const newTopic = {
      slug: "new_slug",
      description: "description about new_slug",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then((res) => {
        expect(res.body.topic).toMatchObject({
          slug: "new_slug",
          description: "description about new_slug",
        });
      });
  });
  test("POST: status 400 & returns an error message - missing description field", () => {
    const newTopic = {
      slug: "new_slug",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("POST: status 400 & returns an error message - invalid type for slug field", () => {
    const newTopic = {
      slug: 1,
      description: "description about new_slug",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET: status 200 & array of user objects with a key of username", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users).toBeInstanceOf(Array);
        expect(res.body.users).toHaveLength(4);
        res.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
          });
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET: status 200 & requested user object", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((res) => {
        expect(res.body.user).toMatchObject({
          username: "butter_bridge",
          avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          name: "jonny",
        });
      });
  });
  test("GET: status 404 & returns an error message", () => {
    return request(app)
      .get("/api/users/None_existent_username")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: status 200 & requested article object inc comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-08T23:00:00.000Z",
          votes: 100,
          comment_count: "11",
        });
      });
  });
  test("GET: status 200 & requested article object inc comment_count where article has no comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          votes: 0,
          comment_count: "0",
        });
      });
  });

  test("GET: status 404 & returns an error message", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("GET: status 400 & returns an error message", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH: status 200 & positive updated to article vote property", () => {
    const updateArticle = {
      inc_votes: 10,
    };

    return request(app)
      .patch("/api/articles/1")
      .send(updateArticle)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-08T23:00:00.000Z",
          votes: 110,
        });
      });
  });
  test("PATCH: status 200 & negative updated to article vote property", () => {
    const updateArticle = {
      inc_votes: -110,
    };

    return request(app)
      .patch("/api/articles/1")
      .send(updateArticle)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-08T23:00:00.000Z",
          votes: -10,
        });
      });
  });
  test("PATCH: status 400 & returns an error message - missing inc_vote field", () => {
    const updateArticle = {};

    return request(app)
      .patch("/api/articles/1")
      .send(updateArticle)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("PATCH: status 400 & returns an error message - invalid type for body field", () => {
    const updateArticle = {
      inc_votes: "invalid_type",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(updateArticle)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("PATCH: status 404 & returns an error message - non-existent article_id ", () => {
    const updateArticle = {
      inc_votes: 10,
    };

    return request(app)
      .patch("/api/articles/1000")
      .send(updateArticle)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("PATCH: status 400 & returns an error message - invalid article_id", () => {
    const updateArticle = {
      inc_votes: 10,
    };

    return request(app)
      .patch("/api/articles/invalid_id")
      .send(updateArticle)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("DELETE: status 204 & no content", () => {
    return request(app).delete("/api/articles/10").expect(204);
  });
  test("DELETE: status 404 & returns an error message", () => {
    return request(app)
      .delete("/api/articles/1000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("DELETE: status 400 & returns an error message", () => {
    return request(app)
      .delete("/api/articles/invalid_id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET: status 200 & array of article objects sorted by defaults (created_at DESC)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        res.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by created_at DESC", () => {
    return request(app)
      .get("/api/articles?order=DESC")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by created_at desc", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by created_at ASC", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by created_at asc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by title DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=title&&order=DESC")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by body DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=body&&order=DESC")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("body", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by votes DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&&order=DESC")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by topic DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&&order=DESC")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("topic", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by author DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=author&&order=DESC")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by created_at DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&&order=DESC")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by created_at DESC", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(1);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by created_at DESC", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(11);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & array of article objects sorted by created_at DESC", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(0);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 400 & returns an error message - topic not in db (case insensitive)", () => {
    return request(app)
      .get("/api/articles?topic=unknown_topic")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("GET: status 400 & returns an error message - not allowed sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_term")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("GET: status 400 & returns an error message - not allowed order", () => {
    return request(app)
      .get("/api/articles?order=invalid_term")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET: status 200 & object with total_count, page, pageCount and post properties sorted by defaults (created_at DESC)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          total_count: 12,
          page: 1,
          pageCount: 2,
          articles: expect.any(Array),
        });
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & object with total_count, page, pageCount and post properties sorted by defaults (created_at DESC)", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          total_count: 12,
          page: 1,
          pageCount: 3,
          articles: expect.any(Array),
        });
        expect(res.body.articles).toHaveLength(5);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 200 & object with total_count, page, pageCount and post properties sorted by defaults (created_at DESC)", () => {
    return request(app)
      .get("/api/articles?limit=5&&p=2")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          total_count: 12,
          page: 2,
          pageCount: 3,
          articles: expect.any(Array),
        });
        expect(res.body.articles).toHaveLength(5);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("/api/articles", () => {
  test("POST: status 201 & returns new article object", () => {
    const newArticle = {
      author: "lurker",
      title: "Test article by Lurker",
      body: "This is a very exciting test article about cats.",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          author: "lurker",
          title: "Test article by Lurker",
          body: "This is a very exciting test article about cats.",
          topic: "cats",
          article_id: 13,
          votes: 0,
          comment_count: "0",
          created_at: expect.any(String),
        });
      });
  });
  test("POST: status 400 & returns an error message - missing title field", () => {
    const newArticle = {
      author: "lurker",
      body: "This is a very exciting test article about cats.",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("POST: status 400 & returns an error message - invalid type for body field", () => {
    const newArticle = {
      author: "lurker",
      title: "Test article by Lurker",
      body: 1,
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("POST: status 422 & returns an error message - valid but non-existent author", () => {
    const newArticle = {
      author: "VALID_NON_EXISTENT",
      title: "Test article by Lurker",
      body: "This is a very exciting test article about cats.",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(422)
      .then((res) => {
        expect(res.body.msg).toBe("Unprocessable Entity");
      });
  });
  test("POST: status 422 & returns an error message - invalid author", () => {
    const newArticle = {
      author: 8,
      title: "Test article by Lurker",
      body: "This is a very exciting test article about cats.",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("POST: status 400 & returns an error message - valid but non-existent topic", () => {
    const newArticle = {
      author: "lurker",
      title: "Test article by Lurker",
      body: "This is a very exciting test article about cats.",
      topic: "VALID_NON_EXISTENT",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(422)
      .then((res) => {
        expect(res.body.msg).toBe("Unprocessable Entity");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: status 200 & requested array of comment objects", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(11);
        expect(res.body.comments).toBeInstanceOf(Array);
        expect(res.body.comments).toHaveLength(10);
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("GET: status 404 & returns an error message", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("GET: status 400 & returns an error message", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: status 200 & object with total_count, page, pageCount and post properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          total_count: 11,
          page: 1,
          pageCount: 2,
          comments: expect.any(Array),
        });
        expect(res.body.comments).toHaveLength(10);
      });
  });
  test("GET: status 200 & object with total_count, page, pageCount and post properties", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          total_count: 11,
          page: 1,
          pageCount: 3,
          comments: expect.any(Array),
        });
        expect(res.body.comments).toHaveLength(5);
      });
  });
  test("GET: status 200 & object with total_count, page, pageCount and post properties sorted by defaults (created_at DESC)", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&&p=2")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          total_count: 11,
          page: 2,
          pageCount: 3,
          comments: expect.any(Array),
        });
        expect(res.body.comments).toHaveLength(5);
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST: status 201 & returns new comment object", () => {
    const newComment = {
      username: "lurker",
      body: "Test comment for article_id: 1",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: 19,
          article_id: 1,
          author: "lurker",
          body: "Test comment for article_id: 1",
          votes: 0,
        });
      });
  });
  test("POST: status 400 & returns an error message - missing body field", () => {
    const newComment = {
      username: "lurker",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("POST: status 400 & returns an error message - invalid type for body field", () => {
    const newComment = {
      username: "lurker",
      body: 10,
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("POST: status 404 & returns an error message - non-existent article_id ", () => {
    const newComment = {
      username: "lurker",
      body: "Test comment for article_id: 1",
    };

    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("POST: status 400 & returns an error message - invalid article_id", () => {
    const newComment = {
      username: "lurker",
      body: "Test comment for article_id: 1",
    };

    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("DELETE: status 204 & array of deleted comment objects", () => {
    return request(app)
      .delete("/api/articles/5/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeInstanceOf(Array);
        expect(res.body.comments).toHaveLength(2);
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 5,
          });
        });
      });
  });
  test("DELETE: status 404 & returns an error message", () => {
    return request(app)
      .delete("/api/articles/1000/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("DELETE: status 400 & returns an error message", () => {
    return request(app)
      .delete("/api/articles/invalid_id/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE: status 204 & no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE: status 404 & returns an error message", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("DELETE: status 400 & returns an error message", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("PATCH: status 200 & positive updated to comment vote property", () => {
    const updateComment = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(updateComment)
      .expect(200)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-05T23:00:00.000Z",
        });
      });
  });
  test("PATCH: status 200 & negative updated to article vote property", () => {
    const updateComment = {
      inc_votes: -1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(updateComment)
      .expect(200)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 15,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-05T23:00:00.000Z",
        });
      });
  });
  test("PATCH: status 400 & returns an error message - missing inc_vote field", () => {
    const updateComment = {};

    return request(app)
      .patch("/api/comments/1")
      .send(updateComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("PATCH: status 400 & returns an error message - invalid type for body field", () => {
    const updateComment = {
      inc_votes: "invalid_type",
    };

    return request(app)
      .patch("/api/comments/1")
      .send(updateComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("PATCH: status 404 & returns an error message - non-existent comment_id ", () => {
    const updateComment = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/comments/1000")
      .send(updateComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("PATCH: status 400 & returns an error message - invalid article_id", () => {
    const updateComment = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/comments/invalid_id")
      .send(updateComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});
