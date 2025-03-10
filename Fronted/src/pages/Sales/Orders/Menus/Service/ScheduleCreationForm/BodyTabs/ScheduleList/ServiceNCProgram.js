/** @format */

import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { endpoints } from "../../../../../../../api/constants";
import { postRequest } from "../../../../../../../api/apiinstance";
import AlertModal from "../../../Components/Alert";
import { ToastContainer, toast } from "react-toastify";

function ServiceNCProgram() {
	const location = useLocation(); // Access location object using useLocation hook
	const response = location?.state?.response || [];
	const MachineList = location?.state?.responsedata || [];
	const Type = location?.state?.Type || []; //get types
	const DwgNameList = location?.state?.DwgNameList || [];

	const [NCprogramForm, setNCProgramForm] = useState([]);
	const [machineList, setMachineList] = useState([]);

	const [selectedMachine, setSelectedMachine] = useState("");
	const handleChangeMachine = (e) => {
		setSelectedMachine(e.target.value);
	};

	useEffect(() => {
		setNCProgramForm(response);
		setMachineList(MachineList);
		setSelectedMachine(NCprogramForm[0]?.Machine);
	}, []);

	//getNCProgram
	const [NCProramData, setNCProgramData] = useState([]);
	const getNCProgramData = () => {
		postRequest(endpoints.getNCPrograms, { NCprogramForm }, (response) => {
			setNCProgramData(response);
		});
	};

	//get PartsData
	const [partsData, setPartsData] = useState([]);
	const getPartsData = () => {
		if (NCprogramForm) {
			postRequest(endpoints.getPartsData, { NCprogramForm }, (response) => {
				setPartsData(response);
			});
		}
	};

	useEffect(() => {
		getNCProgramData();
		getPartsData();
	}, [NCprogramForm]);

	//row select
	const [selectedNCprogram, setSelectedNCProgram] = useState({});
	const [selectedNcid, setSelectedNcid] = useState("");
	const onClickSelectedNCprogram = (item, index) => {
		let list = { ...item, index: index };
		setSelectedNCProgram(list);
		setSelectedNcid(list.Ncid);
	};

	//Default first row select
	// useEffect(() => {
	//   if (NCProramData.length > 0 && !selectedNCprogram.NCProgramNo) {
	//     onClickSelectedNCprogram(NCProramData[0], 0); // Select the first row
	//   }
	// }, [NCProramData, selectedNCprogram, onClickSelectedNCprogram]);

	//ADD NCPROGRAM
	const OnclickAddNCProgram = () => {
		if (!selectedMachine) {
			toast.error("Please Select Machine", {
				position: toast.POSITION.TOP_CENTER,
			});
		} else {
			postRequest(
				endpoints.addNCProgram,
				{ NCprogramForm, selectedMachine },
				(response) => {
					if (response.message === "NC Program added successfully")
						toast.success(response.message, {
							position: toast.POSITION.TOP_CENTER,
						});
					else {
						toast.warning(response.message, {
							position: toast.POSITION.TOP_CENTER,
						});
					}
					getNCProgramData();
				}
			);
		}
	};

	//Send MTrl Issue Modal
	const [showModal, setShowModal] = useState(false);
	const openMtrlIssueModal = () => {
		setShowModal(true);
	};

	//ONCLICK OF YES BUTTON IN MTRL ISSUE
	const OnclickMtrlIssueYes = () => {
		postRequest(endpoints.sendMtrlIssue, { selectedNCprogram }, (response) => {
			setShowModal(false);
			toast.success(response.message, {
				position: toast.POSITION.TOP_CENTER,
			});
			postRequest(endpoints.getNCPrograms, { NCprogramForm }, (response) => {
				setNCProgramData(response);
				// setSelectedNCProgram({ ...NCProramData[0], index: 0 });
				setSelectedNCProgram({});
			});
		});
	};

	//Delete Modal
	const [openDelete, setOpenDelete] = useState(false);
	const openDeleteModal = () => {
		setOpenDelete(true);
	};

	//Onclick of Yes Button
	const OnclickDeleteNCProgram = () => {
		postRequest(
			endpoints.DeleteNCProgram,
			{ selectedNCprogram },
			(response) => {
				setOpenDelete(false);
				toast.success(response.message, {
					position: toast.POSITION.TOP_CENTER,
				});
				getNCProgramData();
			}
		);
	};

	//save Button
	const OnclickButtonSave = () => {
		postRequest(
			endpoints.SaveButton,
			{ selectedMachine: selectedMachine, NCprogramForm },
			(response) => {
				// console.log("response of Scheduled is",response);
				toast.success("Saved", {
					position: toast.POSITION.TOP_CENTER,
				});
			}
		);
	};

	let navigate = useNavigate();

	//Task Sheet
	const onClickTaskSheet = () => {
		if (!selectedNcid) {
			toast.error("Select Table row");
			return;
		}
		navigate("/Orders/Service/TaskSheet", {
			state: { selectedNcid, response: response, responsedata: MachineList },
		});
	};

	//Solid State
	const onClickSolidState = () => {
		if (!selectedNcid) {
			toast.error("Select Table row");
			return;
		}
		navigate("/Orders/Service/Solidstatelaser", {
			state: { selectedNcid, response: response, responsedata: MachineList },
		});
	};

	//Co2Form
	const onClickCo2State = () => {
		if (!selectedNcid) {
			toast.error("Select Table row");
			return;
		}
		navigate("/Orders/Service/Co2Form", {
			state: { selectedNcid, response: response, responsedata: MachineList },
		});
	};

	console.log("selectedNCprogram is", selectedNCprogram);

	return (
		<div>
			<div className="row">
				<h4 className="title">Production Program No Allotment Form</h4>

				<h4 style={{ fontSize: "14px" }}>Production Program No Manager</h4>
			</div>
			{/* //---------- */}

			<div className="row mt-1">
				<div className="d-flex col-md-2 sm-12 field-gap">
					<label className="form-label label-space">Task No</label>
					<input
						className="in-field"
						type="text"
						value={NCprogramForm[0]?.TaskNo}
					/>
				</div>
				<div className="d-flex col-md-2 sm-12 field-gap">
					<label className="form-label label-space">Status</label>
					<input
						className="in-field"
						type="text"
						value={NCprogramForm[0]?.TStatus}
					/>
				</div>
				<div className="d-flex col-md-3 sm-12 field-gap">
					<label className="form-label label-space">Assy Name</label>
					<input
						className="in-field"
						type="text"
						value={NCprogramForm[0]?.AssyName}
					/>
				</div>

				<div className="d-flex col-md-3 sm-12 field-gap">
					<label className="form-label label-space">Operation</label>
					<input
						className="in-field"
						type="text"
						value={NCprogramForm[0]?.Operation}
					/>
				</div>
				<div className="d-flex col-md-2 sm-12 field-gap ">
					<label className="form-label label-space">Task Quantity</label>
					<input
						className="in-field"
						type="text"
						value={NCprogramForm[0]?.TotalParts}
					/>
				</div>
			</div>
			<div className="row mt-2">
				<div className="d-flex col-md-4 sm-12 field-gap">
					<label className="form-label label-space">Material</label>
					<input
						className="in-field"
						type="text"
						value={`${NCprogramForm[0]?.CustMtrl}/${NCprogramForm[0]?.Mtrl_Code}`}
					/>
				</div>

				<div className="d-flex col-md-4 sm-12 field-gap">
					<label className="form-label">Machine</label>
					<select
						id=""
						className="ip-select"
						onChange={handleChangeMachine}>
						<option>Select Machine</option>
						{machineList.map((item, key) => {
							return (
								<>
									<option value={item.refName}>{item.refName}</option>
								</>
							);
						})}
					</select>
				</div>
			</div>
			{/* ------------------------ */}

			<div className="row justify-content-left mt-3">
				<div className="col-md-12">
					<button
						className="button-style"
						onClick={OnclickAddNCProgram}>
						Add Program
					</button>
					{/* <button
            className="button-style"
            onClick={openDeleteModal}
            disabled={selectedNCprogram?.PStatus !== "Created"}
          >
            Delete Program
          </button>
           */}

					<button
						className="button-style"
						onClick={OnclickButtonSave}>
						Save
					</button>

					<button
						className="button-style"
						// style={{ width: "250px" }}
						onClick={openMtrlIssueModal}
						disabled={selectedNCprogram.PStatus !== "Created"}>
						Send to Material Issue
					</button>

					<button
						className="button-style"
						onClick={onClickTaskSheet}>
						TaskSheet
					</button>

					<button
						className="button-style"
						onClick={onClickSolidState}>
						Solid State
					</button>

					<button
						className="button-style"
						onClick={onClickCo2State}>
						Co2 Form
					</button>
					<Link
						to={
							Type === "Profile"
								? `/Orders/Profile/ProfileOpenSchedule`
								: Type === "Service"
								? `/Orders/Service/ServiceOpenSchedule`
								: Type === "Fabrication"
								? `/Orders/Fabrication/FabricationOpenSchedule`
								: null
						}
						state={{ DwgNameList, Type: Type }}>
						<button className="button-style">Close</button>
					</Link>
				</div>
			</div>
			{/* --------- */}

			<div className="row">
				{/* <div className="col-md-8 sm-12"> */}
				{/* <div className="row mt-2"> */}
				{/* <div className="col-md-6 sm-12 ">
              <label className="form-label">Task No</label>
              <input type="text" value={NCprogramForm[0]?.TaskNo} />
            </div> */}

				{/* <div className="col-md-6 sm-12">
              <label className="form-label">Status</label>
              <input type="text" value={NCprogramForm[0]?.TStatus} />
            </div> */}
				{/* </div> */}

				{/* <div className="row mt-2"> */}
				{/* <div className="col-md-6 sm-12 ">
              <label className="form-label">Assy Name</label>
              <input type="text" value={NCprogramForm[0]?.AssyName} />
            </div> */}

				{/* <div className="col-md-6 sm-12">
              <label className="form-label">Operation</label>
              <input type="text" value={NCprogramForm[0]?.Operation} />
            </div> */}
				{/* </div> */}

				{/* <div className="row mt-2">
            <div className="col-md-6 sm-12 ">
              <label className="form-label">Task Quantity</label>
              <input type="text" value={NCprogramForm[0]?.TotalParts} />
            </div>

            <div className="col-md-6 sm-12">
              <label className="form-label">Material</label>
              <input
                type="text"
                value={`${NCprogramForm[0]?.CustMtrl}/${NCprogramForm[0]?.Mtrl_Code}`}
              />
            </div>
          </div> */}

				{/* <div className="row mt-2"> */}
				{/* <div className="col-md-6 sm-12 ">
              <label className="form-label">Machine</label>
              <select
                id=""
                className="ip-select"
                onChange={handleChangeMachine}
              >
                <option>Select Machine</option>
                {machineList.map((item, key) => {
                  return (
                    <>
                      <option value={item.refName}>{item.refName}</option>
                    </>
                  );
                })}
              </select>
            </div> */}

				{/* <div className="col-md-6 sm-12 mt-3">
              <Link to="/Orders/Service/OrderSchedule">
                <button className="button-style">Close</button>
              </Link>
            </div> */}
				{/* </div> */}
				{/* </div> */}

				{/* <div className="row mt-3"> */}
				{/* <div className="col-md-2">
            <button className="button-style" onClick={OnclickAddNCProgram}>
              Add Program
            </button>
          </div> */}
				{/* <div className="col-md-2">
            <button
              className="button-style"
              onClick={openDeleteModal}
              disabled={selectedNCprogram.PStatus !== "Created"}
            >
              Delete Program
            </button>
            {selectedNCprogram.PStatus !== "Created" && (
              <style>
                {`
            .button-style[disabled] {
                background-color: grey;
                cursor: not-allowed;
            }
            `}
              </style>
            )}
          </div> */}

				{/* <div className="col-md-2">
            <button className="button-style" onClick={OnclickButtonSave}>
              Save
            </button>
          </div> */}

				{/* <div className="col-md-3">
            <button
              className="button-style"
              style={{ width: "250px" }}
              onClick={openMtrlIssueModal}
              disabled={selectedNCprogram.PStatus !== "Created"}
            >
              Send to Material Issue
            </button>
            {selectedNCprogram.PStatus !== "Created" && (
              <style>
                {`
            .button-style[disabled] {
                background-color: grey;
                cursor: not-allowed;
            }
            `}
              </style>
            )}
          </div> */}

				{/* <div className="col-md-3">
            <Link to={"/Orders/Service/OrderSchedule"} state={NCprogramForm}>
              <button className="button-style">Close</button>
            </Link>
          </div> */}

				{/* <div className="col-md-2">
            <button className="button-style" onClick={onClickTaskSheet}>
              TaskSheet
            </button>
          </div> */}

				{/* <div className="col-md-2">
            <button className="button-style" onClick={onClickSolidState}>
              Solid State
            </button>
          </div>

          <div className="col-md-2">
            <button className="button-style" onClick={onClickCo2State}>
              Co2 Form
            </button>
          </div> */}
				{/* </div> */}

				{/* <div className="row "> */}
				<div className="col-md-5 col-sm-12">
					<br></br>
					<h9>BOM Material Availablity :</h9>

					<div
						className=""
						style={{
							overflowX: "scroll",
							overflowY: "scroll",
							height: "300px",
						}}>
						<Table
							striped
							className="table-data border"
							style={{ border: "1px" }}>
							<thead className="tableHeaderBGColor">
								<tr>
									<th style={{ whiteSpace: "nowrap" }}>PartId</th>
									<th style={{ whiteSpace: "nowrap" }}>Qty/Assy</th>
									<th style={{ whiteSpace: "nowrap" }}>Required</th>
									<th style={{ whiteSpace: "nowrap" }}>Available</th>
								</tr>
							</thead>
							<tbody className="tablebody">
								{partsData?.partsData?.length > 0 ? (
									partsData.partsData.map((item, key) => (
										<tr key={key}>
											<td>{item?.PartId}</td>
											<td>{item?.QtyPerAssy}</td>
											<td>{item?.QtyRequired}</td>
											<td>{partsData?.availableQty}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={4}>No data to show</td>{" "}
										{/* Ensure colSpan matches the number of columns */}
									</tr>
								)}
							</tbody>
						</Table>
					</div>
				</div>
				{/* <div className="col-md-4 sm-12 mt-3" style={{ overflowY: "scroll" }}>
            <Table
              striped
              className="table-data border"
              style={{ border: "1px", height: "200px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>PartId</th>
                  <th style={{ whiteSpace: "nowrap" }}>Qty/Assy</th>
                  <th style={{ whiteSpace: "nowrap" }}>Required</th>
                  <th style={{ whiteSpace: "nowrap" }}>Available</th>
                </tr>
              </thead>
              <tbody className="tablebody">
                {partsData.length > 0 ? (
                  partsData.map((item, key) => (
                    <tr key={key}>
                      <td>{item.PartID}</td>
                      <td>{item.QtyPerAssy}</td>
                      <td>{item.QtyRequired}</td>
                      <td>{item.QtyAvialable}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No data to show</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div> */}
				<div className="col-md-7 col-sm-12">
					<br></br>
					<div
						className=""
						style={{
							overflowX: "scroll",
							overflowY: "scroll",
							height: "300px",
						}}>
						<Table
							striped
							className="table-data border mt-4"
							style={{ border: "1px" }}>
							<thead className="tableHeaderBGColor">
								<tr>
									<th style={{ whiteSpace: "nowrap" }}>Program No</th>
									<th style={{ whiteSpace: "nowrap" }}>Machine</th>
									<th style={{ whiteSpace: "nowrap" }}>Source</th>
									<th style={{ whiteSpace: "nowrap" }}>Quantity</th>
									<th style={{ whiteSpace: "nowrap" }}>Estimated Time</th>
									<th style={{ whiteSpace: "nowrap" }}>Total LOC</th>
									<th style={{ whiteSpace: "nowrap" }}>Total Holes</th>
									<th style={{ whiteSpace: "nowrap" }}>Status</th>
								</tr>
							</thead>
							<tbody className="tablebody">
								{NCProramData.map((item, key) => {
									return (
										<>
											<tr
												onClick={() => onClickSelectedNCprogram(item, key)}
												className={
													key === selectedNCprogram?.index
														? "selcted-row-clr"
														: ""
												}>
												{" "}
												<td>{item.NCProgramNo}</td>
												<td>{item.Machine}</td>
												<td>{item.CustMtrl}</td>
												<td>{item.Qty}</td>
												<td>{item.EstimatedTime}</td>
												<td>{item.TotalLOC}</td>
												<td>{item.TotalHoles}</td>
												<td style={{ whiteSpace: "nowrap" }}>{item.PStatus}</td>
											</tr>
										</>
									);
								})}
							</tbody>
						</Table>
					</div>
				</div>
				{/* <div
            className="col-md-4 mt-3"
            style={{
              overflowX: "scroll",
              width: "600px",
              msOverflowY: "scroll",
            }}
          >
            <Table
              striped
              className="table-data border"
              style={{ border: "1px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>Program No</th>
                  <th style={{ whiteSpace: "nowrap" }}>Machine</th>
                  <th style={{ whiteSpace: "nowrap" }}>Source</th>
                  <th style={{ whiteSpace: "nowrap" }}>Quantity</th>
                  <th style={{ whiteSpace: "nowrap" }}>Estimated Time</th>
                  <th style={{ whiteSpace: "nowrap" }}>Total LOC</th>
                  <th style={{ whiteSpace: "nowrap" }}>Total Holes</th>
                  <th style={{ whiteSpace: "nowrap" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {NCProramData.map((item, key) => {
                  return (
                    <>
                      <tr
                        onClick={() => onClickSelectedNCprogram(item, key)}
                        className={
                          key === selectedNCprogram?.index
                            ? "selcted-row-clr"
                            : ""
                        }
                      >
                        {" "}
                        <td>{item.NCProgramNo}</td>
                        <td>{item.Machine}</td>
                        <td>{item.CustMtrl}</td>
                        <td>{item.Qty}</td>
                        <td>{item.EstimatedTime}</td>
                        <td>{item.TotalLOC}</td>
                        <td>{item.TotalHoles}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{item.PStatus}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
          </div> */}
				{/* </div> */}
			</div>

			{/* Send  MTrlIssue Modal */}
			<AlertModal
				show={showModal}
				onHide={(e) => setShowModal(e)}
				firstbutton={OnclickMtrlIssueYes}
				secondbutton={(e) => setShowModal(e)}
				title="magod_Order"
				message={`Do you wish to release program no ${selectedNCprogram.NCProgramNo} to Material Issue?`}
				firstbuttontext="Yes"
				secondbuttontext="No"
			/>

			{/* Delete NCProgram Button */}
			<AlertModal
				show={openDelete}
				onHide={(e) => setOpenDelete(e)}
				firstbutton={OnclickDeleteNCProgram}
				secondbutton={(e) => setOpenDelete(e)}
				title="magod_Order"
				message={`Do you wish to Delete program no ${selectedNCprogram.NCProgramNo}?`}
				firstbuttontext="Yes"
				secondbuttontext="No"
			/>
		</div>
	);
}

export default ServiceNCProgram;
