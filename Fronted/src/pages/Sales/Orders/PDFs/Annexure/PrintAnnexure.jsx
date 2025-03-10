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
import MLLogo from "../../../../../ML-LOGO.png";

export default function PrintInvoiceAndAnnexure(props) {
	const style = {
		pageStyling: { padding: "2%", fontSize: "10px", fontFamily: "Helvetica" },
		globalPadding: { padding: "0.6%" },
		fontBold: {
			//   fontWeight: "bold",
			fontSize: "10px",
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
	// console.log("props in invoice and annexure...", props);

	const copiesNames = [
		{ copyName: "Original for Recipient" },
		{ copyName: "Transporter Copy" },
		{ copyName: "Accounts Copy" },
		{ copyName: "Extra Copy" },
	];

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
												TAX INVOICE
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
											height: "100px",
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
													{props.invRegisterData.Cust_Name}
												</Text>

												<Text>
													{props.invRegisterData.Cust_Address},{" "}
													{props.invRegisterData.Cust_Place},{" "}
													{props.invRegisterData.Cust_State} -{" "}
													{props.invRegisterData.PIN_Code}
												</Text>

												<View style={{ display: "flex", flexDirection: "row" }}>
													<Text style={{ ...style.fontBold }}>GSTIN : </Text>
													<Text>{props.invRegisterData.GSTNo}</Text>
												</View>
											</View>
										</View>
										<View style={{ width: "35%", ...style.globalPadding }}>
											<Text style={{ ...style.fontBold }}>
												Shipping Address :
											</Text>
											<View style={{ ...style.globalPadding }}>
												<Text>{props.invRegisterData.Del_Address}</Text>
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
										<View style={{ width: "70%", borderRight: "1px" }}>
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
														{props.invRegisterData.PO_No}{" "}
														{props.invRegisterData.Printable_PO_Date}
														{/* {monthNames[props.invRegisterData.PO_Date?.getMonth()]} */}
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
														width: "25%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Proforma Invoice Type
													</Text>
												</View>
												<View style={{ width: "75%", ...style.globalPadding }}>
													<Text>{props.invRegisterData.DC_InvType}</Text>
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
														{props.invRegisterData?.Inv_No
															? `${props.invRegisterData?.Inv_No} - ${InvFinYear}`
															: ""}
														{/* {`${props.invRegisterData?.Inv_No} - ${InvFinYear}`} */}
													</Text>
												</View>
												<View
													style={{
														width: "25%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Invoice Date
													</Text>
												</View>
												<View style={{ width: "25%", ...style.globalPadding }}>
													<Text>
														{props.invRegisterData.Printable_Inv_Date}
													</Text>
												</View>
											</View>

											{/* packingnote num and packing date */}
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
														Packing Note No
													</Text>
												</View>
												<View
													style={{
														width: "25%",
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
														width: "25%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>
														Packing Date
													</Text>
												</View>
												<View style={{ width: "25%", ...style.globalPadding }}>
													<Text>{props.invRegisterData.Printable_DC_Date}</Text>
												</View>
											</View>

											{/* eway bill No and pay on before */}
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
														EWay Bill No
													</Text>
												</View>
												<View
													style={{
														width: "75%",
														// borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>
														{props.invRegisterData.EWayBillRef === "" ||
														props.invRegisterData.EWayBillRef === undefined ||
														props.invRegisterData.EWayBillRef === null
															? ""
															: props.invRegisterData.EWayBillRef}
													</Text>
												</View>
												{/* <View
                          style={{
                            width: "25%",
                            borderRight: "1px",
                            ...style.globalPadding,
                          }}
                        >
                          <Text style={{ ...style.fontBold }}>
                            Pay on Before
                          </Text>
                        </View>
                        <View style={{ width: "25%", ...style.globalPadding }}>
                          <Text>{payOnBefore}</Text>
                        </View> */}
											</View>

											{/* irn No */}
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
													<Text style={{ ...style.fontBold }}>IRN No</Text>
												</View>
												<View style={{ width: "75%", ...style.globalPadding }}>
													<Text></Text>
												</View>
											</View>

											{/* pan and msme No */}
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
													<Text style={{ ...style.fontBold }}>PAN No</Text>
												</View>
												<View
													style={{
														width: "20%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text>
														{props.invRegisterData.PAN_No === "" ||
														props.invRegisterData.PAN_No === undefined ||
														props.invRegisterData.PAN_No === null
															? ""
															: props.invRegisterData.PAN_No}
													</Text>
												</View>
												<View
													style={{
														width: "15%",
														borderRight: "1px",
														...style.globalPadding,
													}}>
													<Text style={{ ...style.fontBold }}>MSME No</Text>
												</View>
												<View style={{ width: "40%", ...style.globalPadding }}>
													<Text></Text>
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
													<Text>
														Whether the Tax is payable on Reverse Charge Basis:
														No
													</Text>
												</View>
											</View>
										</View>
										{/* qr */}
										<View
											style={{
												width: "30%",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}>
											<Text style={{ ...style.fontBold }}></Text>
										</View>
									</View>
									{/* Parts/ Goods Details attached as ANNEXURE - I */}

									<View
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											height: "200px",
											borderBottom: "1px",
										}}>
										<Text style={{ ...style.fontBold }}>
											Parts/ Goods Details attached as ANNEXURE - I
										</Text>

										<Text style={{ ...style.fontBold }}>
											Total Items - {props.invDetailsData.length}
										</Text>
										<Text style={{ ...style.fontBold }}>
											Net Value - {props.invRegisterData.Net_Total}
										</Text>
									</View>
									{/* footer starts */}
									<View>
										{/* remarks and net total */}
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												borderBottom: "1px",
											}}>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Remarks</Text>
											</View>
											<View
												style={{
													width: "61%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>
													{props.invRegisterData.Remarks === "" ||
													props.invRegisterData.Remarks === null ||
													props.invRegisterData.Remarks === undefined
														? ""
														: props.invRegisterData.Remarks}
												</Text>
											</View>

											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Net Total</Text>
											</View>
											<View style={{ width: "15%", ...style.globalPadding }}>
												<Text>{props.invRegisterData.Net_Total}</Text>
											</View>
										</View>

										{/* tax details heading and delivery charges... */}
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												borderBottom: "1px",
											}}>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Tax Name</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Taxable</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Tax %</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Tax Amount</Text>
											</View>
											<View
												style={{
													width: "25%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>
													Goods Under HSN Class
												</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Del. Charge</Text>
											</View>
											<View style={{ width: "15%", ...style.globalPadding }}>
												<Text>{props.invRegisterData.Del_Chg}</Text>
											</View>
										</View>

										{/* tax detatils 1 and discount */}
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												borderBottom: "1px",
											}}>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>{props.invTaxData[0]?.Tax_Name}</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>{props.invTaxData[0]?.TaxableAmount}</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>
													{props.invTaxData[0]?.TaxPercent
														? parseFloat(
																props.invTaxData[0]?.TaxPercent
														  ).toFixed(2)
														: ""}
												</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>{props.invTaxData[0]?.TaxAmt}</Text>
											</View>
											<View
												style={{
													width: "25%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text></Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Discount</Text>
											</View>
											<View style={{ width: "15%", ...style.globalPadding }}>
												<Text>{props.invRegisterData?.Discount}</Text>
											</View>
										</View>

										{/* tax detatils 2 and Total Taxes */}
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												borderBottom: "1px",
											}}>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>{props.invTaxData[1]?.Tax_Name}</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>{props.invTaxData[1]?.TaxableAmount}</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>
													{props.invTaxData[1]?.TaxPercent
														? parseFloat(
																props.invTaxData[1]?.TaxPercent
														  ).toFixed(2)
														: ""}
												</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>{props.invTaxData[1]?.TaxAmt}</Text>
											</View>
											<View
												style={{
													width: "25%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text></Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Total Taxes</Text>
											</View>
											<View style={{ width: "15%", ...style.globalPadding }}>
												<Text>{props.invRegisterData.TaxAmount}</Text>
											</View>
										</View>

										{/* good removed on and Invoice total */}
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												borderBottom: "1px",
											}}>
											<View
												style={{
													width: "24%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>
													Goods Removed on
												</Text>
											</View>
											<View
												style={{
													width: "49%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>
													{props.invRegisterData.Printable_DespatchDate}{" "}
													{props.invRegisterData.TptMode}{" "}
													{props.invRegisterData.VehNo}
												</Text>
											</View>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Invoice Total</Text>
											</View>
											<View style={{ width: "15%", ...style.globalPadding }}>
												<Text>{props.invRegisterData.InvTotal}</Text>
											</View>
										</View>

										{/* Cleared Under Service Accounting Code 998898 - Laser Cutting/Welding Services and round off */}

										<View
											style={{
												display: "flex",
												flexDirection: "row",
												borderBottom: "1px",
											}}>
											<View
												style={{
													width: "73%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>
													Cleared Under Service Accounting Code 998898 - Laser
													Cutting/Welding Services
												</Text>
											</View>

											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Round Off</Text>
											</View>
											<View style={{ width: "15%", ...style.globalPadding }}>
												<Text>{props.invRegisterData.Round_Off}</Text>
											</View>
										</View>

										{/* empty space and grand total */}
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												borderBottom: "1px",
											}}>
											<View
												style={{
													width: "73%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text></Text>
											</View>

											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Grand Total</Text>
											</View>
											<View style={{ width: "15%", ...style.globalPadding }}>
												<Text>{props.invRegisterData.GrandTotal}</Text>
											</View>
										</View>

										{/* amount in words */}
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												borderBottom: "1px",
												justifyContent: "flex-end",
												...style.globalPadding,
											}}>
											<Text>
												{"Total Value in words Rupees" +
													(parseInt(props.invRegisterData?.GrandTotal) === 0
														? " Zero "
														: wordify(
																parseInt(props.invRegisterData?.GrandTotal)
														  )) +
													"Only."}
												{/* {"Rupees" +
                          wordify(
                            props.invRegisterData.GrandTotal?.split(".")[0]
                          ) +
                          "Only."} */}
											</Text>
										</View>

										{/* bank details */}

										<View
											style={{
												display: "flex",
												flexDirection: "row",
												borderBottom: "1px",
											}}>
											<View
												style={{
													width: "12%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text style={{ ...style.fontBold }}>Bank Details</Text>
											</View>
											<View style={{ ...style.globalPadding }}>
												<Text>
													State Bank of India Current Account A/C No :
													33664104046 IFSC : SBIN0011355 Branch : Jigani
												</Text>
											</View>
										</View>

										{/* disclaimer and signatory */}

										<View
											style={{
												display: "flex",
												flexDirection: "row",
												// borderBottom: "1px",
											}}>
											<View
												style={{
													width: "60%",
													borderRight: "1px",
													...style.globalPadding,
												}}>
												<Text>
													Certified that the particulars given above are true &
													correct and the amount indicated represents the price
													actually charged and that there is no flow of
													additional consideration directly or indirectly from
													the buyer.
												</Text>
												<Text>SUBJECT TO BANGALORE JURISDICTION.</Text>
											</View>
											<View
												style={{
													...style.globalPadding,
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-end",
													justifyContent: "space-between",
													width: "40%",
												}}>
												<Text>For, Magod Laser Machining Private Limited</Text>
												<Text style={{ ...style.fontBold }}>
													Authorised Signatory
												</Text>
											</View>
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
									<Text>
										#72, Phase II, KIADB Indl Area Jigani, Anekal Taluk
										Bengaluru - 560105
									</Text>
								</View>
							</View>
						</Page>
						<Page
							size="A4"
							style={{ ...style.pageStyling }}>
							{/* heading annexure */}
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "center",
								}}>
								<Text style={{ fontSize: "15px", ...style.fontBold }}>
									ANNEXURE I
								</Text>
							</View>
							<View style={{ ...style.globalPadding }}></View>
							{/* table */}
							<View style={{ border: "1px" }}>
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
											width: "44%",
											borderRight: "1px",
										}}>
										<Text>Description of goods / Drawing No</Text>
									</View>

									{/* Material */}
									<View
										style={{
											...style.globalPadding,
											width: "22%",
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
								<View>
									{props.invDetailsData?.map((val, key) => (
										<View
											// style={{

											//   display: "flex",
											//   flexDirection: "row",
											//   // ...style.fontBold,
											//   borderBottom: "1px",
											// }}

											style={
												props.invDetailsData?.length === key + 1
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
													...style.globalPadding,
													width: "7%",
													borderRight: "1px",
												}}>
												<Text>{key + 1}</Text>
											</View>

											{/* description of goods or drawing No  */}

											<View
												style={{
													...style.globalPadding,
													width: "44%",
													borderRight: "1px",
												}}>
												<Text>{val.Dwg_No}</Text>
											</View>

											{/* Material */}
											<View
												style={{
													...style.globalPadding,
													width: "22%",
													borderRight: "1px",
												}}>
												<Text>{val.Mtrl}</Text>
											</View>

											{/* Quantity */}

											<View
												style={{
													...style.globalPadding,
													width: "7%",
													borderRight: "1px",
												}}>
												<Text>{val.Qty}</Text>
											</View>

											{/* Unit Price */}

											<View
												style={{
													...style.globalPadding,
													width: "10%",
													borderRight: "1px",
												}}>
												<Text>{val.Unit_Rate}</Text>
											</View>

											{/* amount */}

											<View style={{ ...style.globalPadding, width: "10%" }}>
												<Text>{val.DC_Srl_Amt}</Text>
											</View>
										</View>
									))}
								</View>
							</View>
						</Page>
					</>
				))}
			</Document>
		</>
	);
}
