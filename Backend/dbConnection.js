/** @format */

const express = require("express");

const app = express();

const cors = require("cors");

const mysql = require("mysql2");

const bodyParser = require("body-parser");
const { logger } = require("./helpers/logger");
const { setupQuery, setupQueryMod } = require("./helpers/dbconn");
const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: 3306,
	database: "magodmis",
});


// veeranna 

app.use(cors());

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser());

app.listen(process.env.PORT, () => {
	console.log("server running on port 4056");
});

//login

app.post(`/login`, async (req, res, next) => {
	try {
		console.log("login");
		const username = req.body.username;
		const passwd = req.body.password;

		let passwrd = CryptoJS.SHA512(req.body.password);
		console.log(passwrd);
		if (!username || !passwrd) res.send(createError.BadRequest());

		setupQueryMod(
			`Select usr.Name, usr.UserName,usr.Password,usr.Role, unt.UnitName,usr.ActiveUser from magod_setup.magod_userlist usr
		left join magod_setup.magodlaser_units unt on unt.UnitID = usr.UnitID WHERE usr.UserName = '${username}' and usr.ActiveUser = '1'`,
			async (err, d) => {
				if (err) logger.error(err);
				let data = d;
				if (data.length > 0) {
					if (data[0]["Password"] == passwrd) {
						delete data[0]["Password"];

						setupQueryMod(
							`Select m.MenuUrl,ModuleId  from magod_setup.menumapping mm
				left outer join magod_setup.menus m on m.Id = mm.MenuId
				where mm.Role = '${data[0]["Role"]}' and mm.ActiveMenu = '1'`,
							async (err, mdata) => {
								if (err) logger.error(err);
								let menuarray = [];
								mdata.forEach((element) => {
									menuarray.push(element["MenuUrl"]);
								});
								const moduleIds = [
									...new Set(
										mdata
											.map((menu) => menu.ModuleId)
											.filter((id) => id !== null)
									),
								];
								let accessToken = await signAccessToken(data[0]["UserName"]);
								res.send({
									accessToken: accessToken,
									data: { ...data, access: menuarray },
									moduleIds: moduleIds,
									// access: menuarray,
								});
								logger.info(`Login Success - ${data[0]["UserName"]}`);
							}
						);
					} else {
						res.send(createError.Unauthorized("Invalid Username/Password"));
						logger.error(`Login Failed - ${username} IP : ${req.ip}`);
					}
				} else {
					res.send(createError.Unauthorized("Invalid Username/Password"));
					logger.error(`Login Failed - ${username} IP : ${req.ip}`);
				}

				//      res.send({...data, decPass, encrypted: encrypted.toString(), decrypted: decrypted.toString(CryptoJS.enc.Utf8)});
			}
		);

		// res.send(createError.Unauthorized("Invalid Username/Password"))
	} catch (error) {
		next(error);
		logger.error(`Error - ${error}`);
	}
});

// New endpoint to fetch menu URLs
app.post("/fetchMenuUrls", async (req, res, next) => {
	try {
		const { role, username } = req.body;
	//	console.log("req.body", req.body);
		if (!role || !username) return res.send(createError.BadRequest());

		setupQueryMod(
			`Select usr.Name, usr.UserName,usr.Password,usr.Role, unt.UnitName,usr.ActiveUser from magod_setup.magod_userlist usr
		left join magod_setup.magodlaser_units unt on unt.UnitID = usr.UnitID WHERE usr.UserName = '${username}' and usr.ActiveUser = '1'`,
			async (err, d) => {
				if (err) logger.error(err);
				let data = d;
				if (data.length > 0) {
					setupQueryMod(
						`Select m.MenuUrl,ModuleId  from magod_setup.menumapping mm
				left outer join magod_setup.menus m on m.Id = mm.MenuId
				where mm.Role = '${data[0]["Role"]}' and mm.ActiveMenu = '1'`,
						async (err, mdata) => {
							if (err) logger.error(err);
							let menuarray = [];
							mdata.forEach((element) => {
								menuarray.push(element["MenuUrl"]);
							});
							const moduleIds = [
								...new Set(
									mdata.map((menu) => menu.ModuleId).filter((id) => id !== null)
								),
							];
							res.send({
								data: { ...data, access: menuarray },
								moduleIds: moduleIds,
							});
						}
					);
				} else {
					res.send(createError.Unauthorized("Invalid Username"));
					logger.error(` Failed - ${username} IP : ${req.ip}`);
				}
			}
		);
	} catch (error) {
		next(error);
		logger.error(`Error - ${error}`);
	}
});





app.get("/getMtrlTypeList", (req, res) => {
	db.query(
		"SELECT * FROM magodmis.mtrl_typeslist m  ORDER BY m.`Material`;",
		(err, result) => {
			if (err) {
				console.log("error", err);
				return res.json({ error: "err in sql query" });
			} else {
				//  console.log("result", result);
				return res.json({ status: "success", result: result });
			}
		}
	);
});

app.post("/getMtrlGradeData", (req, res) => {
	//console.log("res",req.body);
	console.log("REQ==============", req.body.material);

	// db.query(
	//   `SELECT m.*,m1.MtrlId FROM magodmis.MtrlGrades m,magodmis.Mtrl_typesList m1 WHERE m.Material='${req.body.material}' GROUP BY Grade Order By m.MtrlGradeId;`,(err, response)=>{
	//     console.log('res', response);
	//     res.send(response)
	//   }
	// )
	db.query(
		`SELECT m.*, MAX(m1.MtrlID) AS MtrlID 
    FROM magodmis.MtrlGrades m, magodmis.Mtrl_typesList m1 
    WHERE m.Material='${req.body.material}'
    GROUP BY m.Grade, m.MtrlGradeID
    ORDER BY m.MtrlGradeId;`,
		(err, response) => {
			console.log("res", response);
			res.send(response);
		}
	);
});

app.post("/submitMaterialGradeForm", (req, res) => {
	const { mgId, grade, specificWeight, exciseClNo, m } = req.body;
	console.log("result", req.body)
	db.query(
		`INSERT INTO magodmis.mtrlgrades (Material, Grade, MtrlGradeID, Specific_Wt, Excise_Cl_No) VALUES ('${req.body.formData.m}','${req.body.formData.grade}','${req.body.formData.mgId}',
  '${req.body.formData.specificWeight}','${req.body.formData.exciseClNo}')`,
		(err, response) => {
			if (err) {
				console.error("Error inserting data into the database:", err);
				return res.status(500).json({ error: "Enter valid data" });
			} else {
				// sending data to refresh the table 
				db.query(`SELECT m.*, MAX(m1.MtrlID) AS MtrlID FROM magodmis.MtrlGrades m, magodmis.Mtrl_typesList m1 
				WHERE m.Material='${req.body.formData.m}'	GROUP BY m.Grade, m.MtrlGradeID	ORDER BY m.MtrlGradeId;`,
					(err, response1) => {
						console.log("res", response1);
						return res.status(200).json({
							message: `${req.body.formData.grade} Added to Grade List`,
							response1:response1
						});
						// return res.status(200).json({ message: "Data inserted successfully" },response1);
						// return res.send({message: "Data inserted successfully"}, response1);
						// return res.send( response1);
					}
				);

				console.log("Data inserted successfully");
				// return res.status(200).json({ message: "Data inserted successfully" });
			}
		}
	);
});
app.post("/submitSecondForm", (req, res) => {
	const {
		mtrlGradeId,
		shape,
		mtrlCode,
		mtrlType,
		StaticPara1,
		StaticPara2,
		StaticPara3,
	} = req.body;
	//console.log("Received Data:", req.body);
	console.log("req=StaticPara1:", req.body.formData.StaticPara1);
	console.log("req=StaticPara2:", req.body.formData.StaticPara2);
	console.log("req=StaticPara3:", req.body.formData.StaticPara3);
	

const staticPara1 = req.body.formData.StaticPara1 === ""  ? 0.0 : parseFloat(req.body.formData.StaticPara1);
const staticPara2 = req.body.formData.StaticPara2 === "" ? 0.0 : parseFloat(req.body.formData.StaticPara2);
const staticPara3 = req.body.formData.StaticPara3 === "" ? 0.0 : parseFloat(req.body.formData.StaticPara3);

console.log("staticPara1",staticPara1);
console.log("staticPara2",staticPara2);
console.log("staticPara3",staticPara3);

	db.query(
		`Insert Into magodmis.Mtrl_data(MtrlGradeID, Shape, Mtrl_Type,mtrl_code,StaticPara1,StaticPara2,StaticPara3) Values('${req.body.formData.mtrlGradeId}','${req.body.formData.shape}','${req.body.formData.mtrlType}',
  '${req.body.formData.mtrlCode}','${staticPara1}','${staticPara2}','${staticPara3}')`,
		(err, response) => {
			if (err) {
				console.error("Error inserting data into the database:", err);
				return res.status(500).json({ error: "Enter valid data" });
			} else {
				db.query(
					`SELECT Mtrl_Code FROM magodmis.mtrl_data WHERE MtrlGradeID='${req.body.formData.mtrlGradeId}' AND Shape='${req.body.formData.shape}' ORDER BY Mtrl_Code;`,
					(err, response1) => {
						console.log('res1====', response1);
						// res.send(response1);

						console.log("Data inserted successfully");
				return res.status(200).json({
					message: `${req.body.formData.mtrlCode} Added to Material List`,
					response1:response1
				});
					}
				);
				// console.log("Data inserted successfully");
				// return res.status(200).json({
				// 	message: `${req.body.formData.mtrlCode} Added to Material List`,
				// });
			}
		}
	);
});

app.post("/getMtrlCode", (req, res) => {
	const { MGI, S } = req.body;
	//console.log("Received Data",req.body);
	// db.query(`SELECT Mtrl_code FROM mydb.mtrlcode WHERE MG_id ='${req.body.Data.MGI}' AND Shape = '${req.body.Data.S}')`,
	//   (err, result) => {
	//     if (err) {
	//       console.error("Error retrieving Mtrl Code:", err);
	//       return res.status(500).json({ error: "Internal server error" });
	//     } else {
	//       console.log("Mtrl Code retrieved successfully");
	//       return res.status(200).json({ result });
	//     }
	//   }
	// );
	db.query(
		`SELECT Mtrl_Code FROM magodmis.mtrl_data WHERE MtrlGradeID='${req.body.Data.MGI}' AND Shape='${req.body.Data.S}' ORDER BY Mtrl_Code;`,
		(err, response) => {
			// console.log('res', response);
			res.send(response);
		}
	);
});


app.post("/checkMtrlCode", (req, res) => {
	// Write the SQL query to retrieve the shape data
	console.log("entring into the checkMtrlCode PAI");
	console.log("req===",req.body);
	
	db.query(`SELECT * FROM magodmis.mtrl_data where Mtrl_Code = '${req.body.totalfield}'`,(err, response) => {

		console.log("response===",response);
		
		
		
		res.send(response);
	});
});

// 	 // Extract the shape data from the query results
// 		const shapes = results.map((result) => result.Shape);

// 		// Send the shape data as a response to the frontend
// 		return res.status(200).json(shapes);
// 	});
// });



app.get("/getShapes", (req, res) => {
	// Write the SQL query to retrieve the shape data
	const sql = "SELECT * FROM magodmis.Shapes;";

	// Execute the SQL query
	db.query(sql, (err, results) => {
		if (err) {
			console.error("Error fetching shape data:", err);
			return res.status(500).json({ error: "Internal server error" });
		}

		// Extract the shape data from the query results
		const shapes = results.map((result) => result.Shape);

		// Send the shape data as a response to the frontend
		return res.status(200).json(shapes);
	});
});

app.post(`/login`, async (req, res, next) => {
	try {
		console.log("login");
		const username = req.body.username;
		const passwd = req.body.password;

		let passwrd = CryptoJS.SHA512(req.body.password);
		console.log(passwrd);
		if (!username || !passwrd) res.send(createError.BadRequest());

		setupQueryMod(
			`Select usr.Name, usr.UserName,usr.Password,usr.Role, unt.UnitName,usr.ActiveUser from magod_setup.magod_userlist usr
        left join magod_setup.magodlaser_units unt on unt.UnitID = usr.UnitID WHERE usr.UserName = '${username}' and usr.ActiveUser = '1'`,
			async (err, d) => {
				if (err) logger.error(err);
				let data = d;
				if (data.length > 0) {
					if (data[0]["Password"] == passwrd) {
						delete data[0]["Password"];

						setupQueryMod(
							`Select m.MenuUrl,ModuleId  from magod_setup.menumapping mm
                left outer join magod_setup.menus m on m.Id = mm.MenuId
                where mm.Role = '${data[0]["Role"]}' and mm.ActiveMenu = '1'`,
							async (err, mdata) => {
								if (err) logger.error(err);
								let menuarray = [];
								mdata.forEach((element) => {
									menuarray.push(element["MenuUrl"]);
								});
								const moduleIds = [
									...new Set(
										mdata
											.map((menu) => menu.ModuleId)
											.filter((id) => id !== null)
									),
								];
								let accessToken = await signAccessToken(data[0]["UserName"]);
								res.send({
									accessToken: accessToken,
									data: { ...data, access: menuarray },
									moduleIds: moduleIds,
									// access: menuarray,
								});
								logger.info(`Login Success - ${data[0]["UserName"]}`);
							}
						);
					} else {
						res.send(createError.Unauthorized("Invalid Username/Password"));
						logger.error(`Login Failed - ${username} IP : ${req.ip}`);
					}
				} else {
					res.send(createError.Unauthorized("Invalid Username/Password"));
					logger.error(`Login Failed - ${username} IP : ${req.ip}`);
				}

				//      res.send({...data, decPass, encrypted: encrypted.toString(), decrypted: decrypted.toString(CryptoJS.enc.Utf8)});
			}
		);

		// res.send(createError.Unauthorized("Invalid Username/Password"))
	} catch (error) {
		next(error);
		logger.error(`Error - ${error}`);
	}
});

// New endpoint to fetch menu URLs
app.post("/fetchMenuUrls", async (req, res, next) => {
	try {
		const { role, username } = req.body;
		console.log("req.body", req.body);
		if (!role || !username) return res.send(createError.BadRequest());

		setupQueryMod(
			`Select usr.Name, usr.UserName,usr.Password,usr.Role, unt.UnitName,usr.ActiveUser from magod_setup.magod_userlist usr
        left join magod_setup.magodlaser_units unt on unt.UnitID = usr.UnitID WHERE usr.UserName = '${username}' and usr.ActiveUser = '1'`,
			async (err, d) => {
				if (err) logger.error(err);
				let data = d;
				if (data.length > 0) {
					setupQueryMod(
						`Select m.MenuUrl,ModuleId  from magod_setup.menumapping mm
                left outer join magod_setup.menus m on m.Id = mm.MenuId
                where mm.Role = '${data[0]["Role"]}' and mm.ActiveMenu = '1'`,
						async (err, mdata) => {
							if (err) logger.error(err);
							let menuarray = [];
							mdata.forEach((element) => {
								menuarray.push(element["MenuUrl"]);
							});
							const moduleIds = [
								...new Set(
									mdata.map((menu) => menu.ModuleId).filter((id) => id !== null)
								),
							];
							res.send({
								data: { ...data, access: menuarray },
								moduleIds: moduleIds,
							});
						}
					);
				} else {
					res.send(createError.Unauthorized("Invalid Username"));
					// logger.error(` Failed - ${username} IP : ${req.ip}`);
				}
			}
		);
	} catch (error) {
		next(error);
		// logger.error(`Error - ${error}`);
	}
});
