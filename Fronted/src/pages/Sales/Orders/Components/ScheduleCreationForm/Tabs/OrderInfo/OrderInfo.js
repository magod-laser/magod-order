/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Table, Tabs, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { endpoints } from "../../../../../../api/constants";
import { postRequest } from "../../../../../../api/apiinstance";
export default function OrderInfo(props) {
	
	const [dealingEngineer, setDealingEngineer] = useState(
		props.OrderData?.Dealing_Engineer || ""
	);
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
		const day = date.getDate().toString().padStart(2, "0");
		// Use template literals to format the date
		return `${year}-${month}-${day}`;
	};
	const [deliveryDate, setDeliveryDate] = useState(formatDate(""));
	const [orderValue, setOrderValue] = useState(formatDate(""));

	useEffect(() => {
		if (props.OrderData?.Delivery_Date) {
			setDeliveryDate(formatDate(props.OrderData?.Delivery_Date));
		}
	}, [props.OrderData?.Delivery_Date]);
	// Function to handle the input change
	const handleInputChange = (e) => {
		setDealingEngineer(e.target.value);
	};
	const today = new Date().toISOString().split("T")[0];	
	const orderDateISOString = props.OrderData?.Delivery_Date;
	const orderDate = new Date(orderDateISOString);

	// Get day, month, and year
	const day = orderDate.getDate();
	const month = orderDate.getMonth() + 1; 
	const year = orderDate.getFullYear();

	// Format the date as dd mm yyyy
	// const formattedDate = `${day}-${month}-${year}`;
	const formattedDate = `${year}-${month}-${day}`;
	// //console.log(formattedDate);
	//console.log(props.OrderData);
	const [selectedEngineer, setSelectedEngineer] = useState(
		props.OrderData?.Dealing_Engineer || ""
	);

	
	useEffect(() => {
		setSelectedEngineer(props.OrderData?.Dealing_Engineer);
	}, [props.OrderData]);
	

	const handleChange = (event) => {
		const { id, value } = event.target;
		// let updatedEngineer = selectedEngineer;
		if (id === "formDealingEngineer") {
			const [selectedId, selectedName] = value.split(":");
			setSelectedEngineer(selectedName);
			var updatedEngineer = selectedName;
		} else if (id === "deliveryDate") {
			// console.log("value", value);
			setDeliveryDate(value);
			var updatedDeliveryDate = value;
		} else if (id === "OrderValue") {
			// console.log("value", value);
			setOrderValue(value);
		}
		
		// Prepare the data for the second update (updateOrderDetails)
		const updateOrderDetailsData = {
			orderNo: props.OrderData.Order_No,
			deliveryDate: updatedDeliveryDate ? updatedDeliveryDate : deliveryDate,
			delEngr: updatedEngineer ? updatedEngineer : selectedEngineer,
		};

		// Call the updateOrderDetails API
		const orderDetailsResponse = postRequest(
			endpoints.updateOrderTblDetails,
			updateOrderDetailsData
		);

		if (orderDetailsResponse.success) {
			// toast.success("Order details updated successfully");
			// fetchData(); // Fetch updated data after both updates
		} else {
			// toast.warning("Order details update failed, check once");
		}
	};
	return (
		<>
			<div>
				<div className="row mt-1">
					<div
						className="d-flex col-md-2 sm-12 field-gap"
						style={{ gap: "37px" }}>
						<label className="form-label label-space">Order Type</label>
						<input
							className="in-field"
							type="text"
							id="orderType"
							value={props.OrderData?.Order_Type}
						/>
					</div>
					<div className="d-flex col-md-2 sm-12 field-gap">
						<label className="form-label label-space">Delivery Date</label>
						<input
							type="date"
							className="in-field"
							id="deliveryDate"
							// onChange={handleDateChange}
							onChange={handleChange}
							value={deliveryDate}
							// value={formattedDate}
							min={today}
						/>
					</div>

					<div
						className="d-flex col-md-2 sm-12 field-gap"
						style={{ gap: "25px" }}>
						<label className="form-label label-space">Magod Delivery</label>

						<input
							type="checkbox"
							className="checkBoxStyle mt-1 col-md-1"
							checked={props.OrderData?.Delivery === 1}
						/>
					</div>
					<div
						className="d-flex col-md-2 sm-12 field-gap"
						style={{ gap: "18px" }}>
						<label className="form-label label-space">Sales Contact</label>
						<input
							className="in-field"
							type="text"
							id="salesContact"
							value={props.OrderData?.SalesContact}
						/>
					</div>
					<div
						className="d-flex col-md-2 sm-12 field-gap"
						style={{ gap: "36px" }}>
						<label className="form-label label-space">Recorded By</label>
						<input
							className="in-field"
							type="text"
							value={props.OrderData?.RecordedBy}
						/>
					</div>
					<div className="d-flex col-md-2 sm-12 field-gap">
						<label className="form-label label-space">Received By</label>
						<input
							className="in-field"
							type="text"
							value={props.OrderData?.Order_Received_By}
						/>
					</div>
				</div>

				<div className="row">
					<div
						className="d-flex col-md-2 sm-12 field-gap"
						style={{ gap: "27px" }}>
						<label className="form-label label-space">Order Status</label>
						<input
							className="in-field"
							type="text"
							id="orderStatus"
							value={props.OrderData?.Order_Status}
						/>
					</div>
					<div
						className="d-flex col-md-2 sm-12 field-gap"
						style={{ gap: "38px" }}>
						<label className="form-label label-space">Order Value</label>
						<input
							id="OrderValue"
							className="in-field"
							type="text"
							value={props.OrderData?.OrderValue}
							onChange={props.handleChangeOrderInfo}
						/>
					</div>
					{/* <div
            className="d-flex col-md-2 sm-12 field-gap"
            // style={{ gap: "66px" }}
          >
            <label className="form-label label-space">Delivery</label>
            <textarea
              className="in-field"
              type="text"
              id="delivery"
              // value={props.OrderData?.Delivery}
              value={props.OrderData?.Del_Place}
              readOnly
            />
          </div> */}
					<div className="col-md-2 sm-12 d-flex field-gap">
						<label className="form-label label-space">Delivery Mode</label>
						<input
							className="in-field"
							type="text"
							id="delivery"
							value={props.OrderData?.Del_Mode}
							readOnly
						/>
					</div>
					{/* {console.log("selectedEngineer123", selectedEngineer)}
					{console.log(
						"props.OrderData?.Dealing_Engineer",
						props.OrderData?.Dealing_Engineer
					)}
					{console.log("props.salesExecdata", props.salesExecdata)} */}
					<div className="col-md-3 sm-12 d-flex field-gap">
						<label className="form-label label-space">Dealing Engineer</label>
						<select
							id="formDealingEngineer"
							className="ip-select"
							onChange={handleChange}>
							<option value={selectedEngineer}>{selectedEngineer}</option>
							{props.salesExecdata.map((sdata) => {
								return (
									<>
										{/* <option value={sdata["ID"]}>{sdata["Name"]}</option> */}
										<option
											value={`${sdata["ID"]}:${sdata["Name"]}`}
											key={sdata["ID"]}>
											{sdata["Name"]}
										</option>
									</>
								);
							})}
						</select>
					</div>
					<div
						className="d-flex col-md-3 sm-12 field-gap"
						style={{ gap: "26px" }}>
						<label className="form-label label-space">Contact Name</label>
						<input
							className="in-field"
							type="text"
							value={props.OrderData?.Contact_Name}
						/>
					</div>
				</div>

				<div className="row mt-2">
					<div className="col-md-2 sm-12 d-flex field-gap">
						<label className="form-label label-space">Payment Terms</label>
						<input
							className="in-field"
							type="text"
							value={props.OrderData?.Payment}
							readOnly
						/>
					</div>
					<div className="d-flex col-md-3 sm-12 field-gap">
						<label className="form-label label-space">Transport Charges</label>
						<input
							className="in-field"
							type="text"
							value={props.OrderData?.TptCharges}
							readOnly
						/>

						{/* <select id="" className="ip-select">
              <option value=""> Select </option>
              <option value="Customer Account">Customer Account</option>
              <option value="Magod Account">Magod Account</option>
            </select> */}
					</div>
					<div
						className="d-flex col-md-3 sm-12 field-gap"
						style={{ gap: "65px" }}>
						<label className="form-label label-space">PO No</label>
						<input
							className="in-field"
							type="text"
							value={props.OrderData?.Purchase_Order}
						/>
					</div>
					{/* <div
            className="d-flex col-md-3 sm-12 field-gap"
            style={{ gap: "38px" }}
          >
            <label className="form-label label-space">Order Value</label>
            <input
              className="in-field"
              type="text"
              value={props.OrderData?.OrderValue}
            />
          </div> */}
					<div
						className="d-flex col-md-4 sm-12 field-gap"
						// style={{ gap: "66px" }}
					>
						<label className="form-label label-space">Delivery</label>
						<textarea
							className="in-field"
							type="text"
							id="delivery"
							// value={props.OrderData?.Delivery}
							// value={props.OrderData?.Del_Place}
							value={
								props.OrderData?.Del_Place
								// props.OrderData?.Delivery === 0
								//   ? "EX FACTORY"
								//   : props.OrderData?.Billing_Address
							}
							readOnly
							style={{
								borderRadius: "0",
								height: "50px",
								width: "100%",
							}}
						/>
					</div>
				</div>

				<div className="row mt-2">
					{/* <div
            className="d-flex col-md-4 sm-12 field-gap"
            style={{ gap: "33px" }}
          >
            <label className="form-label label-space">Quotation No</label>
            <input
              className="in-field"
              type="text"
              value={props.OrderData?.QtnNo}
            />
          </div> */}
					{/* <div className="col-md-4 sm-12 ">
            <label className="form-label">Order Value</label>
            <input type="text" value={props.OrderData?.OrderValue} />
          </div> */}
					{/* <div className="col-md-4 sm-12 ">
            <label className="form-label">Delivery</label>
            <input type="text" id="delivery" value={props.OrderData?.Delivery} />
          </div> */}
				</div>
			</div>
		</>
	);
}
