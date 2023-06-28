const { updateArticleById } = require("../models/articles.models");
const { selectAllArticles } = require("../models/articles.models");
const { selectArticleById } = require("../models/articles.models");

function getAllArticles(req, res, next) {
  selectAllArticles().then((result) => {
    res.status(200).send({ articles: result });
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

module.exports = { getArticleById, getAllArticles, patchArticleById };
