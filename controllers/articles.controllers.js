const { insertCommentByArticleId } = require("../models/articles.models");
const { selectAllArticles } = require("../models/articles.models");
const { selectArticleById } = require("../models/articles.models");

function getAllArticles(req, res, next){
    selectAllArticles().then((result)=>{
        res.status(200).send({articles: result})
    })
}
function getArticleById (req, res, next) {
    const {article_id} = req.params;
    selectArticleById(article_id).then((result)=>{
        res.status(200).send({article: result})
    }).catch((err)=>{
        next(err)
    })
}

function postCommentByArticleId(req, res, next){
    const {article_id} = req.params;
    const msg = req.body;
    insertCommentByArticleId(article_id, msg).then((result)=>{
        res.status(201).send({comment: result})
    }).catch((err)=>{next(err)})
}

module.exports = {getArticleById, getAllArticles, postCommentByArticleId}