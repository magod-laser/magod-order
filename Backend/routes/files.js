/** @format */

const fileRouter = require("express").Router();
// var exists = require("fs-exists-sync");
var createError = require("http-errors");
const fsSync = require("fs");
const fsAsync = require('fs').promises;
const multer = require("multer");
const { copyfiles } = require("../helpers/folderhelper");
// const JSONStream = require("JSONStream");
const path = require("path");
const { misQueryMod } = require("../helpers/dbconn");
const CustomStorageEngine = require("../helpers/storageEngine");

// const basefolder='C:\\Magod\\Jigani';
const basefolder = process.env.FILE_SERVER_PATH;

var storage = new CustomStorageEngine({
	destination: function (req, file, cb) {
		console.log(req.headers["destinationpath"]);
		console.log(basefolder + req.headers["destinationpath"]);
		cb(null, basefolder + req.headers["destinationpath"]);
	},
});

const upload = multer({ storage: storage });

fileRouter.post("/uploaddxf", upload.array("files"), function (req, res, next) {
	console.log(" Upload DXF ");
	console.log(req.files);
	res.send({ status: "success" });
});

fileRouter.post("/getdxf", async (req, res, next) => {
	try {
		const { dxfname } = req.body;
		//  const { frompath } = req.body.frompath;
		//       console.log(dxfname);
		let content = fsSync.readFileSync("uploads/" + dxfname);
		//    let content = fs.readFileSync(basefolder + "\\" + frompath+"\\" + dxfname);
		res.send(content);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

fileRouter.get("/orddxf", async (req, res, next) => {
	console.log(" Order DXF ");
	try {
		const { dxfName, srcPath } = req.query;
		if (!dxfName) {
			throw createError(400, "DXF Name is required");
		}
		if (!srcPath) {
			throw createError(400, "Source Path is required");
		}
		const path = require('path');
		let basefolder = process.env.FILE_SERVER_PATH;
		 const filePath = path.join(basefolder, srcPath, dxfName);
		//let filePath = basefolder + srcPath + dxfName;
		/////////////////////////////////////////////
		// let content = "";
		// fs.readdir(filePath, (err, dxfName) => {
		//     if (err) {
		//         console.error('Error reading the folder:', err);
		//     }

		// if (path.extname(dxfName).toLowerCase() === '.dxf') {
		//     try {
		//     content = fs.readFileSync(filePath, 'utf8');
		//     } catch (error) {
		//         console.log(error);
		//         next(error)
		//     }
		// } else {

		// fs.renameSync("uploads/" + dxfName, filePath);
		// content = fs.readFileSync(filePath, 'utf8');
		// // }
		// res.send(content);
		//  });

		/////////////////////////////////////////////
		console.log("basefolder :", basefolder + srcPath + dxfName);
		console.log(filePath);
		let content = fsSync.readFileSync(filePath); // basefolder + srcPath + dxfName);
		//let content = fs.readFileSync(basefolder + srcPath + dxfName);
		if (!content) {
			throw createError(404, "DXF not found");
		}
		res.send(content);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

fileRouter.post("/tocopydxfforselected", async (req, res, next) => {
	console.log(" Copy DXF for Selected ");
	try {
		const { OrderNo, Dwglist } = req.body;
		console.log(OrderNo);
		console.log(Dwglist);
		let basefolder = process.env.FILE_SERVER_PATH;
		let basefoldr = basefolder + "\\Wo\\" + OrderNo + "\\DXF\\";

		misQueryMod(
			`SELECT O.Order_No, C.Cust_name,C.DwgLoc FROM magodmis.order_list O
                     INNER JOIN magodmis.cust_data c ON O.Cust_Code = C.Cust_Code
                     Where O.Order_No = '${OrderNo}'`,
			(err, cdata) => {
				if (err) {
					console.log(err);
				} else {
					let custfoldr =
						basefolder + "\\CustDwg\\" + cdata[0].DwgLoc + "\\DXF";
					// If folder exists in custDwg folder
					if (!fsSync.existsSync(custfoldr)) {
						res.send({
							status: "error",
							message:
								"Customer Drawing Folder does not exist, create it and update in Cust Information",
						});
						return;
					}
					for (let i = 0; i < Dwglist.length; i++) {
						fsSync.renameSync(
							"uploads/" + Dwglist[i].DwgName,
							basefoldr + Dwglist[i].DwgName
						);
					}
					res.send({ status: "success", message: "Files copied successfully" });
				}
			}
		);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// fileRouter.post("/checkdxf", async (req, res, next) => {
// 	console.log(" Check Dxf ");
// 	try {
// 		//  const { docno, drawfiles } = req.body;
// 		const docno = req.body.OrderNo;
// 		// let chkdxf = false;

// 		//  console.log(req.body.drawfiles);
// 		let basefolder = process.env.FILE_SERVER_PATH;

// 		basefolder = basefolder + "\\Wo\\" + docno + "\\DXF\\";

// 		fs.readdir(basefolder, (err, files) => {
// 			if (err) {
// 				console.error("Error reading the folder:", err);
// 				//    chkdxf = false;
// 			}

// 			// Filter the files to find any with the .dxf extension
// 			const dxfFiles = files.filter(
// 				(file) => path.extname(file).toLowerCase() === ".dxf"
// 			);

// 			// Check if any .dxf files were found
// 			if (dxfFiles.length > 0) {
// 				console.log(".dxf files found:", dxfFiles);
// 				//    chkdxf = true;
// 			} else {
// 				console.log("No .dxf files found in the folder.");
// 				//   chkdxf = false;
// 			}
// 			res.send(dxfFiles);
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		next(error);
// 	}
// });
/////////////////////////////////////////////////////
// Local Copying of DXF files

//const fs = require("fs").promises;

// fileRouter.post("/checkdxf", async (req, res, next) => {
//   console.log(" Check Dxf ");
//   try {
//     const docno = req.body.orderno;
//     let basefolder = process.env.FILE_SERVER_PATH + "\\Wo\\" + docno + "\\DXF\\";

//     console.log("Base Folder Path:", basefolder);

//     const files = await fs.readdir(basefolder);
//     const dxfFiles = files.filter((file) => path.extname(file).toLowerCase() === ".dxf");

//     if (dxfFiles.length > 0) {
//       console.log(".dxf files found:", dxfFiles);
//     } else {
//       console.log("No .dxf files found in the folder.");
//     }
//     res.send(dxfFiles);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("An error occurred");
//   }
// });

fileRouter.post("/checkdxf", async (req, res, next) => {
	try {
		const docno = req.body.orderno;
		let basefolder = process.env.FILE_SERVER_PATH + "\\Wo\\" + docno + "\\DXF\\";
		console.log("Base Folder Path:", basefolder);

		const files = await fsAsync.readdir(basefolder);
		const dxfFiles = files; //.filter((file) => path.extname(file).toLowerCase() === ".dxf");

		//res.send(dxfFiles);
		if (dxfFiles.length > 0) {
			res.send({message:"Preent"});
		} else {
			res.send({message:"Not Present"});
		}

	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("An error occurred");
	}
});

fileRouter.post("/copydxf", async (req, res, next) => {
	console.log(" Copy Dxf ");
	console.log(req.body.Dwg);
	try {
		let files = req.body.Dwg;
		let destination = req.body.destPath;
		//  console.log(req.body.files[0].);
		// console.log("uploads/" + filename);
		console.log(basefolder + destination);
		let srcfolder = "uploads\\" + files;
		let destdir = basefolder + destination;
		let destfolder = path.join(destdir, files);
		console.log(srcfolder);
		console.log(destfolder);
		fsSync.copyFile(srcfolder, destfolder, (err) => {
			if (err) {
				console.error("Error during file copy:", err);
				res.status(500).send;
			} else {
				console.log("File copied successfully");
				res.send({ status: "success" });
			}
		});

		// fs.renameSync("uploads\\" + files, basefolder + destination + files); // files[0].DwgName);
		// copyfiles(filename, basefolder + destination + '\\' + filename, (err, result) => {
		//     if (err) {
		//         res.status(500).send(err);
		//         console.log(err);
		//     } else {
		//         res.send({ status: 'success' });
		//     }
		// });
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// Order Copy Dxf File
fileRouter.post("/ordcopydxf", async (req, res, next) => {
	console.log(" Ord Copy Dxf ");
	console.log("custdwgname : ",req.body.custdwgname);
	try {
		let files = req.body.custdwgname;
		let sourcefld = path.join(req.body.srcfolder,'\\',files);
		let destinationfld = path.join(req.body.destfolder,'\\',files);
	//	console.log(basefolder + destination);
		//let srcfolder = "uploads\\" + files;
		//let destdir = basefolder + destination;
		//let destfolder = path.join(destdir, files);
	//	console.log(srcfolder);
	//	console.log(destfolder);
		fsSync.copyFile(sourcefld, destinationfld, (err) => {
			if (err) {
				console.error("Customer Drawing folder does not exist. Error during file copy:", err);
				res.send({status: "Customer Drawing folder does not exist. Create it and update in Cust Information"});
			} else {
				console.log("File copied successfully");
				res.send({ status: "success" });
			}
		});

		// fs.renameSync("uploads\\" + files, basefolder + destination + files); // files[0].DwgName);
		// copyfiles(filename, basefolder + destination + '\\' + filename, (err, result) => {
		//     if (err) {
		//         res.status(500).send(err);
		//         console.log(err);
		//     } else {
		//         res.send({ status: 'success' });
		//     }
		// });
	} catch (error) {
		console.log(error);
		next(error);
	}
});

fileRouter.post("/getfolderfilenames", async (req, res) => {
	console.log(" Get Folder File Names ");
	let filedetails = [];
	try {
		let path = basefolder + req.body.destPath;

		const directoryPath = path; // '/path/to/your/directory';

		// Step 2: Get all file names in the directory
		const files = fsSync
			.readdirSync(directoryPath, { withFileTypes: true })
			.filter((dirent) => dirent.isFile()) // Only include files, not directories
			.map((dirent) => {
				const filePath = directoryPath + dirent.name;
				const stats = fsSync.statSync(filePath); // Get file information including size
				return {
					name: dirent.name,
					size: stats.size, // Size in bytes
				};
			});
		// Step 3: Read each file's content (optional)
		files.forEach((file) => {
			const filePath = directoryPath + file.name;
			const content = fsSync.readFileSync(filePath, "utf8"); // Read the file content
			// console.log(`Content of ${file.name}:`);
			//  console.log(content);
			filedetails = [
				...filedetails,
				{
					name: file.name,
					fcontent: content,
					size: (file.size / 1024).toFixed(2) + " KB",
				},
			];
		});

		res.send(filedetails);
	} catch (error) {
		console.log(error);
		//       next(error);
	}
});

fileRouter.post(`/getfolderfiles`, async (req, res, next) => {
	console.log("getfolderfiles : " + basefolder + req.body.FolderName);
	console.log(req.body);
	try {
		const { FolderName } = req.body;
		let content = fsSync.readdirSync(basefolder + FolderName);
		res.send(content);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

fileRouter.post("/getdxfnames", async (req, res) => {
	console.log(" Get DXF Names ");
	console.log(req.body);
	let basefolder = process.env.FILE_SERVER_PATH;
	console.log("basefolder : " + basefolder);
	//const path = basefolder + req.body.filepath;
	const paths = path.join(basefolder, req.body.destPath);
	console.log(paths);
	let content = fsSync.readdirSync(paths);
	console.log(content);
	res.send({ files: content });
});

fileRouter.get("/orddxf", async (req, res, next) => {
	console.log(" Order DXF ");
	try {
		const { dxfName, srcPath } = req.query;
		if (!dxfName) {
			throw createError(400, "DXF Name is required");
		}
		if (!srcPath) {
			throw createError(400, "Source Path is required");
		}
		let basefolder = process.env.FILE_SERVER_PATH;
		// const filePath = path.join(basefolder, srcPath, dxfName);
		let filePath = basefolder + srcPath + dxfName;
		/////////////////////////////////////////////
		// let content = "";
		// fs.readdir(filePath, (err, dxfName) => {
		//     if (err) {
		//         console.error('Error reading the folder:', err);
		//     }

		// if (path.extname(dxfName).toLowerCase() === '.dxf') {
		//     try {
		//     content = fs.readFileSync(filePath, 'utf8');
		//     } catch (error) {
		//         console.log(error);
		//         next(error)
		//     }
		// } else {

		// fs.renameSync("uploads/" + dxfName, filePath);
		// content = fs.readFileSync(filePath, 'utf8');
		// // }
		// res.send(content);
		//  });

		/////////////////////////////////////////////
		console.log("basefolder :", basefolder + srcPath + dxfName);
		console.log(filePath);
		let content = fsSync.readFileSync(filePath); // basefolder + srcPath + dxfName);
		if (!content) {
			throw createError(404, "DXF not found");
		}
		res.send(content);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

fileRouter.post('/getfolderfilenames', async (req, res) => {

	let filedetails = [];
	try {

		let path = basefolder + req.body.destPath;
		const directoryPath = path; // '/path/to/your/directory';

		// Step 2: Get all file names in the directory
		const files = fsSync.readdirSync(directoryPath, { withFileTypes: true })
			.filter(dirent => dirent.isFile()) // Only include files, not directories
			.map(dirent => {
				const filePath = directoryPath + dirent.name;
				const stats = fsSync.statSync(filePath); // Get file information including size
				return {
					name: dirent.name,
					size: stats.size // Size in bytes
				};
			});
		console.log('Files with sizes:');
		files.forEach(file => {
			``
			console.log(`${file.name}: ${file.size} bytes`);
		});

		// Step 3: Read each file's content (optional)
		files.forEach(file => {
			const filePath = directoryPath + file.name;
			const content = fsSync.readFileSync(filePath, 'utf8'); // Read the file content
			// console.log(`Content of ${file.name}:`);
			//  console.log(content);
			filedetails = [...filedetails, { name: file.name, fcontent: content, size: (file.size / 1024).toFixed(2) + ' KB' }];
		});



		//     const directoryPath = path; // '/some/directory/path';
		//     const files = fs.readdirSync(directoryPath, { withFileTypes: true })
		//                    .filter(item => !item.isDirectory())
		//                    .map(item => item.name);
		//   //  res.json(files);

		//     for (let i = 0; i < files.length; i++) {
		//         let fpath = path + files[i].name;
		//         await fs.stat(fpath, (err, stats) => {
		//             if (err) {
		//                 console.error(err);
		//                 return;
		//             }
		//             //   respdata.push({ name: data[i].name, size: (stats.size / 1024).toFixed(2) + ' KB' });
		//             //   console.log(data[i].name +'|| ' +(stats.size/1024).toFixed(2) + ' KB');
		//             filedetails = [...filedetails, { name: files[i].name, size: (stats.size / 1024).toFixed(2) + ' KB' }];
		//             // stats.isFile(); // true
		//             // stats.isDirectory(); // false
		//             // stats.isSymbolicLink(); // false
		//             // stats.size; // 1024000 //= 1MB
		//             //   filedetails = [...filedetails, { name: data[i].name, size: (stats.size / 1024).toFixed(2) + ' KB' }];
		//               console.log(filedetails);
		//         });
		//   }
		console.log(filedetails);
		res.send(filedetails);
	} catch (error) {
		console.log(error);
		//       next(error);
	}
});


module.exports = fileRouter;
