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

function selectAllCommentsByArticleId(article_id) {
    return db.query('SELECT * FROM comments WHERE article_id = $1', [article_id]).then(({rows})=>{
        if (rows.length != 0){
            return rows
        } else {
            return Promise.reject({ status: 404, msg: "Not Found"})
        }
    })
}
module.exports = {
  selectArticleById,
  selectAllArticles,
  selectAllCommentsByArticleId,
};
