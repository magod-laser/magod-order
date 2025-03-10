/** @format */

import React from "react";
import { Button, Table } from "react-bootstrap";

export default function ProfomaInvoiceForm() {
	return (
		<div>
			<div className="row">
				<div className="col-md-12">
					<h4 className="title">Proforma Invoice Form</h4>
				</div>
			</div>
			<div className="row mt-2">
				<div className="col-md-4 sm-12 ">
					<label className="form-label">Proforma Invoice Type</label>
					<input type="text" />
				</div>
				<div className="col-md-4 sm-12">
					<label className="form-label">Customer Name</label>
					<input type="text" />
				</div>
				<div className="col-md-4 sm-12">
					<label className="form-label">GST No</label>
					<input type="text" />
				</div>
			</div>

			<div className="row">
				<div className="col-md-4 sm-12 ">
					<label className="form-label">Proforma Invoice No</label>
					<input type="text" />
				</div>
				<div className="col-md-4 sm-12">
					<label className="form-label">Date</label>
					<input type="date" />
				</div>
				<div className="col-md-4 sm-12">
					<label className="form-label">City</label>
					<input type="text" />
				</div>
			</div>

			<div className="row">
				<div className="col-md-4 sm-12 ">
					<label className="form-label">Pin</label>
					<input type="text" />
				</div>
				<div className="col-md-4 sm-12">
					<label className="form-label">State</label>
					<input type="text" />
				</div>
				<div className="col-md-4 sm-12">
					<label className="form-label">PO No</label>
					<input type="text" />
				</div>
			</div>

			<div className="row">
				<div className="col-md-4 sm-12">
					<label className="form-label">Address</label>
					<textarea
						id="exampleFormControlTextarea1"
						rows="3"
						style={{ width: "360px" }}></textarea>
				</div>
			</div>

			<div className="row">
				<div className="col-md-6 col-sm-12">
					<div
						className="mt-3"
						style={{ overflowY: "scroll" }}>
						<Table
							striped
							className="table-data border"
							style={{ border: "1px" }}>
							<thead className="tableHeaderBGColor">
								<tr>
									<th>Srl</th>
									<th>Drawing No</th>
									<th>Material Code</th>
									<th>Quantity</th>
									<th>Unit Rate</th>
									<th>Total</th>
								</tr>
							</thead>
							<tbody className="tablebody"></tbody>
						</Table>
					</div>
				</div>
				<div className="col-md-6 col-sm-12">
					<div className="row">
						<div className="col-md-4 col-sm-12">
							<div>
								<label className="form-label">Select Tax</label>
								<select
									id=""
									className="ip-select">
									<option value="option1">option 1</option>
									<option value="option2">option 2</option>
									<option value="option3">option 3</option>
								</select>
							</div>
							<div>
								<label className="form-label">Assessable Value</label>
								<input type="number" />
							</div>
							<div>
								<label className="form-label">Net Total</label>
								<input type="number" />
							</div>
							<div>
								<label className="form-label">Discount</label>
								<input type="number" />
							</div>
							<div>
								<label className="form-label">Delivery Charges</label>
								<input type="number" />
							</div>
						</div>
						<div className="col-md-4 col-sm-12">
							<button className="button-style ">Save Invoice</button>
							<button className="button-style ">Delete Taxes</button>

							<button className="button-style ">Create Invoice</button>
							<button className="button-style ">Print Copy</button>
						</div>
						<div className="col-md-4 col-sm-12">
							<div>
								<label className="form-label">Tax Amount</label>
								<input type="number" />
							</div>
							<div>
								<label className="form-label">Invoice Total</label>
								<input type="number" />
							</div>
							<div>
								<label className="form-label">Round Off</label>
								<input type="number" />
							</div>
							<div>
								<label className="form-label">Grand Total</label>
								<input type="number" />
							</div>
						</div>
					</div>
					<div
						className="mt-3"
						style={{ overflowY: "scroll" }}>
						<Table
							striped
							className="table-data border"
							style={{ border: "1px" }}>
							<thead className="tableHeaderBGColor">
								<tr>
									<th>Srl</th>
									<th>Drawing No</th>
									<th>Material Code</th>
									<th>Quantity</th>
									<th>Unit Rate</th>
									<th>Total</th>
								</tr>
							</thead>
							<tbody className="tablebody"></tbody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
