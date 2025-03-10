/** @format */

import React from "react";
import { Tab, Table, Tabs, Form } from "react-bootstrap";

export default function IQMTable(props) {
	return (
		<>
			<Table
				striped
				className="table-data border"
				style={{ border: "1px" }}>
				<thead className="tableHeaderBGColor">
					<tr>
						<th>SL No</th>
						<th>ID</th>
						<th>Qtn ID</th>
						<th>Name</th>
						<th>Material</th>
						<th>Operation</th>
						<th>Quantity</th>
						<th>Base Price</th>
						<th>Discount Amount</th>
						<th>Final Price</th>
						<th>Total Amount</th>
					</tr>
				</thead>
				<tbody className="tablebody">
					{props.filteredQtnListData?.length > 0 ? (
						props.filteredQtnListData?.map((val, key) => (
							<>
								<tr>
									<td>{key + 1}</td>
									<td>{val.ID}</td>
									<td>{val.QtnId}</td>
									<td>{val.Name}</td>
									<td>{val.Material}</td>
									<td>{val.Operation}</td>
									<td>{val.Quantity}</td>
									<td>{parseFloat(val.BasePrice).toFixed(2)}</td>
									<td>{parseFloat(val.DiscountAmount).toFixed(2)}</td>
									<td>
										{(
											parseFloat(val.BasePrice) - parseFloat(val.DiscountAmount)
										).toFixed(2)}
									</td>
									<td>
										{(
											parseFloat(val.Quantity) *
											(parseFloat(val.BasePrice) -
												parseFloat(val.DiscountAmount))
										).toFixed(2)}
									</td>
								</tr>
							</>
						))
					) : (
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td>Select Quotation No</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					)}
				</tbody>
			</Table>
		</>
	);
}
