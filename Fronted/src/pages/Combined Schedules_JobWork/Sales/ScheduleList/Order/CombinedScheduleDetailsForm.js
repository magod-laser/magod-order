import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { getRequest, postRequest } from "../../../../api/apiinstance";
import { endpoints } from "../../../../api/constants";
import PrintModal from "../../../PrintPDF/PrintModal";

function CombinedScheduleDetailsForm() {
  const location = useLocation();
  const { selectedRow } = location?.state || {};

  //get sales contact list
  const [salesContactList, setSalesContactList] = useState([]);
  const getSalesContactList = () => {
    getRequest(endpoints.getSalesContact,(response) => {
        setSalesContactList(response);
      });
  };

  //SchedueleList Details
  const [scheduleListDetailsData, setScheduleListDetailsData] = useState([]);
  const getScheduleListDetails = () => {
    postRequest(endpoints.getSchedudleDetails, {
        selectedRow,
      },(response) => {
        console.log(response);
        setScheduleListDetailsData(response);
      });
  };

  const getBackgroundColor = (item) => {
    if (item.QtyScheduled === 0) {
      return "red";
    } else if (item.QtyScheduled === item.QtyScheduled) {
      return "green";
    } else if (item.QtyScheduled === item.QtyCleared) {
      return "yellow";
    } else if (item.QtyCleared > 0) {
      return "lightgreen";
    } else if (item.QtyScheduled === item.QtyProduced) {
      return "lightyellow";
    } else if (
      item.QtyProduced > 0 &&
      item.QtyScheduled === item.QtyProgrammed
    ) {
      return "lightpink";
    } else if (item.QtyScheduled === item.QtyProgrammed) {
      return "lightcoral";
    } else if (item.QtyProgrammed > 0) {
      return "coral";
    } else {
      return ""; // Default background color if none of the conditions match
    }
  };

  //Date Format
  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based
    const year = date.getFullYear();

    // Use template literals to format the date
    return `${day}/${month}/${year}`;
  };

  const formatDeliveryDate2 = (dateString) => {
    // Convert the input string to a JavaScript Date object
    const dateObject = new Date(dateString);

    // Format the Date object to "YYYY-MM-DD"
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  //row select
  const [selected, setSelected] = useState({});
  const rowSelectFunc1 = (item, index) => {
    let list = { ...item, index: index };
    setSelected(list);
  };

  //Default first row select for First Table Schedule Details
  useEffect(() => {
    if (scheduleListDetailsData?.length > 0 && !selected?.DwgName) {
      rowSelectFunc1(scheduleListDetailsData[0], 0); // Select the first row
    }
  }, [scheduleListDetailsData, selected, rowSelectFunc1]);

  //Combined Tasks Table 1
  const [TaskNoTableData, setTaskNoTableData] = useState([]);
  const getTaskNoTabledata = () => {
    postRequest(endpoints.CombinedTasksTaskTable, {
        ScheduleId: selectedRow?.ScheduleId,
      },(response) => {
        setTaskNoTableData(response);
      });
  };

  //const row select TaskNo Table
  const [selectedTaskNo, setSelectedTaskNo] = useState({});
  const [DwgNameTableData, setDwgNameTableData] = useState([]);
  const rowSelectFuncTaskNo = (item, index) => {
    let list = { ...item, index: index };
    setSelectedTaskNo(list);
    postRequest(endpoints.CombinedTasksShowDwg, {
        TaskNo: list?.TaskNo,
      },(response) => {
        setDwgNameTableData(response);
      });
  };

  ///Original Schedules Table 1
  const [orinalScheudledata, setOrinalScheduledata] = useState([]);
  const getOriginalTable1 = () => {
    postRequest(endpoints.OriginalTable, {
        selectedRow,
      },(response) => {
        setOrinalScheduledata(response);
      });
  };

  //table row select
  const [selectedOrignalSchedule, setSelectedOrignalSchedule] = useState({});
  const [orinalScheudleTable2, setOrinalScheduleTable2] = useState([]);
  const rowSelectFuncOriginalSchedule = (item, index) => {
    let list = { ...item, index: index };
    // console.log(list);
    setSelectedOrignalSchedule(list);
    postRequest(endpoints.OriginalTable2, {
        list,
      },(response) => {
        setOrinalScheduleTable2(response);
      });
  };

  useEffect(() => {
    getSalesContactList();
    getScheduleListDetails();
    getTaskNoTabledata();
    getOriginalTable1();
  }, []);

  //Update To Original Schedule
  const updateToOriganSchedule = () => {
    postRequest(endpoints.updateToOriganalSchedule, {
      selectedRow,
    });
    toast
      .success("Sucessfully Updated", {
        position: toast.POSITION.TOP_CENTER,
      },(response) => {
      });
  };

  //rowselect for dwg name table
  const [DwgSelect, setDwgSelect] = useState({});
  const rowSelectDwg = (item, index) => {
    let list = { ...item, index: index };
    setDwgSelect(list);
  };

  // console.log("DwgSelect",DwgSelect);
  // console.log(selectedTaskNo);

  const updateTask = () => {
    postRequest(endpoints.updateTask, {
        DwgSelect,
      },(response) => {
        if (response === "Success") {
          toast.success(response, {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error(response, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
  };

  //Distribute Parts
  const distributeParts = () => {
    postRequest(endpoints.distributeParts, { selectedRow },(response) => {
        console.log(response);
      });
  };

  ///
  const handleButtonClick = () => {
    // alert('Please navigate to the desired folder before selecting a file.');
    // Trigger click event on the hidden file input
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    // Handle the selected file here
    const selectedFile = event.target.files[0];
  };

  const fileInputRef = React.createRef();

  //
  const [displayDate, setDisplayDate] = useState(
    formatDeliveryDate2(selectedRow.Delivery_Date)
  );
  const [selectedSalesContact, setSelectedSalesContact] = useState(
    selectedRow.Dealing_Engineer
  );
  const handleDateChange = (e) => {
    // Update the displayDate whenever the user selects a date
    setDisplayDate(e.target.value);
  };

  const [instruction, setInstruction] = useState("");
  const onChangeInstruction = (e) => {
    setInstruction(e.target.value);
  };

  const formatDeliveryDate3 = (dateString) => {
    // Convert the input string to a JavaScript Date object
    const dateObject = new Date(dateString);

    // Format the Date object to "YYYY-MM-DD HH:mm:ss"
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getDate().toString().padStart(2, "0");
    const hours = "00";
    const minutes = "00";
    const seconds = "00";

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const onClickSave = () => {
    const updatedSelectedRow = {
      ...selectedRow,
      Delivery_Date: formatDeliveryDate3(displayDate), // Set Delivery_Date using formatDeliveryDate2
      Special_Instructions: instruction, // Set Special_Instructions to "instruction"
      Dealing_Engineer: selectedSalesContact, // Set Dealing_Engineer to selectedSalesContact
    };

    postRequest(endpoints.save, { updatedSelectedRow },(response) => {
        toast.success("Saved", {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };


  //Print button
  const[serviceOpen,setServiceOpen]=useState(false);
  const PrintPdf = () => {
    setServiceOpen(true);
  };

  
  //close button
  const navigate = useNavigate();
  const closeButton=()=>{
    console.log("close in sales")
    // navigate("/Orders/Sales/ScheduleList/Order/OpenDetailForm", {
    // });
  }
  
  return (
    <div>
      <h4 className="title">Combined Schedule Details Form</h4>
      <div className="ip-box">
        <div className="row">
          <div className="col-md-4 mb-2 col-sm-12">
            <label className="form-label">No</label>
            <input class="" type="text" value={selectedRow?.OrdSchNo} />
          </div>

          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label">Customer</label>
            <input class="" type="text" value={selectedRow?.Cust_name} />
          </div>

          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label"> Sales Contact</label>
            <input class="" type="text" value={selectedRow?.SalesContact} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-2 col-sm-12">
            <label className="form-label">Type</label>
            <input class="" type="text" value={selectedRow?.ScheduleType} />
          </div>

          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label">PO No</label>
            <input class="" type="text" value={selectedRow?.PO} />
          </div>

          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label"> Target Date</label>
            <input
              class=""
              type="text"
              value={formatDeliveryDate(selectedRow?.schTgtDate)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-2 col-sm-12">
            <label className="form-label">Status</label>
            <input class="" type="text" value={selectedRow?.Schedule_Status} />
          </div>
          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label">Instruction</label>
            <input
              class=""
              type="text"
              onChange={onChangeInstruction}
              value={selectedRow?.Special_Instructions}
            />
          </div>
          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label"> Delivery Date</label>
            <input
              className="mt-1"
              type="date"
              onChange={(e) => handleDateChange(e)}
              value={displayDate}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-2 col-sm-12">
            <label className="form-label"> Dealing Engineer</label>
            <select
              id="gstpan"
              className="ip-select mt-1"
              value={selectedSalesContact}
              onChange={(e) => setSelectedSalesContact(e.target.value)}
            >
              <option value="" disabled>
                Select Sales Contact
              </option>
              {salesContactList?.map((item, key) => (
                <option key={key} value={item.Name}>
                  {item.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div
        className="row justify-content-center mt-5"
        style={{ display: "flex" }}
      >
        <button
          className="button-style"
          style={{ width: "60px" }}
          onClick={onClickSave}
        >
          Save
        </button>
        <button
          className="button-style"
          style={{ width: "150px" }}
          onClick={distributeParts}
        >
          Distribute Parts
        </button>
        <button
          className="button-style"
          style={{ width: "270px" }}
          onClick={updateToOriganSchedule}
        >
          Update To Original Schedule
        </button>
        <button className="button-style" style={{ width: "120px" }}>
          Short Close
        </button>
        <button className="button-style" style={{ width: "80px" }}>
          Cancel
        </button>
        <div>
          <button
            className="button-style"
            style={{ width: "130px" }}
            onClick={handleButtonClick}
          >
            Open Folder
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <button className="button-style" style={{ width: "150px" }}>
          Copy Drawings
        </button>
        <button className="button-style" style={{ width: "60px" }} onClick={PrintPdf}>
          Print
        </button>
        <button className="button-style" onClick={closeButton}>close</button>
      </div>

      <Tabs className=" tab_font mt-4">
        <Tab eventKey="" title="Schedule Details">
          <div className="row">
            <div className="col-md-8">
              <div>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    height: "200px",
                    overflowY: "scroll",
                    overflowX: "scroll",
                    width: "200px",
                  }}
                >
                  <thead className="tableHeaderBGColor ">
                    <tr>
                      <th>Dwg Name</th>
                      <th>Material</th>
                      <th>Mprocess</th>
                      <th>Operation</th>
                      <th>Scheduled</th>
                      <th>Programmed</th>
                      <th>Inspected</th>
                      <th>Cleared</th>
                    </tr>
                  </thead>

                  <tbody className="tablebody">
                    {scheduleListDetailsData?.map((item, key) => {
                      const backgroundColor = getBackgroundColor(item);
                      return (
                        <>
                          <tr
                            onClick={() => rowSelectFunc1(item, key)}
                            className={
                              key === selected?.index ? "selcted-row-clr" : ""
                            }
                            style={{ backgroundColor: backgroundColor }}
                          >
                            <td>{item.DwgName}</td>
                            <td>{item.Mtrl_Code}</td>
                            <td>{item.MProcess}</td>
                            <td>{item.Operation}</td>
                            <td>{item.QtyScheduled}</td>
                            <td>{item.QtyProgrammed}</td>
                            <td>{item.QtyProgrammed}</td>
                            <td>{item.QtyCleared}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="col-md-4">
              <div style={{ overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th>Schedule</th>
                      <th>Scheduled</th>
                      <th>Cleared</th>
                      <th>Distributed</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    <tr>
                      <td>{selected?.OrdSchNo}</td>
                      <td>{selected?.QtyScheduled}</td>
                      <td>{selected?.QtyCleared}</td>
                      <td>{selected?.QtyProduced}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Tab>

        {/* Combined Tasks Tab */}
        <Tab eventKey="combinedScheduleDetails" title="Combined Tasks">
          <div className="row">
            <div className="col-md-8">
              <button className="button-style" onClick={updateTask}>
                Update Task
              </button>
              <div style={{ height: "300px", overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th>Task No</th>
                      <th>Matl_Code</th>
                      <th>No of Dwgs</th>
                      <th>DwgsNested</th>
                      <th>Total Parts</th>
                      <th>Parts Nested</th>
                      <th>Operation</th>
                      <th>T Status</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {TaskNoTableData?.map((item, key) => {
                      return (
                        <>
                          <tr
                            onClick={() => rowSelectFuncTaskNo(item, key)}
                            className={
                              key === selectedTaskNo?.index
                                ? "selcted-row-clr"
                                : ""
                            }
                          >
                            {" "}
                            <td>{item.TaskNo}</td>
                            <td>{item.Mtrl_Code}</td>
                            <td>{item.NoOfDwgs}</td>
                            <td>{item.DwgsNested}</td>
                            <td>{item.TotalParts}</td>
                            <td>{item.PartsNested}</td>
                            <td>{item.Operation}</td>
                            <td>{item.TStatus}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div
                style={{ height: "190px", width: "400px", overflowY: "scroll" }}
              >
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th>Length</th>
                      <th>Width</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody"></tbody>
                </Table>
              </div>
            </div>
            <div className="col-md-4">
              <div style={{ height: "350px", overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor table-space">
                    <tr>
                      <th>Dwg Name</th>
                      <th>Qty To Nest</th>
                      <th>Qty Nested</th>
                      <th>Qty Produced</th>
                      <th>Qty Cleared</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {DwgNameTableData?.map((item, key) => {
                      return (
                        <>
                          <tr
                            onClick={() => rowSelectDwg(item, key)}
                            className={
                              key === DwgSelect?.index ? "selcted-row-clr" : ""
                            }
                          >
                            <td>{item.DwgName}</td>
                            <td>{item.QtyToNest}</td>
                            <td>{item.QtyNested}</td>
                            <td>{item.QtyProduced}</td>
                            <td>{item.QtyCleared}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="prepareSchedule" title="Original Schedules">
          <div className="row">
            <div className="col-md-5">
              <div style={{ overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor table-space ">
                    <tr>
                      <th>OrderSrcNo</th>
                      <th>Delivery Date</th>
                      <th>Schedule Status</th>
                      <th>PO</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {orinalScheudledata?.map((item, key) => {
                      return (
                        <>
                          <tr
                            onClick={() =>
                              rowSelectFuncOriginalSchedule(item, key)
                            }
                            className={
                              key === selectedOrignalSchedule?.index
                                ? "selcted-row-clr"
                                : ""
                            }
                          >
                            {" "}
                            <td>{item.OrdSchNo}</td>
                            <td>{formatDeliveryDate(item.Delivery_Date)}</td>
                            <td>{item.Schedule_Status}</td>
                            <td>{item.PO}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="col-md-7">
              {" "}
              <div style={{ overflow: "scroll" }}>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor table-space">
                    <tr>
                      <th>Dwg Name</th>
                      <th>Qty Scheduled</th>
                      <th>Qty Programmed</th>
                      <th>Qty Produced</th>
                      <th>Qty Inspected</th>
                      <th>Qty Cleared</th>
                      <th>Qty Packed</th>
                      <th>Qty Delivered</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {orinalScheudleTable2?.map((item, map) => {
                      return (
                        <>
                          <tr>
                            <td>{item.DwgName}</td>
                            <td>{item.QtyScheduled}</td>
                            <td>{item.QtyProgrammed}</td>
                            <td>{item.QtyProduced}</td>
                            <td>{item.QtyInspected}</td>
                            <td>{item.QtyCleared}</td>
                            <td>{item.QtyPacked}</td>
                            <td>{item.QtyDelivered}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
      <PrintModal
      serviceOpen={serviceOpen}
      setServiceOpen={setServiceOpen}
      selectedRow={selectedRow}
      />
    </div>
  );
}

export default CombinedScheduleDetailsForm;
