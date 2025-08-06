const mailRouter = require("express").Router();
var createError = require("http-errors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { sendQuotation, sendAttachmails } = require("../helpers/sendmail");

// This API is for sendmail
mailRouter.post("/sendmail", async (req, res, next) => {
  try {
    const { customer, qtnDetails, qtnTC } = req.body;
    sendQuotation(customer, qtnDetails, qtnTC, (err, data) => {
      if (err) return createError(500, err);
      else res.send({ status: "success", data });
    });
  } catch (error) {
    next(error);
  }
});

// This API is for sendDirectMail with attachment
mailRouter.post(
  "/sendDirectMail",
  upload.single("file"),
  async (req, res, next) => {
    try {
      const { toAddress, ccAddress, subjectLine, mailBody } = req.body;
      sendAttachmails(
        toAddress,
        ccAddress,
        subjectLine,
        mailBody,
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
        (data) => {
          res.send({ status: "success" });
          console.log(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mailRouter;
