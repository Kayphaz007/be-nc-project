const { selectArticleById } = require("../models/articles.models");

function getArticleById (req, res, next) {
    const {article_id} = req.params;
    selectArticleById(article_id).then((result)=>{
        res.status(200).send({article: result})
    }).catch((err)=>{
        next(err)
    })
}

module.exports = {getArticleById}