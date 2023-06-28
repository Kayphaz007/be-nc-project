const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  handlePostgressErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");
const { getAllApi } = require("./controllers/api.controllers");
const { getArticleById, getAllArticles, patchArticleById } = require("./controllers/articles.controllers");
const app = express();

app.use(express.json())

app.get("/api", getAllApi)

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", patchArticleById)

app.use(handleCustomErrors);
app.use(handlePostgressErrors);
app.use(handleServerErrors);

module.exports = { app };