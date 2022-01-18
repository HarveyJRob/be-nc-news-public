const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const allowedSortBys = ["title", "body", "votes", "topic", "author", "created_at"];
  const allowedOrderBys = ["ASC", "DESC"];

  if (!allowedSortBys.includes(sort_by) || !allowedOrderBys.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryValues = [];
  let sqlStr = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryValues.push(topic);
    sqlStr += ` WHERE topic ILIKE %L`;
  }

  sqlStr += ` GROUP BY articles.article_id`;

  if (sort_by === "title") {
    queryValues.push(`title`);
    sqlStr += ` ORDER BY %I`;
  } else if (sort_by === "body") {
    queryValues.push(`body`);
    sqlStr += ` ORDER BY %I`;
  } else if (sort_by === "votes") {
    queryValues.push(`votes`);
    sqlStr += ` ORDER BY %I`;
  } else if (sort_by === "topic") {
    queryValues.push(`topic`);
    sqlStr += ` ORDER BY %I`;
  } else if (sort_by === "author") {
    queryValues.push(`author`);
    sqlStr += ` ORDER BY %I`;
  } else if (sort_by === "created_at") {
    queryValues.push(`created_at`);
    sqlStr += ` ORDER BY %I`;
  }

  if (order === "ASC") {
    queryValues.push(`ASC`);
    sqlStr += ` %s`;
  } else if (order === "DESC") {
    queryValues.push(`DESC`);
    sqlStr += ` %s`;
  }

  const queryStr = format(sqlStr, ...queryValues);
  return db.query(queryStr).then((results) => {
    return results.rows;
  });
};

exports.insertArticle = (author, title, body, topic) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (
    typeof author !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof topic !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryValues = [author, title, body, topic];
  let sqlStr = `INSERT INTO articles (author, title, body, topic)
                VALUES (%L, %L, %L, %L) RETURNING *;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((insertResults) => {
    let queryValues = [insertResults.rows[0].article_id];
    let sqlStr = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
                FROM articles
                LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
                WHERE articles.article_id = %L
                GROUP BY articles.article_id;`;

    const queryStr = format(sqlStr, ...queryValues);

    return db.query(queryStr).then((selectResults) => {
      return selectResults.rows[0];
    });
  });
};

exports.selectArticleByArticleId = (article_id) => {
  let queryValues = [article_id];
  let sqlStr = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
                FROM articles
                JOIN comments ON articles.article_id = comments.article_id 
                WHERE articles.article_id = %L
                GROUP BY articles.article_id;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows[0];
  });
};

exports.updateArticleByArticleId = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryValues = [inc_votes, article_id];
  let sqlStr = `UPDATE articles SET votes = votes + %L
                WHERE article_id = %L RETURNING *;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows[0];
  });
};

exports.removeArticleByArticleId = (article_id) => {
  let queryValues = [article_id];
  let sqlStr = `DELETE FROM articles 
                WHERE article_id = %L RETURNING *;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows[0];
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  let queryValues = [article_id];
  let sqlStr = `SELECT comments.*
                FROM comments 
                WHERE comments.article_id = %L`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows;
  });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryValues = [article_id, username, body];
  let sqlStr = `INSERT INTO comments (article_id, author, body)
                VALUES (%L, %L, %L) RETURNING *;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows[0];
  });
};

exports.removeCommentsByArticleId = (article_id) => {
  let queryValues = [article_id];
  let sqlStr = `DELETE FROM comments 
                WHERE article_id = %L RETURNING *;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows;
  });
};
