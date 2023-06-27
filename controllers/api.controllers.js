const endPoints = require("../endpoints.json")

function getAllApi(req, res){
    console.log({api: endPoints});
    res.status(200).send({api: endPoints})

}

module.exports = {getAllApi}