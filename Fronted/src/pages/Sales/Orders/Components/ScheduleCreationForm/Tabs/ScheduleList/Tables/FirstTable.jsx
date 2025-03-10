/** @format */

import React, { useState } from "react";
import { Table } from "react-bootstrap";

export default function FirstTable(props) {

	//table sorting

	const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
	
	  // sorting function for table headings of the table
	  const requestSort = (key) => {
		console.log("entering into the request sort");
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
		  direction = "desc";
		}
		setSortConfig({ key, direction });
	  };
	
	  const sortedData = () => {
		const dataCopy = [...props.scheduleListData];
	
		if (sortConfig.key) {
		  dataCopy.sort((a, b) => {
			let valueA = a[sortConfig.key];
			let valueB = b[sortConfig.key];
	
			// Convert only for the "intiger" columns
			if (
			  sortConfig.key === "ScheduleNo"
			 
			) {
			  valueA = parseFloat(valueA);
			  valueB = parseFloat(valueB);
			}
	
			if (valueA < valueB) {
			  return sortConfig.direction === "asc" ? -1 : 1;
			}
			if (valueA > valueB) {
			  return sortConfig.direction === "asc" ? 1 : -1;
			}
			return 0;
		  });
		}
		return dataCopy;
	  };



	return (
		<>
			<div>
				<Table
					striped
					className="table-data border">
					<thead className="tableHeaderBGColor">
						<tr>
							<th onClick={() => requestSort("ScheduleType")}>Type</th>
							<th onClick={() => requestSort("ScheduleNo")}>No</th>
							<th onClick={() => requestSort("Schedule_Status")}>Status</th>
							<th >Delivered</th>
						</tr>
					</thead>
					<tbody className="tablebody">
						{/* {props.scheduleListData.map((item, key) => { */}
						{sortedData()?.map((item, key) => {
							return (
								<>
									<tr
										onClick={() => props.onRowClickScheduleList(item, key)}
										className={
											key === props.rowScheduleList?.index
												? "selcted-row-clr"
												: ""
										}>
										<td>{item.ScheduleType}</td>
										<td>{item.ScheduleNo}</td>
										<td>{item.Schedule_Status}</td>
										<td>{props.formatDate(item.Delivery_Date)}</td>
									</tr>
								</>
							);
						})}
					</tbody>
				</Table>
			</div>
		</>
	);
}
