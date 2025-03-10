/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Table, Tabs, Form } from "react-bootstrap";

// import Axios from "axios";
import DetailsTable from "./Tables/DetailsTable";
import MainTable from "./Tables/MainTable";
import { endpoints } from "../../../../../../api/constants";
import { postRequest } from "../../../../../../api/apiinstance";

import { toast } from "react-toastify";

export default function ProfarmaInvoiceList(props) {
	// console.log("propsss in proforma inv list", props);
	const nav = useNavigate();

	const [selectedProfarmaMainRow, setSelectedProfarmaMainRow] = useState({});
	const [filteredDetailsData, setFilteredDetailsData] = useState([]);

	const filterDetailsRow = (val) => {
		if (selectedProfarmaMainRow.ProfarmaID === val.ProfarmaID) {
			setSelectedProfarmaMainRow({});
			setFilteredDetailsData([]);
		} else {
			setSelectedProfarmaMainRow(val);
			const arr = props.profarmaInvDetails?.filter(
				(obj) => obj.ProfarmaID === val.ProfarmaID
			);
			setFilteredDetailsData(arr);
		}
	};

	// console.log("selectedItems", props.selectedItems);

	const createInvoice = () => {
		// console.log("createInvoice");

		if (props.selectedItems.length > 0) {
			let InvType = "Sales";
			let netTotal = 0;

			// const arr = props.selectedItems?.filter((obj)=>(
			//   obj.Mtrl_Source === 'Magod'
			// )).length>0

			for (let i = 0; i < props.selectedItems.length; i++) {
				const element = props.selectedItems[i];
				if (element.Mtrl_Source === "Magod") {
					InvType = "Sales";
				} else {
					InvType = "Job Work";
				}

				netTotal = (
					parseFloat(netTotal) +
					parseFloat(element.Qty_Ordered) *
						(parseFloat(element.JWCost) + parseFloat(element.MtrlCost || 0))
				).toFixed(2);
			}

			// console.log("netTotal", netTotal);
			// console.log("InvType", InvType);

			const profarmaMainData = {
				InvType: InvType,
				OrderNo: props.OrderData.Order_No,
				OrderDate: props.OrderData.Order_Date,
				Cust_Code: props.OrderCustData.Cust_Code,
				Cust_Name: props.OrderCustData.Cust_name || "",
				Cust_Address: props.OrderCustData.Address || "",
				Cust_Place: props.OrderCustData.City || "",
				Cust_State: props.OrderCustData.State || "",
				Cust_StateId: props.OrderCustData.StateId || "",
				PIN_Code: props.OrderCustData.Pin_Code || "",
				DelAddress: props.OrderCustData.Delivery || "",
				GSTNo: props.OrderCustData.GSTNo || "Unregistered",
				PO_No: props.OrderData.Purchase_Order || "",
				PO_Date: props.OrderData.Order_Date || "",
				Net_Total: netTotal || 0,
				AssessableValue: netTotal || 0,
				InvTotal: netTotal || 0,
				GrandTotal: netTotal || 0,
				Status: "Draft",
			};

			postRequest(
				endpoints.postCreateInvoice,
				{
					profarmaMainData: profarmaMainData,
					profarmaDetailsData: props.selectedItems,
				},
				(resp) => {
					if (resp) {
						if (resp.flag) {
							toast.success(resp.message);
							props.fetchData();
							// console.log("resp", resp);
						} else {
							toast.error(resp.message);
						}
					} else {
						toast.error("uncaught error in frontend");
					}
				}
			);
		} else {
			toast.warning("Please select drawing to create profarma invoice");
		}
	};

	function deleteInvoice() {
		// console.log("delete invoice", selectedProfarmaMainRow.ProfarmaID);
		if (selectedProfarmaMainRow.ProfarmaID) {
			postRequest(
				endpoints.postDeleteInvoice,
				{ ProfarmaID: selectedProfarmaMainRow.ProfarmaID },
				(resp) => {
					if (resp) {
						if (resp.flag) {
							toast.success(resp.message);
							props.fetchData();
							setFilteredDetailsData([]);
							setSelectedProfarmaMainRow({});
						} else {
							toast.error(resp.message || "uncaught error in backend");
						}
					} else {
						toast.error("uncaught error in frontend");
					}
				}
			);
		} else {
			toast.warning("Please select the profarma invoice");
		}
	}

	function openInvoice() {
		if (selectedProfarmaMainRow.ProfarmaID) {
			nav(`/Orders/${props.OrderData.Type}/ProformaInvoiceForm`, {
				state: selectedProfarmaMainRow.ProfarmaID,
			});
		} else {
			toast.warning("Please select the profarma invoice");
		}
	}

	return (
		<>
			<div>
				<div className="row d-flex justify-content-center p-2">
					<div className="col-md-2">
						<button
							className={
								props.selectedItems.length > 0
									? "button-style m-0"
									: "button-style button-disabled m-0"
							}
							onClick={createInvoice}>
							Create Invoice
						</button>
					</div>
					<div className="col-md-2">
						<button
							disabled={selectedProfarmaMainRow.ProformaInvNo}
							className={
								selectedProfarmaMainRow.ProfarmaID &&
								!selectedProfarmaMainRow.ProformaInvNo
									? "button-style m-0"
									: "button-style button-disabled m-0"
							}
							onClick={deleteInvoice}>
							Delete Invoice
						</button>
					</div>
					<div className="col-md-2">
						<button
							className={
								selectedProfarmaMainRow.ProfarmaID
									? "button-style m-0"
									: "button-style button-disabled m-0"
							}
							onClick={openInvoice}>
							Open Invoice
						</button>
						{/* <Link
              to={`/Orders/${props.OrderData.Type}/ProfarmaInvoiceForm`}
              state={selectedProfarmaMainRow.ProfarmaID}
            >
              <button className="button-style m-0">Open Invoice</button>
            </Link> */}
					</div>
				</div>

				<div className="row">
					<div
						className="col-md-6"
						style={{ height: "300px", overflow: "auto" }}>
						<MainTable
							profarmaInvMain={props.profarmaInvMain}
							setSelectedProfarmaMainRow={setSelectedProfarmaMainRow}
							selectedProfarmaMainRow={selectedProfarmaMainRow}
							filterDetailsRow={filterDetailsRow}
						/>
					</div>
					<div
						className="col-md-6"
						style={{ height: "300px", overflow: "auto" }}>
						<DetailsTable filteredDetailsData={filteredDetailsData} />
					</div>
				</div>
			</div>
		</>
	);
}
