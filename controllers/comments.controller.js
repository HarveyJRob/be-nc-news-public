const {
  selectCommentsByUsername,
  removeCommentByCommentId,
  updateCommentByCommentId,
} = require("../models/comments.model");

const { checkExists } = require("../utils/utils");

exports.checkCommentIdExists = function (req, res, next, id) {
  return checkExists("comments", "comment_id", id)
    .then((result) => {
      if (result === true) {
        next();
      }
    })
    .catch((err) => next(err));
};

exports.getCommentsByUsername = (req, res, next) => {
  const { username } = req.params;
  selectCommentsByUsername(username)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentId(comment_id)
    .then((comment) => {
      return res.status(204).send();
    })
    .catch((err) => next(err));
};

exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentByCommentId(comment_id, inc_votes)
    .then((comment) => {
      return res.status(200).send({ comment });
    })
    .catch((err) => next(err));
};
