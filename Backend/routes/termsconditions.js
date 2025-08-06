const termsconditionsRouter = require("express").Router();
var createError = require('http-errors');
const { qtnQuery } = require('../helpers/dbconn');

//This API is for alltermsconditions
termsconditionsRouter.post('/alltermsconditions', async (req, res, next) => {
    try {
        qtnQuery("Select * from magodqtn.terms_and_conditions order by ID asc", (data) => {
            res.send(data)
        })
    } catch (error) {
        next(error)
    }
});

module.exports = termsconditionsRouter