const pdf = require("express").Router();
var createError = require("http-errors");
const req = require("express/lib/request");
const {
  misQuery,
  setupQuery,
  misQueryMod,
  qtnQueryMod,
  setupQueryMod,
} = require("../helpers/dbconn");
const { logger } = require("../helpers/logger");

pdf.get("/getPDFData", async (req, res, next) => {
  const { UnitName } = req.body;

  console.log("UnitName", UnitName);
  
  try {
    setupQueryMod(
      `SELECT * FROM magod_setup.magodlaser_units`,
      // `SELECT * FROM magod_setup.magodlaser_units where UnitName = ${UnitName}`,
      (err, pdfData) => {
        if (err) {
          console.log("err", err);
        } else {
          //   console.log("pdfData", pdfData);
          logger.info("successfully fetched data from magodlaser_units");

          res.send(pdfData);
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = pdf;
