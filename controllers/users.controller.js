const { selectUsers, selectUserByUsername } = require("../models/users.model");

const { checkExists } = require("../utils/utils");

exports.checkUsernameExists = function (req, res, next, id) {
  return checkExists("users", "username", id)
    .then((result) => {
      if (result === true) {
        next();
      }
    })
    .catch((err) => next(err));
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => next(err));
};
