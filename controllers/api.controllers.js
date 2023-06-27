const endPoints = require("../endpoints.json")

function getAllApi(req, res){
    res.status(200).send({api: endPoints})

}

module.exports = {getAllApi}