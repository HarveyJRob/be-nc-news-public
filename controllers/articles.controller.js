const {
  selectArticles,
  insertArticle,
  selectArticlesByUsername,
  selectArticleByArticleId,
  updateArticleByArticleId,
  removeArticleByArticleId,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentsByArticleId,
} = require("../models/articles.model");

const { checkExists, addPagination, checkTopic } = require("../utils/utils");

exports.checkArticleIdExists = function (req, res, next, id) {
  return checkExists("articles", "article_id", id)
    .then((result) => {
      if (result === true) {
        next();
      }
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit = 10, p = 1 } = req.query;
  checkTopic(topic)
    .then((topics) => {
      return selectArticles(sort_by, order, topic);
    })
    .then((articles) => {
      res.status(200).send(addPagination("articles", articles, limit, p));
    })
    .catch((err) => next(err));
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic } = req.body;
  insertArticle(author, title, body, topic)
    .then((article) => {
      return res.status(201).send({ article });
    })
    .catch((err) => next(err));
};

exports.getArticlesByUsername = (req, res, next) => {
  const { username } = req.params;
  selectArticlesByUsername(username)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleByArticleId(article_id, inc_votes)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.deleteArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleByArticleId(article_id)
    .then((article) => {
      return res.status(204).send();
    })
    .catch((err) => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit = 10, p = 1 } = req.query;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send(addPagination("comments", comments, limit, p));
    })
    .catch((err) => next(err));
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.deleteCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  removeCommentsByArticleId(article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};
