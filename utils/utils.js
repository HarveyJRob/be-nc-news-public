const db = require("../db/connection");
const format = require("pg-format");

const checkExists = (table, column, value) => {
  // %I is an identifier in pg-format
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);

  return db.query(queryStr, [value]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return Promise.resolve(true);
    }
  });
};

const addPagination = (results, limit, p) => {
  resultsCopy = JSON.parse(JSON.stringify(results));

  const pageCount = Math.ceil(resultsCopy.rows.length / limit);
  let page = parseInt(p);
  if (page > pageCount) {
    page = pageCount;
  }
  const articles = {};
  articles.total_count = resultsCopy.rows.length;
  articles.page = page;
  articles.pageCount = pageCount;
  articles.posts = resultsCopy.rows.slice(page * limit - limit, page * limit);
  return articles;
};

module.exports = { checkExists, addPagination };
