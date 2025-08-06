const statesRouter = require("express").Router();
const createError = require('http-errors');
//const { createFolder } = require('../helpers/folderhelper');
const { setupQuery } = require('../helpers/dbconn');

//This API is for get all states
statesRouter.post('/allstates', async (req, res, next) => {
    try {
        setupQuery("Select State,StateCode from magod_setup.state_codelist order by State asc", (data) => {
            res.send(data)
        })
    } catch (error) {
        next(error)
    }
});
//This API is for getstatecode
statesRouter.post('/getstatecode', async (req, res, next) => {
    try {
        setupQuery("Select StateCode from magod_setup.state_codelist where State = '" + req.body.statenm + "'", (data) => {
            res.send(data)
        })
    } catch (error) {
        next(error)
    }
});
//This API is for getstatename
statesRouter.post('/getstatename', async (req, res, next) => {
    try {
        setupQuery("Select State from magod_setup.state_codelist where StateCode = '" + req.body.statecd + "'", (data) => {
            res.send(data)
        })
    } catch (error) {
        next(error)
    }
});

module.exports = statesRouter;