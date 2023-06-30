const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  handlePostgressErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");
const { getAllApi } = require("./controllers/api.controllers");
const {
  getArticleById,
  getAllArticles,
  patchArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
  getAllUsers,
} = require("./controllers/articles.controllers");
const app = express();

app.use(express.json());

app.get("/api", getAllApi);

app.get("/api/topics", getAllTopics);

app.get("/api/users", getAllUsers);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.use(handleCustomErrors);
app.use(handlePostgressErrors);
app.use(handleServerErrors);

module.exports = { app };
