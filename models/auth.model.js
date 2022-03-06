const db = require("../db/connection");
const format = require("pg-format");

exports.selectUsers = (username) => {
  return db.query(`SELECT * FROM user_pwds WHERE username = $1;`, [username]).then((results) => {
    return results.rows[0];
  });
};
