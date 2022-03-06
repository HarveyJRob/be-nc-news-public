const express = require("express");
const usersRouter = express.Router();

const {
  checkUsernameExists,
  getUsers,
  getUserByUsername,
  getAuthUser,
} = require("../controllers/users.controller");

const { loginUser, validateUser } = require("../controllers/auth.controller");

const app = require("../app");

usersRouter.use(express.json());

usersRouter.param("username", checkUsernameExists);

usersRouter.route("/").get(getUsers);

usersRouter.post("/login", loginUser);

usersRouter.route("/:username").get(getUserByUsername);

usersRouter.use(validateUser);

usersRouter.route("/secure/user").get(getAuthUser);

usersRouter.route("/secure/:username").get(getUserByUsername);

module.exports = usersRouter;
