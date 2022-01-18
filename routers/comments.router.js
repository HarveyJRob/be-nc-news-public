const express = require("express");
const commentsRouter = express.Router();

const {
  checkCommentIdExists,
  deleteCommentByCommentId,
  patchCommentByCommentId,
} = require("../controllers/comments.controller");

commentsRouter.use(express.json());

commentsRouter.param("comment_id", checkCommentIdExists);

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentByCommentId)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;
