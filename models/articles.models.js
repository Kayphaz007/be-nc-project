const db = require("../db/connection");
const { reduceRight } = require("../db/data/test-data/articles");

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

async function updateArticleById(article_id, inc_votes) {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Malformed Request" });
  }
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Id NaN" });
  }
  //   check if article_id exist in database
  async function checkIfArticle_idExist(article_id) {
    const dbResult = await db.query(
      "SELECT * FROM articles WHERE article_id = $1;",
      [article_id]
    );
    if (dbResult.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No Resource Found" });
    } else {
      return dbResult.rows[0].votes;
    }
  }
  const doesArticle_idExist = await checkIfArticle_idExist(article_id);
  if (doesArticle_idExist) {
    return doesArticle_idExist;
  }
  const previousVoteValue = doesArticle_idExist;
  return db
    .query("UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *", [
      inc_votes + previousVoteValue,
      article_id,
    ])
    .then(({ rows }) => {
      return rows;
    });
}
module.exports = { selectArticleById, selectAllArticles, updateArticleById };
