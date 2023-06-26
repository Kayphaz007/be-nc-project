const { selectAllTopics } = require("../models/topics.models");

function getAllTopics(req, res, next) {
  return selectAllTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllTopics };
