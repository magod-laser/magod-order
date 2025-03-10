/** @format */

import React from "react";
import {
	Page,
	Document,
	StyleSheet,
	View,
	Text,
	Image,
} from "@react-pdf/renderer";
// import MLLogo from "../../../../../ML-LOGO.png";
import MLLogo from "../../../../../ML-LOGO.png";

export default function PrintProfarmaInvoice(props) {
	const fontSize = "8px";
	const headerFontSize = "9px";
	const style = {
		pageStyling: {
			padding: "2%",
			paddingTop: "1.5%",
			fontSize: fontSize,
			fontFamily: "Helvetica",
		},
		globalPadding: { padding: "0.6%" },
		footerRowPadding: { padding: "3%" },
		footerTaxRowPadding: { padding: "1.1%" },
		rowPadding: { padding: "0.6%" },
		fontBold: {
			//   fontWeight: "bold",
			fontSize: fontSize,
			fontFamily: "Helvetica-Bold",
		},
	};

	// amount num to word
	const wordify = (num) => {
		const single = [
			"Zero",
			"One",
			"Two",
			"Three",
			"Four",
			"Five",
			"Six",
			"Seven",
			"Eight",
			"Nine",
		];
		const double = [
			"Ten",
			"Eleven",
			"Twelve",
			"Thirteen",
			"Fourteen",
			"Fifteen",
			"Sixteen",
			"Seventeen",
			"Eighteen",
			"Nineteen",
		];
		const tens = [
			"",
			"Ten",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		const formatTenth = (digit, prev) => {
			return 0 == digit ? "" : " " + (1 == digit ? double[prev] : tens[digit]);
		};
		const formatOther = (digit, next, denom) => {
			return (
				(0 != digit && 1 != next ? " " + single[digit] : "") +
				(0 != next || digit > 0 ? " " + denom : "")
			);
		};
		let res = "";
		let index = 0;
		let digit = 0;
		let next = 0;
		let words = [];
		if (((num += ""), isNaN(parseInt(num)))) {
			res = "";
		} else if (parseInt(num) > 0 && num.length <= 10) {
			for (index = num.length - 1; index >= 0; index--)
				switch (
					((digit = num[index] - 0),
					(next = index > 0 ? num[index - 1] - 0 : 0),
					num.length - index - 1)
				) {
					case 0:
						words.push(formatOther(digit, next, ""));
						break;
					case 1:
						words.push(formatTenth(digit, num[index + 1]));
						break;
					case 2:
						words.push(
							0 != digit
								? " " +
										single[digit] +
										" Hundred" +
										(0 != num[index + 1] && 0 != num[index + 2] ? " and" : "")
								: ""
						);
						break;
					case 3:
						words.push(formatOther(digit, next, "Thousand"));
						break;
					case 4:
						words.push(formatTenth(digit, num[index + 1]));
						break;
					case 5:
						words.push(formatOther(digit, next, "Lakh"));
						break;
					case 6:
						words.push(formatTenth(digit, num[index + 1]));
						break;
					case 7:
						words.push(formatOther(digit, next, "Crore"));
						break;
					case 8:
						words.push(formatTenth(digit, num[index + 1]));
						break;
					case 9:
						words.push(
							0 != digit
								? " " +
										single[digit] +
										" Hundred" +
										(0 != num[index + 1] || 0 != num[index + 2]
											? " and"
											: " Crore")
								: ""
						);
				}
			res = words.reverse().join("");
		} else res = "";
		return res;
	};
	// console.log("props in proforma...", props);

	const copiesNames = [
		// { copyName: "Original for Recipient" },
		// { copyName: "Transporter Copy" },
		// { copyName: "Accounts Copy" },
		// { copyName: "Extra Copy" },
		{ copyName: "Original Copy" },
	];

	// // payonBefore
	// let payOnBefore = "";
	// if (
	//   props.invRegisterData?.BillType === "Credit" &&
	//   props.invRegisterData.Inv_No?.length > 0 &&
	//   // finding int in payment terms
	//   props.invRegisterData.PaymentTerms?.match(/\d+/g)
	// ) {
	//   let newInvDate = new Date(
	//     props.invRegisterData.Inv_Date?.split("/")[1] +
	//       "/" +
	//       props.invRegisterData.Inv_Date?.split("/")[0] +
	//       "/" +
	//       props.invRegisterData.Inv_Date?.split("/")[2]
	//   );

	//   newInvDate.setDate(
	//     newInvDate.getDate() +
	//       parseInt(props.invRegisterData.PaymentTerms?.split(" Days Credit")[0])
	//   );
	//   payOnBefore =
	//     (parseInt(newInvDate.getDate()) < 10
	//       ? "0" + newInvDate.getDate()
	//       : newInvDate.getDate()) +
	//     "/" +
	//     (parseInt(newInvDate.getMonth()) + 1 < 10
	//       ? "0" + (parseInt(newInvDate.getMonth()) + 1)
	//       : parseInt(newInvDate.getMonth()) + 1) +
	//     "/" +
	//     newInvDate.getFullYear();
	//   // console.log("payon before...", payOnBefore);
	// } else {
	// }

	// // finyear

	// let pnDate = new Date(
	//   `${props.invRegisterData.Printable_DC_Date?.split("/")[1]}-${
	//     props.invRegisterData.Printable_DC_Date?.split("/")[0]
	//   }-${props.invRegisterData.Printable_DC_Date?.split("/")[2]}`
	// );
	// let InvDate = new Date(
	//   `${props.invRegisterData.Printable_Inv_Date?.split("/")[1]}-${
	//     props.invRegisterData.Printable_Inv_Date?.split("/")[0]
	//   }-${props.invRegisterData.Printable_Inv_Date?.split("/")[2]}`
	// );

	// let PNFinYear = "";
	// let InvFinYear = "";

	// // calculating PNFinYear
	// if (pnDate.getMonth() + 1 <= 3) {
	//   PNFinYear = `${String(pnDate.getFullYear() - 1).substring(2)}/${String(
	//     pnDate.getFullYear()
	//   ).substring(2)}`;
	// } else {
	//   PNFinYear = `${String(pnDate.getFullYear()).substring(2)}/${String(
	//     parseInt(pnDate.getFullYear()) + 1
	//   ).substring(2)}`;
	// }

	// // calculating InvFinYear
	// if (InvDate.getMonth() + 1 <= 3) {
	//   InvFinYear = `${String(InvDate.getFullYear() - 1).substring(2)}/${String(
	//     InvDate.getFullYear()
	//   ).substring(2)}`;
	// } else {
	//   InvFinYear = `${String(InvDate.getFullYear()).substring(2)}/${String(
	//     parseInt(InvDate.getFullYear()) + 1
	//   ).substring(2)}`;
	// }

	return (
		<>
			<Document>
				{copiesNames.map((copyVal, copyKey) => (
					<>
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
												PROFORMA INVOICE
											</Text>
										</View>
										<Text style={{ ...style.fontBold, fontSize: "11px" }}>
											{props.PDFData.RegisteredName}
										</Text>
										<Text
											style={{ ...style.fontBold, fontSize: headerFontSize }}>
											GST: {props.PDFData.GST_No} CIN: {props.PDFData.CIN_No}
										</Text>
										<Text style={{ fontSize: headerFontSize }}>
											{props.PDFData.RegistredOfficeAddress}
										</Text>
										<Text style={{ fontSize: headerFontSize }}>
											{props.PDFData.PhonePrimary},{" "}
											{props.PDFData.PhoneSecondary}, {props.PDFData.Email},{" "}
											{props.PDFData.URL}
										</Text>
									</View>
									{/* <View> */}
									<Text style={{ width: "10%", fontSize: headerFontSize }}>
										{copyVal.copyName}
									</Text>
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
											height: "72px",
										}}>
										<View
											style={{
												width: "50%",
												borderRight: "1px",
												...style.globalPadding,
											}}>
											<Text style={{ ...style.fontBold }}>
												Billing Address :
											</Text>
											<View style={{ ...style.globalPadding }}>
												<Text style={{ ...style.fontBold }}>
													{props.profarmaMainData.Cust_Name}
												</Text>

												<Text>
													{props.profarmaMainData.Cust_Address},{" "}
													{props.profarmaMainData.Cust_Address},{" "}
													{props.profarmaMainData.Cust_State} -{" "}
													{props.profarmaMainData.Cust_State}
												</Text>

												<View style={{ display: "flex", flexDirection: "row" }}>
													<Text style={{ ...style.fontBold }}>GSTIN : </Text>
													<Text>{props.profarmaMainData.GSTNo}</Text>
												</View>
											</View>
										</View>
										<View style={{ width: "50%", ...style.globalPadding }}>
											<Text style={{ ...style.fontBold }}>
												Shipping Address :
											</Text>
											<View style={{ ...style.globalPadding }}>
												<Text>{props.profarmaMainData.DelAddress}</Text>
											</View>
										</View>
									</View>
									{/* other details */}
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											borderBottom: "1px",
											//   minHeight: "180px",
										}}>
										<View style={{ width: "100%" }}>
											{/* borderRight: "1px" */}
											{/* PO */}
											<View
												style={{
													borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														width: "25%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>PO No</Text>
												</View>
												<View style={{ width: "75%", ...style.globalPadding }}>
													<Text>
														{props.profarmaMainData.PO_No}
														{/* {" "}
                            {props.profarmaMainData.Printable_PO_Date} */}
													</Text>
												</View>
											</View>
											{/* Proforma Proforma Invoice Type */}
											<View
												style={{
													borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														width: "25%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Proforma Invoice Type
													</Text>
												</View>
												<View style={{ width: "75%", ...style.globalPadding }}>
													<Text>{props.profarmaMainData.InvType}</Text>
												</View>
											</View>
											{/* Invoice num and Invoice date */}
											<View
												style={{
													borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														width: "25%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Proforma Invoice No
													</Text>
												</View>
												<View
													style={{
														width: "25%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>
														{props.profarmaMainData?.ProformaInvNo || ""}
													</Text>
												</View>
												<View
													style={{
														width: "25%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Proforma Invoice Date
													</Text>
												</View>
												<View style={{ width: "25%", ...style.globalPadding }}>
													<Text>
														{props.profarmaMainData.Printable_ProformaDate ||
															""}
													</Text>
												</View>
											</View>
											{/* extra comment - Whether the Tax is payable on Reverse Charge Basis: No */}
											<View
												style={{
													//   borderBottom: "1px",
													display: "flex",
													flexDirection: "row",
												}}>
												<View
													style={{
														...style.globalPadding,
													}}>
													<Text>{props.PDFData.ReverseChargeNote}</Text>
												</View>
											</View>
										</View>
										{/* qr */}
										{/* <View
											style={{
												width: "30%",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}>
											<Text style={{ ...style.fontBold }}></Text>
										</View> */}
									</View>
									{/*   Invoice Item Details  */}

									<View>
										<View
											style={{
												...style.globalPadding,
												borderBottom: "1px",
												display: "flex",
												alignContent: "center",
												justifyContent: "center",
												flexDirection: "row",
											}}>
											<Text
												style={{ ...style.fontBold, fontSize: headerFontSize }}>
												Proforma Invoice Item Details
											</Text>
										</View>

										<View
										//  style={{ border: "1px" }}
										>
											{/* table header... */}
											<View
												style={{
													display: "flex",
													flexDirection: "row",
													...style.fontBold,
													borderBottom: "1px",
												}}>
												{/* sl */}
												<View
													style={{
														...style.globalPadding,
														width: "7%",
														borderRight: "1px",
													}}>
													<Text>SL No</Text>
												</View>

												{/* description of goods or drawing no  */}

												<View
													style={{
														...style.globalPadding,
														width: "47%",
														borderRight: "1px",
													}}>
													<Text>Description of goods / Drawing No</Text>
												</View>

												{/* Material */}
												<View
													style={{
														...style.globalPadding,
														width: "19%",
														borderRight: "1px",
													}}>
													<Text>Material</Text>
												</View>

												{/* Quantity */}

												<View
													style={{
														...style.globalPadding,
														width: "7%",
														borderRight: "1px",
													}}>
													<Text>Qty</Text>
												</View>

												{/* Unit Price */}

												<View
													style={{
														...style.globalPadding,
														width: "10%",
														borderRight: "1px",
													}}>
													<Text>Unit Price</Text>
												</View>

												{/* amount */}

												<View style={{ ...style.globalPadding, width: "10%" }}>
													<Text>Amount</Text>
												</View>
											</View>
											{/* table content */}
											<View style={{ height: "291px" }}>
												<View>
													{props.profarmaDetailsData?.map((val, key) => (
														<View
															// style={{

															//   display: "flex",
															//   flexDirection: "row",
															//   // ...style.fontBold,
															//   borderBottom: "1px",
															// }}

															style={
																key + 1 === props.rowLimit
																	? { display: "flex", flexDirection: "row" }
																	: {
																			display: "flex",
																			flexDirection: "row",
																			borderBottom: "1px",
																	  }
															}>
															{/* sl */}
															<View
																style={{
																	...style.rowPadding,
																	width: "7%",
																	borderRight: "1px",
																}}>
																<Text>{key + 1}</Text>
															</View>

															{/* description of goods or drawing No  */}

															<View
																style={{
																	...style.rowPadding,
																	width: "47%",
																	borderRight: "1px",
																}}>
																<Text>{val.Dwg_No}</Text>
															</View>

															{/* Material */}
															<View
																style={{
																	...style.rowPadding,
																	width: "19%",
																	borderRight: "1px",
																}}>
																<Text>{val.Mtrl}</Text>
															</View>

															{/* Quantity */}

															<View
																style={{
																	...style.rowPadding,
																	width: "7%",
																	borderRight: "1px",
																}}>
																<Text>{val.Qty}</Text>
															</View>

															{/* Unit Price */}

															<View
																style={{
																	...style.rowPadding,
																	width: "10%",
																	borderRight: "1px",
																}}>
																<Text>
																	{parseFloat(val.Unit_Rate).toFixed(2)}
																</Text>
															</View>

															{/* amount */}

															<View
																style={{
																	...style.rowPadding,
																	width: "10%",
																}}>
																<Text>
																	{(
																		val.DC_Srl_Amt ||
																		parseFloat(val.Qty || 0) *
																			parseFloat(val.Unit_Rate || 0)
																	).toFixed(2)}
																</Text>
															</View>
														</View>
													))}
												</View>
											</View>
										</View>
									</View>

									{/* footer starts */}
									<View style={{ borderTop: "1px" }}>
										<View
											style={{
												display: "flex",
												flexDirection: "row",
											}}>
											{/* left */}
											<View
												style={{
													width: "73%",
													borderRight: "1px",
												}}>
												<View
													style={{ display: "flex", flexDirection: "column" }}>
													{/* remarks */}
													{/* <View style={{ borderBottom: "1px" }}>
                            <View
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <View
                                style={{
                                  width: "15%",
                                  ...style.fontBold,
                                  ...style.footerRowPadding,
                                  borderRight: "1px",
                                }}
                              >
                                <Text>Remarks</Text>
                              </View>
                              <View
                                style={{
                                  width: "85%",
                                  ...style.footerRowPadding,
                                }}
                              >
                                <Text>remakrs</Text>
                              </View>
                            </View>
                          </View> */}
													{/* tax and hsn heading */}
													<View
													// style={{ borderBottom: "1px" }}
													>
														<View
															style={{ display: "flex", flexDirection: "row" }}>
															<View
																style={{
																	display: "flex",
																	flexDirection: "row",
																	// borderRight: "1px",
																	// width: "60.5%",
																	borderBottom: "1px",
																	// height: "10px",
																}}>
																<View
																	style={{
																		width: "25%",
																		...style.fontBold,
																		...style.footerTaxRowPadding,
																		borderRight: "1px",
																	}}>
																	<Text>Tax Name</Text>
																</View>
																<View
																	style={{
																		width: "25%",
																		...style.fontBold,
																		...style.footerTaxRowPadding,
																		borderRight: "1px",
																	}}>
																	<Text>Taxable</Text>
																</View>
																<View
																	style={{
																		width: "25%",
																		...style.fontBold,
																		...style.footerTaxRowPadding,
																		borderRight: "1px",
																	}}>
																	<Text>Tax %</Text>
																</View>
																<View
																	style={{
																		width: "25%",
																		...style.fontBold,
																		...style.footerTaxRowPadding,
																		// borderRight: "1px",
																	}}>
																	<Text>Tax Amt</Text>
																</View>
															</View>
															{/* <View
                                style={{
                                  width: "39%",
                                  ...style.fontBold,
                                  ...style.footerRowPadding,
                                  // borderRight: "1px",
                                }}
                              >
                                <Text>Goods Under HSN Class</Text>
                              </View> */}
														</View>
													</View>
													{/* tax and hsn data */}
													<View
													//  style={{ borderBottom: "1px" }}
													>
														<View
															style={{
																display: "flex",
																flexDirection: "row",
															}}>
															<View
																style={{
																	// width: "60.5%",
																	display: "flex",
																	flexDirection: "column",
																	borderBottom: "1px",
																}}>
																{props.profarmaTaxData?.map((taxVal, key) => (
																	<View
																		style={
																			key + 1 != props.profarmaTaxData.length
																				? {
																						borderBottom: "1px",
																						display: "flex",
																						flexDirection: "row",
																						// borderRight: "1px",
																				  }
																				: {
																						display: "flex",
																						flexDirection: "row",
																						// borderRight: "1px",
																				  }
																		}>
																		<View
																			style={{
																				width: "25%",
																				// ...style.fontBold,
																				...style.footerTaxRowPadding,
																				borderRight: "1px",
																			}}>
																			<Text>{taxVal.Tax_Name}</Text>
																		</View>
																		<View
																			style={{
																				width: "25%",
																				// ...style.fontBold,
																				...style.footerTaxRowPadding,
																				borderRight: "1px",
																			}}>
																			<Text>{taxVal.TaxableAmount}</Text>
																		</View>
																		<View
																			style={{
																				width: "25%",
																				// ...style.fontBold,
																				...style.footerTaxRowPadding,
																				borderRight: "1px",
																			}}>
																			<Text>
																				{parseFloat(taxVal.TaxPercent).toFixed(
																					2
																				)}{" "}
																				%
																			</Text>
																		</View>
																		<View
																			style={{
																				width: "25%",
																				// ...style.fontBold,
																				...style.footerTaxRowPadding,
																				// borderRight: "1px",
																			}}>
																			<Text>
																				{parseFloat(taxVal.TaxAmt).toFixed(2)}
																			</Text>
																		</View>
																	</View>
																))}
															</View>
														</View>
													</View>

													<View
														style={
															props.profarmaTaxData?.length < 3
																? { borderBottom: "1px" }
																: ""
														}>
														<View
															style={{
																...style.footerTaxRowPadding,
															}}>
															<Text>{props.PDFData.ServiceTariffInfo}</Text>
														</View>
													</View>
												</View>
											</View>

											{/* right */}
											<View style={{ width: "27%" }}>
												<View
													style={{ display: "flex", flexDirection: "column" }}>
													{/* net total */}
													<View
														style={{
															display: "flex",
															flexDirection: "row",
															borderBottom: "1px",
														}}>
														<View
															style={{
																width: "42%",
																...style.fontBold,
																...style.footerRowPadding,
																borderRight: "1px",
															}}>
															<Text>Net Total</Text>
														</View>
														<View
															style={{
																width: "58%",
																...style.footerRowPadding,
															}}>
															<Text>
																{parseFloat(
																	props.profarmaMainData.Net_Total
																).toFixed(2)}
															</Text>
														</View>
													</View>
													{/* del charge */}
													<View
														style={{
															display: "flex",
															flexDirection: "row",
															borderBottom: "1px",
														}}>
														<View
															style={{
																width: "42%",
																...style.fontBold,
																...style.footerRowPadding,
																borderRight: "1px",
															}}>
															<Text>Del. Charge</Text>
														</View>
														<View
															style={{
																width: "58%",
																...style.footerRowPadding,
															}}>
															<Text>
																{parseFloat(
																	props.profarmaMainData.Del_Chg
																).toFixed(2)}
															</Text>
														</View>
													</View>
													{/* discount */}
													<View
														style={{
															display: "flex",
															flexDirection: "row",
															borderBottom: "1px",
														}}>
														<View
															style={{
																width: "42%",
																...style.fontBold,
																...style.footerRowPadding,
																borderRight: "1px",
															}}>
															<Text>Discount</Text>
														</View>
														<View
															style={{
																width: "58%",
																...style.footerRowPadding,
															}}>
															<Text>
																{parseFloat(
																	props.profarmaMainData.Discount
																).toFixed(2)}
															</Text>
														</View>
													</View>
													{/* total taxes */}
													<View
														style={{
															display: "flex",
															flexDirection: "row",
															borderBottom: "1px",
														}}>
														<View
															style={{
																width: "42%",
																...style.fontBold,
																...style.footerRowPadding,
																borderRight: "1px",
															}}>
															<Text>Total Taxes</Text>
														</View>
														<View
															style={{
																width: "58%",
																...style.footerRowPadding,
															}}>
															<Text>
																{parseFloat(
																	props.profarmaMainData.TaxAmount
																).toFixed(2)}
															</Text>
														</View>
													</View>
													{/* invoice total */}
													<View
														style={{
															display: "flex",
															flexDirection: "row",
															borderBottom: "1px",
														}}>
														<View
															style={{
																width: "42%",
																...style.fontBold,
																...style.footerRowPadding,
																borderRight: "1px",
															}}>
															<Text>Invoice Total</Text>
														</View>
														<View
															style={{
																width: "58%",
																...style.footerRowPadding,
															}}>
															<Text>
																{parseFloat(
																	props.profarmaMainData.InvTotal
																).toFixed(2)}
															</Text>
														</View>
													</View>
													{/* round off */}
													<View
														style={{
															display: "flex",
															flexDirection: "row",
															borderBottom: "1px",
														}}>
														<View
															style={{
																width: "42%",
																...style.fontBold,
																...style.footerRowPadding,
																borderRight: "1px",
															}}>
															<Text>Round Off</Text>
														</View>
														<View
															style={{
																width: "58%",
																...style.footerRowPadding,
															}}>
															<Text>
																{parseFloat(
																	props.profarmaMainData.Round_Off
																).toFixed(2)}
															</Text>
														</View>
													</View>
													{/* grand total */}
													<View
														style={{
															display: "flex",
															flexDirection: "row",
															// borderBottom: "1px",
														}}>
														<View
															style={{
																width: "42%",
																...style.fontBold,
																...style.footerRowPadding,
																borderRight: "1px",
															}}>
															<Text>Grand Total</Text>
														</View>
														<View
															style={{
																width: "58%",
																...style.footerRowPadding,
															}}>
															<Text>
																{parseFloat(
																	props.profarmaMainData.GrandTotal
																).toFixed(2)}
															</Text>
														</View>
													</View>
												</View>
											</View>
										</View>
									</View>
									{/* rupees */}
									<View
										style={{
											borderTop: "1px",
											display: "flex",
											flexDirection: "row",
											justifyContent: "flex-end",
											...style.footerTaxRowPadding,
										}}>
										<Text>
											{"Rupees" +
												(parseInt(props.profarmaMainData?.GrandTotal) === 0
													? " Zero "
													: wordify(
															parseInt(props.profarmaMainData?.GrandTotal)
													  )) +
												"Only."}
										</Text>
									</View>
									{/* bank detials */}
									<View
										style={{
											borderTop: "1px",
											display: "flex",
											flexDirection: "row",
										}}>
										<View
											style={{
												width: "12%",
												borderRight: "1px",
												...style.fontBold,
												...style.footerTaxRowPadding,
											}}>
											<Text>Bank Details</Text>
										</View>
										<View
											style={{
												width: "88%",
												// ...style.fontBold,
												...style.footerTaxRowPadding,
											}}>
											<Text>{props.PDFData.BankDetails}</Text>
										</View>
									</View>
									{/* signature line... */}
									<View
										style={{
											borderTop: "1px",
											display: "flex",
											flexDirection: "row",
										}}>
										<View
											style={{
												width: "60%",
												borderRight: "1px",
												// ...style.fontBold,
												...style.footerTaxRowPadding,
											}}>
											<Text>{props.PDFData.InvoiceTerms}</Text>
										</View>
										<View
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-end",
												justifyContent: "space-between",
												width: "40%",
												...style.fontBold,
												...style.footerTaxRowPadding,
											}}>
											<Text>For, {props.PDFData.RegisteredName}</Text>
											<Text>Authorised Signatory</Text>
										</View>
									</View>

									{/* footer ends */}
								</View>
								{/* main content ends */}

								<View style={{ ...style.globalPadding }}></View>

								{/* Footer address */}
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "center",
									}}>
									<Text style={{ ...style.fontBold }}>Registered office :</Text>
									<Text>{props.PDFData.RegistredOfficeAddress}</Text>
								</View>
							</View>
						</Page>
					</>
				))}
			</Document>
		</>
	);
}

// <View style={{ borderTop: "1px" }}>
// {/* remarks and net total */}
// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     borderBottom: "1px",
//   }}
// >
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Remarks</Text>
//   </View>
//   <View
//     style={{
//       width: "61%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>No need</Text>
//   </View>

//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Net Total</Text>
//   </View>
//   <View style={{ width: "15%", ...style.globalPadding }}>
//     <Text>{props.profarmaMainData.Net_Total}</Text>
//   </View>
// </View>

// {/* tax details heading and delivery charges... */}
// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     borderBottom: "1px",
//   }}
// >
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Tax Name</Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Taxable</Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Tax %</Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Tax Amount</Text>
//   </View>
//   <View
//     style={{
//       width: "25%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>
//       Goods Under HSN Class
//     </Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Del. Charge</Text>
//   </View>
//   <View style={{ width: "15%", ...style.globalPadding }}>
//     <Text>{props.profarmaMainData.Del_Chg}</Text>
//   </View>
// </View>

// {/* tax detatils 1 and discount */}
// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//   }}
// >
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//       borderBottom: "1px",
//     }}
//   >
//     <Text>{props.profarmaTaxData[0]?.Tax_Name}</Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//       borderBottom: "1px",
//     }}
//   >
//     <Text>{props.profarmaTaxData[0]?.TaxableAmount}</Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//       borderBottom: "1px",
//     }}
//   >
//     <Text>
//       {props.profarmaTaxData[0]?.TaxPercent
//         ? parseFloat(
//             props.profarmaTaxData[0]?.TaxPercent
//           ).toFixed(2)
//         : ""}
//     </Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//       borderBottom: "1px",
//     }}
//   >
//     <Text>{props.profarmaTaxData[0]?.TaxAmt}</Text>
//   </View>
//   <View
//     style={{
//       width: "25%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text></Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//       borderBottom: "1px",
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Discount</Text>
//   </View>
//   <View
//     style={{
//       width: "15%",
//       ...style.globalPadding,

//       borderBottom: "1px",
//     }}
//   >
//     <Text>{props.profarmaMainData?.Discount}</Text>
//   </View>
// </View>

// {/* tax detatils 2 and Total Taxes */}
// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     borderBottom: "1px",
//   }}
// >
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>{props.profarmaTaxData[1]?.Tax_Name}</Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>{props.profarmaTaxData[1]?.TaxableAmount}</Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>
//       {props.profarmaTaxData[1]?.TaxPercent
//         ? parseFloat(
//             props.profarmaTaxData[1]?.TaxPercent
//           ).toFixed(2)
//         : ""}
//     </Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>{props.profarmaTaxData[1]?.TaxAmt}</Text>
//   </View>
//   <View
//     style={{
//       width: "25%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text></Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Total Taxes</Text>
//   </View>
//   <View style={{ width: "15%", ...style.globalPadding }}>
//     <Text>{props.profarmaMainData.TaxAmount}</Text>
//   </View>
// </View>

// {/*  Invoice total */}
// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     borderBottom: "1px",
//   }}
// >
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>{props.profarmaTaxData[2]?.Tax_Name}</Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>{props.profarmaTaxData[2]?.TaxableAmount}</Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>
//       {props.profarmaTaxData[2]?.TaxPercent
//         ? parseFloat(
//             props.profarmaTaxData[2]?.TaxPercent
//           ).toFixed(2)
//         : ""}
//     </Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>{props.profarmaTaxData[2]?.TaxAmt}</Text>
//   </View>
//   <View
//     style={{
//       width: "25%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text></Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Invoice Total</Text>
//   </View>
//   <View style={{ width: "15%", ...style.globalPadding }}>
//     <Text>{props.profarmaMainData.InvTotal}</Text>
//   </View>
// </View>

// {/* rpund off */}

// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     borderBottom: "1px",
//   }}
// >
//   <View
//     style={{
//       width: "24%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>
//       Goods Removed on
//     </Text>
//   </View>
//   <View
//     style={{
//       width: "49%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>
//       no need
//       {/* {props.profarmaMainData.Printable_DespatchDate}{" "}
//       {props.profarmaMainData.TptMode}{" "}
//       {props.profarmaMainData.VehNo} */}
//     </Text>
//   </View>
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Round Off</Text>
//   </View>
//   <View style={{ width: "15%", ...style.globalPadding }}>
//     <Text>{props.profarmaMainData.Round_Off}</Text>
//   </View>
// </View>

// {/* empty space and grand total */}
// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     borderBottom: "1px",
//   }}
// >
//   <View
//     style={{
//       width: "73%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text></Text>
//   </View>

//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Grand Total</Text>
//   </View>
//   <View style={{ width: "15%", ...style.globalPadding }}>
//     <Text>{props.profarmaMainData.GrandTotal}</Text>
//   </View>
// </View>

// {/* amount in words */}
// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     borderBottom: "1px",
//     justifyContent: "flex-end",
//     ...style.globalPadding,
//   }}
// >
// <Text>
//   {"Total Value in words Rupees" +
//     (parseInt(props.profarmaMainData?.GrandTotal) === 0
//       ? " Zero "
//       : wordify(
//           parseInt(props.profarmaMainData?.GrandTotal)
//         )) +
//     "Only."}
// </Text>
// </View>

// {/* bank details */}

// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     borderBottom: "1px",
//   }}
// >
//   <View
//     style={{
//       width: "12%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text style={{ ...style.fontBold }}>Bank Details</Text>
//   </View>
//   <View style={{ ...style.globalPadding }}>
//     <Text>
// State Bank of India Current Account A/C No :
// 33664104046 IFSC : SBIN0011355 Branch : Jigani
//     </Text>
//   </View>
// </View>

// {/* disclaimer and signatory */}

// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     // borderBottom: "1px",
//   }}
// >
//   <View
//     style={{
//       width: "60%",
//       borderRight: "1px",
//       ...style.globalPadding,
//     }}
//   >
//     <Text>
//       Certified that the particulars given above are true &
//       correct and the amount indicated represents the price
//       actually charged and that there is no flow of
//       additional consideration directly or indirectly from
//       the buyer.
//     </Text>
//     <Text>SUBJECT TO BANGALORE JURISDICTION.</Text>
//   </View>
//   <View
//     style={{
//       ...style.globalPadding,
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "flex-end",
//       justifyContent: "space-between",
//       width: "40%",
//     }}
//   >
//     <Text>For, Magod Laser Machining Private Limited</Text>
//     <Text style={{ ...style.fontBold }}>
//       Authorised Signatory
//     </Text>
//   </View>
// </View>
// </View>
