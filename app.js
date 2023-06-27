const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  handlePostgressErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");
const { getAllApi } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/articles.controllers");
const app = express();

app.get("/api", getAllApi)

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById)

app.use(handleCustomErrors);
app.use(handlePostgressErrors);
app.use(handleServerErrors);

module.exports = { app };