const express = require("express");
const usersRouter = express.Router();

const { checkUsernameExists, getUsers, getUserByUsername } = require("../controllers/users.controller");

const { getArticlesByUsername } = require("../controllers/articles.controller");

const { getCommentsByUsername } = require("../controllers/comments.controller");

const app = require("../app");

usersRouter.use(express.json());

usersRouter.param("username", checkUsernameExists);

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getUserByUsername);

usersRouter.route("/:username/articles").get(getArticlesByUsername);

usersRouter.route("/:username/comments").get(getCommentsByUsername);

module.exports = usersRouter;
