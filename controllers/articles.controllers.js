const {
  insertCommentByArticleId,
  selectAllCommentsByArticleId,
  selectAllArticles,
  selectArticleById,
  updateArticleById,
  removeCommentByCommentId,
} = require("../models/articles.models");

function getAllArticles(req, res, next) {
  selectAllArticles()
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
}
function getArticleById(req, res, next) {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticleById(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((result) => {
      res.status(200).send({ article: result[0] });
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentByArticleId(req, res, next) {
  const { article_id } = req.params;
  const msg = req.body;
  insertCommentByArticleId(article_id, msg)
    .then((result) => {
      res.status(201).send({ comment: result });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  selectAllCommentsByArticleId(article_id)
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteCommentByCommentId(req, res, next) {
  const { comment_id } = req.params;
  removeCommentByCommentId(comment_id)
    .then((result) => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentByCommentId,
};
