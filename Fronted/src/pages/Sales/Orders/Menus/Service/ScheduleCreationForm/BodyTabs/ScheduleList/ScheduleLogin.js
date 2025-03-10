/** @format */

import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { postRequest } from "../../../../../../../api/apiinstance";
import { ToastContainer, toast } from "react-toastify";
import { endpoints } from "../../../../../../../api/constants";

export default function ScheduleLogin({
	scheduleLogin,
	setScheduleLogin,
	onClickScheduled,
	newState,
	scheduleDetailsRow,
	formdata,
	setFormdata,
	DwgNameList,
	setNewState,
	setTaskMaterialData,
	OrdrDetailsData,
}) {
	const apiKey = process.env.REACT_APP_API_KEY;

	let [username, setUsername] = useState("");
	let [formPassword, setPassword] = useState("");

	const handleClose = () => {
		setScheduleLogin(false);
		toast.warning("Caution Customer for Payment ", {
			position: toast.POSITION.TOP_CENTER,
		});
		toast.warning("Not Scheduled", {
			position: toast.POSITION.TOP_CENTER,
		});
	};

	const onclickOk = () => {
		if (!username || !formPassword) {
			toast.error("Plese enter username and password", {
				position: toast.POSITION.TOP_CENTER,
			});
		} else {
			postRequest(
				`${apiKey}/user/login`,
				{ username: username, password: formPassword },
				(data) => {
					if (data.accessToken) {
						postRequest(
							endpoints.onClickLoginSchedule,
							{
								scheduleDetailsRow,
								formdata,
								newState,
								OrdrDetailsData,
							},
							(response) => {
								setScheduleLogin(false);
								toast.success(response.message, {
									position: toast.POSITION.TOP_CENTER,
								});
								postRequest(
									endpoints.getScheduleListgetFormDetails,
									{
										Cust_Code: DwgNameList[0]?.Cust_Code,
										ScheduleId: DwgNameList[0]?.ScheduleId,
									},
									(response) => {
										setFormdata(response);
									}
								);
								setTimeout(() => {
									postRequest(
										endpoints.ShiftDetails,
										{ ScheduleId: DwgNameList[0].ScheduleId },
										(response) => {
											setNewState(response);
										}
									);
									postRequest(
										endpoints.getScheduleListTaskandMaterial,
										{ ScheduleId: formdata[0]?.ScheduleId },
										(response) => {
											setTaskMaterialData(response);
										}
									);
								}, 3000);
							}
						);
					} else {
						setScheduleLogin(false);
						toast.warning("Caution Customer for Payment ", {
							position: toast.POSITION.TOP_CENTER,
						});
						toast.warning("Not Scheduled", {
							position: toast.POSITION.TOP_CENTER,
						});
					}
				}
			);
		}
	};

	return (
		<div>
			<Modal
				show={scheduleLogin}
				onHide={(e) => setScheduleLogin(false)}
				style={{ background: "#4d4d4d57" }}>
				<Modal.Header closeButton>
					<Modal.Title style={{ fontSize: "14px" }}>Login</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="ip-box form-bg">
						<div
							className="d-flex col-md-6"
							style={{ gap: "10px" }}>
							<label
								className="form-label"
								style={{ whiteSpace: "nowrap" }}>
								Username
							</label>
							<input
								className="input-field"
								type="text"
								name="username"
								onChange={(e) => {
									setUsername(e.target.value);
								}}
							/>
						</div>

						<div
							className="d-flex col-md-6 mb-2"
							style={{ gap: "10px" }}>
							<label
								className="form-label"
								style={{ whiteSpace: "nowrap" }}>
								Password
							</label>
							<input
								className="input-field"
								type="password"
								name="password"
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							/>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="d-flex flex-row justify-content-end">
					<button
						className="button-style m-0 me-3"
						onClick={onclickOk}>
						Ok
					</button>

					<button
						className="button-style m-0"
						onClick={handleClose}>
						cancel
					</button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
