const db = require("../db/connection");
const format = require("pg-format");

const { addPagination } = require("../utils/utils");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((results) => {
    return results.rows;
  });
};

exports.insertTopic = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryValues = [slug, description];
  let sqlStr = `INSERT INTO topics (slug, description)
                  VALUES (%L, %L) RETURNING *;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows[0];
  });
};
