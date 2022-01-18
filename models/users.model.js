const db = require("../db/connection");
const format = require("pg-format");

exports.selectUsers = () => {
  return db.query(`SELECT username FROM users;`).then((results) => {
    return results.rows;
  });
};

exports.selectUserByUsername = (username) => {
  let queryValues = [username];
  let sqlStr = `SELECT users.*
                  FROM users 
                  WHERE users.username = %L;`;

  const queryStr = format(sqlStr, ...queryValues);

  return db.query(queryStr).then((results) => {
    return results.rows[0];
  });
};
