const db = require("../db/connection");
function selectAllTopics() {
  return db.query("SELECT * FROM TOPICS").then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No topics found",
      });
    }
    return rows;
  });
}

module.exports = { selectAllTopics };
