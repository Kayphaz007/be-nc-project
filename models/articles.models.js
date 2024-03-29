const db = require("../db/connection");
// const { reduceRight } = require("../db/data/test-data/articles");

function selectAllUsers() {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No Users Found" });
    }
    return rows;
  });
}

function selectAllArticles(topic, sort_by = "created_at", order = "desc") {
  const orderValues = ["desc", "asc"];
  const sortByValues = [
    "created_at",
    "topic",
    "article_id",
    "votes",
    "article_img_url",
    "comment_count",
    "author",
    "title",
  ];
  const queryArray = [];
  let query =
    "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id ";

  if (topic) {
    queryArray.push(topic);
    query += `WHERE topic LIKE $1 `;
  }
  if (!sortByValues.includes(sort_by.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (!orderValues.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  query += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
  return db.query(query, queryArray).then(({ rows }) => {
    // if (rows.length === 0) {
    //   return Promise.reject({
    //     status: 404,
    //     msg: "No articles found",
    //   });
    // }
    return rows.map((row) => {
      row.votes = +row.votes;
      row.comment_count = +row.comment_count;
      return row;
    });
  });
}
function selectArticleById(article_id) {
  return db
    .query(
      "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.body, articles.votes, article_img_url, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ORDER BY articles.created_at DESC;",
      [article_id]
    )
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
  if (typeof doesArticle_idExist === "object") {
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

async function selectAllCommentsByArticleId(article_id) {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  }
  async function checkIfArticleIdExists(article_id) {
    return await db.query("SELECT * FROM articles WHERE article_id = $1", [
      article_id,
    ]);
  }
  const dbArticle = await checkIfArticleIdExists(article_id);
  if (dbArticle.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "No Resource Found" });
  }
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      return rows;
    });
}

function removeCommentByCommentId(comment_id) {
  if (isNaN(comment_id)) {
    return Promise.reject({ status: 400, msg: "Id is NaN" });
  }

  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No Resource Found" });
      } else {
        return rows[0];
      }
    });
}

module.exports = {
  selectArticleById,
  selectAllArticles,
  insertCommentByArticleId,
  selectAllCommentsByArticleId,
  updateArticleById,
  removeCommentByCommentId,
  selectAllUsers,
};
