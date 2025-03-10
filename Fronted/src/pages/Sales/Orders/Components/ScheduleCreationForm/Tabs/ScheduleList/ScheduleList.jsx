/** @format */

import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { postRequest } from "../../../../../../api/apiinstance";
import { endpoints } from "../../../../../../api/constants";
import FirstTable from "./Tables/FirstTable";
import SecondTable from "./Tables/SecondTable";
import AlertModal from "../../../../Menus/Service/Components/Alert";
import { ToastContainer, toast } from "react-toastify";

export default function ScheduleList({
	OrderData,
	OrderCustData,
	setScheduleListData,
	scheduleListData,
	OrdrDetailsData,
}) {
	//date format
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const day = date.getDate();
		const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
		const year = date.getFullYear();
		// Use template literals to format the date
		return `${day}/${month}/${year}`;
	};

	// Fetch schedule list data when OrderData changes
	useEffect(() => {
		if (OrderData && OrderData.Order_No) {
			postRequest(
				endpoints.getScheduleListData,
				{ Order_No: OrderData.Order_No },
				(response) => {
					setScheduleListData(response);
				}
			);
		}
	}, [OrderData, setScheduleListData]); // Watch for changes in OrderData

	//onClick ScheduleList table
	const [DwgNameList, setDwgNameList] = useState([]);
	const [rowScheduleList, setRowScheduleList] = useState({});
	const onRowClickScheduleList = (item, index) => {
		let list = { ...item, index: index };
		setRowScheduleList(list);
		postRequest(
			endpoints.getScheduleListDwgData,
			{ ScheduleId: list.ScheduleId },
			(response) => {
				setDwgNameList(response);
			}
		);
	};

	// Ensure first row is selected after scheduleListData is updated
	useEffect(() => {
		if (scheduleListData.length > 0) {
			setRowScheduleList({ ...scheduleListData[0], index: 0 });
			onRowClickScheduleList(scheduleListData[0], 0); // Call to fetch DwgNameList
		}
	}, [scheduleListData]);

	//delete ask modal
	const [deleteAsk, setDeleteAsk] = useState(false);
	const DeleteAskModal = () => {
		setDeleteAsk(true);
	};

	const deleteScheduleList = () => {
		postRequest(
			endpoints.deleteScheduleList,
			{ rowScheduleList },
			(response) => {
				setDeleteAsk(false);
				toast.success(response.message, {
					position: toast.POSITION.TOP_CENTER,
				});
				postRequest(
					endpoints.getScheduleListData,
					{ Order_No: OrderData.Order_No },
					(response) => {
						setScheduleListData(response);
					}
				);
			}
		);
	};

	// console.log("OrderData?.Type", OrderData?.Type);

	return (
		<>
			<div>
				<div className="row d-flex justify-content-center p-2">
					<div className="col-md-2">
						<button
							className={`button-style m-0 ${
								rowScheduleList.Schedule_Status !== "Created" ? "disabled" : ""
							}`}
							onClick={
								rowScheduleList.Schedule_Status === "Created"
									? DeleteAskModal
									: null
							}
							disabled={rowScheduleList.Schedule_Status !== "Created"}>
							Delete Schedule
						</button>
						<style>
							{`
      .button-style[disabled] {
        background-color: grey;
        cursor: not-allowed;
      }
    `}
						</style>
					</div>

					<div className="col-md-2">
						<Link
							to={
								OrderData?.Type === "Profile"
									? `/Orders/Profile/ProfileOpenSchedule`
									: OrderData?.Type === "Service"
									? `/Orders/Service/ServiceOpenSchedule`
									: OrderData?.Type === "Fabrication"
									? `/Orders/Fabrication/FabricationOpenSchedule`
									: null
							}
							state={{
								DwgNameList,
								Type: OrderData?.Type,
								OrdrDetailsData: OrdrDetailsData,
							}}>
							<button
								className="button-style"
								disabled={Object.keys(DwgNameList).length === 0}>
								Open Schedule
							</button>
						</Link>

						{Object.keys(DwgNameList).length === 0 && (
							<style>
								{`
            .button-style[disabled] {
                background-color: grey;
                cursor: not-allowed;
            }
            `}
							</style>
						)}
					</div>
				</div>

				<div className="row">
					<div
						className="col-md-6"
						style={{ height: "300px", overflow: "auto" }}>
						<FirstTable
							scheduleListData={scheduleListData}
							onRowClickScheduleList={onRowClickScheduleList}
							rowScheduleList={rowScheduleList}
							formatDate={formatDate}
						/>
					</div>
					<div
						className="col-md-6"
						style={{ height: "300px", overflow: "auto" }}>
						<SecondTable DwgNameList={DwgNameList} />
					</div>
				</div>

				<AlertModal
					show={deleteAsk}
					onHide={(e) => setDeleteAsk(e)}
					firstbutton={deleteScheduleList}
					secondbutton={(e) => setDeleteAsk(e)}
					secondbuttontext="No"
					title="magod_Order"
					message={`Do you wish to Delete?`}
					firstbuttontext="Yes"
				/>
			</div>
		</>
	);
}
