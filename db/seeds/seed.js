const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  // Drop tables
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then((result) => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then((result) => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then((result) => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then((result) => {
      //Create tables
      //Start with topics, users, articles, comments
      return db.query(`CREATE TABLE topics (
        slug VARCHAR(100) PRIMARY KEY,
        description VARCHAR(250) NOT NULL
      );`);
    })
    .then((result) => {
      return db.query(`CREATE TABLE users (
        username VARCHAR(100) PRIMARY KEY,
        avatar_url VARCHAR(150) NOT NULL,
        name VARCHAR(100) NOT NULL
      );`);
    })
    .then((result) => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        body TEXT NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        topic VARCHAR(100) REFERENCES topics(slug) NOT NULL,
        author VARCHAR(100) REFERENCES users(username) NOT NULL,
        created_at DATE DEFAULT Now() NOT NULL
      );`);
    })
    .then((result) => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(100) REFERENCES users(username) NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        body TEXT NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at DATE DEFAULT Now() NOT NULL
      );`);
    })
    .then((result) => {
      // Insert data
      // //Start with topics, users, articles, comments
      const queryString = format(
        `INSERT INTO topics (slug, description) VALUES %L RETURNING *;`,
        topicData.map((topic) => {
          return [topic.slug, topic.description];
        })
      );
      return db.query(queryString);
    })
    .then((result) => {
      const queryString = format(
        `INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *;`,
        userData.map((user) => {
          return [user.username, user.avatar_url, user.name];
        })
      );
      return db.query(queryString);
    })
    .then((result) => {
      const queryString = format(
        `INSERT INTO articles (title, body, topic, author, created_at, votes) VALUES %L RETURNING *;`,
        articleData.map((article) => {
          return [article.title, article.body, article.topic, article.author, article.created_at, article.votes];
        })
      );
      return db.query(queryString);
    })
    .then((result) => {
      const queryString = format(
        `INSERT INTO comments (author, article_id, body, created_at, votes) VALUES %L RETURNING *;`,
        commentData.map((comment) => {
          return [comment.author, comment.article_id, comment.body, comment.created_at, comment.votes];
        })
      );
      return db.query(queryString);
    });
};

module.exports = seed;
