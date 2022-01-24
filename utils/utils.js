const db = require("../db/connection");
const format = require("pg-format");

const checkExists = (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);

  return db.query(queryStr, [value]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return true;
    }
  });
};

const checkTopic = (topic) => {
  let queryValues = [];
  let sqlStr = `SELECT slug FROM topics`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((topics) => {
    if (
      topic &&
      !topics.rows.find((element) => element.slug.toLowerCase() === topic.toLowerCase())
    ) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return topics.rows.map((element) => element.slug);
    }
  });
};

const addPagination = (resource, results, limit, p) => {
  resultsCopy = JSON.parse(JSON.stringify(results));

  const pageCount = Math.ceil(resultsCopy.length / limit);
  let page = parseInt(p);
  if (page > pageCount) {
    page = pageCount;
  }
  const newResults = {};
  newResults.total_count = resultsCopy.length;
  newResults.page = page;
  newResults.pageCount = pageCount;
  newResults[resource] = resultsCopy.slice(page * limit - limit, page * limit);
  return newResults;
};

module.exports = { checkExists, checkTopic, addPagination };
