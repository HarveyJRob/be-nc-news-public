const express = require("express");
const usersRouter = express.Router();

const {
  checkUsernameExists,
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controller");

usersRouter.use(express.json());

usersRouter.param("username", checkUsernameExists);

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
