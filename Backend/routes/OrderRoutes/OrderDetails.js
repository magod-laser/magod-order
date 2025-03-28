/** @format */

const OrderDetailsRouter = require("express").Router();
const { createLogger } = require("winston");
const {
  misQuery,
  setupQuery,
  misQueryMod,
  qtnQueryMod,
} = require("../../helpers/dbconn");
const { logger } = require("../../helpers/logger");
const moment = require("moment");

OrderDetailsRouter.post(`/insertnewsrldata`, async (req, res, next) => {
  // console.log("entering into insertnewsrldata...");
  //console.log("req.body", req.body);
  let ressrldata = [];
  if (req.body.requestData.flag === 1 || req.body.requestData.flag === 3) {
    try {
      misQueryMod(
        `SELECT * FROM magodmis.order_details where Order_No=${req.body.requestData.OrderNo}`,
        (err, data1) => {
          if (err) {
            logger.error(err);
          } else {
            try {
              const orderNo = req.body.requestData.OrderNo;
              const UnitPrice = req.body.requestData.UnitPrice;
              const newOrderSrl = req.body.requestData.newOrderSrl;
              console.log("newOrderSrl", newOrderSrl);

              const custcode = req.body.requestData.custcode;
              const dwgName = req.body.requestData.DwgName;
              const dwgCode = req.body.requestData.Dwg_Code || "";
              const strmtrlcode = req.body.requestData.strmtrlcode || "";
              const operation = req.body.requestData.Operation || "";
              const mtrlSrc = req.body.requestData.NewSrlFormData.MtrlSrc;
              const qtyOrdered =
                parseInt(req.body.requestData.Qty_Ordered) || 0;
              const inspLvl = req.body.requestData.NewSrlFormData.InspLvl;
              const pkngLvl = req.body.requestData.NewSrlFormData.PkngLvl;
              const jwCost = parseFloat(req.body.requestData.JwCost) || 0.0;
              const mtrlCost = parseFloat(req.body.requestData.mtrlcost) || 0.0;
              const dwg = req.body.requestData.dwg || 0;
              const tolerance = req.body.requestData.tolerance;
              const hasBOM = req.body.requestData.HasBOM || 0;

              misQueryMod(
                `INSERT INTO magodmis.order_details (
                                Order_No, Order_Srl, Cust_Code, DwgName, Dwg_Code, mtrl_code, Operation, Mtrl_Source, Qty_Ordered, InspLevel, PackingLevel, JWCost, MtrlCost,UnitPrice, Dwg, tolerance, HasBOM
                            ) VALUES (
                                '${orderNo}',
                                ${newOrderSrl},
                                '${custcode}',
                                '${dwgName}',
                                '${dwgCode}',
                                '${strmtrlcode}',
                                '${operation}',
                                '${mtrlSrc}',
                                ${qtyOrdered},
                                '${inspLvl}',
                                '${pkngLvl}',
                                ${jwCost},
                                ${mtrlCost},
                                ${UnitPrice},
                                ${dwg},
                                '${tolerance}',
                                ${hasBOM}
                            )`,
                (err, srldata) => {
                  if (err) {
                    logger.error(err);
                  } else {
                    // res.send(srldata);
                    //   const orderValue = qtyOrdered * (jwCost + mtrlCost);

                    //   misQueryMod(
                    //     `UPDATE magodmis.order_list
                    //                          SET ordervalue = ${orderValue}
                    //                          WHERE order_no = '${orderNo}'`,
                    //     (err, updateResult) => {
                    //       if (err) {
                    //         logger.error(err);
                    //         res.status(500).send("Error updating order value.");
                    //       } else {
                    //         //console.log("updateResult", updateResult);

                    //         res.send({ srldata, updateResult });
                    //       }
                    //     }
                    //   );
                    // Step 1: Fetch the existing ordervalue
                    misQueryMod(
                      `SELECT ordervalue FROM magodmis.order_list WHERE order_no = '${orderNo}'`,
                      (err, result) => {
                        if (err) {
                          logger.error(err);
                          return res
                            .status(500)
                            .send("Error fetching current order value.");
                        }

                        if (result.length === 0) {
                          return res.status(404).send("Order not found.");
                        }

                        const currentOrderValue = result[0].ordervalue;
                        const newOrderValue = qtyOrdered * (jwCost + mtrlCost);
                        const updatedOrderValue =
                          (currentOrderValue || 0) + newOrderValue;

                        // Step 2: Update the ordervalue
                        misQueryMod(
                          `UPDATE magodmis.order_list
       SET ordervalue = ${updatedOrderValue}
       WHERE order_no = '${orderNo}'`,
                          (err, updateResult) => {
                            if (err) {
                              logger.error(err);
                              return res
                                .status(500)
                                .send("Error updating order value.");
                            }

                            //console.log("updateResult", updateResult);

                            res.send({ srldata, updateResult });
                          }
                        );
                      }
                    );
                  }
                }
              );
            } catch (error) {
              logger.error(error);
            }
          }
        }
      );
    } catch (error) {
      logger.error(error);
    }
  } else if (req.body.requestData.flag === 2) {
    // console.log("Flag : ", req.body.requestData.flag);

    try {
      // console.log("Order No : " + req.body.requestData.imprtDwgData["OrderNo"]);

      // console.log(
      // 	"File Name 1: ",
      // 	req.body.requestData.imprtDwgData.impDwgFileData[0].file
      // );
      //console.log("Delivery Date : ", req.body.requestData.imprtDwgData.Delivery_Date);

      let ordno = req.body.requestData.imprtDwgData["OrderNo"];
      misQueryMod(
        `SELECT * FROM magodmis.order_details where Order_No=${ordno} `,
        (err, data1) => {
          if (err) {
            logger.error(err);
          } else {
            // console.log("data1",data1);
            // console.log("data1",data1.length);
            // console.log("data1",data1[0].Order_Srl);
            try {
              let j = data1.length || 0;
              for (
                let i = 0;
                i < req.body.requestData.imprtDwgData.impDwgFileData.length;
                i++
              ) {
                // console.log("i : ", i);
                // console.log(
                //   "File Name : ",
                //   req.body.requestData.imprtDwgData.impDwgFileData[i].file
                // );

                const orderNo = req.body.requestData.imprtDwgData.OrderNo;
                const newOrderSrl = j + 1; // req.body.requestData.imprtDwgData.newOrderSrl;
                console.log("newOrderSrl", newOrderSrl);

                const custcode = req.body.requestData.imprtDwgData.custcode;
                const dwgName =
                  req.body.requestData.imprtDwgData.impDwgFileData[i].file;
                const dwgCode =
                  req.body.requestData.imprtDwgData.Dwg_Code || "";
                const strmtrlcode =
                  req.body.requestData.imprtDwgData.strmtrlcode || "";
                const operation =
                  req.body.requestData.imprtDwgData.Operation || "";
                const mtrlSrc =
                  req.body.requestData.imprtDwgData.NewSrlFormData.MtrlSrc;
                const qtyOrdered =
                  parseInt(req.body.requestData.imprtDwgData.Qty_Ordered) || 0;
                const inspLvl =
                  req.body.requestData.imprtDwgData.NewSrlFormData.InspLvl;
                const pkngLvl =
                  req.body.requestData.imprtDwgData.NewSrlFormData.PkngLvl;
                const loc =
                  parseFloat(
                    req.body.requestData.imprtDwgData.impDwgFileData[i]
                      .lengthOfCut
                  ) || 0;
                const noofpierces =
                  parseFloat(
                    req.body.requestData.imprtDwgData.impDwgFileData[i]
                      .noOfPierces
                  ) || 0;
                const jwCost =
                  parseFloat(
                    req.body.requestData.imprtDwgData.impDwgFileData[i].jwcost
                  ) || 0.0;
                const mtrlCost =
                  parseFloat(
                    req.body.requestData.imprtDwgData.impDwgFileData[i].mtrlcost
                  ) || 0.0;
                const unitPrice =
                  parseFloat(
                    req.body.requestData.imprtDwgData.impDwgFileData[i]
                      .unitPrice
                  ) || 0.0;
                const dwg = req.body.requestData.imprtDwgData.dwg || 0;
                const tolerance = req.body.requestData.imprtDwgData.tolerance;
                const thickness = req.body.requestData.imprtDwgData.Thickness;
                const mtrl = req.body.requestData.imprtDwgData.mtrl;
                const material = req.body.requestData.imprtDwgData.material;
                const deldate = moment(
                  req.body.requestData.imprtDwgData.Delivery_Date,
                  "YYYY-MM-DD"
                ).format("YYYY-MM-DD");
                const hasBOM = req.body.requestData.imprtDwgData.HasBOM || 0;

                misQueryMod(
                  `INSERT INTO magodmis.order_details (
                                Order_No, Order_Srl, Cust_Code, DwgName, Dwg_Code, mtrl_code, Operation, Thickness, Mtrl_Source, Mtrl, Material, Qty_Ordered,
                                InspLevel, PackingLevel, Delivery_Date, UnitPrice, LOC, Holes, JWCost, MtrlCost, Dwg, tolerance, HasBOM
                            ) VALUES (
                                '${orderNo}',
                                ${newOrderSrl},
                                '${custcode}',
                                '${dwgName}',
                                '${dwgCode}',
                                '${strmtrlcode}',
                                '${operation}',
                                '${thickness}',
                                '${mtrlSrc}',
                                '${mtrl}',
                                '${material}',
                                ${qtyOrdered},
                                '${inspLvl}',
                                '${pkngLvl}',
                                '${deldate}',
                                ${unitPrice},
                                '${loc}',
                                ${noofpierces},
                                ${jwCost},
                                ${mtrlCost},
                                ${dwg},
                                '${tolerance}',
                                ${hasBOM}
                            )`,
                  (err, srldata) => {
                    if (err) {
                      logger.error(err);
                    } else {
                      console.log("srldata...123", srldata);
                      ressrldata.push(srldata);
                      //res.send(srldata);
                    }
                    // console.log("srldata...123", srldata);
                  }
                );
                j++;
              }
            } catch (error) {
              logger.error(error);
            }
          }
          res.send(ressrldata);
        }
      );
    } catch (error) {
      logger.error(error);
    }
  }
});

OrderDetailsRouter.post(`/getbomdata`, async (req, res, next) => {
  try {
    misQueryMod(
      // `SELECT *
      // FROM magodmis.cust_bomlist AS bom
      // INNER JOIN magodmis.cust_assy_data AS assy ON bom.cust_code = assy.cust_code WHERE bom.cust_code= ${req.body.custcode}
      // ORDER BY bom.Id DESC`,
      `SELECT bom.*, assy.*, UniqueColumn
FROM (
    SELECT DISTINCT PartId AS UniqueColumn
    FROM magodmis.cust_bomlist
    WHERE cust_code = ${req.body.custcode}

    UNION

    SELECT DISTINCT AssyCust_PartId AS UniqueColumn
    FROM magodmis.cust_bomlist AS bom
    INNER JOIN magodmis.cust_assy_data AS assy ON bom.cust_code = assy.cust_code
    WHERE bom.cust_code = ${req.body.custcode}
) AS UniqueData

LEFT JOIN magodmis.cust_bomlist AS bom ON UniqueData.UniqueColumn = bom.PartId
LEFT JOIN magodmis.cust_assy_data AS assy ON UniqueData.UniqueColumn = assy.AssyCust_PartId

ORDER BY UniqueData.UniqueColumn DESC`,
      (err, bomdata) => {
        if (err) {
          logger.error(err);

          logger.error(`Error fetching BOM data: ${err.message}`);
          res
            .status(500)
            .send({ error: "An error occurred while fetching BOM data" });
        } else {
          // ////console.log("bomdata...", bomdata);
          res.send(bomdata);
        }
      }
    );
  } catch (error) {}
});

OrderDetailsRouter.post(`/getfindoldpartdata`, async (req, res, next) => {
  ////console.log("req", req.body);
  try {
    misQueryMod(
      // `SELECT * FROM magodmis.order_details WHERE cust_code=${req.body.custcode}`,
      `SELECT * FROM magodmis.orderscheduledetails WHERE cust_code=${req.body.custcode}`,
      (err, findoldpartdata) => {
        if (err) {
          ////console.log("error", err);
        } else {
          ////console.log("findoldpartdata", findoldpartdata);
          res.send(findoldpartdata);
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

OrderDetailsRouter.post(`/loadStockPosition`, async (req, res, next) => {
  //   let sqlQuery =
  //     "SELECT MtrlStockID, count(m.`MtrlStockID`) as inStock, m.`Mtrl_Code`, " +
  //     "m.`DynamicPara1`, m.`DynamicPara2`, m.`Locked`, m.`Scrap` " +
  //     "FROM magodmis.mtrlstocklist m ";

  //   if (!CB_Magod) {
  //     sqlQuery +=
  //       "WHERE m.`Cust_Code` = ? " +
  //       "GROUP BY m.`Mtrl_Code`, m.`DynamicPara1`, m.`DynamicPara2`, m.`Scrap`, m.`Locked` " +
  //       "ORDER BY m.`Locked` DESC, m.`Scrap` DESC;";
  //   } else {
  //     sqlQuery +=
  //       "WHERE m.`Cust_Code` = '0000' " +
  //       "GROUP BY m.`Mtrl_Code`, m.`DynamicPara1`, m.`DynamicPara2`, m.`Scrap`, m.`Locked` " +
  //       "ORDER BY m.`Locked` DESC, m.`Scrap` DESC;";
  //   }

  //   const [rows] = await connection.query(sqlQuery, [Cust_Code]);

  //   connection.release();

  //   res.json(rows);
  // } catch (error) {
  //   //console.error(error);
  //   res.status(500).send("Internal Server Error");
  // }
  // next(error);
  //console.log("req", req.body);
  try {
    misQueryMod(
      `SELECT 
      MtrlStockID, 
      COUNT(MtrlStockID) as inStock, 
      Mtrl_Code, 
      DynamicPara1, 
      DynamicPara2, 
      Locked, 
      Scrap 
  FROM 
      magodmis.mtrlstocklist m
  GROUP BY 
      MtrlStockID, 
      Mtrl_Code, 
      DynamicPara1, 
      DynamicPara2, 
      Locked, 
      Scrap`,
      (err, data) => {
        if (err) {
          //console.log("error", err);
        } else {
          //console.log("data....", data);
          //  if (!CB_Magod) {
          if (req.body.CB_Magod === 0) {
            misQueryMod(
              ` SELECT 
                MtrlStockID, 
                COUNT(MtrlStockID) as inStock, 
                Mtrl_Code, 
                DynamicPara1, 
                DynamicPara2, 
                Locked, 
                Scrap 
            FROM 
                magodmis.mtrlstocklist m
            WHERE 
                m.Cust_Code = ${req.body.custcode}
            GROUP BY 
                MtrlStockID, 
                Mtrl_Code, 
                DynamicPara1, 
                DynamicPara2, 
                Locked, 
                Scrap
            ORDER BY 
                Locked DESC, 
                Scrap DESC`,
              (err, data1) => {
                if (err) {
                  //console.log("error", err);
                } else {
                  //console.log("data1.........", data1);
                  res.send(data1);
                }
              }
            );
          } else {
            misQueryMod(
              ` SELECT 
          MtrlStockID, 
          COUNT(MtrlStockID) as inStock, 
          Mtrl_Code, 
          DynamicPara1, 
          DynamicPara2, 
          Locked, 
          Scrap 
      FROM 
          magodmis.mtrlstocklist m
      WHERE 
          m.Cust_Code = "0000"
      GROUP BY 
          MtrlStockID, 
          Mtrl_Code, 
          DynamicPara1, 
          DynamicPara2, 
          Locked, 
          Scrap
      ORDER BY 
          Locked DESC, 
          Scrap DESC`,
              (err, data2) => {
                if (err) {
                  //console.log("error", err);
                } else {
                  //console.log("data2.......", data2);
                  res.send(data2);
                }
              }
            );
          }
          // res.send(data);
        }
      }
    );
  } catch (error) {}
});
OrderDetailsRouter.post(`/LoadArrival`, async (req, res, next) => {
  // try {
  // try {
  //   const { Cust_Code } = req.body;

  //   const connection = await pool.getConnection();

  //   const sqlQuery =
  //     "SELECT m.`RVID`, m.`RV_No`, m.`RV_Date`, m.`CustDocuNo`, m.`RVStatus`, " +
  //     "m.`TotalWeight`, m.updated, m.`TotalCalculatedWeight` " +
  //     "FROM magodmis.material_receipt_register m " +
  //     "WHERE m.`Cust_Code` = ? ORDER BY m.RV_no DESC;";

  //   const [rows] = await connection.query(sqlQuery, [Cust_Code]);

  //   connection.release();

  //   res.json(rows);
  //   //-----------------------------------------------
  //   try {
  //     const { rvID } = req.body;

  //     const connection = await pool.getConnection();

  //     const sqlQuery =
  //       "SELECT m.rvID, m.`Mtrl_Code`, m.`DynamicPara1`, m.`DynamicPara2`, m.`Qty`, m.updated " +
  //       "FROM magodmis.mtrlreceiptdetails m WHERE m.rvID = ?;";

  //     const [rows] = await connection.query(sqlQuery, [rvID]);

  //     connection.release();

  //     res.json(rows);
  //   } catch (error) {
  //     //console.error(error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // } catch (error) {
  //   //console.error(error);
  //   res.status(500).send("Internal Server Error");
  // }
  // //console.log("req", req.body);
  try {
    // misQueryMod(
    //   ` SELECT m.RVID, m.RV_No, m.RV_Date, m.CustDocuNo, m.RVStatus,
    //     m.TotalWeight, m.updated, m.TotalCalculatedWeight
    //     FROM magodmis.material_receipt_register m
    //     WHERE m.Cust_Code = ${req.body.custcode} ORDER BY m.RV_no DESC`,
    //   (err, data) => {
    //     if (err) {
    //       ////console.log("error", err);
    //     } else {
    //       //console.log("data", data);
    //       res.send(data);
    //       misQueryMod(
    //         `SELECT m.rvID, m.Mtrl_Code, m.DynamicPara1, m.DynamicPara2, m.Qty, m.updated
    //               FROM magodmis.mtrlreceiptdetails m WHERE m.rvID = "71011"`,
    //         (err, data1) => {
    //           if (err) {
    //             ////console.log("error", err);
    //           } else {
    //             //console.log("data1", data1);
    //             res.send(data1);
    //           }
    //         }
    //       );
    //     }
    //   }
    // );
    misQueryMod(
      `SELECT m.RVID, m.RV_No, m.RV_Date, m.CustDocuNo, m.RVStatus, 
      m.TotalWeight, m.updated, m.TotalCalculatedWeight 
      FROM magodmis.material_receipt_register m 
      WHERE m.Cust_Code = ${req.body.custcode} ORDER BY m.RV_no DESC`,
      (err, data) => {
        if (err) {
          //console.log("error", err);
          res.status(500).send("Internal Server Error");
        } else {
          // //console.log("data", data);
          res.send(data);
        }
      }
    );
  } catch (error) {}
});

OrderDetailsRouter.post(`/LoadArrival2`, async (req, res, next) => {
  // console.log("reqqqqqqqq", req.body);
  try {
    misQueryMod(
      `SELECT m.rvID, m.Mtrl_Code, m.DynamicPara1, m.DynamicPara2, m.Qty, m.updated 
      FROM magodmis.mtrlreceiptdetails m WHERE m.rvID = "${req.body.RVID}"`,
      (err, data1) => {
        if (err) {
          //console.log("error", err);
          res.status(500).send("Internal Server Error");
        } else {
          // console.log("data1", data1);
          res.send(data1);
        }
      }
    );
  } catch (error) {}
});

OrderDetailsRouter.post(`/getQtnList`, async (req, res, next) => {
  console.log("entering getQtnList");

  console.log(req.body);
  let QtnFormat = req.body.QtnFormat;
  console.log("QtnFormat", QtnFormat);

  try {
    qtnQueryMod(
      `SELECT *, DATE_FORMAT(ValidUpTo, '%d/%m/%Y') AS Printable_ValidUpTo FROM magodqtn.qtnlist  where QtnFormat='${QtnFormat}' And QtnStatus = 'Qtn Sent' ORDER BY QtnID DESC`,
      (err, qtnList) => {
        if (err) {
          res.status(500).send("Internal Server Error");
        } else {
          res.send({ qtnList: qtnList });
          // try {
          //   qtnQueryMod(
          //     `SELECT
          //           *
          //       FROM
          //           magodqtn.qtn_itemslist
          //               INNER JOIN
          //           magodqtn.qtnlist ON magodqtn.qtnlist.QtnID = magodqtn.qtn_itemslist.QtnId`,
          //     (err, qtnItemList) => {
          //       if (err) {
          //         res.status(500).send("Internal Server Error");
          //       } else {
          //         res.send({
          //           qtnList: qtnList,
          //           qtnItemList: qtnItemList,
          //         });
          //       }
          //     }
          //   );
          // } catch (error) {
          //   next(error);
          // }
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

// OrderDetailsRouter.post(`/getQtnDataByQtnID`, async (req, res, next) => {
//   console.log("req.body", req.body);
//   try {
//     qtnQueryMod(
//       `SELECT
//             *
//         FROM
//             magodqtn.qtn_itemslist
//         WHERE
//             magodqtn.qtn_itemslist.QtnId = '${req.body.qtnId}'
//         ORDER BY magodqtn.qtn_itemslist.ID DESC`,
//       (err, qtnItemList) => {
//         if (err) {
//           res.status(500).send("Internal Server Error");
//         } else {
//           // console.log("qtnItemList", qtnItemList);
//           res.send({
//             qtnItemList: qtnItemList,
//           });
//         }
//       }
//     );
//   } catch (error) {
//     next(error);
//   }
// });

OrderDetailsRouter.post("/getQtnDataByQtnID", async (req, res, next) => {
  try {
    const { qtnId, QtnFormat } = req.body;

    console.log("req.body", req.body);

    let query = "";

    if (QtnFormat === "Service") {
      query = `
        SELECT *
        FROM magodqtn.qtn_itemslist
        WHERE magodqtn.qtn_itemslist.QtnId = '${qtnId}'
        ORDER BY magodqtn.qtn_itemslist.ID DESC
      `;
    } else if (QtnFormat === "Profile") {
      query = `
        SELECT *
        FROM magodqtn.qtn_profiledetails
        WHERE magodqtn.qtn_profiledetails.QtnId = '${qtnId}'
        ORDER BY magodqtn.qtn_profiledetails.ProfileId DESC
      `;
    } else {
      return res.status(400).send({ error: "Invalid QtnType" });
    }

    qtnQueryMod(query, (err, qtnItemList) => {
      if (err) {
        res.status(500).send("Internal Server Error");
      } else {
        console.log("qtnItemList", qtnItemList);
        res.send({ qtnItemList: qtnItemList });
      }
    });
  } catch (error) {
    next(error);
  }
});

OrderDetailsRouter.post(
  `/getOldOrderByCustCodeAndOrderNo`,
  async (req, res, next) => {
    // console.log("req.body", req.body);
    try {
      misQueryMod(
        `SELECT * FROM magodmis.order_list WHERE Cust_Code = '${req.body.Cust_Code}' AND Order_No != '${req.body.Order_No}' ORDER BY Order_No DESC`,
        (err, orderListData) => {
          if (err) {
            res.status(500).send("Internal Server Error");
          } else {
            try {
              misQueryMod(
                `SELECT * FROM magodmis.order_details WHERE Cust_Code = '${req.body.Cust_Code}' AND Order_No != '${req.body.Order_No}' ORDER BY Order_Srl`,
                (err, orderDetailsData) => {
                  if (err) {
                    res.status(500).send("Internal Server Error");
                  } else {
                    // console.log("orderListData", orderListData);
                    // console.log("orderDetailsData", orderDetailsData);
                    res.send({
                      orderListData: orderListData,
                      orderDetailsData: orderDetailsData,
                    });
                  }
                }
              );
            } catch (error) {
              next(error);
            }
          }
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

OrderDetailsRouter.post(
  `/postDeleteDetailsByOrderNo`,
  async (req, res, next) => {
    // console.log("req.body", req.body.Order_No);
    try {
      misQueryMod(
        `DELETE FROM magodmis.order_details WHERE (Order_No = '${req.body.Order_No}')`,
        (err, deleteOrderData) => {
          if (err) {
            res.status(500).send("Internal Server Error");
          } else {
            // console.log("deleteOrderData", deleteOrderData);
            res.send({ deleteOrderData: deleteOrderData, flag: 1 });
          }
        }
      );
    } catch (error) {
      next(error);
    }
  }
);
// Import Qtn
// OrderDetailsRouter.post(
//   `/postDetailsDataInImportQtn`,
//   async (req, res, next) => {
//     // console.log("req.body", req.body);

//     for (let i = 0; i < req.body.detailsData.length; i++) {
//       const element = req.body.detailsData[i];
//       try {
//         misQueryMod(
//           `INSERT INTO magodmis.order_details (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess,  Mtrl_Source, Qty_Ordered, InspLevel, PackingLevel, UnitPrice, UnitWt, Order_Status, JWCost, MtrlCost, Operation, tolerance)
//           VALUES ('${element.Order_No}', '${element.Order_Srl}', '${
//             element.Cust_Code
//           }', '${element.DwgName || ""}', '${element.Mtrl_Code || ""}', '${
//             element.MProcess || ""
//           }', '${element.Mtrl_Source || ""}', '${parseInt(
//             element.Qty_Ordered || 0
//           )}', '${element.InspLevel || "Insp1"}', '${
//             element.PackingLevel || "Pkng1"
//           }', '${parseFloat(element.UnitPrice || 0).toFixed(2)}', '${parseFloat(
//             element.UnitWt || 0
//           ).toFixed(3)}', '${
//             element.Order_Status || "Received"
//           }', '${parseFloat(element.JWCost || 0).toFixed(2)}', '${parseFloat(
//             element.MtrlCost || 0
//           ).toFixed(2)}', '${element.Operation || ""}', '${
//             element.tolerance || ""
//           }')`,
//           (err, deleteOrderData) => {
//             if (err) {
//               res.status(500).send("Internal Server Error");
//             } else {
//               // console.log("deleteOrderData", deleteOrderData);
//             }
//           }
//         );
//       } catch (error) {
//         next(error);
//       }
//     }

//     res.send({ result: true });
//   }
// );
// OrderDetailsRouter.post(
//   `/postDetailsDataInImportQtn`,
//   async (req, res, next) => {
//     console.log("Entering into postDetailsDataInImportQtn");

//     try {
//       let totalNewOrderValue = 0; // Accumulator for new order value
//       let orderNo = null; // Store order number to update `order_list`

//       const insertPromises = req.body.detailsData.map((element) => {
//         return new Promise((resolve, reject) => {
//           // Set orderNo for later use
//           if (!orderNo) orderNo = element.Order_No;

//           // Insert into order_details
//           const insertQuery = `
//             INSERT INTO magodmis.order_details
//             (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess,
//             Mtrl_Source, Qty_Ordered, InspLevel, PackingLevel, UnitPrice,
//             UnitWt, Order_Status, JWCost, MtrlCost, Operation, tolerance)
//             VALUES
//             ('${element.Order_No}', '${element.Order_Srl}', '${
//             element.Cust_Code
//           }',
//             '${element.DwgName || ""}', '${element.Mtrl_Code || ""}',
//             '${element.MProcess || ""}', '${element.Mtrl_Source || ""}',
//             '${parseInt(element.Qty_Ordered || 0)}', '${
//             element.InspLevel || "Insp1"
//           }',
//             '${element.PackingLevel || "Pkng1"}', '${parseFloat(
//             element.UnitPrice || 0
//           ).toFixed(2)}',
//             '${parseFloat(element.UnitWt || 0).toFixed(3)}', '${
//             element.Order_Status || "Received"
//           }',
//             '${parseFloat(element.JWCost || 0).toFixed(2)}', '${parseFloat(
//             element.MtrlCost || 0
//           ).toFixed(2)}',
//             '${element.Operation || ""}', '${element.tolerance || ""}')`;

//           misQueryMod(insertQuery, (err) => {
//             if (err) {
//               reject(err);
//             } else {
//               // Accumulate new order value
//               const newRowValue =
//                 parseInt(element.Qty_Ordered) *
//                 (parseFloat(element.JWCost) + parseFloat(element.MtrlCost));

//               totalNewOrderValue += newRowValue; // Add to accumulator
//               resolve();
//             }
//           });
//         });
//       });

//       // Wait for all rows to be inserted
//       await Promise.all(insertPromises);

//       // Now update ordervalue in order_list once
//       if (!orderNo) {
//         return res.status(400).send("No valid Order_No found in request data.");
//       }

//       const fetchOrderValueQuery = `SELECT ordervalue FROM magodmis.order_list WHERE order_no = '${orderNo}'`;

//       misQueryMod(fetchOrderValueQuery, (err, result) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send("Error fetching current order value.");
//         }

//         if (result.length === 0) {
//           return res.status(404).send("Order not found.");
//         }

//         const currentOrderValue = result[0].ordervalue || 0;
//         const updatedOrderValue = currentOrderValue + totalNewOrderValue;

//         console.log("Total new order value:", totalNewOrderValue);
//         console.log("Updated order value:", updatedOrderValue);

//         const updateQuery = `
//           UPDATE magodmis.order_list
//           SET ordervalue = ${updatedOrderValue}
//           WHERE order_no = '${orderNo}'`;

//         misQueryMod(updateQuery, (updateErr) => {
//           if (updateErr) {
//             console.error(updateErr);
//             return res.status(500).send("Error updating order value.");
//           }

//           res.send({ result: true, updatedOrderValue });
//         });
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

//26-03-2025
OrderDetailsRouter.post(
  `/postDetailsDataInImportQtn`,
  async (req, res, next) => {
    console.log("Entering into postDetailsDataInImportQtn");

    try {
      let totalNewOrderValue = 0;
      let totalOldOrderValue = 0;
      let orderNo = null;

      // Fetch existing rows before inserting new ones
      const existingOrderNos = req.body.detailsData
        .map((el) => `'${el.Order_No}'`)
        .join(",");

      if (!existingOrderNos) {
        return res.status(400).send("No valid Order_No found in request data.");
      }

      const fetchOldOrderQuery = `
        SELECT Order_No, Qty_Ordered, JWCost, MtrlCost 
        FROM magodmis.order_details 
        WHERE Order_No IN (${existingOrderNos})`;

      misQueryMod(fetchOldOrderQuery, async (err, oldData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error fetching existing order details.");
        }

        // Calculate total old order value
        oldData.forEach((row) => {
          const oldQty = parseInt(row.Qty_Ordered) || 0;
          const oldJWCost = parseFloat(row.JWCost) || 0;
          const oldMtrlCost = parseFloat(row.MtrlCost) || 0;
          totalOldOrderValue += oldQty * (oldJWCost + oldMtrlCost);
        });

        console.log("Total old order value:", totalOldOrderValue);

        // Insert new rows and calculate new order value
        const insertPromises = req.body.detailsData.map((element) => {
          return new Promise((resolve, reject) => {
            if (!orderNo) orderNo = element.Order_No;

            const insertQuery = `
              INSERT INTO magodmis.order_details 
              (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess, 
              Mtrl_Source, Qty_Ordered, InspLevel, PackingLevel, UnitPrice, 
              UnitWt, Order_Status, JWCost, MtrlCost, Operation, tolerance) 
              VALUES 
              ('${element.Order_No}', '${element.Order_Srl}', '${
              element.Cust_Code
            }', 
              '${element.DwgName || ""}', '${element.Mtrl_Code || ""}', 
              '${element.MProcess || ""}', '${element.Mtrl_Source || ""}', 
              '${parseInt(element.Qty_Ordered || 0)}', '${
              element.InspLevel || "Insp1"
            }', 
              '${element.PackingLevel || "Pkng1"}', '${parseFloat(
              element.UnitPrice || 0
            ).toFixed(2)}', 
              '${parseFloat(element.UnitWt || 0).toFixed(3)}', '${
              element.Order_Status || "Received"
            }', 
              '${parseFloat(element.JWCost || 0).toFixed(2)}', '${parseFloat(
              element.MtrlCost || 0
            ).toFixed(2)}', 
              '${element.Operation || ""}', '${element.tolerance || ""}')`;

            misQueryMod(insertQuery, (err) => {
              if (err) {
                reject(err);
              } else {
                // Accumulate new order value
                const newRowValue =
                  parseInt(element.Qty_Ordered) *
                  (parseFloat(element.JWCost) + parseFloat(element.MtrlCost));

                totalNewOrderValue += newRowValue;
                resolve();
              }
            });
          });
        });

        await Promise.all(insertPromises);

        // Fetch current order value from order_list
        const fetchOrderValueQuery = `
          SELECT ordervalue FROM magodmis.order_list 
          WHERE order_no = '${orderNo}'`;

        misQueryMod(fetchOrderValueQuery, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error fetching current order value.");
          }

          if (result.length === 0) {
            return res.status(404).send("Order not found.");
          }

          const currentOrderValue = parseFloat(result[0].ordervalue) || 0;
          const updatedOrderValue =
            currentOrderValue - totalOldOrderValue + totalNewOrderValue;

          console.log("Total new order value:", totalNewOrderValue);
          console.log("Updated order value:", updatedOrderValue);

          // Update ordervalue in order_list
          const updateQuery = `
            UPDATE magodmis.order_list 
            SET ordervalue = ${totalNewOrderValue} 
            WHERE order_no = '${orderNo}'`;

          misQueryMod(updateQuery, (updateErr) => {
            if (updateErr) {
              console.error(updateErr);
              return res.status(500).send("Error updating order value.");
            }

            res.send({ result: true, updatedOrderValue });
          });
        });
      });
    } catch (error) {
      next(error);
    }
  }
);

// Import Excel
// OrderDetailsRouter.post(
//   `/postDetailsDataInImportExcel`,
//   async (req, res, next) => {
//     console.log("Entering Into postDetailsDataInImportExcel");
//     console.log("req.body", req.body);

//     try {
//       const db = require("../../helpers/dbconn"); // Import DB connection

//       const insertPromises = req.body.detailsData.map((element) => {
//         return new Promise((resolve, reject) => {
//           // First, check if Order_No exists in order_list
//           const checkQuery = `SELECT Order_No FROM magodmis.order_list WHERE Order_No = '${element.Order_No}'`;

//           misQueryMod
//             (checkQuery, (err, results) => {
//             if (err) {
//               reject(err);
//             } else if (results.length === 0) {
//               reject(new Error(`Order_No ${element.Order_No} not found in order_list`));
//             } else {
//               // If Order_No exists, insert into order_details
//               const insertQuery = `
//                 INSERT INTO magodmis.order_details (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess,  Mtrl_Source, Qty_Ordered, InspLevel, PackingLevel, UnitPrice, UnitWt, Order_Status, JWCost, MtrlCost, Operation, tolerance)
//                 VALUES ('${element.Order_No}', '${element.Order_Srl}', '${element.Cust_Code}',
//                         '${element.DwgName || ""}', '${element.Mtrl_Code || ""}', '${element.MProcess || ""}',
//                         '${element.Mtrl_Source || ""}', '${parseInt(element.Qty_Ordered || 0)}',
//                         '${element.InspLevel || "Insp1"}', '${element.PackingLevel || "Pkng1"}',
//                         '${parseFloat(element.UnitPrice || 0).toFixed(2)}', '${parseFloat(element.UnitWt || 0).toFixed(3)}',
//                         '${element.Order_Status || "Received"}', '${parseFloat(element.JWCost || 0).toFixed(2)}',
//                         '${parseFloat(element.MtrlCost || 0).toFixed(2)}', '${element.Operation || ""}',
//                         '${element.tolerance || ""}')`;
//                         misQueryMod(insertQuery, (insertErr) => {
//                 if (insertErr) {
//                   reject(insertErr);
//                 } else {
//                   misQueryMod(
//                     `SELECT ordervalue FROM magodmis.order_list WHERE order_no = '${element.Order_No}'`,
//                     (err, result) => {
//                       if (err) {
//                         logger.error(err);
//                         return res
//                           .status(500)
//                           .send("Error fetching current order value.");
//                       }
//           console.log("result order value",result);

//                       if (result.length === 0) {
//                         return res.status(404).send("Order not found.");
//                       }

//                       const currentOrderValue = result[0].ordervalue;
//                       const newOrderValue = parseInt(element.Qty_Ordered) * (parseFloat(element.JWCost) + parseFloat(element.MtrlCost));
//                       const updatedOrderValue = (currentOrderValue || 0) + newOrderValue;
//           console.log("currentOrderValue",currentOrderValue);
//           console.log("newOrderValue",newOrderValue);
//           console.log("updatedOrderValue",updatedOrderValue);

//                       // Step 2: Update the ordervalue
//                       console.log ("entering into the UPDATE magodmis.order_list ")
//                       misQueryMod(
//                         `UPDATE magodmis.order_list
//                SET ordervalue = ${updatedOrderValue}
//                WHERE order_no = '${element.Order_No}'`,
//                         (err, updateResult) => {
//                           if (err) {
//                             logger.error(err);
//                             return res.status(500).send("Error updating order value.");
//                           }

//                           // console.log("updateResult", updateResult);

//                           // res.send({ updateResult });
//                         }
//                       );
//                     }
//                   );
//                   resolve();
//                 }
//               });
//             }
//           });
//         });
//       });

//       // Wait for all queries to complete
//       await Promise.all(insertPromises);

//       res.send({ result: true });
//     } catch (error) {
//       console.error("Error inserting order details:", error);
//       res.status(500).send({ error: error.message });
//     }
//   }
// );
// OrderDetailsRouter.post(
//   `/postDetailsDataInImportExcel`,
//   async (req, res, next) => {
//     console.log("Entering Into postDetailsDataInImportExcel");
//     console.log("req.body", req.body);

//     try {
//       const db = require("../../helpers/dbconn"); // Import DB connection

//       let totalNewOrderValue = 0; // Accumulator for new order value

//       const insertPromises = req.body.detailsData.map((element) => {
//         return new Promise((resolve, reject) => {
//           // Check if Order_No exists in order_list
//           const checkQuery = `SELECT Order_No FROM magodmis.order_list WHERE Order_No = '${element.Order_No}'`;

//           misQueryMod(checkQuery, (err, results) => {
//             if (err) {
//               reject(err);
//             } else if (results.length === 0) {
//               reject(
//                 new Error(
//                   `Order_No ${element.Order_No} not found in order_list`
//                 )
//               );
//             } else {
//               // Insert into order_details
//               const insertQuery = `
//                 INSERT INTO magodmis.order_details (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess, Mtrl_Source, Qty_Ordered, InspLevel, PackingLevel, UnitPrice, UnitWt, Order_Status, JWCost, MtrlCost, Operation, tolerance)
//                 VALUES ('${element.Order_No}', '${element.Order_Srl}', '${
//                 element.Cust_Code
//               }',
//                         '${element.DwgName || ""}', '${
//                 element.Mtrl_Code || ""
//               }', '${element.MProcess || ""}',
//                         '${element.Mtrl_Source || ""}', '${parseInt(
//                 element.Qty_Ordered || 0
//               )}',
//                         '${element.InspLevel || "Insp1"}', '${
//                 element.PackingLevel || "Pkng1"
//               }',
//                         '${parseFloat(element.UnitPrice || 0).toFixed(
//                           2
//                         )}', '${parseFloat(element.UnitWt || 0).toFixed(3)}',
//                         '${element.Order_Status || "Received"}', '${parseFloat(
//                 element.JWCost || 0
//               ).toFixed(2)}',
//                         '${parseFloat(element.MtrlCost || 0).toFixed(2)}', '${
//                 element.Operation || ""
//               }',
//                         '${element.tolerance || ""}')`;

//               misQueryMod(insertQuery, (insertErr) => {
//                 if (insertErr) {
//                   reject(insertErr);
//                 } else {
//                   // Accumulate new order value
//                   const newRowValue =
//                     parseInt(element.Qty_Ordered) *
//                     (parseFloat(element.JWCost) + parseFloat(element.MtrlCost));

//                   totalNewOrderValue += newRowValue; // Add to accumulator
//                   resolve();
//                 }
//               });
//             }
//           });
//         });
//       });

//       // Wait for all rows to be inserted
//       await Promise.all(insertPromises);

//       // Now update ordervalue in order_list once
//       const orderNo = req.body.detailsData[0].Order_No; // Assuming all rows have same Order_No
//       const fetchOrderValueQuery = `SELECT ordervalue FROM magodmis.order_list WHERE order_no = '${orderNo}'`;

//       misQueryMod(fetchOrderValueQuery, (err, result) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send("Error fetching current order value.");
//         }

//         if (result.length === 0) {
//           return res.status(404).send("Order not found.");
//         }

//         const currentOrderValue = result[0].ordervalue || 0;
//         const updatedOrderValue = currentOrderValue + totalNewOrderValue;

//         console.log("Total new order value:", totalNewOrderValue);
//         console.log("Updated order value:", updatedOrderValue);

//         const updateQuery = `
//           UPDATE magodmis.order_list
//           SET ordervalue = ${updatedOrderValue}
//           WHERE order_no = '${orderNo}'`;

//         misQueryMod(updateQuery, (updateErr) => {
//           if (updateErr) {
//             console.error(updateErr);
//             return res.status(500).send("Error updating order value.");
//           }

//           res.send({ result: true, updatedOrderValue });
//         });
//       });
//     } catch (error) {
//       console.error("Error inserting order details:", error);
//       res.status(500).send({ error: error.message });
//     }
//   }
// );
//26-03-2025
OrderDetailsRouter.post(
  `/postDetailsDataInImportExcel`,
  async (req, res, next) => {
    console.log("Entering Into postDetailsDataInImportExcel");
    console.log("req.body", req.body);

    try {
      const db = require("../../helpers/dbconn"); // Import DB connection

      let totalNewOrderValue = 0;
      let totalOldOrderValue = 0;

      // Get unique order numbers from request data
      const orderNos = [
        ...new Set(req.body.detailsData.map((el) => `'${el.Order_No}'`)),
      ].join(",");

      if (!orderNos) {
        return res.status(400).send("No valid Order_No found in request data.");
      }

      // Fetch old order values before inserting new data
      const fetchOldOrderQuery = `
        SELECT Order_No, Qty_Ordered, JWCost, MtrlCost 
        FROM magodmis.order_details 
        WHERE Order_No IN (${orderNos})`;

      misQueryMod(fetchOldOrderQuery, async (err, oldData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error fetching existing order details.");
        }

        // Calculate total old order value
        oldData.forEach((row) => {
          const oldQty = parseInt(row.Qty_Ordered) || 0;
          const oldJWCost = parseFloat(row.JWCost) || 0;
          const oldMtrlCost = parseFloat(row.MtrlCost) || 0;
          totalOldOrderValue += oldQty * (oldJWCost + oldMtrlCost);
        });

        console.log("Total old order value:", totalOldOrderValue);

        // Insert new rows and calculate new order value
        const insertPromises = req.body.detailsData.map((element) => {
          return new Promise((resolve, reject) => {
            // Check if Order_No exists in order_list
            const checkQuery = `SELECT Order_No FROM magodmis.order_list WHERE Order_No = '${element.Order_No}'`;

            misQueryMod(checkQuery, (err, results) => {
              if (err) {
                reject(err);
              } else if (results.length === 0) {
                reject(
                  new Error(
                    `Order_No ${element.Order_No} not found in order_list`
                  )
                );
              } else {
                // Insert into order_details
                const insertQuery = `
                  INSERT INTO magodmis.order_details (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess, Mtrl_Source, Qty_Ordered, InspLevel, PackingLevel, UnitPrice, UnitWt, Order_Status, JWCost, MtrlCost, Operation, tolerance)
                  VALUES ('${element.Order_No}', '${element.Order_Srl}', '${
                  element.Cust_Code
                }', 
                          '${element.DwgName || ""}', '${
                  element.Mtrl_Code || ""
                }', '${element.MProcess || ""}', 
                          '${element.Mtrl_Source || ""}', '${parseInt(
                  element.Qty_Ordered || 0
                )}', 
                          '${element.InspLevel || "Insp1"}', '${
                  element.PackingLevel || "Pkng1"
                }', 
                          '${parseFloat(element.UnitPrice || 0).toFixed(
                            2
                          )}', '${parseFloat(element.UnitWt || 0).toFixed(3)}', 
                          '${
                            element.Order_Status || "Received"
                          }', '${parseFloat(element.JWCost || 0).toFixed(2)}', 
                          '${parseFloat(element.MtrlCost || 0).toFixed(2)}', '${
                  element.Operation || ""
                }', 
                          '${element.tolerance || ""}')`;

                misQueryMod(insertQuery, (insertErr) => {
                  if (insertErr) {
                    reject(insertErr);
                  } else {
                    // Accumulate new order value
                    const newRowValue =
                      parseInt(element.Qty_Ordered) *
                      (parseFloat(element.JWCost) +
                        parseFloat(element.MtrlCost));

                    totalNewOrderValue += newRowValue; // Add to accumulator
                    resolve();
                  }
                });
              }
            });
          });
        });

        await Promise.all(insertPromises);

        // Now update ordervalue in order_list once
        const orderNo = req.body.detailsData[0].Order_No; // Assuming all rows have same Order_No
        const fetchOrderValueQuery = `
          SELECT ordervalue FROM magodmis.order_list 
          WHERE order_no = '${orderNo}'`;

        misQueryMod(fetchOrderValueQuery, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error fetching current order value.");
          }

          if (result.length === 0) {
            return res.status(404).send("Order not found.");
          }

          const currentOrderValue = parseFloat(result[0].ordervalue) || 0;
          const updatedOrderValue =
            currentOrderValue - totalOldOrderValue + totalNewOrderValue;

          console.log("Total new order value:", totalNewOrderValue);
          console.log("Updated order value:", updatedOrderValue);

          // Update ordervalue in order_list
          const updateQuery = `
            UPDATE magodmis.order_list 
            SET ordervalue = ${totalNewOrderValue} 
            WHERE order_no = '${orderNo}'`;

          misQueryMod(updateQuery, (updateErr) => {
            if (updateErr) {
              console.error(updateErr);
              return res.status(500).send("Error updating order value.");
            }

            res.send({ result: true, updatedOrderValue });
          });
        });
      });
    } catch (error) {
      console.error("Error inserting order details:", error);
      res.status(500).send({ error: error.message });
    }
  }
);

// Import old order
// OrderDetailsRouter.post(
//   `/postDetailsDataInImportOldOrder`,
//   async (req, res, next) => {
//     console.log("Entering into postDetailsDataInImportOldOrder");
//     console.log("req.body", req.body);

//     for (let i = 0; i < req.body.detailsData.length; i++) {
//       const element = req.body.detailsData[i];
//       try {
//         misQueryMod(
//           `INSERT INTO magodmis.order_details (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess,  Mtrl_Source, Qty_Ordered,QtyScheduled,
//  InspLevel, PackingLevel, UnitPrice, UnitWt, Order_Status, JWCost, MtrlCost, Operation, tolerance,Delivery_Date)
//           VALUES ('${element.Order_No}', '${element.Order_Srl}', '${
//             element.Cust_Code
//           }', '${element.DwgName || ""}', '${element.Mtrl_Code || ""}', '${
//             element.MProcess || ""
//           }', '${element.Mtrl_Source || ""}', '${parseInt(
//             element.Qty_Ordered || 0
//           )}', '${parseInt(
//             element.QtyScheduled || 0
//           )}','${element.InspLevel || "Insp1"}', '${
//             element.PackingLevel || "Pkng1"
//           }', '${parseFloat(element.UnitPrice || 0).toFixed(2)}', '${parseFloat(
//             element.UnitWt || 0
//           ).toFixed(3)}', '${
//             element.Order_Status || "Received"
//           }', '${parseFloat(element.JWCost || 0).toFixed(2)}', '${parseFloat(
//             element.MtrlCost || 0
//           ).toFixed(2)}', '${element.Operation || ""}', '${
//             element.tolerance || ""
//           }','${
//             element.Delivery_Date || null
//           }')`,
//           (err, deleteOrderData) => {
//             if (err) {
//               res.status(500).send("Internal Server Error");
//             } else {
//               console.log("deleteOrderData", deleteOrderData);
//             }
//           }
//         );
//       } catch (error) {
//         next(error);
//       }
//     }

//     res.send({ result: true });
//   }
// );

// OrderDetailsRouter.post(
//   `/postDetailsDataInImportOldOrder`,
//   async (req, res, next) => {
//     console.log("Entering into postDetailsDataInImportOldOrder");
//     console.log("req.body", req.body);

//     try {
//       const queries = req.body.detailsData.map((element) => {
//         return new Promise((resolve, reject) => {
//           // Convert Delivery_Date to MySQL DATETIME format if it exists
//           const deliveryDate = element.Delivery_Date
//             ? new Date(element.Delivery_Date).toISOString().slice(0, 19).replace("T", " ")
//             : null;

//           misQueryMod(
//             `INSERT INTO magodmis.order_details (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess,  Mtrl_Source, Qty_Ordered,QtyScheduled,
//             InspLevel, PackingLevel, UnitPrice, UnitWt, Order_Status, JWCost, MtrlCost, Operation, tolerance, Delivery_Date)
//             VALUES ('${element.Order_No}', '${element.Order_Srl}', '${element.Cust_Code}', '${element.DwgName || ""}', '${element.Mtrl_Code || ""}',
//             '${element.MProcess || ""}', '${element.Mtrl_Source || ""}', '${parseInt(element.Qty_Ordered || 0)}', '${parseInt(element.QtyScheduled || 0)}',
//             '${element.InspLevel || "Insp1"}', '${element.PackingLevel || "Pkng1"}', '${parseFloat(element.UnitPrice || 0).toFixed(2)}',
//             '${parseFloat(element.UnitWt || 0).toFixed(3)}', '${element.Order_Status || "Received"}', '${parseFloat(element.JWCost || 0).toFixed(2)}',
//             '${parseFloat(element.MtrlCost || 0).toFixed(2)}', '${element.Operation || ""}', '${element.tolerance || ""}', ${deliveryDate ? `'${deliveryDate}'` : 'NULL'})`,
//             (err, result) => {
//               if (err) {
//                 reject(err); // If error, reject the promise
//               } else {
//                 resolve(result); // If success, resolve the promise
//               }
//             }
//           );
//         });
//       });

//       // Wait for all queries to complete
//       await Promise.all(queries);

//       // Send response after all insertions are done
//       res.send({ result: true });

//     } catch (error) {
//       next(error); // Handle errors properly
//     }
//   }
// );

// OrderDetailsRouter.post(
//   `/postDetailsDataInImportOldOrder`,
//   async (req, res, next) => {
//     console.log("Entering into postDetailsDataInImportOldOrder");
//     console.log("req.body", req.body);

//     try {
//       let totalNewOrderValue = 0; // Accumulator for new order value
//       let orderNo = null; // Store order number to update `order_list`

//       const insertPromises = req.body.detailsData.map((element) => {
//         return new Promise((resolve, reject) => {
//           // Convert Delivery_Date to MySQL DATETIME format if it exists
//           const deliveryDate = element.Delivery_Date
//             ? new Date(element.Delivery_Date)
//                 .toISOString()
//                 .slice(0, 19)
//                 .replace("T", " ")
//             : null;

//           // Set orderNo for later use
//           if (!orderNo) orderNo = element.Order_No;

//           // Insert into order_details
//           const insertQuery = `
//             INSERT INTO magodmis.order_details
//             (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess, Mtrl_Source,
//             Qty_Ordered, QtyScheduled, InspLevel, PackingLevel, UnitPrice, UnitWt, Order_Status,
//             JWCost, MtrlCost, Operation, tolerance, Delivery_Date)
//             VALUES
//             ('${element.Order_No}', '${element.Order_Srl}', '${
//             element.Cust_Code
//           }', '${element.DwgName || ""}',
//             '${element.Mtrl_Code || ""}', '${element.MProcess || ""}', '${
//             element.Mtrl_Source || ""
//           }',
//             '${parseInt(element.Qty_Ordered || 0)}', '${parseInt(
//             element.QtyScheduled || 0
//           )}',
//             '${element.InspLevel || "Insp1"}', '${
//             element.PackingLevel || "Pkng1"
//           }',
//             '${parseFloat(element.UnitPrice || 0).toFixed(2)}', '${parseFloat(
//             element.UnitWt || 0
//           ).toFixed(3)}',
//             '${element.Order_Status || "Received"}', '${parseFloat(
//             element.JWCost || 0
//           ).toFixed(2)}',
//             '${parseFloat(element.MtrlCost || 0).toFixed(2)}', '${
//             element.Operation || ""
//           }', '${element.tolerance || ""}',
//             ${deliveryDate ? `'${deliveryDate}'` : "NULL"})`;

//           misQueryMod(insertQuery, (err) => {
//             if (err) {
//               reject(err);
//             } else {
//               // Accumulate new order value
//               const newRowValue =
//                 parseInt(element.Qty_Ordered) *
//                 (parseFloat(element.JWCost) + parseFloat(element.MtrlCost));

//               totalNewOrderValue += newRowValue; // Add to accumulator
//               resolve();
//             }
//           });
//         });
//       });

//       // Wait for all rows to be inserted
//       await Promise.all(insertPromises);

//       // Now update ordervalue in order_list once
//       if (!orderNo) {
//         return res.status(400).send("No valid Order_No found in request data.");
//       }

//       const fetchOrderValueQuery = `SELECT ordervalue FROM magodmis.order_list WHERE order_no = '${orderNo}'`;

//       misQueryMod(fetchOrderValueQuery, (err, result) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send("Error fetching current order value.");
//         }

//         if (result.length === 0) {
//           return res.status(404).send("Order not found.");
//         }

//         const currentOrderValue = result[0].ordervalue || 0;
//         const updatedOrderValue = currentOrderValue + totalNewOrderValue;

//         console.log("Total new order value:", totalNewOrderValue);
//         console.log("Updated order value:", updatedOrderValue);

//         const updateQuery = `
//           UPDATE magodmis.order_list
//           SET ordervalue = ${totalNewOrderValue}
//           WHERE order_no = '${orderNo}'`;

//         misQueryMod(updateQuery, (updateErr) => {
//           if (updateErr) {
//             console.error(updateErr);
//             return res.status(500).send("Error updating order value.");
//           }

//           res.send({ result: true, updatedOrderValue });
//         });
//       });
//     } catch (error) {
//       next(error); // Handle errors properly
//     }
//   }
// );

//26-03-2025
OrderDetailsRouter.post(
  `/postDetailsDataInImportOldOrder`,
  async (req, res, next) => {
    console.log("Entering into postDetailsDataInImportOldOrder");
    console.log("req.body", req.body);

    try {
      let totalNewOrderValue = 0;
      let orderNo = null;

      const insertPromises = req.body.detailsData.map((element) => {
        return new Promise((resolve, reject) => {
          const deliveryDate = element.Delivery_Date
            ? new Date(element.Delivery_Date)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            : null;

          if (!orderNo) orderNo = element.Order_No;

          const insertQuery = `
            INSERT INTO magodmis.order_details 
            (Order_No, Order_Srl, Cust_Code, DwgName, Mtrl_Code, MProcess, Mtrl_Source, 
            Qty_Ordered, QtyScheduled, InspLevel, PackingLevel, UnitPrice, UnitWt, Order_Status, 
            JWCost, MtrlCost, Operation, tolerance, Delivery_Date) 
            VALUES 
            ('${element.Order_No}', '${element.Order_Srl}', '${
            element.Cust_Code
          }', '${element.DwgName || ""}', 
            '${element.Mtrl_Code || ""}', '${element.MProcess || ""}', '${
            element.Mtrl_Source || ""
          }', 
            '${parseInt(element.Qty_Ordered || 0)}', '${parseInt(
            element.QtyScheduled || 0
          )}', 
            '${element.InspLevel || "Insp1"}', '${
            element.PackingLevel || "Pkng1"
          }', 
            '${parseFloat(element.UnitPrice || 0).toFixed(2)}', '${parseFloat(
            element.UnitWt || 0
          ).toFixed(3)}', 
            '${element.Order_Status || "Received"}', '${parseFloat(
            element.JWCost || 0
          ).toFixed(2)}', 
            '${parseFloat(element.MtrlCost || 0).toFixed(2)}', '${
            element.Operation || ""
          }', '${element.tolerance || ""}', 
            ${deliveryDate ? `'${deliveryDate}'` : "NULL"})`;

          misQueryMod(insertQuery, (err) => {
            if (err) {
              reject(err);
            } else {
              // Accumulate new order value
              const newRowValue =
                parseInt(element.Qty_Ordered) *
                (parseFloat(element.JWCost) + parseFloat(element.MtrlCost));

              totalNewOrderValue += newRowValue;
              resolve();
            }
          });
        });
      });

      await Promise.all(insertPromises);

      if (!orderNo) {
        return res.status(400).send("No valid Order_No found in request data.");
      }

      // Fetch current order value from order_list
      const fetchOrderValueQuery = `SELECT OrderValue FROM magodmis.order_list WHERE Order_No = '${orderNo}'`;

      misQueryMod(fetchOrderValueQuery, (err, result) => {
        if (err) {
          console.error("Error fetching current order value:", err);
          return res.status(500).send("Error fetching current order value.");
        }

        if (result.length === 0) {
          return res.status(404).send("Order not found.");
        }

        const currentOrderValue = parseFloat(result[0].OrderValue) || 0;
        const updatedOrderValue = currentOrderValue + totalNewOrderValue;

        console.log("Current Order Value:", currentOrderValue);
        console.log("Total New Order Value:", totalNewOrderValue);
        console.log("Updated Order Value:", updatedOrderValue);

        const updateQuery = `
          UPDATE magodmis.order_list 
          SET OrderValue = ${totalNewOrderValue} 
          WHERE Order_No = '${orderNo}'`;

        misQueryMod(updateQuery, (updateErr) => {
          if (updateErr) {
            console.error("Error updating order value:", updateErr);
            return res.status(500).send("Error updating order value.");
          }

          res.send({ result: true, updatedOrderValue });
        });
      });
    } catch (error) {
      next(error);
    }
  }
);

//NEW BULK CHANGE
OrderDetailsRouter.post("/bulkChangeUpdate", async (req, res, next) => {
  console.log("Entered bulkChangeUpdate");
  const orderSrlArray = req.body.OrderSrl;
  const selectedItems = req.body.selectedItems;
  const orderNo = req.body.OrderNo;

  console.log("reqBody", req.body);
  console.log("reqBody", req.body.MtrlSrc);

  let completedUpdates = 0;
  const executeUpdate = (
    orderSrl,
    qtyOrdered,
    DwgName,
    JWCost,
    MtrlCost,
    UnitPrice,
    Operation,
    InspLevel,
    PackingLevel,
    Mtrl_Source,
    Mtrl_Code
  ) => {
    const updateQuery = `
      UPDATE magodmis.order_details
      SET
        Qty_Ordered = ${qtyOrdered},
        DwgName = '${DwgName}',
        JWCost = ${JWCost},
		MtrlCost = ${MtrlCost},
		UnitPrice = ${UnitPrice},
		Operation = '${Operation}',
		InspLevel = '${InspLevel}',
		PackingLevel = '${PackingLevel}',
		Mtrl_Source='${Mtrl_Source}',
		 Mtrl_Code='${Mtrl_Code}'
      WHERE Order_No = ${orderNo} 
      AND Order_Srl = ${orderSrl}
    `;

    console.log(`Executing query for Order_Srl: ${orderSrl}`);
    console.log(`Query: ${updateQuery}`);

    return new Promise((resolve, reject) => {
      misQueryMod(updateQuery, (err, blkcngdata) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          console.log(`Update result for Order_Srl ${orderSrl}:`, blkcngdata);
          resolve(blkcngdata);
        }
      });
    });
  };

  try {
    for (let i = 0; i < orderSrlArray.length; i++) {
      const orderSrl = orderSrlArray[i];
      const oldValues = selectedItems[i];

      console.log("oldValues", oldValues);
      let qtyOrdered; // Define variable to hold the value

      if (typeof oldValues.quantity !== "undefined") {
        qtyOrdered = parseInt(oldValues.quantity); // Assuming quantity is numeric
      } else {
        qtyOrdered = oldValues.Qty_Ordered; // Use oldValues.Qty_Ordered if quantity is undefined
      }
      console.log("qtyOrdered...", qtyOrdered);
      const DwgName = oldValues.DwgName;
      const JWCost = parseInt(oldValues.JWCost);
      const MtrlCost = parseInt(oldValues.MtrlCost);
      const UnitPrice = parseInt(oldValues.UnitPrice);
      const Operation = oldValues.Operation;
      const InspLevel = oldValues.InspLevel;
      const PackingLevel = oldValues.PackingLevel;

      let Mtrl_Source;
      if (req.body.MtrlSrc !== "") {
        Mtrl_Source = req.body.MtrlSrc;
      } else {
        Mtrl_Source = oldValues.Mtrl_Source;
      }
      console.log("Mtrl_Source", Mtrl_Source);
      console.log("oldValues.Mtrl_Source", oldValues.Mtrl_Source);
      const Mtrl_Code = oldValues.Mtrl_Code;
      await executeUpdate(
        orderSrl,
        qtyOrdered,
        DwgName,
        JWCost,
        MtrlCost,
        UnitPrice,
        Operation,
        InspLevel,
        PackingLevel,
        Mtrl_Source,
        Mtrl_Code
      );

      completedUpdates++;
      if (completedUpdates === orderSrlArray.length) {
        res.send({ message: "Updates completed successfully." });
      }
    }
  } catch (error) {
    next(error);
  }
});

//ORDER table values update
// OrderDetailsRouter.post("/ordertablevaluesupdate", async (req, res, next) => {
//   console.log("ordertablevaluesupdate");
//   // console.log("req.body", req.body);
//   // console.log(
//   //   "req.body.updatedRows.Qty_Ordered",
//   //   req.body.updatedRows.Qty_Ordered
//   // );
//   if (Array.isArray(req.body.updatedRows) && req.body.updatedRows.length > 0) {
//   console.log(
//     "req.body.updatedRows[0].Qty_Ordered",
//     req.body.updatedRows[0].Qty_Ordered
//   );}

//   try {
//     // const qtyOrdered = parseInt(req.body.LastSlctedRow.Qty_Ordered);
//     // const materialRate = parseFloat(req.body.LastSlctedRow.MtrlCost);
//     // const jwRate = parseFloat(req.body.LastSlctedRow.JWCost);
//     // const qtyOrdered = parseInt(req.body.updatedRows.Qty_Ordered);
//     // const materialRate = parseFloat(req.body.updatedRows.MtrlCost);
//     // const jwRate = parseFloat(req.body.updatedRows.JWCost);

//     // console.log("qtyOrdered", qtyOrdered);
//     // console.log("materialRate", materialRate);
//     // console.log("jwRate", jwRate);
//     // console.log("orderNo", req.body.orderNo, jwRate);
//     // // console.log("Order_Srl", req.body.LastSlctedRow.Order_Srl);
//     // console.log("Order_Srl", req.body.updatedRows.Order_Srl);

//     const updateQuery = `
//     UPDATE magodmis.order_details
//     SET
//       Qty_Ordered = CASE WHEN ${qtyOrdered} IS NOT NULL THEN ${qtyOrdered} ELSE Qty_Ordered END,
//       JWCost = CASE WHEN ${jwRate} IS NOT NULL THEN ${jwRate} ELSE JWCost END,
//       MtrlCost = CASE WHEN ${materialRate} IS NOT NULL THEN ${materialRate} ELSE MtrlCost END
//     WHERE Order_No = ${req.body.orderNo} AND Order_Srl = ${req.body.updatedRows.Order_Srl}
//   `;

//     misQueryMod(updateQuery, (err, cngdata) => {
//       if (err) {
//         // console.log("err", err);
//         logger.error(err);
//         return next(err);
//       } else {
//         // res.send(singlecngdata);
//         misQueryMod(
//           `SELECT ordervalue FROM magodmis.order_list WHERE order_no = '${req.body.orderNo}'`,
//           (err, result) => {
//             if (err) {
//               logger.error(err);
//               return res
//                 .status(500)
//                 .send("Error fetching current order value.");
//             }

//             if (result.length === 0) {
//               return res.status(404).send("Order not found.");
//             }

//             const currentOrderValue = result[0].ordervalue;
//             const newOrderValue = qtyOrdered * (jwRate + materialRate);
//             const updatedOrderValue = (currentOrderValue || 0) + newOrderValue;

//             // Step 2: Update the ordervalue
//             misQueryMod(
//               `UPDATE magodmis.order_list
// 		       SET ordervalue = ${updatedOrderValue}
// 		       WHERE order_no = '${req.body.orderNo}'`,
//               (err, updateResult) => {
//                 if (err) {
//                   logger.error(err);
//                   return res.status(500).send("Error updating order value.");
//                 }
//                 // console.log("updateResult", updateResult);
//                 res.send({ cngdata, updateResult });
//               }
//             );
//           }
//         );
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// });
// OrderDetailsRouter.post("/ordertablevaluesupdate", async (req, res, next) => {
//   console.log("ordertablevaluesupdate");

//   if (
//     !Array.isArray(req.body.updatedRows) ||
//     req.body.updatedRows.length === 0
//   ) {
//     console.log("updatedRows is empty or not an array");
//     return res.status(400).send("Invalid updatedRows data.");
//   }

//   const orderNo = req.body.orderNo;
//   console.log("orderNo:", orderNo);

//   try {
//     let updateQueries = [];

//     // Prepare update queries for all rows
//     req.body.updatedRows.forEach((row) => {
//       const { Qty_Ordered, MtrlCost, JWCost, Order_Srl } = row;
//       const qtyOrdered = parseInt(Qty_Ordered) || 0;
//       const materialRate = parseFloat(MtrlCost) || 0.0;
//       const jwRate = parseFloat(JWCost) || 0.0;
//       const UnitPrice = jwRate + materialRate || 0.0;

//       console.log(
//         `Processing Order_Srl: ${Order_Srl}, Qty_Ordered: ${qtyOrdered}`
//       );

//       const updateQuery = `
//         UPDATE magodmis.order_details
//         SET
//           Qty_Ordered = CASE WHEN ${qtyOrdered} IS NOT NULL THEN ${qtyOrdered} ELSE Qty_Ordered END,
//           JWCost = CASE WHEN ${jwRate} IS NOT NULL THEN ${jwRate} ELSE JWCost END,
//           MtrlCost = CASE WHEN ${materialRate} IS NOT NULL THEN ${materialRate} ELSE MtrlCost END,
//              UnitPrice = CASE WHEN ${UnitPrice} IS NOT NULL THEN ${UnitPrice} ELSE UnitPrice END
//         WHERE Order_No = '${orderNo}' AND Order_Srl = '${Order_Srl}';
//       `;
//       updateQueries.push(updateQuery);
//     });

//     // Execute all update queries
//     const updatePromises = updateQueries.map(
//       (query) =>
//         new Promise((resolve, reject) => {
//           misQueryMod(query, (err, result) => {
//             if (err) reject(err);
//             else resolve(result);
//           });
//         })
//     );

//     // Execute all updates in parallel
//     await Promise.all(updatePromises);
//     console.log("All rows updated successfully");

//     // Fetch the current order value
//     misQueryMod(
//       `SELECT ordervalue FROM magodmis.order_list WHERE order_no = '${orderNo}'`,
//       (err, result) => {
//         if (err) {
//           logger.error(err);
//           return res.status(500).send("Error fetching current order value.");
//         }

//         if (result.length === 0) {
//           return res.status(404).send("Order not found.");
//         }

//         const currentOrderValue = result[0].ordervalue;
//         let newOrderValue = 0;

//         // Calculate total order value
//         req.body.updatedRows.forEach((row) => {
//           const qtyOrdered = parseInt(row.Qty_Ordered) || 0;
//           const materialRate = parseFloat(row.MtrlCost) || 0.0;
//           const jwRate = parseFloat(row.JWCost) || 0.0;
//           newOrderValue += qtyOrdered * (jwRate + materialRate);
//         });

//         const updatedOrderValue = (currentOrderValue || 0) + newOrderValue;

//         // Update the total order value
//         misQueryMod(
//           `UPDATE magodmis.order_list
//            SET ordervalue = ${updatedOrderValue}
//            WHERE order_no = '${orderNo}'`,
//           (err, updateResult) => {
//             if (err) {
//               logger.error(err);
//               return res.status(500).send("Error updating order value.");
//             }
//             res.send({
//               success: true,
//               message: "Rows updated successfully",
//               updateResult,
//             });
//           }
//         );
//       }
//     );
//   } catch (error) {
//     next(error);
//   }
// });

// 26-03-2025
OrderDetailsRouter.post("/ordertablevaluesupdate", async (req, res, next) => {
  console.log("ordertablevaluesupdate");

  if (
    !Array.isArray(req.body.updatedRows) ||
    req.body.updatedRows.length === 0
  ) {
    console.log("updatedRows is empty or not an array");
    return res.status(400).send("Invalid updatedRows data.");
  }

  const orderNo = req.body.orderNo;
  console.log("orderNo:", orderNo);

  try {
    let updateQueries = [];

    // Prepare update queries for all rows
    req.body.updatedRows.forEach((row) => {
      const { Qty_Ordered, MtrlCost, JWCost, Order_Srl } = row;
      const qtyOrdered = parseInt(Qty_Ordered) || 0;
      const materialRate = parseFloat(MtrlCost) || 0.0;
      const jwRate = parseFloat(JWCost) || 0.0;
      const UnitPrice = jwRate + materialRate || 0.0;

      console.log(
        `Processing Order_Srl: ${Order_Srl}, Qty_Ordered: ${qtyOrdered}`
      );

      const updateQuery = `
        UPDATE magodmis.order_details
        SET
          Qty_Ordered = ${qtyOrdered},
          JWCost = ${jwRate},
          MtrlCost = ${materialRate},
          UnitPrice = ${UnitPrice}
        WHERE Order_No = '${orderNo}' AND Order_Srl = '${Order_Srl}';
      `;
      updateQueries.push(updateQuery);
    });

    // Execute all update queries
    const updatePromises = updateQueries.map(
      (query) =>
        new Promise((resolve, reject) => {
          misQueryMod(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        })
    );

    // Wait for all updates to complete
    await Promise.all(updatePromises);
    console.log("All rows updated successfully");

    // Fetch the total recalculated order value from order_details
    const fetchTotalOrderValueQuery = `
      SELECT SUM(Qty_Ordered * (JWCost + MtrlCost)) AS totalOrderValue 
      FROM magodmis.order_details 
      WHERE Order_No = '${orderNo}'
    `;

    misQueryMod(fetchTotalOrderValueQuery, (err, result) => {
      if (err) {
        console.error("Error fetching total order value:", err);
        return res.status(500).send("Error fetching total order value.");
      }

      if (result.length === 0) {
        return res.status(404).send("Order details not found.");
      }

      const totalOrderValue = parseFloat(result[0].totalOrderValue) || 0;

      console.log("Updated Total Order Value:", totalOrderValue);

      // Update the ordervalue in order_list
      const updateOrderListQuery = `
        UPDATE magodmis.order_list
        SET ordervalue = ${totalOrderValue}
        WHERE Order_No = '${orderNo}'
      `;

      misQueryMod(updateOrderListQuery, (updateErr) => {
        if (updateErr) {
          console.error("Error updating order value in order_list:", updateErr);
          return res.status(500).send("Error updating order value.");
        }

        res.send({
          success: true,
          message: "Rows updated successfully and order value recalculated",
          updatedOrderValue: totalOrderValue,
        });
      });
    });
  } catch (error) {
    next(error);
  }
});


// OrderDetailsRouter.post("/singleChangeUpdate", async (req, res, next) => {
//   // console.log("enter into singleChangeUpdate -- shravan");
//   // console.log("req.body", req.body);

//   try {
//     const qtyOrdered = parseInt(req.body.quantity);
//     const jwRate = parseFloat(req.body.JwCost);
//     const materialRate = parseFloat(req.body.mtrlcost);
//     const unitPrice = parseFloat(req.body.unitPrice);
//     const Operation = req.body.Operation;
//     const InspLvl = req.body.InspLvl;
//     const PkngLvl = req.body.PkngLvl;
//     const DwgName = req.body.DwgName;
//     const Mtrl_Source = req.body.MtrlSrc;
//     const Mtrl_Code = req.body.strmtrlcode;

//     const updateQuery = `
//     UPDATE magodmis.order_details
//     SET
//       Qty_Ordered = CASE WHEN ${qtyOrdered} IS NOT NULL THEN ${qtyOrdered} ELSE Qty_Ordered END,
//       JWCost = CASE WHEN ${jwRate} IS NOT NULL THEN ${jwRate} ELSE JWCost END,
//       MtrlCost = CASE WHEN ${materialRate} IS NOT NULL THEN ${materialRate} ELSE MtrlCost END,
//       UnitPrice = CASE WHEN ${unitPrice} IS NOT NULL THEN ${unitPrice} ELSE UnitPrice END,
//       Operation = '${Operation}',
//       InspLevel = '${InspLvl}',
//       PackingLevel = '${PkngLvl}',
//       DwgName = '${DwgName}',
//       Mtrl_Source = '${Mtrl_Source}',
//       Mtrl_Code = '${Mtrl_Code}'
//     WHERE Order_No = '${req.body.OrderNo}' AND Order_Srl = '${req.body.OrderSrl}'
//   `;

//     misQueryMod(updateQuery, (err, singlecngdata) => {
//       if (err) {
//         console.log("err", err);
//         logger.error(err);
//         // res.send("error");
//         return next(err);
//       } else {
//         //console.log("blkcngdata", singlecngdata);
//         // res.send(singlecngdata);
//         misQueryMod(
//           `SELECT ordervalue FROM magodmis.order_list WHERE order_no = '${req.body.OrderNo}'`,
//           (err, result) => {
//             if (err) {
//               logger.error(err);
//               return res
//                 .status(500)
//                 .send("Error fetching current order value.");
//             }

//             if (result.length === 0) {
//               return res.status(404).send("Order not found.");
//             }

//             const currentOrderValue = result[0].ordervalue;
//             console.log("==currentOrderValue",currentOrderValue);

//             const newOrderValue = qtyOrdered * (jwRate + materialRate);
//             console.log("==newOrderValue",newOrderValue);

//             const updatedOrderValue = (currentOrderValue || 0) + newOrderValue;

//             console.log("==updatedOrderValue",updatedOrderValue);
//             // Step 2: Update the ordervalue
//             misQueryMod(
//               `UPDATE magodmis.order_list
// 		 SET ordervalue = ${updatedOrderValue}
// 		 WHERE order_no = '${req.body.OrderNo}'`,
//               (err, updateResult) => {
//                 if (err) {
//                   logger.error(err);
//                   return res.status(500).send("Error updating order value.");
//                 }

//                 // console.log("updateResult", updateResult);

//                 res.send({ singlecngdata, updateResult });
//               }
//             );
//           }
//         );
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// OrderDetailsRouter.post(`/postDeleteDetailsBySrl`, async (req, res, next) => {
//   // console.log("req.body", req.body);
//   try {
//     const selectedSrl = req.body.selectedSrl; // Assuming req.body.selectedSrl is an array like [1, 2]
//     const selectedItems = req.body.selectedItems; // Assuming req.body.selectedSrl is an array like [1, 2]

//     for (let i = 0; i < selectedItems.length; i++) {
//       // console.log("selectItem", selectedItems[i].Order_Srl);
//       misQueryMod(
//         `DELETE FROM magodmis.order_details WHERE (Order_No = '${req.body.Order_No}') AND (Order_Srl = '${selectedItems[i].Order_Srl}');`,
//         (err, deleteOrderData) => {
//           if (err) {
//             console.error(err);
//             res.status(500).send("Internal Server Error");
//           } else {
//             console.log("deleteOrderData",deleteOrderData);

//             // console.log(
//             //   `Deleted order with Order_No '${req.body.Order_No}' and Order_Srl '${selectedItems[i].Order_Srl}'`
//             // );
//             misQueryMod(
//               `SELECT * FROM magodmis.order_details WHERE Order_No='${req.body.Order_No}'`,
//               (err, orderDetails) => {
//                 if (err) {
//                   console.error("Error fetching remaining order details:", err);
//                   return res.status(500).send("Error fetching remaining order details.");
//                 }

//                 console.log("Remaining order details:", orderDetails);

//                 // If no records remain, reset ordervalue to 0
//                 let updatedOrderValue = 0;
//                 if (orderDetails.length > 0) {
//                   updatedOrderValue = orderDetails.reduce((total, row) => {
//                     return total + row.Qty_Ordered * (row.JWCost + row.MtrlCost);
//                   }, 0);
//                 }

//                 console.log(`New calculated order value: ${updatedOrderValue}`);

//                 // Step 3: Update the order value in order_list
//                 misQueryMod(
//                   `UPDATE magodmis.order_list SET ordervalue = ${updatedOrderValue} WHERE Order_No = '${req.body.Order_No}'`,
//                   (err, updateResult) => {
//                     if (err) {
//                       console.error("Error updating order value:", err);
//                       return res.status(500).send("Error updating order value.");
//                     }

//                     console.log(`Updated order value for Order_No: ${req.body.Order_No} to ${updatedOrderValue}`);
//                     res.send({ success: true, updatedOrderValue });
//                   }
//                 );
//               })
//           }
//         }
//       );
//     }
//     // Iterate over each selectedSrl value and generate a DELETE query for each
//     // for (let i = 0; i < selectedSrl.length; i++) {
//     // misQueryMod(
//     // 	`DELETE FROM magodmis.order_details WHERE (Order_No = '${req.body.Order_No}') AND (Order_Srl = '${selectedSrl[i]}');`,
//     // 	(err, deleteOrderData) => {
//     // 		if (err) {
//     // 			console.error(err);
//     // 			res.status(500).send("Internal Server Error");
//     // 		} else {
//     // 			console.log(
//     // 				`Deleted order with Order_No '${req.body.Order_No}' and Order_Srl '${selectedSrl[i]}'`
//     // 			);
//     // 		}
//     // 	}
//     // );
//     // }

//     // Send response after all DELETE queries have been executed
//     res.send({ flag: 1 });
//   } catch (error) {
//     next(error);
//   }
// });

OrderDetailsRouter.post("/singleChangeUpdate", async (req, res, next) => {
  try {
    // Ensure all numeric values are valid, else default to 0
    const qtyOrdered = parseInt(req.body.quantity) || 0;
    const jwRate = parseFloat(req.body.JwCost) || 0;
    const materialRate = parseFloat(req.body.mtrlcost) || 0;
    const unitPrice = parseFloat(req.body.unitPrice) || 0;

    const Operation = req.body.Operation || "";
    const InspLvl = req.body.InspLvl || "";
    const PkngLvl = req.body.PkngLvl || "";
    const DwgName = req.body.DwgName || "";
    const Mtrl_Source = req.body.MtrlSrc || "";
    const Mtrl_Code = req.body.strmtrlcode || "";

    // Fetch the old order details before updating
    misQueryMod(
      `SELECT Qty_Ordered, JWCost, MtrlCost FROM magodmis.order_details 
       WHERE Order_No = '${req.body.OrderNo}' AND Order_Srl = '${req.body.OrderSrl}'`,
      (err, oldRowResult) => {
        if (err) {
          logger.error(err);
          return res.status(500).send("Error fetching old order details.");
        }

        if (oldRowResult.length === 0) {
          return res.status(404).send("Order detail not found.");
        }

        const oldQtyOrdered = parseInt(oldRowResult[0].Qty_Ordered) || 0;
        const oldJwCost = parseFloat(oldRowResult[0].JWCost) || 0;
        const oldMtrlCost = parseFloat(oldRowResult[0].MtrlCost) || 0;
        const oldOrderValue = oldQtyOrdered * (oldJwCost + oldMtrlCost);

        // Update order details
        const updateQuery = `
        UPDATE magodmis.order_details
        SET
          Qty_Ordered = ${qtyOrdered},
          JWCost = ${jwRate},
          MtrlCost = ${materialRate},
          UnitPrice = ${unitPrice},
          Operation = '${Operation}',
          InspLevel = '${InspLvl}',
          PackingLevel = '${PkngLvl}',
          DwgName = '${DwgName}',
          Mtrl_Source = '${Mtrl_Source}',
          Mtrl_Code = '${Mtrl_Code}'
        WHERE Order_No = '${req.body.OrderNo}' AND Order_Srl = '${req.body.OrderSrl}'`;

        misQueryMod(updateQuery, (err, singlecngdata) => {
          if (err) {
            logger.error(err);
            return next(err);
          }

          // Fetch current order value
          misQueryMod(
            `SELECT ordervalue FROM magodmis.order_list WHERE order_no = '${req.body.OrderNo}'`,
            (err, result) => {
              if (err) {
                logger.error(err);
                return res
                  .status(500)
                  .send("Error fetching current order value.");
              }

              if (result.length === 0) {
                return res.status(404).send("Order not found.");
              }

              const currentOrderValue = parseFloat(result[0].ordervalue) || 0;
              const newOrderValue = qtyOrdered * (jwRate + materialRate);
              const finalOrderValue =
                currentOrderValue - oldOrderValue + newOrderValue;

              // Update order value in order_list
              misQueryMod(
                `UPDATE magodmis.order_list SET ordervalue = ${finalOrderValue} WHERE order_no = '${req.body.OrderNo}'`,
                (err, updateResult) => {
                  if (err) {
                    logger.error(err);
                    return res.status(500).send("Error updating order value.");
                  }
                  res.send({ singlecngdata, updateResult });
                }
              );
            }
          );
        });
      }
    );
  } catch (error) {
    next(error);
  }
});

OrderDetailsRouter.post(`/postDeleteDetailsBySrl`, async (req, res, next) => {
  try {
    const { Order_No, selectedItems } = req.body;

    if (!selectedItems || selectedItems.length === 0) {
      return res.status(400).json({ error: "No selected items provided" });
    }

    for (const item of selectedItems) {
      await misQueryMod(
        `DELETE FROM magodmis.order_details WHERE Order_No = ? AND Order_Srl = ?`,
        [Order_No, item.Order_Srl]
      );
      console.log(`Deleted Order_Srl: ${item.Order_Srl}`);
    }

    const orderDetails = await misQueryMod(
      `SELECT Qty_Ordered, JWCost, MtrlCost FROM magodmis.order_details WHERE Order_No = ?`,
      [Order_No]
    );

    let updatedOrderValue = 0;
    if (Array.isArray(orderDetails) && orderDetails.length > 0) {
      updatedOrderValue = orderDetails.reduce((total, row) => {
        console.log("row", row);

        return (
          total +
          (row.Qty_Ordered ?? 0) *
            ((parseFloat(row.JWCost) ?? 0.0) +
              (parseFloat(row.MtrlCost) ?? 0.0))
        );
      }, 0);
    }
    console.log("TYPE", typeof updatedOrderValue);
    console.log("updatedOrderValue", updatedOrderValue);

    await misQueryMod(
      `UPDATE magodmis.order_list SET OrderValue = ? WHERE Order_No = ?`,
      [parseInt(updatedOrderValue), Order_No]
    );

    console.log(
      `Updated order value for Order_No: ${Order_No} to ${updatedOrderValue}`
    );
    res.send({ success: true, updatedOrderValue });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
});

module.exports = OrderDetailsRouter;
