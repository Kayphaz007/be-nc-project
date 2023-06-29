const db = require("../db/connection");

function selectAllArticles() {
  return db
    .query(
      "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No articles found",
        });
      }
      return rows.map((row) => {
        row.votes = +row.votes;
        row.comment_count = +row.comment_count;
        return row;
      });
    });
}
function selectArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length != 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
}

async function insertCommentByArticleId(article_id, msg) {
  let { username, body } = msg;
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid Id" });
  }
  if (!username) {
    return Promise.reject({ status: 400, msg: "User not defined" });
  }
  username = username.toLowerCase();
  // check if article_id and user exists
  async function checkArticleIdAndUsernameExists(article_id, username) {
    const dbArticle_id = await db.query(
      "SELECT article_id FROM articles WHERE article_id = $1",
      [article_id]
    );
    const dbUsername = await db.query(
      "SELECT username FROM users WHERE username = $1",
      [username]
    );
    if (dbArticle_id.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    if (dbUsername.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "User not found" });
    }
  }
  // check body is not empty
  if (!body.length) {
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  }
  const doesArticle_idAndUsernameExist = await checkArticleIdAndUsernameExists(
    article_id,
    username
  );
  if (doesArticle_idAndUsernameExist) {
    return doesArticle_idAndUsernameExist;
  }

  const result = await db.query(
    "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING body;",
    [article_id, username, body]
  );
  const { rows } = result;
  return rows[0];
}
module.exports = {
  selectArticleById,
  selectAllArticles,
  insertCommentByArticleId,
};
