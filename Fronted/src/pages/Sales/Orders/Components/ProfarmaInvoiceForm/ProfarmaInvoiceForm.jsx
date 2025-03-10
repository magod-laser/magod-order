/** @format */

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";

import { endpoints } from "../../../../api/constants";
import { getRequest, postRequest } from "../../../../api/apiinstance";
import ProductTable from "./Tables/ProductTable";
import TaxTable from "./Tables/TaxTable";
import Confirmation from "../Modals/Confirmation";
import ModalProfarmaInvoice from "../../PDFs/ProfarmaInvoice/ModalProfarmaInvoice";

export default function ProfarmaInvoiceForm(props) {
	const location = useLocation();
	const navigate = useNavigate();
	const todayDate = new Date();

	// console.log("location", location);
	const [ProfarmaID, setProfarmaID] = useState(location?.state);
	// console.log("profarmaID", ProfarmaID);

	const [runningNo, setRunningNo] = useState({});

	const [formData, setFormData] = useState({
		unitName: "Jigani",
	});
	const [profarmaMainData, setProfarmaMainData] = useState({});
	const [profarmaDetailsData, setProfarmaDetailsData] = useState([]);
	const [profarmaTaxData, setProfarmaTaxData] = useState([]);

	const [taxDropdownData, setTaxDropdownData] = useState([]);

	const [confirmModalOpen, setConfirmModalOpen] = useState(false);

	const [printInvoiceModal, setPrintInvoiceModal] = useState(false);

	const [runningNoData, setRunningNoData] = useState({});

	const rowLimit = 20;
	const fetchData = () => {
		postRequest(
			endpoints.getProfarmaFormMain,
			{ ProfarmaID: ProfarmaID },
			(profarmaMainData) => {
				setProfarmaMainData(profarmaMainData[0]);

				// console.log("profarmaMainData", profarmaMainData);
				postRequest(
					endpoints.getTaxData,
					{
						Cust_Code: profarmaMainData[0].Cust_Code,
						unitStateID: "29",
						unitGST: "29AABCM1970H1ZE",
					},
					(taxData) => {
						setTaxDropdownData(taxData);
					}
				);
			}
		);

		postRequest(
			endpoints.getProfarmaFormDetails,
			{ ProfarmaID: ProfarmaID },
			(profarmaDetailsData) => {
				setProfarmaDetailsData(profarmaDetailsData);
				// console.log("qwqwqwqw", profarmaMainData);
			}
		);

		postRequest(
			endpoints.getProfarmaFormTaxes,
			{ ProfarmaID: ProfarmaID },
			(profarmaTaxData) => {
				setProfarmaTaxData(profarmaTaxData);
				// console.log("qwqwqwqw", profarmaMainData);
			}
		);
	};

	useEffect(() => {
		fetchData();
	}, []);

	// console.log("profarmaMainData", profarmaMainData);
	// console.log("profarmaDetailsData", profarmaDetailsData);
	// console.log("profarmaTaxData", profarmaTaxData);

	function saveInvoiceFunc() {
		// console.log("saveInvoiceFunc clicked");

		postRequest(
			endpoints.postSaveInvoice,
			{
				profarmaMainData: profarmaMainData,
				profarmaDetailsData: profarmaDetailsData,
				profarmaTaxData: profarmaTaxData,
			},
			(saveInvoiceResp) => {
				// console.log("saveInvoiceResp", saveInvoiceResp);

				if (saveInvoiceResp) {
					if (saveInvoiceResp.flag) {
						toast.success(saveInvoiceResp.message);
					} else {
						toast.error("uncaught backend error");
					}
				} else {
					toast.warning("uncaught frontend error");
				}
			}
		);
	}

	function modifyInputs(e) {
		// console.log("eeee", e.target.name, e.target.value);

		let discount = profarmaMainData.Discount || 0;
		let deliveryCharge = profarmaMainData.Del_Chg || 0;

		let taxAmount = 0;
		let invoiceTotal = 0;
		let roundOff = 0;
		let grandTotal = 0;
		let assessableValue = 0;

		if (e.target.name === "Discount") {
			discount = e.target.value || 0;
		} else if ((e.target.name = "Del_Chg")) {
			deliveryCharge = e.target.value || 0;
		}

		invoiceTotal =
			parseFloat(profarmaMainData?.Net_Total) -
			parseFloat(discount) +
			parseFloat(deliveryCharge);

		grandTotal = Math.round(invoiceTotal);
		roundOff = grandTotal - invoiceTotal;
		assessableValue = invoiceTotal;

		setProfarmaMainData({
			...profarmaMainData,
			Discount: discount,
			Del_Chg: deliveryCharge,
			TaxAmount: taxAmount,
			InvTotal: invoiceTotal,
			Round_Off: roundOff,
			GrandTotal: grandTotal,
			AssessableValue: assessableValue,
		});

		setProfarmaTaxData([]);
		document.getElementById("taxDropdown").value = "none";

		// setProfarmaMainData({
		//   ...profarmaMainData,
		//   [e.target.name]: e.target.value || 0,
		// });
	}

	function deleteTaxes() {
		setProfarmaTaxData([]);
		document.getElementById("taxDropdown").value = "none";

		setProfarmaMainData({
			...profarmaMainData,
			TaxAmount: "0.00",
			InvTotal:
				parseFloat(profarmaMainData?.Net_Total) -
				parseFloat(profarmaMainData?.Discount) +
				parseFloat(profarmaMainData?.Del_Chg),
			GrandTotal: Math.round(
				parseFloat(profarmaMainData?.Net_Total) -
					parseFloat(profarmaMainData?.Discount) +
					parseFloat(profarmaMainData?.Del_Chg)
			),
			Round_Off:
				Math.round(
					parseFloat(profarmaMainData?.Net_Total) -
						parseFloat(profarmaMainData?.Discount) +
						parseFloat(profarmaMainData?.Del_Chg)
				) -
				(parseFloat(profarmaMainData?.Net_Total) -
					parseFloat(profarmaMainData?.Discount) +
					parseFloat(profarmaMainData?.Del_Chg)),
		});
	}
	// console.log("profarmaMainData", profarmaMainData);

	function changeQTY(key, qty) {
		// console.log("key", key, "qty", qty);
		let arr = [];
		let netTotal = 0;

		for (let i = 0; i < profarmaDetailsData.length; i++) {
			const element = profarmaDetailsData[i];
			if (i === key) {
				element.Qty = qty;
				element.DC_Srl_Amt = (
					parseFloat(qty) * parseFloat(element.Unit_Rate)
				).toFixed(2);

				// netTotal =
				//   parseFloat(netTotal) +
				//   parseFloat(qty) * parseFloat(element.Unit_Rate);
			}
			// netTotal =
			//   parseFloat(netTotal) +
			//   parseFloat(element.Qty) * parseFloat(element.Unit_Rate);
			arr.push(element);

			netTotal = parseFloat(netTotal) + parseFloat(element.DC_Srl_Amt);
			// console.log("netTotal", netTotal);
		}

		// console.log("arr", arr);

		setProfarmaDetailsData(arr);

		setProfarmaMainData({
			...profarmaMainData,
			Net_Total: parseFloat(netTotal).toFixed(2),
			Discount: "0.00",
			Del_Chg: "0.00",
			TaxAmount: "0.00",
			InvTotal: parseFloat(netTotal).toFixed(2),
			GrandTotal: Math.round(parseFloat(netTotal).toFixed(2)),
			Round_Off: (
				Math.round(parseFloat(netTotal).toFixed(2)) -
				parseFloat(netTotal).toFixed(2)
			).toFixed(2),
			AssessableValue: parseFloat(netTotal).toFixed(2),
		});

		setProfarmaTaxData([]);
		document.getElementById("taxDropdown").value = "none";
	}

	const getDCNo = async () => {
		// console.log("todayDate", todayDate);

		let finYear = `${
			(todayDate.getMonth() + 1 < 4
				? todayDate.getFullYear() - 1
				: todayDate.getFullYear()
			)
				.toString()
				.slice(-2) +
			"/" +
			(todayDate.getMonth() + 1 < 4
				? todayDate.getFullYear()
				: todayDate.getFullYear() + 1
			)
				.toString()
				.slice(-2)
		}`;

		// console.log("finYear", finYear);

		const srlType = "ProformaInvoice";
		const ResetPeriod = "FinanceYear";
		const ResetValue = 0;
		const Length = 4;
		// const prefix = "";

		postRequest(
			endpoints.insertAndGetRunningNo,
			{
				finYear: finYear,
				unitName: formData.unitName,
				srlType: srlType,
				ResetPeriod: ResetPeriod,
				ResetValue: ResetValue,
				Length: Length,
				// prefix: prefix,
			},
			(res) => {
				console.log("getDCNo Response", res);
				setRunningNoData(res.runningNoData);
			}
		);
	};

	function createInvoiceConfirmation() {
		getDCNo();
		setConfirmModalOpen(true);
	}

	function createInvoice() {
		saveInvoiceFunc();
		// console.log("create invoice");

		// let newRunningNo = parseInt(runningNo.Running_No) + 1;

		// let series = newRunningNo.toString();
		// for (let i = 0; i < parseInt(runningNo["Length"]); i++) {
		//   if (series.length < parseInt(runningNo["Length"])) {
		//     series = "0" + series;
		//   }
		// }

		// series = runningNo.Period + "/" + runningNo.Prefix + series;

		// // console.log("seriesssss", series);

		postRequest(
			endpoints.postInvFormCreateInvoice,
			{
				// series: series,
				ProfarmaID: profarmaMainData.ProfarmaID,
				runningNoData: runningNoData,
			},
			(resp) => {
				// console.log("resp", resp);

				if (resp.flag) {
					toast.success(resp.message || "Proforma Invoice Created");
					fetchData();

					// postRequest(
					//   endpoints.updateRunningNoBySrlType,
					//   {
					//     SrlType: runningNo.SrlType,
					//     Period: runningNo.Period,
					//     RunningNo: newRunningNo,
					//   },
					//   (updateRunningNo) => {
					//     if (resp.affectedRows > 0 || resp.changedRows > 0) {
					//     } else {
					//       toast.error("unable to update running no");
					//     }

					//     // console.log("update running no", updateRunningNo);
					//   }
					// );
				} else {
					toast.error("uncaught error in backend");
				}
				// setRunningNo(runningNo[0]);
			}
		);
	}

	return (
		<>
			<div>
				<div>
					<h4 className="title m-0">Proforma Invoice Form</h4>
				</div>
				<div className="p-1"></div>
				<div className="row border rounded">
					<div className="col-md-3">
						<label className="form-label m-0 label-space">Customer Name</label>
						<input
							value={profarmaMainData?.Cust_Name || ""}
							disabled
							className="input-disabled in-field"
						/>
					</div>
					<div className="col-md-3">
						<label className="form-label m-0 label-space">
							Proforma Invoice No & Date
						</label>
						<input
							value={
								profarmaMainData?.ProformaInvNo
									? profarmaMainData?.ProformaInvNo +
									  " Date: " +
									  profarmaMainData?.Printable_ProformaDate
									: ""
							}
							disabled
							className="input-disabled in-field"
						/>
					</div>
					<div className="col-md-3">
						<label className="form-label m-0 label-space">
							Proforma Invoice Type
						</label>
						<input
							value={profarmaMainData?.InvType || ""}
							disabled
							className="input-disabled in-field"
						/>
					</div>
					<div className="col-md-3">
						<label className="form-label m-0 label-space">PO No</label>
						<input
							value={profarmaMainData?.PO_No || ""}
							disabled
							className="input-disabled in-field"
						/>
					</div>
					<div className="col-md-6 row p-0">
						<div className="col-md-12 row p-0">
							<div className="col-md-6">
								<label className="form-label m-0 label-space">City</label>
								<input
									value={profarmaMainData?.Cust_Place || ""}
									disabled
									className="input-disabled in-field"
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label m-0 label-space">State</label>
								<input
									value={profarmaMainData?.Cust_State || ""}
									disabled
									className="input-disabled in-field"
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label m-0 label-space">PIN</label>
								<input
									value={profarmaMainData?.PIN_Code || ""}
									disabled
									className="input-disabled in-field"
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label m-0 label-space">GST No</label>
								<input
									value={profarmaMainData?.GSTNo || "Unregistered"}
									disabled
									className="input-disabled in-field"
								/>
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<label className="form-label m-0 label-space">Address</label>
						<textarea
							rows="3"
							style={{ width: "100%", height: "auto" }}
							value={profarmaMainData?.Cust_Address || ""}
							disabled
							className="input-disabled in-field"></textarea>
					</div>
					<div className="p-1"></div>
				</div>
				<div className="p-1"></div>
				<div className="row border rounded">
					<div className="col-md-3">
						<label className="form-label m-0 label-space">Net Total</label>
						<input
							type="number"
							value={parseFloat(profarmaMainData?.Net_Total).toFixed(2)}
							disabled
							className="input-disabled in-field"
						/>
					</div>
					<div className="col-md-3">
						<label className="form-label m-0 label-space">Discount</label>
						<input
							type="number"
							value={parseFloat(profarmaMainData?.Discount)}
							min={0}
							// max={parseFloat(profarmaMainData?.Net_Total)}
							name="Discount"
							onChange={modifyInputs}
							disabled={profarmaMainData?.ProformaInvNo}
							className={
								profarmaMainData?.ProformaInvNo
									? "input-disabled in-field"
									: "in-field"
							}
						/>
					</div>
					<div className="col-md-3">
						<label className="form-label m-0 label-space">
							Delivery Charges
						</label>
						<input
							type="number"
							value={parseFloat(profarmaMainData?.Del_Chg)}
							min={0}
							name="Del_Chg"
							onChange={modifyInputs}
							disabled={profarmaMainData?.ProformaInvNo}
							className={
								profarmaMainData?.ProformaInvNo
									? "input-disabled in-field"
									: "in-field"
							}
						/>
					</div>
					<div className="col-md-3">
						<label className="form-label m-0 label-space">Tax Amount</label>
						<input
							type="number"
							value={parseFloat(profarmaMainData?.TaxAmount).toFixed(2)}
							disabled
							className="input-disabled in-field"
						/>
					</div>
					<div className="col-md-3">
						<label className="form-label m-0 label-space">Invoice Total</label>
						<input
							type="number"
							value={parseFloat(profarmaMainData?.InvTotal).toFixed(2)}
							disabled
							className="input-disabled in-field"
						/>
					</div>
					<div className="col-md-3">
						<label className="form-label m-0 label-space">Round Off</label>
						<input
							type="number"
							value={parseFloat(profarmaMainData?.Round_Off).toFixed(2)}
							disabled
							className="input-disabled in-field"
						/>
					</div>
					<div className="col-md-3">
						<label className="form-label m-0 label-space">Grand Total</label>
						<input
							type="number"
							value={parseFloat(profarmaMainData?.GrandTotal).toFixed(2)}
							disabled
							className="input-disabled in-field"
						/>
					</div>
					<div className="p-1"></div>
				</div>
				<div className="row">
					<div className="col-md-6 d-flex justify-content-start align-items-center">
						<button
							disabled={profarmaMainData?.ProformaInvNo}
							className={
								profarmaMainData?.ProformaInvNo
									? "button-style m-0 button-disabled"
									: "button-style m-0"
							}
							onClick={saveInvoiceFunc}>
							Save Invoice
						</button>
						<div className="p-1"></div>
						<button
							disabled={profarmaMainData?.ProformaInvNo}
							className={
								profarmaMainData?.ProformaInvNo
									? "button-style m-0 button-disabled"
									: "button-style m-0"
							}
							onClick={createInvoiceConfirmation}>
							Create Invoice
						</button>
						<div className="p-1"></div>
						<button
							disabled={!profarmaMainData?.ProformaInvNo}
							className={
								!profarmaMainData?.ProformaInvNo
									? "button-style m-0 button-disabled"
									: "button-style m-0"
							}
							onClick={(e) => {
								setPrintInvoiceModal(true);
							}}>
							Print Copy
						</button>
						<div className="p-1"></div>
						<button
							className="button-style m-0"
							onClick={() => navigate(-1)}
							// style={{ float: "right" }}
						>
							Close
						</button>
					</div>
					<div className="col-md-6 d-flex justify-content-end align-items-center">
						<div>
							<label className="form-label m-0 label-space">
								Assessable Value
							</label>
							<input
								type="number"
								value={parseFloat(profarmaMainData?.AssessableValue).toFixed(2)}
								disabled
								className="input-disabled in-field"
							/>
						</div>
						<div className="p-1"></div>
						<div>
							<label className="form-label m-0 label-space">Select Taxes</label>
							<select
								id="taxDropdown"
								style={{ width: "100%" }}
								disabled={profarmaMainData?.ProformaInvNo}
								className={
									profarmaMainData?.ProformaInvNo
										? "input-disabled ip-select mt-1 in-field"
										: "ip-select mt-1 in-field"
								}
								onChange={(e) => {
									const taxOn = taxDropdownData[e.target.value].TaxOn.replace(
										"(",
										""
									)
										.replace(")", "")
										.split("+");
									let applicableTaxes = [];
									let arr = [];
									let totalTaxAmount = 0;

									if (
										taxDropdownData[e.target.value].UnderGroup.toUpperCase() ===
											"INCOMETAX" ||
										taxDropdownData[e.target.value].UnderGroup.toUpperCase() ===
											"INCOME TAX"
									) {
										for (let i = 1; i < taxOn.length; i++) {
											const element = taxOn[i];
											taxDropdownData
												.filter((obj) => obj.TaxID === parseInt(element))
												.map((value, key) => applicableTaxes.push(value));
										}
										applicableTaxes.push(taxDropdownData[e.target.value]);
										// let taxableAmount = (
										//   parseFloat(invRegisterData?.Net_Total) -
										//   parseFloat(invRegisterData?.Discount) +
										//   parseFloat(invRegisterData?.Del_Chg)
										// ).toFixed(2);

										let taxableAmount = parseFloat(
											profarmaMainData?.AssessableValue || 0
										).toFixed(2);
										// let totalTaxAmount = 0;
										for (let i = 0; i < applicableTaxes.length; i++) {
											const element = applicableTaxes[i];
											if (
												element.UnderGroup.toUpperCase() === "INCOMETAX" ||
												element.UnderGroup.toUpperCase() === "INCOME TAX"
											) {
												let TaxableAmntForTCS =
													parseFloat(taxableAmount) +
													parseFloat(totalTaxAmount);
												let TaxAmtForRow = (
													(TaxableAmntForTCS *
														parseFloat(element.Tax_Percent)) /
													100
												).toFixed(2);
												totalTaxAmount =
													parseFloat(totalTaxAmount) + parseFloat(TaxAmtForRow);

												const taxTableRow = {
													ProfarmaID: profarmaMainData.ProfarmaID,
													TaxID: element.TaxID,
													Tax_Name: element.TaxName,
													TaxOn: element.TaxOn,
													TaxableAmount: taxableAmount,
													TaxPercent: parseFloat(element.Tax_Percent).toFixed(
														2
													),
													TaxAmt: TaxAmtForRow,
												};
												arr.push(
													taxTableRow
													// {
													//   // TaxID: element.TaxID,
													//   // TaxOn: element.TaxOn,
													//   // TaxPercent: element.Tax_Percent,
													//   // Tax_Name: element.TaxName,
													//   // taxableAmount: TaxableAmntForTCS,
													//   // TaxAmt: TaxAmtForRow,

													//   ProfarmaID: profarmaMainData.ProfarmaID,
													//   TaxID: element.TaxID,
													//   Tax_Name: element.TaxName,
													//   TaxOn: element.TaxOn,
													//   TaxableAmount: taxableAmount,
													//   TaxPercent: parseFloat(element.Tax_Percent).toFixed(2),
													//   TaxAmt: TaxAmtForRow,
													// }
												);
											} else {
												let TaxAmtForRow = (
													(taxableAmount * parseFloat(element.Tax_Percent)) /
													100
												).toFixed(2);
												totalTaxAmount =
													parseFloat(totalTaxAmount) + parseFloat(TaxAmtForRow);
												const taxTableRow = {
													ProfarmaID: profarmaMainData.ProfarmaID,
													TaxID: element.TaxID,
													Tax_Name: element.TaxName,
													TaxOn: element.TaxOn,
													TaxableAmount: taxableAmount,
													TaxPercent: parseFloat(element.Tax_Percent).toFixed(
														2
													),
													TaxAmt: TaxAmtForRow,
												};
												arr.push(
													taxTableRow
													// {
													//   // TaxID: element.TaxID,
													//   // TaxOn: element.TaxOn,
													//   // TaxPercent: element.Tax_Percent,
													//   // Tax_Name: element.TaxName,
													//   // taxableAmount: TaxableAmntForTCS,
													//   // TaxAmt: TaxAmtForRow,

													//   ProfarmaID: profarmaMainData.ProfarmaID,
													//   TaxID: element.TaxID,
													//   Tax_Name: element.TaxName,
													//   TaxOn: element.TaxOn,
													//   TaxableAmount: taxableAmount,
													//   TaxPercent: parseFloat(element.Tax_Percent).toFixed(2),
													//   TaxAmt: TaxAmtForRow,
													// }
												);
											}
										}
										// setInvTaxData(arr);
										// let newInvTotal =
										//   parseFloat(taxableAmount) +
										//   parseFloat(totalTaxAmount);
										// let newGrandTotal = Math.round(newInvTotal);
										// let newRoundOff = newGrandTotal - newInvTotal;
										// setInvRegisterData({
										//   ...invRegisterData,
										//   TaxAmount: parseFloat(totalTaxAmount).toFixed(2),
										//   InvTotal: newInvTotal.toFixed(2),
										//   GrandTotal: newGrandTotal.toFixed(2),
										//   Round_Off: newRoundOff.toFixed(2),
										// });

										let invTotal =
											parseFloat(profarmaMainData.Net_Total) -
											parseFloat(profarmaMainData.Discount) +
											parseFloat(profarmaMainData.Del_Chg) +
											parseFloat(totalTaxAmount);

										let grandTotal = Math.round(invTotal);
										setProfarmaTaxData(arr);
										setProfarmaMainData({
											...profarmaMainData,
											TaxAmount: totalTaxAmount,
											InvTotal: invTotal,
											Round_Off: grandTotal - invTotal,
											GrandTotal: grandTotal,
										});
									} else {
										for (let i = 0; i < taxOn.length; i++) {
											const element = taxOn[i];
											if (parseInt(element) === 1) {
												applicableTaxes.push(taxDropdownData[e.target.value]);
											} else {
												// filter gets the data in array, there may be more then 1 rows, so mappppp....
												taxDropdownData
													.filter((obj) => obj.TaxID === parseInt(element))
													.map((value, key) => applicableTaxes.push(value));
											}
										}
										// let taxableAmount = (
										//   parseFloat(invRegisterData?.Net_Total) -
										//   parseFloat(invRegisterData?.Discount) +
										//   parseFloat(invRegisterData?.Del_Chg)
										// ).toFixed(2);

										let taxableAmount = parseFloat(
											profarmaMainData?.AssessableValue || 0
										).toFixed(2);
										let totalTaxAmount = 0;
										for (let i = 0; i < applicableTaxes.length; i++) {
											const element = applicableTaxes[i];
											let TaxAmtForRow = (
												(taxableAmount * parseFloat(element.Tax_Percent)) /
												100
											).toFixed(2);
											totalTaxAmount =
												parseFloat(totalTaxAmount) + parseFloat(TaxAmtForRow);

											const taxTableRow = {
												ProfarmaID: profarmaMainData.ProfarmaID,
												TaxID: element.TaxID,
												Tax_Name: element.TaxName,
												TaxOn: element.TaxOn,
												TaxableAmount: taxableAmount,
												TaxPercent: parseFloat(element.Tax_Percent).toFixed(2),
												TaxAmt: TaxAmtForRow,
											};

											arr.push(taxTableRow);
											// if (arr.length > 0) {
											//   arr = [
											//     ...arr,
											//     {
											//       TaxID: element.TaxID,
											//       TaxOn: element.TaxOn,
											//       TaxPercent: element.Tax_Percent,
											//       Tax_Name: element.TaxName,
											//       taxableAmount: taxableAmount,
											//       TaxAmt: TaxAmtForRow,
											//     },
											//   ];
											// } else {
											//   arr = [
											//     {
											//       TaxID: element.TaxID,
											//       TaxOn: element.TaxOn,
											//       TaxPercent: element.Tax_Percent,
											//       Tax_Name: element.TaxName,
											//       taxableAmount: taxableAmount,
											//       TaxAmt: TaxAmtForRow,
											//     },
											//   ];
											// }
										}

										// setInvTaxData(arr);
										// let newInvTotal =
										//   parseFloat(taxableAmount) +
										//   parseFloat(totalTaxAmount);
										// let newGrandTotal = Math.round(newInvTotal);
										// let newRoundOff = newGrandTotal - newInvTotal;
										// setInvRegisterData({
										//   ...invRegisterData,
										//   TaxAmount: parseFloat(totalTaxAmount).toFixed(2),
										//   InvTotal: newInvTotal.toFixed(2),
										//   GrandTotal: newGrandTotal.toFixed(2),
										//   Round_Off: newRoundOff.toFixed(2),
										// });

										let invTotal =
											parseFloat(profarmaMainData.Net_Total) -
											parseFloat(profarmaMainData.Discount) +
											parseFloat(profarmaMainData.Del_Chg) +
											parseFloat(totalTaxAmount);

										let grandTotal = Math.round(invTotal);
										setProfarmaTaxData(arr);
										setProfarmaMainData({
											...profarmaMainData,
											TaxAmount: totalTaxAmount,
											InvTotal: invTotal,
											Round_Off: grandTotal - invTotal,
											GrandTotal: grandTotal,
										});
									}
								}}
								// onChange={(e) => {
								//   const taxOn = taxDropdownData[e.target.value].TaxOn?.split(
								//     "("
								//   )[0]
								//     .split(")")[0]
								//     .split("+");

								//   let applicableTaxes = [];
								//   let arr = [];

								//   let totalTaxAmount = 0;

								//   // console.log("taxOn", taxOn);
								//   for (let i = 0; i < taxOn.length; i++) {
								//     const element = parseInt(taxOn[i]);
								//     if (element === 1) {
								//       // console.log("111", taxDropdownData[e.target.value]);
								//       applicableTaxes.push(taxDropdownData[e.target.value]);
								//     } else {
								//       // console.log("else", taxDropdownData);

								//       taxDropdownData
								//         .filter((obj) => parseInt(obj.TaxID) === element)
								//         .map((val, key) => applicableTaxes.push(val));
								//     }
								//   }

								//   // console.log("applicableTaxes", applicableTaxes);

								//   for (let i = 0; i < applicableTaxes.length; i++) {
								//     const element = applicableTaxes[i];

								//     let taxableAmount = parseFloat(
								//       profarmaMainData?.AssessableValue || 0
								//     ).toFixed(2);

								//     let taxAmount = parseFloat(
								//       (taxableAmount * parseFloat(element.Tax_Percent)) / 100
								//     ).toFixed(2);

								//     const taxTableRow = {
								//       ProfarmaID: profarmaMainData.ProfarmaID,
								//       TaxID: element.TaxID,
								//       Tax_Name: element.TaxName,
								//       TaxOn: element.TaxOn,
								//       TaxableAmount: taxableAmount,
								//       TaxPercent: parseFloat(element.Tax_Percent).toFixed(2),
								//       TaxAmt: taxAmount,
								//     };

								//     arr.push(taxTableRow);
								//     totalTaxAmount =
								//       parseFloat(totalTaxAmount) + parseFloat(taxAmount);

								//     // console.log("taxTableRow", taxTableRow);
								//     // console.log("taxprofarma", profarmaTaxData);
								//     // if (profarmaTaxData.length > 0) {
								//     //   setProfarmaTaxData([...profarmaTaxData, taxTableRow]);
								//     // } else {
								//     //   setProfarmaTaxData([taxTableRow]);
								//     // }
								//   }

								//   let invTotal =
								//     parseFloat(profarmaMainData.Net_Total) -
								//     parseFloat(profarmaMainData.Discount) +
								//     parseFloat(profarmaMainData.Del_Chg) +
								//     parseFloat(totalTaxAmount);

								//   let grandTotal = Math.round(invTotal);
								//   setProfarmaTaxData(arr);
								//   setProfarmaMainData({
								//     ...profarmaMainData,
								//     TaxAmount: totalTaxAmount,
								//     InvTotal: invTotal,
								//     Round_Off: grandTotal - invTotal,
								//     GrandTotal: grandTotal,
								//   });
								// }}
							>
								<option
									value="none"
									selected
									disabled
									hidden>
									Select an Option
								</option>
								{taxDropdownData?.map((taxVal, key) => (
									<option value={key}>{taxVal.TaxName}</option>
								))}
							</select>
						</div>
						<div className="p-1"></div>
						<button
							disabled={profarmaMainData?.ProformaInvNo}
							className={
								profarmaMainData?.ProformaInvNo
									? "button-style m-0 button-disabled"
									: "button-style m-0"
							}
							onClick={deleteTaxes}>
							Delete Taxes
						</button>
					</div>
				</div>
				<div className="p-1"></div>
				<div className="row">
					<div className="col-md-6">
						<ProductTable
							profarmaMainData={profarmaMainData}
							profarmaDetailsData={profarmaDetailsData}
							changeQTY={changeQTY}
						/>
					</div>
					<div className="col-md-6">
						<TaxTable profarmaTaxData={profarmaTaxData} />
					</div>
				</div>
				<div className="p-2"></div>
			</div>
			<Confirmation
				setConfirmModalOpen={setConfirmModalOpen}
				confirmModalOpen={confirmModalOpen}
				message={"Are you sure to create the Proforma Invoice"}
				yesClickedFunc={createInvoice}
			/>

			<ModalProfarmaInvoice
				printInvoiceModal={printInvoiceModal}
				setPrintInvoiceModal={setPrintInvoiceModal}
				rowLimit={rowLimit}
				profarmaMainData={profarmaMainData}
				profarmaDetailsData={profarmaDetailsData}
				profarmaTaxData={profarmaTaxData}
			/>
		</>
	);
}

// <div>
//   <div className="row">
//     <div className="col-md-12">
//       <h4 className="title">Proforma Invoice Form</h4>
//     </div>
//   </div>
//   <div className="row mt-2">
//     <div className="col-md-4">
//       <label className="form-label m-0">Proforma Invoice Type</label>
//       <input type="text" />
//     </div>
//     <div className="col-md-4">
//       <label className="form-label m-0">Customer Name</label>
//       <input type="text" />
//     </div>
//     <div className="col-md-4">
//       <label className="form-label m-0">GST No</label>
//       <input type="text" />
//     </div>
//   </div>

//   <div className="row">
//     <div className="col-md-4">
//       <label className="form-label m-0">Proforma Invoice No</label>
//       <input type="text" />
//     </div>
//     <div className="col-md-4">
//       <label className="form-label m-0">Date</label>
//       <input type="date" />
//     </div>
//     <div className="col-md-4">
//       <label className="form-label m-0">City</label>
//       <input type="text" />
//     </div>
//   </div>

//   <div className="row">
//     <div className="col-md-4">
//       <label className="form-label m-0">Pin</label>
//       <input type="text" />
//     </div>
//     <div className="col-md-4">
//       <label className="form-label m-0">State</label>
//       <input type="text" />
//     </div>
//     <div className="col-md-4">
//       <label className="form-label m-0">PO No</label>
//       <input type="text" />
//     </div>
//   </div>

//   <div className="row">
//     <div className="col-md-4">
//       <label className="form-label m-0">Address</label>
//       <textarea
//         id="exampleFormControlTextarea1"
//         rows="3"
//         style={{ width: "360px" }}
//       ></textarea>
//     </div>
//   </div>

//   <div className="row">
//     <div className="col-md-6">
//       <div className="mt-3" style={{ overflowY: "scroll" }}>
//         <Table
//           striped
//           className="table-data border"
//           style={{ border: "1px" }}
//         >
//           <thead className="tableHeaderBGColor">
//             <tr>
//               <th>Srl</th>
//               <th>Drawing No</th>
//               <th>Material Code</th>
//               <th>Quantity</th>
//               <th>Unit Rate</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody className="tablebody"></tbody>
//         </Table>
//       </div>
//     </div>
//     <div className="col-md-6">
//       <div className="row">
//         <div className="col-md-4">
//           <div>
//             <label className="form-label m-0">Select Tax</label>
//             <select id="" className="ip-select">
//               <option value="option1">option 1</option>
//               <option value="option2">option 2</option>
//               <option value="option3">option 3</option>
//             </select>
//           </div>
//           <div>
//             <label className="form-label m-0">Assessable Value</label>
//             <input type="number" />
//           </div>
//           <div>
//             <label className="form-label m-0">Net Total</label>
//             <input type="number" />
//           </div>
//           <div>
//             <label className="form-label m-0">Discount</label>
//             <input type="number" />
//           </div>
//           <div>
//             <label className="form-label m-0">Delivery Charges</label>
//             <input type="number" />
//           </div>
//         </div>
//         <div className="col-md-4">
//           <button className="button-style">Save Invoice</button>
//           <button className="button-style">Delete Taxes</button>

//           <button className="button-style">Create Invoice</button>
//           <button className="button-style">Print Copy</button>
//         </div>
//         <div className="col-md-4">
//           <div>
//             <label className="form-label m-0">Tax Amount</label>
//             <input type="number" />
//           </div>
//           <div>
//             <label className="form-label m-0">Invoice Total</label>
//             <input type="number" />
//           </div>
//           <div>
//             <label className="form-label m-0">Round Off</label>
//             <input type="number" />
//           </div>
//           <div>
//             <label className="form-label m-0">Grand Total</label>
//             <input type="number" />
//           </div>
//         </div>
//       </div>
//       <div className="mt-3" style={{ overflowY: "scroll" }}>
//         <Table
//           striped
//           className="table-data border"
//           style={{ border: "1px" }}
//         >
//           <thead className="tableHeaderBGColor">
//             <tr>
//               <th>Srl</th>
//               <th>Drawing No</th>
//               <th>Material Code</th>
//               <th>Quantity</th>
//               <th>Unit Rate</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody className="tablebody"></tbody>
//         </Table>
//       </div>
//     </div>
//   </div>
// </div>
