const express = require("express");

const articlesRouter = express.Router();

const {
  checkArticleIdExists,
  getArticles,
  postArticle,
  getArticleByArticleId,
  patchArticleByArticleId,
  deleteArticleByArticleId,
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentsByArticleId,
  getArticlesPagination,
  getCommentsByArticleIdPagination,
} = require("../controllers/articles.controller");

articlesRouter.use(express.json());

articlesRouter.param("article_id", checkArticleIdExists);

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.get("/pagination", getArticlesPagination);

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(patchArticleByArticleId)
  .delete(deleteArticleByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .delete(deleteCommentsByArticleId);

articlesRouter.route("/:article_id/comments/pagination").get(getCommentsByArticleIdPagination);

module.exports = articlesRouter;
