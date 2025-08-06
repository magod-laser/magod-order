const mtrlsourceRouter = require("express").Router();
const createError = require('http-errors');
const { setupQuery } = require('../helpers/dbconn');

// This API is for allmtrlsources
mtrlsourceRouter.post('/allmtrlsources', async (req, res, next) => {
    try {
        setupQuery("SELECT * FROM magod_setup.mtrlsource order by MtrlSource asc", (data) => {
            res.send(data)
        })
    } catch (error) {
        next(error)
    }
});

module.exports = mtrlsourceRouter;