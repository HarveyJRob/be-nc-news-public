const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByUsername = (username) => {
  let queryValues = [username];
  let sqlStr = `SELECT comments.*, articles.title AS article_title, articles.author AS article_author
                FROM comments
                LEFT OUTER JOIN articles ON articles.article_id = comments.article_id 
                WHERE comments.author = %L;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows;
  });
};

exports.updateCommentByCommentId = (comment_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryValues = [inc_votes, comment_id];
  let sqlStr = `UPDATE comments SET votes = votes + %L
                  WHERE comment_id = %L RETURNING *;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows[0];
  });
};

exports.removeCommentByCommentId = (comment_id) => {
  let queryValues = [comment_id];
  let sqlStr = `DELETE FROM comments 
                  WHERE comment_id = %L RETURNING *;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows[0];
  });
};
