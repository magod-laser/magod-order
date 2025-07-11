import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { getRequest, postRequest } from "../../../../api/apiinstance";
import { endpoints } from "../../../../api/constants";
import PrintModal from "../../../PrintPDF/PrintModal";
import FolderFilesModal from "../../../FolderFilesModal";

function CombinedScheduleDetailsForm() {
  const location = useLocation();
  const { selectedRow } = location?.state || {};
  console.log("selectedRow", selectedRow);
  // console.log("Comb_Order_No", selectedRow?.Order_No);

  const [colordisable, setColorDisable] = useState(false);

  //get sales contact list
  const [salesContactList, setSalesContactList] = useState([]);
  const getSalesContactList = () => {
    getRequest(endpoints.getSalesContact, (response) => {
      //  console.log(response.data);
      setSalesContactList(response);
    });
  };

  console.log("selectedRowasdfghjkl", selectedRow);
  // console.log("selectedRowasdfghjkl", selectedRow?.Order_No);
  // console.log("selectedRowasdfghjkl", selectedRow?.Cust_Code);

  //SchedueleList Details
  const [scheduleListDetailsData, setScheduleListDetailsData] = useState([]);
  const getScheduleListDetails = () => {
    if (
      selectedRow?.Order_No?.startsWith("88")
      // &&      selectedRow.Cust_Code === "0000"
    ) {
      console.log("Sales");
      postRequest(
        endpoints.getSchedudleDetailssales,
        {
          selectedRow,
        },
        (response) => {
          console.log("resss----sales", response.data);
          setScheduleListDetailsData(response.data);
        }
      );
    } else {
      console.log("Job Work");
      postRequest(
        endpoints.getSchedudleDetails,
        {
          selectedRow,
        },
        (response) => {
          console.log("resss----", response);
          setScheduleListDetailsData(response.data);
        }
      );
    }

    // postRequest(
    //   endpoints.getSchedudleDetails,
    //   {
    //     selectedRow,
    //   },
    //   (response) => {
    //     console.log("resss----",response);
    //     setScheduleListDetailsData(response.data);
    //   }
    // );
  };
  console.log("scheduleListDetailsData---2", scheduleListDetailsData);

  const getBackgroundColor = (item) => {
    // console.log("item",item);

    if (!colordisable) {
      if (item.QtyScheduled === 0) {
        // return "red";
        return "#ffb6c1";
      }
      // else if (item.QtyScheduled === item.QtyScheduled) {
      //   // return "green";
      //   return "#90ee90";
      // }
      else if (
        item.QtyScheduled !== 0 &&
        item.QtyProgrammed === 0 &&
        item.QtyCleared === 0 &&
        item.QtyProduced === 0
      ) {
        // return "green";
        return "#FF474C";
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
    }
  };

  //Date Format
  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    // const day = date.getDate();
    const day = String(date.getDate()).padStart(2, "0"); 
    // const month = date.getMonth() + 1; // Month is zero-based
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    // Use template literals to format the date
    return `${day}-${month}-${year}`;
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
    postRequest(
      endpoints.CombinedTasksTaskTable,
      {
        ScheduleId: selectedRow?.ScheduleId,
      },
      (response) => {
        setTaskNoTableData(response);
      }
    );
  };

  //const row select TaskNo Table
  const [selectedTaskNo, setSelectedTaskNo] = useState({});
  const [DwgNameTableData, setDwgNameTableData] = useState([]);

  const rowSelectFuncTaskNo = (item, index) => {
    let list = { ...item, index: index };
    setSelectedTaskNo(list);
    postRequest(
      endpoints.CombinedTasksShowDwg,
      {
        TaskNo: list?.TaskNo,
      },
      (response) => {
        // console.log(response.data);
        setDwgNameTableData(response);
      }
    );
  };

  useEffect(() => {
    // Automatically select the first row if data is available
    if (TaskNoTableData && TaskNoTableData.length > 0) {
      rowSelectFuncTaskNo(TaskNoTableData[0], 0);
    }
  }, [TaskNoTableData]);

  ///Original Schedules Table 1
  const [orinalScheudledata, setOrinalScheduledata] = useState([]);
  const getOriginalTable1 = () => {
    postRequest(
      endpoints.OriginalTable,
      {
        selectedRow,
      },
      (response) => {
        console.log("Original Schedules", response.data);
        setOrinalScheduledata(response);
      }
    );
  };

  //table row select
  const [selectedOrignalSchedule, setSelectedOrignalSchedule] = useState({});
  const [orinalScheudleTable2, setOrinalScheduleTable2] = useState([]);

  const rowSelectFuncOriginalSchedule = (item, index) => {
    let list = { ...item, index: index };
    // console.log(list);
    setSelectedOrignalSchedule(list);
    postRequest(
      endpoints.OriginalTable2,
      {
        list,
      },
      (response) => {
        // console.log(response.data);
        setOrinalScheduleTable2(response);
      }
    );
  };

  useEffect(() => {
    // Automatically select the first row if data is available
    if (orinalScheudledata && orinalScheudledata.length > 0) {
      rowSelectFuncOriginalSchedule(orinalScheudledata[0], 0);
    }
  }, [orinalScheudledata]);

  useEffect(() => {
    getSalesContactList();
    getScheduleListDetails();
    getTaskNoTabledata();
    getOriginalTable1();
  }, []);

  //Update To Original Schedule
  const [openFolder, setOpenFolder] = useState(false);
  const updateToOriganSchedule = () => {
    setOpenFolder(true);
    setColorDisable(true);
    postRequest(
      endpoints.updateToOriganalSchedule,
      {
        selectedRow,
      },
      (response) => {
        toast.success("Sucessfully Updated", {
          position: toast.POSITION.TOP_CENTER,
        });
        postRequest(
          endpoints.getSchedudleDetails,
          {
            selectedRow,
          },
          (response) => {
            console.log("----2", response);
            setScheduleListDetailsData(response);
          }
        );
      }
    );
  };

  //Print button
  const [serviceOpen, setServiceOpen] = useState(false);
  const PrintPdf = () => {
    setServiceOpen(true);
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
    postRequest(
      endpoints.updateTask,
      {
        DwgSelect,
      },
      (response) => {
        // console.log(response.data);
        if (response.data === "Success") {
          toast.success(response.data, {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error(response.data, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    );
  };

  //Distribute Parts
  const distributeParts = () => {
    postRequest(
      endpoints.distributeParts,
      { scheduleListDetailsData },
      (response) => {
        if (response.success === "Parts Distributed") {
          toast.success(response.success, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    );
  };

  ///
  const [openfileModal, setOpenFileModal] = useState(false);

  const [files, setFiles] = useState([]);

  const onClickOpenFolder = () => {
    //  let Comb_Order_No = selectedRow.Order_No;
    let docNo = selectedRow.Order_No;

    setOpenFileModal(true);
    // let destPath =  process.env.REACT_APP_SERVER_FILES + `\\` + docNo + "\\" + selectedFolder + "\\"; //"\\DXF\\";
    let despath = process.env.REACT_APP_SERVER_FILES + `\\Wo\\` + docNo + "\\";

    postRequest(endpoints.getFolders, { docNo, despath }, (folderslist) => {
      console.log("folderslist : ", folderslist);
      setFiles(folderslist);
    });

    // setOpenFileModal(true);

    // if (openFolder) {
    //   // Prepare data to send in the POST request
    //   const requestData = {
    //     OrderNo: selectedRow?.Order_No,
    //   };
    //   // Send POST request to fetch files from the server
    //   postRequest(endpoints.openFolder, { requestData }, (response) => {
    //     setFiles(response);
    //     setOpenFileModal(true);
    //   });
    // } else {
    //   fileInputRef.current.click();
    // }
  };

  const handleFileChange = (event) => {
    // Handle the selected file here
    const selectedFile = event.target.files[0];
  };

  const fileInputRef = React.createRef();

  const onClickCopyDwg = () => {
    // console.log("order nos before combine",orderNumbers);
    // console.log("order nos after combine", selectedRow.Order_No);
    // console.log("DwgData", DwgData);

    // let Indi_orderNumbers = orderNumbers;
    let Comb_Order_No = selectedRow.Order_No;
    let DwgDatas = DwgData;

    //  let custcd = OrderData.Cust_Code;
    // let custpath = process.env.REACT_APP_SERVER_CUST_PATH;
    // let orderno = OrderData.Order_No;
    // let srcfolder = custpath + "\\" + custcd + "\\DXF\\";
    // let destfolder =
    //   process.env.REACT_APP_SERVER_FILES + "\\" + orderno + "\\DXF\\";
    // Prepare data to send in the POST request

    //  let dwgelement = [];

    //     // Filter data where Dwg equals 0
    //     const zerodwgdata = OrdrDetailsData.filter((data) => data.Dwg === 0);

    //     // Extract only the DwgName from filtered data
    //     dwgelement = zerodwgdata.map((data) => data.DwgName);

    //     console.log("Filtered DWG Names:", dwgelement);

    // const requestData = {
    //   selectedRow,
    //   orinalScheudledata,
    // };
    //  srcfolder, destfolder, orderdwg: dwgelement
    postRequest(
      endpoints.cmbordcopydxf,
      { Comb_Order_No, DwgDatas },
      (response) => {
        console.log("res--copy",response);
        alert("File copied successfully")
        
      }
    );
  };

  //
  const [displayDate, setDisplayDate] = useState(
    formatDeliveryDate2(selectedRow?.Delivery_Date)
  );
  const [selectedSalesContact, setSelectedSalesContact] = useState(
    selectedRow?.Dealing_Engineer
  );
  const handleDateChange = (e) => {
    // Update the displayDate whenever the user selects a date

    setDisplayDate(e.target.value);
  };

  const [instruction, setInstruction] = useState("");
  useEffect(() => {
    if (selectedRow?.Special_Instructions) {
      setInstruction(selectedRow.Special_Instructions);
    }
  }, [selectedRow]);

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

    postRequest(endpoints.save, { updatedSelectedRow }, (response) => {
      toast.success("Saved", {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  };

  //close button
  const navigate = useNavigate();
  const closeButton = () => {
    // if (scheduleListDetailsData[0].ScheduleType === "Job Work") {
    navigate("/Orders/JobWork/ScheduleList/Order", {});
      
    // } else {
    // navigate("/Orders/Sales/ScheduleList/Order", {});
      
    // }
  };

  // console.log("orinalScheudledata",orinalScheudledata);
  // console.log("orinalScheudleTable2",orinalScheudleTable2);
  // console.log("scheduleListDetailsData",scheduleListDetailsData[0].ScheduleType); //Job Work

  const orderNumbers = orinalScheudledata.map((item) => item.Order_No);
  const DwgData = scheduleListDetailsData.map((item) => ({
    DwgName: item.DwgName,
    DwgName_Details: item.DwgName_Details,
    order_no: item.Order_No,
  }));
  console.log("DwgData", DwgData);
  console.log("selected", selected);
  console.log("scheduleListDetailsData", scheduleListDetailsData);
  console.log("displayDate", displayDate);
  // console.log("Ind_DWgs before combine",Ind_DWgs);
  // console.log("order nos before combine",orderNumbers);
  // console.log("order nos after combine", selectedRow.Order_No);

  return (
    <div>
      <h4 className="title">Combined Schedule Details Form</h4>
      <div className="ip-box">
        <div className="row">
          <div
            className="field-gap d-flex col-md-4 mb-2 col-sm-12"
            style={{ gap: "92px" }}
          >
            <label className="form-label">No</label>
            <input
              className="in-field"
              type="text"
              value={selectedRow?.OrdSchNo}
            />
          </div>

          <div
            className="d-flex field-gap col-md-4  mb-2 col-sm-12"
            style={{ gap: "17px" }}
          >
            <label className="form-label">Customer</label>
            <input
              className="in-field"
              type="text"
              value={selectedRow?.Cust_name}
            />
          </div>

          <div className="field-gap d-flex col-md-4  mb-2 col-sm-12">
            <label className="form-label label-space"> Sales Contact</label>
            <input
              className="in-field"
              type="text"
              value={selectedRow?.SalesContact}
            />
          </div>
        </div>

        <div className="row">
          <div
            className="field-gap d-flex col-md-4 mb-2 col-sm-12"
            style={{ gap: "82px" }}
          >
            <label className="form-label">Type</label>
            <input
              className="in-field"
              type="text"
              value={selectedRow?.ScheduleType}
            />
          </div>

          <div
            className="d-flex field-gap col-md-4 mb-2 col-sm-12"
            style={{ gap: "34px" }}
          >
            <label className="form-label label-space">PO No</label>
            <input className="in-field" type="text" value={selectedRow?.PO} />
          </div>

          <div
            className="d-flex field-gap col-md-4  mb-2 col-sm-12"
            style={{ gap: "20px" }}
          >
            <label className="form-label label-space"> Target Date</label>
            <input
              className="in-field"
              type="text"
              value={formatDeliveryDate(selectedRow?.schTgtDate)}
            />
          </div>
        </div>
        <div className="row">
          <div
            className="d-flex field-gap col-md-4 mb-2 col-sm-12"
            style={{ gap: "73px" }}
          >
            <label className="form-label">Status</label>
            <input
              className="in-field"
              type="text"
              value={selectedRow?.Schedule_Status}
            />
          </div>
          <div className="d-flex field-gap col-md-4  mb-2 col-sm-12">
            <label className="form-label">Instruction</label>
            <input
              className="in-field"
              type="text"
              onChange={onChangeInstruction}
              value={instruction}
            />
          </div>
          <div className="d-flex field-gap col-md-4  mb-2 col-sm-12">
            <label className="form-label label-space"> Delivery Date</label>
            <input
              className="in-field"
              type="date"
              onChange={(e) => handleDateChange(e)}
              value={displayDate}
            />
          </div>
        </div>
        <div className="row">
          <div className="d-flex field-gap col-md-4 mb-2 col-sm-12">
            <label className="form-label label-space"> Dealing Engineer</label>
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

      <div className="row">
        <div className="col-md-12">
          <button className="button-style" onClick={onClickSave}>
            Save
          </button>
          <button className="button-style" onClick={distributeParts}>
            Distribute Parts
          </button>
          <button className="button-style" onClick={updateToOriganSchedule}>
            Update To Original Schedule
          </button>
          {/* <button className="button-style">Short Close</button>
          <button className="button-style">Cancel</button> */}

          <button className="button-style" onClick={onClickOpenFolder}>
            Open Folder
          </button>
          {!openFolder ? (
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          ) : null}

          <button className="button-style" onClick={onClickCopyDwg}>
            Copy Drawings
          </button>
          <button className="button-style" onClick={PrintPdf}>
            Print
          </button>
          <button className="button-style" onClick={closeButton}>
            Close
          </button>
          {/* <button className="button-style">NC Programming</button> */}
        </div>
      </div>

      <Tabs className="tab_font mt-1">
        <Tab eventKey="" title="Schedule Details">
          <div className="row">
            <div className="col-md-8">
              <div style={{ height: "290px", overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border"
                  style={{
                    overflowY: "scroll",
                    overflowX: "scroll",
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
                            <td>{item.QtyInspected}</td>
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
                  className="table-data border"
                  style={{
                    border: "1px",
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
                      {/* <td>{selected?.OrderScheduleNo}</td> */}
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
              <button className="button-style mb-1" onClick={updateTask}>
                Update Task
              </button>
              <div style={{ height: "300px", overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border"
                  style={{
                    border: "1px",
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
              <div style={{ height: "190px", overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border"
                  style={{
                    border: "1px",
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
              <div
                style={{
                  height: "300px",
                  overflowY: "scroll",
                  marginTop: "37px",
                }}
              >
                <Table
                  striped
                  className="table-data border"
                  style={{
                    border: "1px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor table-space label-space">
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
              <div style={{ overflowY: "scroll", height: "400px" }}>
                <Table striped className="table-data border">
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
              <div style={{ overflow: "scroll", height: "400px" }}>
                <Table
                  striped
                  className="table-data border"
                  style={{
                    border: "1px",
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
      <FolderFilesModal
        openfileModal={openfileModal}
        setOpenFileModal={setOpenFileModal}
        files={files}
        selectedRow={selectedRow}
      />
    </div>
  );
}

export default CombinedScheduleDetailsForm;
