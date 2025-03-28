// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const savePDF = express.Router();

// // Global variable to store the adjustment name
// let globalAdjustmentName = "Default_Name";

// // Ensure the upload directory exists
// const uploadFolder =
//   process.env.FILE_SERVER_PATH || path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder, { recursive: true });
//   console.log(`Upload folder created at: ${uploadFolder}`);
// }

// // Helper function to get formatted date and time
// const getFormattedDateTime = () => {
//   const now = new Date();

//   // Format date as dd-mm-yyyy
//   const day = String(now.getDate()).padStart(2, "0");
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const year = now.getFullYear();

//   // Format time as hh:mm:ss with AM/PM
//   let hours = now.getHours();
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   const seconds = String(now.getSeconds()).padStart(2, "0");
//   const ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12 || 12; // Convert to 12-hour format, replace 0 with 12

//   // Return the formatted date and time string
//   return `${day}-${month}-${year}_${hours}-${minutes}-${seconds} ${ampm}`;
// };

// // API to store the adjustment name globally
// savePDF.post("/set-adjustment-name", (req, res) => {
//   const { adjustment } = req.body;

//   if (!adjustment) {
//     return res.status(400).send({ message: "Adjustment name is required." });
//   }

//   globalAdjustmentName = adjustment;
//   console.log("Global adjustment name set to:", globalAdjustmentName);
//   res.status(200).send({ message: "Adjustment name saved successfully." });
// });

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadFolder); // Save files in the uploads directory
//   },
//   filename: (req, file, cb) => {
//     const dateTime = getFormattedDateTime(); // Get current date and time
//     const ext = path.extname(file.originalname); // Retain the original file extension
//     const fileName = `${globalAdjustmentName}_${dateTime}${ext}`;
//     console.log(`Generated filename: ${fileName}`);
//     cb(null, fileName); // Use global adjustment name in the filename
//   },
// });

// const upload = multer({ storage }).single("file");

// // API endpoint to save the PDF
// savePDF.post("/save-pdf", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.error("File upload error:", err);
//       return res
//         .status(500)
//         .send({ message: "File upload failed", error: err.message });
//     }

//     if (!req.file) {
//       return res.status(400).send({ message: "No file uploaded." });
//     }

//     console.log(`File saved at: ${req.file.path}`);
//     const stats = fs.statSync(req.file.path);
//     console.log(`File size: ${stats.size}`);
//     if (stats.size === 0) {
//       console.error("Uploaded file is empty!");
//     }

//     console.log("Adjustment Name:", globalAdjustmentName); // Log the adjustment name
//     console.log(`File saved to: ${req.file.path}`); // Log the file path

//     res.status(200).send({
//       message: "PDF saved successfully!",
//       filePath: req.file.path,
//     });
//   });
// });

// module.exports = savePDF;

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// require("dotenv").config(); // Load environment variables

// const savePDF = express.Router();
// let globalAdjustmentName = "Default_Name";

// const baseUploadFolder = process.env.FILE_SERVER_PATH?.trim() || path.join(__dirname, "uploads");

// const getFormattedDateTime = () => {
//   const now = new Date();
//   const date = now.toISOString().split("T")[0];
//   const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
//   return `${date}_${time}`;
// };

// // API to store adjustment name globally
// savePDF.post("/set-adjustment-name", (req, res) => {
//   const { adjustment, OrderNo } = req.body;

//   if (!adjustment || !OrderNo) {
//     return res.status(400).send({ message: "Adjustment name and OrderNo are required." });
//   }

//   globalAdjustmentName = adjustment;
//   console.log("Global adjustment name set to:", globalAdjustmentName);

//   const uploadFolder = path.join(baseUploadFolder, "Wo", OrderNo.toString());
//   if (!fs.existsSync(uploadFolder)) {
//     fs.mkdirSync(uploadFolder, { recursive: true });
//   }

//   console.log("Upload folder created/exists:", uploadFolder);

//   res.status(200).send({ message: "Adjustment name saved successfully.", uploadFolder });
// });

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const orderPath = path.join(baseUploadFolder, "Wo", req.body.OrderNo?.toString() || "Default");
//     if (!fs.existsSync(orderPath)) {
//       fs.mkdirSync(orderPath, { recursive: true });
//     }
//     cb(null, orderPath);
//   },
//   filename: (req, file, cb) => {
//     const dateTime = getFormattedDateTime();
//     const ext = path.extname(file.originalname);
//     cb(null, `${globalAdjustmentName}_${dateTime}${ext}`);
//   },
// });
// const upload = multer({ storage }).single("file");

// // API endpoint to save the PDF
// savePDF.post("/save-pdf", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(500).send({ message: "File upload failed", error: err });
//     }

//     if (!req.file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     console.log("File saved to:", req.file.path);
//     res.status(200).send({ message: "PDF saved successfully!", filePath: req.file.path });
//   });
// });

// module.exports = savePDF;

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createFolder } = require("../helpers/folderhelper");
require("dotenv").config();
let OrderNOO;
let SchNoo;
let globalAdjustmentName;

const savePDF = express.Router();
// let globalAdjustmentName = "Default_Name";

const baseUploadFolder =
  process.env.FILE_SERVER_PATH?.trim() || "C:/Magod/Jigani"; // Ensure this is set correctly

const getFormattedDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  return `${date}_${time}`;
};

// API to store adjustment name globally
savePDF.post("/set-adjustment-name", (req, res) => {
  const { adjustment, OrderNo, SchNo } = req.body;

  console.log("OrderNo", OrderNo);
  console.log("adjustment", adjustment);
  console.log("SchNo", SchNo);
  if (SchNo) {
    console.log("entereddd");

    createFolder("Schedule", SchNo, "");
  }
  OrderNOO = req.body.OrderNo;
  SchNoo = req.body.SchNo;

  if (!adjustment || !OrderNo) {
    return res
      .status(400)
      .send({ message: "Adjustment name and OrderNo are required." });
  }

  globalAdjustmentName = adjustment;
  console.log("Global adjustment name set to:", globalAdjustmentName);

  // const uploadFolder = path.join(baseUploadFolder, "Wo", OrderNo.toString());
  // if (!fs.existsSync(uploadFolder)) {
  //   fs.mkdirSync(uploadFolder, { recursive: true });
  // }
  // if(SchNo){
  //     const uploadFolder = path.join(
  //       baseUploadFolder,
  //       "Wo",
  //       OrderNo.toString(),SchNo.toString()
  //     );
  //     if (!fs.existsSync(uploadFolder)) {
  //       fs.mkdirSync(uploadFolder, { recursive: true });
  //     }
  // }

  // console.log("Upload folder created/exists:", uploadFolder);
  let uploadFolder = path.join(baseUploadFolder, "Wo", OrderNo.toString());

  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  if (SchNo) {
    uploadFolder = path.join(
      baseUploadFolder,
      "Wo",
      OrderNo.toString(),
      SchNo.toString()
    );

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
  }

  console.log("Upload folder created/exists:", uploadFolder);

  res
    .status(200)
    .send({ message: "Adjustment name saved successfully.", uploadFolder });
});

// console.log("OrderNOO",OrderNOO);

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Debugging Log
//     console.log("Received req.body:", req.body);

//     const orderNo = req.body.OrderNo || req.query.OrderNo;  // Handle both cases
//     console.log("Extracted OrderNo:", orderNo);

//     if (!orderNo) {
//       return cb(new Error("OrderNo is required to save the file."), null);
//     }

//     const orderPath = path.join(baseUploadFolder, "Wo", orderNo.toString());

//     if (!fs.existsSync(orderPath)) {
//       fs.mkdirSync(orderPath, { recursive: true });
//     }

//     cb(null, orderPath);
//   },
//   filename: (req, file, cb) => {
//     const dateTime = getFormattedDateTime();
//     const ext = path.extname(file.originalname);
//     cb(null, `Packing_Note_${dateTime}${ext}`);
//   },
// });
// const upload = multer({ storage }).single("file");

// // API endpoint to save the PDF
// savePDF.post("/save-pdf", (req, res) => {
//   upload(req, res, (err) => {
//     console.log("formData", req.body.formData);

//     if (err) {
//       console.error("File upload error:", err);
//       return res.status(500).send({ message: "File upload failed", error: err });
//     }

//     if (!req.file) {
//       console.error("No file uploaded.");
//       return res.status(400).send("No file uploaded.");
//     }

//     console.log("File saved to:", req.file.path);
//     res.status(200).send({ message: "PDF saved successfully!", filePath: req.file.path });
//   });
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("Received req.body:", req.body);
//     console.log("OrderNOO======================", OrderNOO);

//     // Multer does not populate req.body automatically for form-data, so use req.query as a fallback
//     // const orderNo = req.body.OrderNo || req.query.OrderNo;
//     const orderNo = OrderNOO;

//     console.log("Extracted OrderNo:", orderNo);

//     if (!orderNo) {
//       return cb(new Error("OrderNo is required to save the file."), null);
//     }

//     // const orderPath = path.join(baseUploadFolder, "Wo", orderNo.toString());
//     const orderPath = path.join(baseUploadFolder, "Wo", OrderNOO.toString());

//     if (!fs.existsSync(orderPath)) {
//       fs.mkdirSync(orderPath, { recursive: true });
//     }
//     if (SchNoo){
//       const orderPath = path.join(baseUploadFolder, "Wo", OrderNOO.toString(),SchNoo.toString());
// fs.mkdirSync(orderPath, { recursive: true });
//     } cb(null, orderPath);
//   },
//   filename: (req, file, cb) => {
//     const dateTime = getFormattedDateTime();
//     const ext = path.extname(file.originalname);
//     // cb(null, `${globalAdjustmentName}_${dateTime}${ext}`);
//     cb(null, `${globalAdjustmentName}${ext}`);
//   },
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Received req.body:", req.body);
    console.log("OrderNOO======================", OrderNOO);

    // Ensure OrderNOO is available
    const orderNo = OrderNOO;
    const schNo = req.body.SchNo || req.query.SchNo; // Extract SchNo properly

    console.log("Extracted OrderNo:", orderNo);
    console.log("Extracted SchNo:", schNo);

    if (!orderNo) {
      return cb(new Error("OrderNo is required to save the file."), null);
    }

    // Base folder for the order
    let orderPath = path.join(baseUploadFolder, "Wo", orderNo.toString());

    // Ensure the base folder exists
    if (!fs.existsSync(orderPath)) {
      fs.mkdirSync(orderPath, { recursive: true });
    }

    // If SchNo exists, append it to the path
    if (SchNoo) {
      orderPath = path.join(orderPath, SchNoo.toString());

      // Ensure the schedule folder exists
      if (!fs.existsSync(orderPath)) {
        fs.mkdirSync(orderPath, { recursive: true });
      }
    }

    console.log("Final file save path:", orderPath);
    cb(null, orderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${globalAdjustmentName}${ext}`);
  },
});

savePDF.post("/save-pdf", (req, res) => {
  console.log("reqqqq", req.body);

  const upload = multer({ storage }).single("file");

  upload(req, res, (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res
        .status(500)
        .send({ message: "File upload failed", error: err });
    }

    console.log("Received req.body:", req.body); // Ensure OrderNo is received
    // const orderNo = req.body.OrderNo;  // Extract after multer has processed form fields
    const orderNo = OrderNOO; // Extract after multer has processed form fields

    if (!orderNo) {
      console.error("OrderNo is missing in request.");
      return res.status(400).send({ message: "OrderNo is required." });
    }

    console.log("File saved to:", req.file.path);
    res
      .status(200)
      .send({ message: "PDF saved successfully!", filePath: req.file.path });
  });
});

module.exports = savePDF;
