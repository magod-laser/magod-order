/** @format */

import React, { useRef, useEffect, useState } from "react";
import {
	Page,
	Document,
	StyleSheet,
	View,
	Text,
	Image,
} from "@react-pdf/renderer";
import MLLogo from "../../../../../ML-LOGO.png";
// import { apipoints } from "../../../../api/PackInv_API/PackingNote/PackingNote";

// import Axios from "axios";
// apipoints

export default function PrintPackingNote(props) {
	// console.log("props.... invRegisterData", props.invRegisterData);

	// const rowLimit = 20;
	// const [tableData, setTableData] = useState([]);

	const style = {
		pageStyling: { padding: "2%", fontSize: "10px", fontFamily: "Helvetica" },
		globalPadding: { padding: "0.6%" },
		fontBold: {
			//   fontWeight: "bold",
			fontSize: "10px",
			fontFamily: "Helvetica-Bold",
		},
	};

	const copiesNames = [
		{ copyName: "Original for Buyer" },
		{ copyName: "Office Copy" },
	];

	// function* chunks(arr, n) {
	//   for (let i = 0; i < arr.length; i += n) {
	//     yield arr.slice(i, i + n);
	//   }
	// }

	// useEffect(() => {
	//   setTableData([...chunks(props?.invDetailsData, rowLimit)]);
	// });

	// console.log("inside print..", [...chunks(props?.invDetailsData, rowLimit)]);

	// function* chunks(arr, n) {
	//   for (let i = 0; i < arr.length; i += n) {
	//     yield arr.slice(i, i + n);
	//   }
	// }

	// console.log("props.invDetails", props.invDetailsData);
	// console.log("table dataaaa", tableData);
	// const [PrintableData, setPrintableData] = useState([]);

	// useEffect(() => {
	//   Axios.post(apipoints.getPrintData, {
	//     DCInvNo: props.props?.DCInvNo,
	//   }).then((res) => {
	//     // console.log("response from BE in PDF", res);
	//     setPrintableData(res.data);
	//   });
	// }, []);

	// // console.log("props inside pdfffff", props);

	// // console.log("PrintableData", PrintableData);
	// // console.log("table data...", tableData);

	// // page quantity calculation
	let pageQuantity = [];
	props.invDetailsData.map((v1, k1) => {
		pageQuantity[k1] = 0;
		{
			v1.map((v2, k2) => {
				pageQuantity[k1] = parseFloat(pageQuantity[k1]) + parseFloat(v2.Qty);
			});
		}
	});

	// total item count
	var totalItems = 0;
	for (let i = 0; i < props.invDetailsData?.length; i++) {
		const element = props.invDetailsData[i];
		totalItems = totalItems + element.length;
		// for (let j = 0; j < element0.length; j++) {
		//   const element1 = element0[j];

		// }
	}

	// // total quantity
	var totalQty = 0;
	for (let i = 0; i < props.invDetailsData?.length; i++) {
		const element0 = props.invDetailsData[i];
		for (let j = 0; j < element0.length; j++) {
			const element1 = element0[j];
			totalQty = parseInt(totalQty) + parseInt(element1.Qty);
		}
	}
	// console.log("totalQTY", totalQty);

	// // totalWeight
	var totalWeight = 0;
	for (let i = 0; i < props.invDetailsData.length; i++) {
		const element0 = props.invDetailsData[i];
		for (let j = 0; j < element0.length; j++) {
			const element1 = element0[j];

			totalWeight =
				totalWeight + parseFloat(element1.Qty) * parseFloat(element1.Unit_Wt);
		}
	}

	// payonBefore
	let payOnBefore = "";
	if (
		props.invRegisterData?.BillType === "Credit" &&
		props.invRegisterData.Inv_No?.length > 0 &&
		// finding int in payment terms
		props.invRegisterData.PaymentTerms?.match(/\d+/g)
	) {
		let newInvDate = new Date(
			props.invRegisterData.Inv_Date?.split("/")[1] +
				"/" +
				props.invRegisterData.Inv_Date?.split("/")[0] +
				"/" +
				props.invRegisterData.Inv_Date?.split("/")[2]
		);

		newInvDate.setDate(
			newInvDate.getDate() +
				parseInt(props.invRegisterData.PaymentTerms.split(" Days Credit")[0])
		);
		payOnBefore =
			(parseInt(newInvDate.getDate()) < 10
				? "0" + newInvDate.getDate()
				: newInvDate.getDate()) +
			"/" +
			(parseInt(newInvDate.getMonth()) + 1 < 10
				? "0" + (parseInt(newInvDate.getMonth()) + 1)
				: parseInt(newInvDate.getMonth()) + 1) +
			"/" +
			newInvDate.getFullYear();
		// console.log("payon before...", payOnBefore);
	} else {
	}

	// finyear

	let pnDate = new Date(
		`${props.invRegisterData.Printable_DC_Date?.split("/")[1]}-${
			props.invRegisterData.Printable_DC_Date?.split("/")[0]
		}-${props.invRegisterData.Printable_DC_Date?.split("/")[2]}`
	);
	let InvDate = new Date(
		`${props.invRegisterData.Printable_Inv_Date?.split("/")[1]}-${
			props.invRegisterData.Printable_Inv_Date?.split("/")[0]
		}-${props.invRegisterData.Printable_Inv_Date?.split("/")[2]}`
	);

	let PNFinYear = "";
	let InvFinYear = "";

	// calculating PNFinYear
	if (pnDate.getMonth() + 1 <= 3) {
		PNFinYear = `${String(pnDate.getFullYear() - 1).substring(2)}/${String(
			pnDate.getFullYear()
		).substring(2)}`;
	} else {
		PNFinYear = `${String(pnDate.getFullYear()).substring(2)}/${String(
			parseInt(pnDate.getFullYear()) + 1
		).substring(2)}`;
	}

	// calculating InvFinYear
	if (InvDate.getMonth() + 1 <= 3) {
		InvFinYear = `${String(InvDate.getFullYear() - 1).substring(2)}/${String(
			InvDate.getFullYear()
		).substring(2)}`;
	} else {
		InvFinYear = `${String(InvDate.getFullYear()).substring(2)}/${String(
			parseInt(InvDate.getFullYear()) + 1
		).substring(2)}`;
	}

	return (
		<>
			<Document>
				{copiesNames.map((copyVal, copyKey) => (
					<>
						{props?.invDetailsData?.map((outerVal, outerKey) => (
							<Page
								size="A4"
								style={{ ...style.pageStyling }}>
								<View>
									{/* top heading */}
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
										}}>
										{/* <View> */}
										<Image
											src={MLLogo}
											style={{ width: "8.3%" }}
										/>
										{/* </View> */}
										<View
											style={{
												display: "flex",
												flexDirection: "column",
												//   justifyContent: "center",
												alignItems: "center",
											}}>
											<View>
												<Text
													style={{
														borderBottom: "1px",
														...style.fontBold,
														fontSize: "11px",
													}}>
													Packing Note and Delivery Challan
												</Text>
											</View>
											<Text style={{ ...style.fontBold, fontSize: "11px" }}>
												Magod Laser Machining Private Limited
											</Text>
											<Text style={{ ...style.fontBold }}>
												GST: 29AABCM1970H1ZE CIN: U28900KA1995PTC018437
											</Text>
											<Text>
												Plot No 72, 2nd Phase, KIADB Indl Area Jigani, Anekal
												Taluk Bengaluru - 560105
											</Text>
											<Text>
												Ph : 08110 414313, 9513393352, sales@magodlaser.in,
												www.magodlaser.in
											</Text>
										</View>
										{/* <View> */}
										<Text style={{ width: "10%" }}>{copyVal.copyName}</Text>
										{/* </View> */}
									</View>
									<View style={{ ...style.globalPadding }}></View>
									{/* main content starts */}
									<View style={{ border: "1px" }}>
										{/* address section */}
										<View
											style={{
												borderBottom: "1px",
												display: "flex",
												flexDirection: "row",
												minHeight: "90px",
											}}>
											<View
												style={{
													width: "65%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>
													Billing Address :
												</Text>
												<View style={{ ...style.globalPadding }}>
													<Text style={{ ...style.fontBold }}>
														{props.invRegisterData?.Cust_Name}
													</Text>

													<Text>
														{props.invRegisterData?.Cust_Address},{" "}
														{props.invRegisterData?.Cust_Place},{" "}
														{props.invRegisterData?.Cust_State} -{" "}
														{props.invRegisterData?.PIN_Code}
													</Text>

													<View
														style={{ display: "flex", flexDirection: "row" }}>
														<Text style={{ ...style.fontBold }}>GSTIN : </Text>
														<Text>
															{props.invRegisterData?.GSTNo === null ||
															props.invRegisterData?.GSTNo === "null" ||
															props.invRegisterData?.GSTNo === undefined ||
															props.invRegisterData?.GSTNo === ""
																? ""
																: props.invRegisterData?.GSTNo}
														</Text>
													</View>
												</View>
											</View>
											<View style={{ width: "35%", ...style.globalPadding }}>
												<Text style={{ ...style.fontBold }}>
													Shipping Address :
												</Text>
												<View style={{ ...style.globalPadding }}>
													<Text>
														{props.invRegisterData?.Del_Address === null ||
														props.invRegisterData?.Del_Address === "null" ||
														props.invRegisterData?.Del_Address === undefined ||
														props.invRegisterData?.Del_Address === ""
															? ""
															: props.invRegisterData?.Del_Address}
													</Text>
												</View>
											</View>
										</View>
										{/* bill details */}
										<View
										// style={{
										//   display: "flex",
										//   flexDirection: "row",
										//   borderBottom: "1px",
										//   //   minHeight: "180px",
										// }}
										>
											{/* customer po and page */}
											<View
												style={{
													borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>Customer PO</Text>
												</View>
												<View
													style={{
														width: "30%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>{props.invRegisterData?.PO_No}</Text>
												</View>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>Page</Text>
												</View>
												<View style={{ width: "30%", ...style.globalPadding }}>
													<Text>
														{outerKey + 1} of {props.invDetailsData.length}
													</Text>
													{/* <Text>needed</Text> */}
												</View>
											</View>

											{/* packing note no and  packing date */}
											<View
												style={{
													borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Packing Note No
													</Text>
												</View>
												<View
													style={{
														width: "30%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>
														{props.invRegisterData?.DC_No
															? `${PNFinYear}/${props.invRegisterData?.DC_No}`
															: props.invRegisterData?.DCStatus}
													</Text>
												</View>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Packing Date
													</Text>
												</View>
												<View style={{ width: "30%", ...style.globalPadding }}>
													<Text>
														{props.invRegisterData?.Printable_DC_Date}
													</Text>
												</View>
											</View>
											{/* Proforma Invoice Type */}
											<View
												style={{
													borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Proforma Invoice Type
													</Text>
												</View>
												<View
													style={{
														width: "30%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>{props.invRegisterData?.DC_InvType}</Text>
												</View>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}></Text>
												</View>
												<View style={{ width: "30%", ...style.globalPadding }}>
													<Text></Text>
												</View>
											</View>
											{/* Proforma Invoice No and invoice date */}
											<View
												style={{
													borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Proforma Invoice No
													</Text>
												</View>
												<View
													style={{
														width: "30%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>
														{props.invRegisterData?.Inv_No
															? `${props.invRegisterData?.Inv_No} - ${InvFinYear}`
															: ""}
														{/* {`${props.invRegisterData?.Inv_No} - ${InvFinYear}`} */}
													</Text>
												</View>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Invoice Date
													</Text>
												</View>
												<View style={{ width: "30%", ...style.globalPadding }}>
													<Text>
														{props.invRegisterData?.Printable_Inv_Date}
													</Text>
												</View>
											</View>
											{/* eway bill no and pay on before */}
											<View
												style={{
													borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Eway Bill No
													</Text>
												</View>
												<View
													style={{
														width: "80%",
														// borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>{props.invRegisterData?.EWayBillRef}</Text>
												</View>
												{/* <View
                          style={{
                            width: "20%",
                            borderRight: "1px",
                            ...style.globalPadding,
                          }}
                        >
                          <Text style={{ ...style.fontBold }}>
                            Pay on Before
                          </Text>
                        </View>
                        <View style={{ width: "30%", ...style.globalPadding }}>
                          <Text>{payOnBefore}</Text>
                        </View> */}
											</View>

											{/* pan no and msme no */}
											<View
												style={{
													borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>PAN No</Text>
												</View>
												<View
													style={{
														width: "23%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>{props.invRegisterData?.PAN_No}</Text>
												</View>
												<View
													style={{
														width: "17%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>MSME No</Text>
												</View>
												<View style={{ width: "40%", ...style.globalPadding }}>
													{/* <Text>data...</Text> */}
												</View>
											</View>
										</View>

										{/* table content */}
										<View>
											{/* table heading -Item List*/}
											<View
												style={{
													display: "flex",
													flexDirection: "row",
													justifyContent: "center",
													borderBottom: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Item List</Text>
											</View>
											{/* table starts */}
											<View>
												{/* table header */}

												<View
													style={{
														display: "flex",
														flexDirection: "row",
														justifyContent: "flex-satrt",
														borderBottom: "1px",
														// ...style.globalPadding,
													}}>
													{/* sl no */}
													<View
														style={{
															display: "flex",
															// flexDirection: "row",
															// justifyContent: "flex-satrt",
															borderRight: "1px",
															width: "7%",
															...style.globalPadding,
														}}>
														<Text style={{ ...style.fontBold }}>SL No</Text>
													</View>
													{/* desc of goods */}
													<View
														style={{
															display: "flex",
															// flexDirection: "row",
															// justifyContent: "flex-satrt",
															borderRight: "1px",
															width: "46%",
															...style.globalPadding,
														}}>
														<Text style={{ ...style.fontBold }}>
															Description of goods / Drawing No
														</Text>
													</View>
													{/* material */}
													<View
														style={{
															display: "flex",
															// flexDirection: "row",
															// justifyContent: "flex-satrt",
															borderRight: "1px",
															width: "21%",
															...style.globalPadding,
														}}>
														<Text style={{ ...style.fontBold }}>Material</Text>
													</View>

													{/* Packaging level */}
													<View
														style={{
															display: "flex",
															// flexDirection: "row",
															// justifyContent: "flex-satrt",
															borderRight: "1px",
															width: "9%",
															...style.globalPadding,
														}}>
														<Text style={{ ...style.fontBold }}>Pnkg Lvl</Text>
													</View>

													{/* inspection level */}

													<View
														style={{
															display: "flex",
															// flexDirection: "row",
															// justifyContent: "flex-satrt",
															borderRight: "1px",
															width: "9%",
															...style.globalPadding,
														}}>
														<Text style={{ ...style.fontBold }}>Insp Lvl</Text>
													</View>

													{/* Qty */}
													<View
														style={{
															display: "flex",
															// flexDirection: "row",
															// justifyContent: "flex-satrt",
															// borderRight: "1px",
															width: "8%",
															...style.globalPadding,
														}}>
														<Text style={{ ...style.fontBold }}>Qty</Text>
													</View>
												</View>
												{/* table data */}
												<View style={{ height: "315px", borderBottom: "1px" }}>
													{outerVal.map((innerVal, innerKey) => (
														<View
															style={
																innerKey + 1 === props.rowLimit
																	? {
																			display: "flex",
																			flexDirection: "row",
																			justifyContent: "flex-satrt",
																			// borderBottom: "5px",
																			// border: "none",
																	  }
																	: {
																			display: "flex",
																			flexDirection: "row",
																			justifyContent: "flex-satrt",
																			borderBottom: "1px",
																	  }
															}>
															{/* sl no */}
															<View
																style={{
																	display: "flex",
																	// flexDirection: "row",
																	// justifyContent: "flex-satrt",
																	borderRight: "1px",
																	width: "7%",
																	...style.globalPadding,
																}}>
																<Text>
																	{props.rowLimit * outerKey + innerKey + 1}
																</Text>
															</View>
															{/* desc of goods */}
															<View
																style={{
																	display: "flex",
																	// flexDirection: "row",
																	// justifyContent: "flex-satrt",
																	borderRight: "1px",
																	width: "46%",
																	...style.globalPadding,
																}}>
																<Text>{innerVal.Dwg_No}</Text>
															</View>
															{/* material */}
															<View
																style={{
																	display: "flex",
																	// flexDirection: "row",
																	// justifyContent: "flex-satrt",
																	borderRight: "1px",
																	width: "21%",
																	...style.globalPadding,
																}}>
																<Text>{innerVal.Mtrl}</Text>
															</View>

															{/* Packaging level */}
															<View
																style={{
																	display: "flex",
																	// flexDirection: "row",
																	// justifyContent: "flex-satrt",
																	borderRight: "1px",
																	width: "9%",
																	...style.globalPadding,
																}}>
																<Text>{innerVal.PkngLevel}</Text>
															</View>

															{/* inspection level */}

															<View
																style={{
																	display: "flex",
																	// flexDirection: "row",
																	// justifyContent: "flex-satrt",
																	borderRight: "1px",
																	width: "9%",
																	...style.globalPadding,
																}}>
																<Text>{innerVal.InspLevel}</Text>
															</View>

															{/* Qty */}
															<View
																style={{
																	display: "flex",
																	// flexDirection: "row",
																	// justifyContent: "flex-satrt",
																	// borderRight: "1px",
																	width: "8%",
																	...style.globalPadding,
																}}>
																<Text>{innerVal.Qty}</Text>
															</View>
														</View>
													))}
												</View>
											</View>
										</View>

										{/* footer starts */}
										<View>
											{/* page items count, page items quantiy, total items count, total items quantity */}

											<View
												style={{
													display: "flex",
													flexDirection: "row",
													borderBottom: "1px",
													...style.fontBold,
												}}>
												<View
													style={{
														...style.globalPadding,
														width: "25%",
														borderRight: "1px",
													}}>
													<Text>Page Items Count = {outerVal.length}</Text>
													{/* <Text>Page Items Count = needed</Text> */}
												</View>

												<View
													style={{
														...style.globalPadding,
														width: "25%",
														borderRight: "1px",
													}}>
													<Text>
														Page Items Quantity = {pageQuantity[outerKey]}
													</Text>
													{/* <Text>Page Items Quantity = needed</Text> */}
												</View>
												<View
													style={{
														...style.globalPadding,
														width: "25%",
														borderRight: "1px",
													}}>
													<Text>Total Item Count = {totalItems}</Text>
													{/* <Text>Total Item Count = needed</Text> */}
												</View>
												<View
													style={{
														...style.globalPadding,
														width: "25%",
														// borderRight: "1px",
													}}>
													<Text>Total Items Quantity = {totalQty}</Text>
													{/* <Text>Total Items Quantity = needed</Text> */}
												</View>
											</View>

											{/* acknowledgement and total weight */}
											<View
												style={{
													display: "flex",
													flexDirection: "row",
													borderBottom: "1px",
													minHeight: "51px",
												}}>
												<View
													style={{
														width: "66%",
														borderRight: "1px",
														...style.globalPadding,
														display: "flex",
														flexDirection: "column",
													}}>
													<Text>
														Please receive the above goods return to us the
														duplicate copy of "Delivery Challian" Dulystamped
														and receipted in acknowledgment of having received
														the material in good condition.anyissuse on this
														transactions, kindly intimate to us in writing
														within 3days from the date receipt
													</Text>
													<Text>SUBJECT TO BANGALORE JURISDICTION</Text>
												</View>
												<View style={{ width: "34%", ...style.globalPadding }}>
													<Text>
														Total Weight in KGs = {totalWeight.toFixed(2)}
													</Text>
													{/* <Text>Total Weight in KGs = needed</Text> */}
												</View>
											</View>
											{/* signaturessss */}
											<View
												style={{
													display: "flex",
													flexDirection: "row",
													// borderBottom: "1px",
													...style.fontBold,
													minHeight: "51px",
												}}>
												<View
													style={{
														width: "66%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>Customer Signature with Seal</Text>
												</View>
												<View
													style={{
														width: "34%",
														...style.globalPadding,
														display: "flex",
														flexDirection: "column",
														justifyContent: "space-between",
														alignItems: "flex-end",
													}}>
													<Text>For, Magod Laser Machining Pvt. Ltd.</Text>
													<Text>Authorised Signatory.</Text>
												</View>
											</View>
										</View>
										{/* footer ends */}
									</View>
									{/* border ends here */}
									{/* address after border */}
									<View
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}>
										<Text>
											Registered office: #72, Phase II, KIADB Indl Area, Jigani,
											Anekal Taluk, Bengaluru - 560105.
										</Text>
									</View>
								</View>
							</Page>
						))}
					</>
				))}
			</Document>
		</>
	);
}

// .............................

// {tableData.map((outerVal, outerKey) => (
//   <View>
//     {/* top heading */}
//     <View
//       style={{
//         display: "flex",
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//       }}
//     >
//       {/* <View> */}
//       <Image src={MLLogo} style={{ width: "8.3%" }} />
//       {/* </View> */}
//       <View
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           //   justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <View>
//           <Text style={{ borderBottom: "1px", ...style.fontBold }}>
//             Packing Note and Delivery Challan
//           </Text>
//         </View>
//         <Text style={{ ...style.fontBold }}>
//           Magod Laser Machining Private Limited
//         </Text>
//         <Text style={{ ...style.fontBold }}>
//           GST: 29AABCM1970H1ZE CIN: U28900KA1995PTC018437
//         </Text>
//         <Text>
//           Plot No 72, 2nd Phase, KIADB Indl Area Jigani, Anekal
//           Taluk Bengaluru - 560105
//         </Text>
//         <Text>
//           Ph : 08110 414313, 9513393352, sales@magodlaser.in,
//           www.magodlaser.in
//         </Text>
//       </View>
//       {/* <View> */}
//       <Text style={{ width: "10%" }}>{copyVal.copyName}</Text>
//       {/* </View> */}
//     </View>
//     <View style={{ ...style.globalPadding }}></View>
//     {/* main content starts */}
//     <View style={{ border: "1px" }}>
//       {/* address section */}
//       <View
//         style={{
//           borderBottom: "1px",
//           display: "flex",
//           flexDirection: "row",
//           minHeight: "90px",
//         }}
//       >
//         <View
//           style={{
//             width: "65%",
//             borderRight: "1px",
//             ...style.globalPadding,
//           }}
//         >
//           <Text style={{ ...style.fontBold }}>
//             Billing Address :
//           </Text>
//           {/* <View style={{ ...style.globalPadding }}>
//       <Text style={{ ...style.fontBold }}>
//         {props.invRegisterData?.Cust_Name}
//       </Text>

//       <Text>
//         {props.invRegisterData?.Cust_Address},
//         {props.invRegisterData?.Cust_Place},
//         {props.invRegisterData?.Cust_State} -
//         {props.invRegisterData?.PIN_Code}
//       </Text>

//       <View style={{ display: "flex", flexDirection: "row" }}>
//         <Text style={{ ...style.fontBold }}>GSTIN : </Text>
//         <Text>
//           {props.invRegisterData?.GSTNo === null ||
//           props.invRegisterData?.GSTNo === "null" ||
//           props.invRegisterData?.GSTNo === undefined ||
//           props.invRegisterData?.GSTNo === ""
//             ? ""
//             : props.invRegisterData?.GSTNo}
//         </Text>
//       </View>
//     </View> */}
//         </View>
//         <View style={{ width: "35%", ...style.globalPadding }}>
//           <Text style={{ ...style.fontBold }}>
//             Shipping Address :
//           </Text>
//           {/* <View style={{ ...style.globalPadding }}>
//       <Text>
//         {props.invRegisterData?.Del_Address === null ||
//         props.invRegisterData?.Del_Address === "null" ||
//         props.invRegisterData?.Del_Address === undefined ||
//         props.invRegisterData?.Del_Address === ""
//           ? ""
//           : props.invRegisterData?.Del_Address}
//       </Text>
//     </View> */}
//         </View>
//       </View>
//       {/* bill details */}
//       <View
//       // style={{
//       //   display: "flex",
//       //   flexDirection: "row",
//       //   borderBottom: "1px",
//       //   //   minHeight: "180px",
//       // }}
//       >
//         {/* customer po and page */}
//         <View
//           style={{
//             borderBottom: "1px",
//             display: "flex",
//             flexDirection: "row",
//           }}
//         >
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>Customer PO</Text>
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             {/* <Text>{props.invRegisterData?.PO_No}</Text> */}
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>Page</Text>
//           </View>
//           <View style={{ width: "25%", ...style.globalPadding }}>
//             {/* <Text>
//         {outerKey + 1} of {tableData.length}
//       </Text> */}
//           </View>
//         </View>

//         {/* packing note no and  packing date */}
//         <View
//           style={{
//             borderBottom: "1px",
//             display: "flex",
//             flexDirection: "row",
//           }}
//         >
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>
//               Packing Note No
//             </Text>
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             {/* <Text>{props.invRegisterData?.DC_No}</Text> */}
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>Packing Date</Text>
//           </View>
//           <View style={{ width: "25%", ...style.globalPadding }}>
//             {/* <Text>{props.invRegisterData?.DC_Date}</Text> */}
//           </View>
//         </View>
//         {/* Proforma Invoice Type */}
//         <View
//           style={{
//             borderBottom: "1px",
//             display: "flex",
//             flexDirection: "row",
//           }}
//         >
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>Proforma Invoice Type</Text>
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             {/* <Text>{props.invRegisterData?.DC_InvType}</Text> */}
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}></Text>
//           </View>
//           <View style={{ width: "25%", ...style.globalPadding }}>
//             <Text></Text>
//           </View>
//         </View>
//         {/* Proforma Invoice No and invoice date */}
//         <View
//           style={{
//             borderBottom: "1px",
//             display: "flex",
//             flexDirection: "row",
//           }}
//         >
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>Proforma Invoice No</Text>
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             {/* <Text>{props.invRegisterData?.Inv_No}</Text> */}
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>Invoice Date</Text>
//           </View>
//           <View style={{ width: "25%", ...style.globalPadding }}>
//             {/* <Text>{props.invRegisterData?.Inv_Date}</Text> */}
//           </View>
//         </View>
//         {/* eway bill no and pay on before */}
//         <View
//           style={{
//             borderBottom: "1px",
//             display: "flex",
//             flexDirection: "row",
//           }}
//         >
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>Eway Bill No</Text>
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             {/* <Text>{props.invRegisterData?.EWayBillRef}</Text> */}
//           </View>
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>Pay on Before</Text>
//           </View>
//           <View style={{ width: "25%", ...style.globalPadding }}>
//             <Text>data...</Text>
//           </View>
//         </View>

//         {/* pan no and msme no */}
//         <View
//           style={{
//             borderBottom: "1px",
//             display: "flex",
//             flexDirection: "row",
//           }}
//         >
//           <View
//             style={{
//               width: "25%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>PAN No</Text>
//           </View>
//           <View
//             style={{
//               width: "18%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             {/* <Text>{props.invRegisterData?.PAN_No}</Text> */}
//           </View>
//           <View
//             style={{
//               width: "17%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text style={{ ...style.fontBold }}>MSME No</Text>
//           </View>
//           <View style={{ width: "40%", ...style.globalPadding }}>
//             <Text>data...</Text>
//           </View>
//         </View>
//       </View>

//       {/* table content */}
//       <View>
//         {/* table heading */}
//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "center",
//             borderBottom: "1px",
//             ...style.globalPadding,
//           }}
//         >
//           <Text style={{ ...style.fontBold }}>Item List</Text>
//         </View>
//         {/* table starts */}
//         <View>
//           {/* table header */}

//           <View
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "flex-satrt",
//               borderBottom: "1px",
//               // ...style.globalPadding,
//             }}
//           >
//             {/* sl no */}
//             <View
//               style={{
//                 display: "flex",
//                 // flexDirection: "row",
//                 // justifyContent: "flex-satrt",
//                 borderRight: "1px",
//                 width: "8%",
//                 ...style.globalPadding,
//               }}
//             >
//               <Text style={{ ...style.fontBold }}>SL No</Text>
//             </View>
//             {/* desc of goods */}
//             <View
//               style={{
//                 display: "flex",
//                 // flexDirection: "row",
//                 // justifyContent: "flex-satrt",
//                 borderRight: "1px",
//                 width: "33%",
//                 ...style.globalPadding,
//               }}
//             >
//               <Text style={{ ...style.fontBold }}>
//                 Description of goods / Drawing No
//               </Text>
//             </View>
//             {/* material */}
//             <View
//               style={{
//                 display: "flex",
//                 // flexDirection: "row",
//                 // justifyContent: "flex-satrt",
//                 borderRight: "1px",
//                 width: "17%",
//                 ...style.globalPadding,
//               }}
//             >
//               <Text style={{ ...style.fontBold }}>Material</Text>
//             </View>

//             {/* Packaging level */}
//             <View
//               style={{
//                 display: "flex",
//                 // flexDirection: "row",
//                 // justifyContent: "flex-satrt",
//                 borderRight: "1px",
//                 width: "15%",
//                 ...style.globalPadding,
//               }}
//             >
//               <Text style={{ ...style.fontBold }}>
//                 Packing Level
//               </Text>
//             </View>

//             {/* inspection level */}

//             <View
//               style={{
//                 display: "flex",
//                 // flexDirection: "row",
//                 // justifyContent: "flex-satrt",
//                 borderRight: "1px",
//                 width: "15%",
//                 ...style.globalPadding,
//               }}
//             >
//               <Text style={{ ...style.fontBold }}>
//                 Inspection Level
//               </Text>
//             </View>

//             {/* Qty */}
//             <View
//               style={{
//                 display: "flex",
//                 // flexDirection: "row",
//                 // justifyContent: "flex-satrt",
//                 // borderRight: "1px",
//                 width: "12%",
//                 ...style.globalPadding,
//               }}
//             >
//               <Text style={{ ...style.fontBold }}>Quantity</Text>
//             </View>
//           </View>
//           {/* table data */}
//           <View
//             style={{ height: "315px", borderBottom: "1px" }}
//           ></View>
//         </View>
//       </View>

//       {/* footer starts */}
//       <View>
//         {/* page items count, page items quantiy, total items count, total items quantity */}

//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             borderBottom: "1px",
//             ...style.fontBold,
//           }}
//         >
//           <View
//             style={{
//               ...style.globalPadding,
//               width: "25%",
//               borderRight: "1px",
//             }}
//           >
//             {/* <Text>Page Items Count = {outerVal.length}</Text> */}
//           </View>

//           <View
//             style={{
//               ...style.globalPadding,
//               width: "25%",
//               borderRight: "1px",
//             }}
//           >
//             <Text>
//               {/* Page Items Quantity = {pageQuantity[outerKey]} */}
//             </Text>
//           </View>
//           <View
//             style={{
//               ...style.globalPadding,
//               width: "25%",
//               borderRight: "1px",
//             }}
//           >
//             {/* <Text>Total Item Count = {PrintableData.length}</Text> */}
//           </View>
//           <View
//             style={{
//               ...style.globalPadding,
//               width: "25%",
//               // borderRight: "1px",
//             }}
//           >
//             {/* <Text>Total Items Quantity = {totalQty}</Text> */}
//           </View>
//         </View>

//         {/* acknowledgement and total weight */}
//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             borderBottom: "1px",
//             minHeight: "51px",
//           }}
//         >
//           <View
//             style={{
//               width: "66%",
//               borderRight: "1px",
//               ...style.globalPadding,
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Text>
//               Please receive the above goods return to us the
//               duplicate copy of "Delivery Challian" Dulystamped and
//               receipted in acknowledgment of having received the
//               material in good condition.anyissuse on this
//               transactions, kindly intimate to us in writing within
//               3days from the date receipt
//             </Text>
//             <Text>SUBJECT TO BANGALORE JURISDICTION</Text>
//           </View>
//           <View style={{ width: "34%", ...style.globalPadding }}>
//             {/* <Text>
//         Total Weight in KGs = {totalWeight.toFixed(2)}
//       </Text> */}
//           </View>
//         </View>
//         {/* signaturessss */}
//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             // borderBottom: "1px",
//             ...style.fontBold,
//             minHeight: "51px",
//           }}
//         >
//           <View
//             style={{
//               width: "66%",
//               borderRight: "1px",
//               ...style.globalPadding,
//             }}
//           >
//             <Text>Customer Signature with Seal</Text>
//           </View>
//           <View
//             style={{
//               width: "34%",
//               ...style.globalPadding,
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "space-between",
//               alignItems: "flex-end",
//             }}
//           >
//             <Text>For, Magod Laser Machining Pvt. Ltd.</Text>
//             <Text>Authorised Signatory.</Text>
//           </View>
//         </View>
//       </View>
//       {/* footer ends */}
//     </View>
//     {/* border ends here */}
//     {/* address after border */}
//     <View
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>
//         Registered office: #72, Phase II, KIADB Indl Area, Jigani,
//         Anekal Taluk, Bengaluru - 560105.
//       </Text>
//     </View>
//   </View>
// ))}
