import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getRequest, postRequest } from "../../api/apiinstance";
import { endpoints } from "../../api/constants";
import Popup from "../Components/Popup";

export default function PrepareScheduleTab({
  oderSchedule,
  custCode,
  rowselectleft,
  setRowSelectLeft,
  handleCheckboxChangeLeft,
  beforecombine,
  setBeforeCombine,
  onclickofLeftShiftButton,
  selectedRows,
  setSelectedRows,
  handleCheckboxChange,
  preapreScheduleData,
  setPrepareScheduleData,
  onclickpreapreScheduleButton,
  selectedSalesContact,
  storedDate,
  type,
  setOrderSchedule,
  beforecombineSales,
  setBeforeCombineSales,
  setSelectedRowIndex,
  selectedRowIndex,
  setRowSelectEnable,
  rowSelectEnable,
  disablebutton,
  setDisableButton,
}) {
  const [openCombinedSchedule, setOpenCombinedSchedule] = useState(false);
  const [openTasked, setOpenTasked] = useState(false);
  const [validationpopup, setValidationPopup] = useState();
  const [rowselectleftSales, setRowSelectLeftSales] = useState([]);
  const [openSchedule, setOpenSchedule] = useState(false);

  //open CombineSchedule Modal
  const openCombineScheduleModal = () => {
    setOpenCombinedSchedule(true);
  };

  //open Schedulle Modal
  const openSchedulModal = () => {
    setOpenSchedule(true);
  };

  //open Tasked Modal
  const openTaskedModal = () => {
    setOpenTasked(true);
  };

  //close CombineSchedule Modal
  const closeCombineScheduleModal = () => {
    setOpenCombinedSchedule(false);
    openSchedulModal();
  };

  //close Schedule Modal
  const closeScheduleModal = () => {
    setOpenSchedule(false);
    openTaskedModal();
  };

  //close Task Modal
  const closeTaskModal = () => {
    setOpenTasked(false);
  };

  //validation
  const validationModal = () => {
    setValidationPopup(true);
  };

  const validationModalClose = () => {
    setValidationPopup(false);
  };

  //get ScheduleDate
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day} 00:00:00`;
  }
  const [ScheduleDate, setScheduleDate] = useState(getTodayDate());
  useEffect(() => {
    // You can use todayDate in any way you need
  }, [ScheduleDate]);

  //select ALL for Right Table
  // const [selectAllChecked, setSelectAllChecked] = useState(false);
  const onClickSelectAllRight = () => {
    const updatedSelectedRows =
      selectedRows.length === 0 ? [...oderSchedule] : [...oderSchedule];
    setSelectedRows(updatedSelectedRows);
  };

  // const onClickSelectAllRightSales = () => {
  //   const updatedSelectedRows =
  //     selectedRowsSales.length === 0 ? [...oderSchedule] : [...oderSchedule];
  //   setSelectedRowsSales(updatedSelectedRows);
  // };

  const onClickSelectAllRightSales = () => {
    const updatedSelectedRows = [...selectedRowsSales];

    oderSchedule.forEach((item) => {
      const selectedItemIndex = updatedSelectedRows.findIndex(
        (selectedItem) => selectedItem.TaskNo === item.TaskNo
      );

      if (selectedItemIndex !== -1) {
        // If the item is already selected, remove it
        updatedSelectedRows.splice(selectedItemIndex, 1);
      } else {
        // If the item is not selected, add it
        updatedSelectedRows.push(item);
      }
    });

    setSelectedRowsSales(updatedSelectedRows);
  };

  const onClickReverse1 = () => {
    // Create a reversed array of selected rows
    const reversedSelection1 = oderSchedule
      .map((value) => {
        const isSelected = selectedRows.some(
          (selectedItem) => selectedItem.ScheduleId === value.ScheduleId
        );
        return isSelected ? undefined : value;
      })
      .filter((value) => value !== undefined);
    // Update the rowselectleft state with the reversed selection
    setSelectedRows(reversedSelection1);
  };

  const onClickReverse1Sales = () => {
    // Create a reversed array of selected rows
    const reversedSelection1 = oderSchedule
      .map((value) => {
        const isSelected = selectedRowsSales.some(
          (selectedItem) => selectedItem.TaskNo === value.TaskNo
        );
        return isSelected ? undefined : value;
      })
      .filter((value) => value !== undefined);
    // Update the rowselectleft state with the reversed selection
    setSelectedRowsSales(reversedSelection1);
  };

  ///////////////////////////////////////////

  //set  data for first table as null (right shift)
  const onClickRightShiftButton = () => {
    // Remove items from beforecombine that are present in rowselectleft
    const updatedBeforeCombine = beforecombine.filter(
      (item) =>
        !rowselectleft.some(
          (selectedItem) => selectedItem.ScheduleId === item.ScheduleId
        )
    );
    // Update the state with the filtered array
    setBeforeCombine(updatedBeforeCombine);
    // Clear the rowselectleft array
    setRowSelectLeft([]);
    setPrepareScheduleData([]);
  };

  //select ALL FOR LEFT TABLE
  const onClickSelectAllLeft = () => {
    // If no rows are selected, select all rows; otherwise, do nothing
    const updatedSelectedRows1 =
      rowselectleft.length === 0 ? [...beforecombine] : [...beforecombine];
    setRowSelectLeft(updatedSelectedRows1);
  };

  const onClickSelectAllLeftSales = () => {
    // If no rows are selected, select all rows; otherwise, do nothing
    const updatedSelectedRows1 =
      rowselectleftSales.length === 0
        ? [...beforecombineSales]
        : [...beforecombineSales];
    setRowSelectLeftSales(updatedSelectedRows1);
  };

  const onClickReverse = () => {
    // Create a reversed array of selected rows
    const reversedSelection = beforecombine
      .map((value) => {
        const isSelected = rowselectleft.some(
          (selectedItem) => selectedItem.TaskNo === value.TaskNo
        );
        return isSelected ? undefined : value;
      })
      .filter((value) => value !== undefined);
    // Update the rowselectleft state with the reversed selection
    setRowSelectLeft(reversedSelection);
  };

  const onClickReverseSales = () => {
    // Create a reversed array of selected rows
    const reversedSelection = beforecombine
      .map((value) => {
        const isSelected = rowselectleftSales.some(
          (selectedItem) => selectedItem.TaskNo === value.TaskNo
        );
        return isSelected ? undefined : value;
      })
      .filter((value) => value !== undefined);
    // Update the rowselectleft state with the reversed selection
    setRowSelectLeftSales(reversedSelection);
  };

  const getAlldataAfterCombineSchedule = () => {
    postRequest(
      endpoints.afterCombinedSchedule,
      {
        combinedScheduleNo,
        type,
      },
      (response) => {
        console.log('response Jobwork', response.data);
        
        setBeforeCombine(response);
      }
    );
  };

  //Create Schedule
  const [combinedScheduleNo, setCombinedScheduleNo] = useState("");
  const onClickCreateSchedule = () => {
    if (selectedSalesContact === "" || null) {
      alert("Please Select Sales Contact");
    } else {
      if (type === "JobWork") {
        if (rowselectleft.length <= 1) {
          validationModal();
        } else {
          console.log('Hello Jobwork');
          
          postRequest(
            endpoints.CreateSchedule,
            {
              rowselectleft,
              custCode: custCode,
              selectedSalesContact: selectedSalesContact,
              Date: storedDate,
              ScheduleDate: ScheduleDate,
            },
            (response) => {
              setDisableButton(true);
              console.log(
                "response after create is",
                response.combinedScheduleNos[0],
                "another is",
                response.combinedScheduleNos,
                "OrderDetails", response.odrdesDetails
              );
              setCombinedScheduleNo(response.combinedScheduleNos[0]);
              openCombineScheduleModal();
              getAlldataAfterCombineSchedule();
            }
          );
        }
      } else {
        if (rowselectleftSales <= 1) {
          validationModal();
        } else {
          postRequest(
            endpoints.CreateScheduleforSales,
            {
              rowselectleftSales,
              custCode: custCode,
              selectedSalesContact: selectedSalesContact,
              Date: storedDate,
              ScheduleDate: ScheduleDate,
            },
            (response) => {
              setDisableButton(true);
              setCombinedScheduleNo(response.combinedScheduleNos[0]);
              openCombineScheduleModal();
            }
          );
        }
      }
    }
  };

  //get Sales Customerdata
  const [salesCustomerData, setSalesCustomerData] = useState([]);
  const getSalesCustomer = () => {
    getRequest(endpoints.getSalesCustomerdata, (response) => {
      setSalesCustomerData(response);
    });
  };

  useEffect(() => {
    getSalesCustomer();
  }, []);

  //row select customertable sales
  const [selectedCustomerSales, setSelectedCustomerSales] = useState({});
  const rowSelectCustomer = (item, index) => {
    let list = { ...item, index: index };
    setSelectedCustomerSales(list);
    postRequest(
      endpoints.getDeatiledSalesData,
      {
        list,
      },
      (response) => {
        setOrderSchedule(response);
      }
    );
  };

  useEffect(() => {
    getAlldataAfterCombineSchedule();
  }, [combinedScheduleNo]);

  ////////////Sales

  //row Select for right table in SALES
  const [selectedRowsSales, setSelectedRowsSales] = useState([]);
  const handleCheckboxChangeSales = (index, item) => {
    const updatedSelectionSales = [...selectedRowsSales];
    const selectedItemIndexSales = updatedSelectionSales.findIndex(
      (selectedItem) => selectedItem.TaskNo === item.TaskNo
    );
    if (selectedItemIndexSales !== -1) {
      // If the item is already selected, remove it
      updatedSelectionSales.splice(selectedItemIndexSales, 1);
    } else {
      // If the item is not selected, add it
      updatedSelectionSales.push(item);
    }
    setSelectedRowsSales(updatedSelectionSales);
  };

  const onclickofLeftShiftButtonSales = () => {
    setBeforeCombineSales(selectedRowsSales);
    setRowSelectLeftSales(selectedRowsSales);
  };

  const handleCheckboxChangeLeftSales = (index, item) => {
    const updatedSelection1Sales = [...rowselectleftSales];
    const selectedItemIndexSales = updatedSelection1Sales.findIndex(
      (selectedItem) => selectedItem.TaskNo === item.TaskNo
    );
    if (selectedItemIndexSales !== -1) {
      // If the item is already selected, remove it
      updatedSelection1Sales.splice(selectedItemIndexSales, 1);
    } else {
      // If the item is not selected, add it
      updatedSelection1Sales.push(item);
    }
    setRowSelectLeftSales(updatedSelection1Sales);
  };

  //Prepare Schedule for sales
  const onclickpreapreScheduleButtonSales = () => {
    setRowSelectEnable(true);
    postRequest(
      endpoints.prepareScheduleSales,
      {
        ScheduleId: selectedRowIndexSales?.ScheduleID,
      },
      (response) => {
        setPrepareScheduleData(response);
        setDisableButton(false);
      }
    );
  };

  const onClickRightShiftButtonSales = () => {
    // Remove items from beforecombine that are present in rowselectleft
    const updatedBeforeCombineSales = beforecombineSales.filter(
      (item) =>
        !rowselectleftSales.some(
          (selectedItem) => selectedItem.TaskNo === item.TaskNo
        )
    );
    // Update the state with the filtered array
    setBeforeCombineSales(updatedBeforeCombineSales);
    // Clear the rowselectleft array
    // setSelectedRowsSales([]);
    setPrepareScheduleData([]);
  };

  //JobWork Row select
  const handleRowClick = (item, index) => {
    let list = { ...item, index: index };
    if (Object.keys(list).length !== 0) {
      // Check if list is not empty
      setSelectedRowIndex(list);
      if (rowSelectEnable) {
        postRequest(
          endpoints.prepareSchedule,
          {
            ScheduleId: list?.ScheduleId,
          },
          (response) => {
            // console.log("response is",response);
            setPrepareScheduleData(response);
          }
        );
      }
    }
  };

  useEffect(() => {
    if (beforecombine.length > 0 && !selectedRowIndex.OrdSchNo) {
      handleRowClick(beforecombine[0], 0); // Select the first row
    }
  }, [beforecombine, handleRowClick]);

  //Sales Row Select
  const [selectedRowIndexSales, setSelectedRowIndexSales] = useState(null);
  const handleRowClickSales = (item, index) => {
    let list = { ...item, index: index };
    if (Object.keys(list).length !== 0) {
      // Check if list is not empty
      setSelectedRowIndexSales(list);

      if (rowSelectEnable) {
        postRequest(
          endpoints.prepareScheduleSales,
          {
            ScheduleId: list?.ScheduleID,
          },
          (response) => {
            // console.log("response of row select", response);
            setPrepareScheduleData(response);
          }
        );
      }
    }
  };

  useEffect(() => {
    if (beforecombineSales.length > 0 && !selectedRowIndexSales?.TaskNo) {
      handleRowClickSales(beforecombineSales[0], 0); // Select the first row
    }
  }, [beforecombineSales, handleRowClickSales]);

  useEffect(() => {
    // setBeforeCombineSales([]);
    setPrepareScheduleData([]);
  }, [selectedCustomerSales]);

  return (
    <>
      {type === "Sales" ? (
        <div>
          <div className="row">
            <div className="col-md-6">
              <button
                className="button-style group-button"
                onClick={onClickSelectAllLeftSales}
              >
                Select All
              </button>
              <button
                className="button-style group-button"
                onClick={onClickReverseSales}
              >
                Reverse
              </button>
              <button
                className="button-style group-button"
                onClick={onClickRightShiftButtonSales}
              >
                {">>"}
              </button>
              <button
                className="button-style group-button"
                onClick={onclickpreapreScheduleButtonSales}
              >
                Prepare Schedule
              </button>
              <button
                className={`button-style group-button ${
                  disablebutton ? "disabledButton" : ""
                }`}
                onClick={onClickCreateSchedule}
                disabled={disablebutton}
              >
                Create Schedule
              </button>

              <div
                className="mt-2"
                style={{ overflowY: "scroll", height: "200px" }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor table-space">
                    <tr>
                      <th>Select</th>
                      <th>Task No</th>
                      <th>CustName</th>
                      <th>Mtrl Code</th>
                      <th>NoOfDwg</th>
                      <th>Total Parts</th>
                      <th>Operation</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {beforecombineSales.map((value, key) => {
                      const isChecked = rowselectleftSales.some(
                        (selectedItem) => selectedItem.TaskNo === value.TaskNo
                      );

                      return (
                        <tr
                          key={key}
                          onClick={() => handleRowClickSales(value, key)}
                          className={
                            key === selectedRowIndexSales?.index
                              ? "selcted-row-clr"
                              : ""
                          }
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                handleCheckboxChangeLeftSales(key, value)
                              }
                            />
                          </td>
                          <td>{value.TaskNo}</td>
                          <td>{value.Cust_name}</td>
                          <td>{value.Mtrl_Code}</td>
                          <td>{value.NoOfDwgs}</td>
                          <td>{value.TotalParts}</td>
                          <td>{value.Operation}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              <div
                style={{
                  height: "200px",
                  overflowY: "scroll",
                  overflowX: "scroll",
                  alignContent: "flex",
                  whiteSpace: "nowrap",
                }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th>Dwg Name</th>
                      <th>Quantity</th>
                      <th>DwgStatus</th>
                      <th>Task_Part_ID</th>
                      <th>NcTaskId</th>
                      <th>Task No</th>
                      <th>Schedule ID</th>
                      <th>SchDetailsId</th>
                      <th>PartID</th>
                      <th>DwgName</th>
                      <th>QtyToNest</th>
                      <th>QtyNested</th>
                      <th>QtyProduced</th>
                      <th>QtyCleared</th>
                      <th>Remarks</th>
                      <th>LOC</th>
                      <th>Pierces</th>
                      <th>Part Area</th>
                      <th>Unit_Wt</th>
                      <th>Qtn DetailId</th>
                      <th>Out Open</th>
                      <th>Dwg Status</th>
                      <th>Insp Level</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {preapreScheduleData?.map((data, key) => (
                      <tr>
                        {" "}
                        <td>{data.DwgName}</td>
                        <td>{data.QtyToNest}</td>
                        {/* <td>{data.DwgName}</td> */}
                        <td>
                          <input
                            type="checkbox"
                            checked={data.DwgStatus === 1}
                          />
                        </td>
                        <td>1</td>
                        <td>{data.NcTaskId}</td>
                        <td>{data.TaskNo}</td>
                        <td>{data.ScheduleId}</td>
                        <td>{data.SchDetailsID}</td>
                        <td>{data.DwgName}</td>
                        <td>{data.DwgName}</td>
                        <td>{data.QtyToNest}</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td></td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>
                          <input type="checkbox" checked={true} />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={data.DwgStatus === 1}
                          />
                        </td>
                        <td>{data.InspLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="col-md-6">
              <button
                className="button-style group-button"
                onClick={onclickofLeftShiftButtonSales}
              >
                {"<<"}
              </button>
              <button
                className="button-style group-button"
                onClick={onClickSelectAllRightSales}
              >
                Select All
              </button>
              <button
                className="button-style group-button"
                onClick={onClickReverse1Sales}
              >
                Reverse
              </button>

              <div className="row">
                <div className="col-md-6 mt-2">
                  <div
                    style={{
                      height: "400px",
                      overflowY: "scroll",
                      overflowX: "scroll",
                      marginLeft: "-20px",
                    }}
                  >
                    <Table
                      striped
                      className="table-data border"
                      style={{ border: "1px" }}
                    >
                      <thead className="tableHeaderBGColor table-space">
                        <tr>
                          <th>Select</th>
                          <th>Task No</th>
                          <th>Dwgs</th>
                          <th>Parts</th>
                          <th>Cust_Name</th>
                        </tr>
                      </thead>
                      <tbody className="tablebody table-space">
                        {oderSchedule.map((item, key) => {
                          const isChecked = selectedRowsSales.some(
                            (selectedItem) =>
                              selectedItem.TaskNo === item.TaskNo
                          );

                          return (
                            <tr
                              key={key}
                              className={
                                key === selectedRowsSales?.index
                                  ? "selcted-row-clr"
                                  : ""
                              }
                            >
                              <td>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() =>
                                    handleCheckboxChangeSales(key, item)
                                  }
                                />
                              </td>
                              <td>{item.TaskNo}</td>
                              <td>{item.NoOfDwgs}</td>
                              <td>{item.TotalParts}</td>
                              <td>{item.Cust_name}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>

                <div className="col-md-6 mt-2">
                  <div
                    style={{
                      height: "400px",
                      overflowY: "scroll",
                      marginLeft: "-20px",
                    }}
                  >
                    <Table striped className="table-data border">
                      <thead className="tableHeaderBGColor table-space">
                        <tr>
                          <th>Material</th>
                          <th>Operation</th>
                          <th>Dwgs</th>
                          <th>Total Parts</th>
                        </tr>
                      </thead>
                      <tbody className="tablebody table-space">
                        {salesCustomerData.map((item, key) => {
                          return (
                            <tr
                              onClick={() => rowSelectCustomer(item, key)}
                              className={
                                key === selectedCustomerSales?.index
                                  ? "selcted-row-clr"
                                  : ""
                              }
                            >
                              <td>{item.Mtrl_Code}</td>
                              <td>{item.Operation}</td>
                              <td>{item.NoOfDwgs}</td>
                              <td>{item.TotalParts}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Popup
            show={openCombinedSchedule}
            onHide={(e) => setOpenCombinedSchedule(e)}
            firstbutton={closeCombineScheduleModal}
            title="Magod Order"
            message={
              <>
                Combined order{" "}
                <span style={{ fontWeight: "bold" }}>{combinedScheduleNo}</span>{" "}
                created
              </>
            }
            firstbuttontext="OK"
          />

          <Popup
            show={openSchedule}
            onHide={(e) => setOpenSchedule(e)}
            firstbutton={closeScheduleModal}
            title="Magod Order"
            message={
              <>
                Combined Schedule{" "}
                <span style={{ fontWeight: "bold" }}>{combinedScheduleNo}</span>{" "}
                Created
              </>
            }
            firstbuttontext="OK"
          />

          <Popup
            show={openTasked}
            onHide={(e) => setOpenTasked(e)}
            firstbutton={closeTaskModal}
            title="Magod Order"
            message="Combined Schedule Tasked"
            firstbuttontext="OK"
          />

          <Popup
            show={validationpopup}
            onHide={(e) => setValidationPopup(e)}
            firstbutton={validationModalClose}
            title="Magod Order"
            message="Cannot Combine One Schedule, select more than one"
            firstbuttontext="OK"
          />
        </div>
      ) : (
        <div>
          <div className="row">
            <div className="col-md-8 col-sm-12">
              <div className="">
                <div className="col-md-8 col-sm-12">
                  <button
                    className="button-style  group-button"
                    onClick={onClickSelectAllLeft}
                  >
                    Select All
                  </button>
                  <button
                    className="button-style  group-button"
                    onClick={onClickReverse}
                  >
                    Revers
                  </button>
                  <button
                    className="button-style  group-button"
                    onClick={onClickRightShiftButton}
                  >
                    {">>"}{" "}
                  </button>
                  <button
                    className="button-style  group-button"
                    onClick={onclickpreapreScheduleButton}
                  >
                    Prepare Schedule
                  </button>
                  <button
                    className={`button-style group-button ${
                      disablebutton ? "disabledButton" : ""
                    }`}
                    onClick={onClickCreateSchedule}
                    disabled={disablebutton}
                  >
                    Create Schedule
                  </button>
                </div>
              </div>
              <div
                className="mt-1"
                style={{ overflowY: "scroll", height: "180px" }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor table-space">
                    <tr>
                      <th>Select</th>
                      <th>Order Schedule No</th>
                      <th>PO</th>
                      <th>Target Date</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {beforecombine.map((value, key) => {
                      const isChecked = rowselectleft.some(
                        (selectedItem) =>
                          selectedItem.ScheduleId === value.ScheduleId
                      );

                      return (
                        <tr
                          onClick={() => handleRowClick(value, key)}
                          className={
                            key === selectedRowIndex?.index
                              ? "selcted-row-clr"
                              : ""
                          }
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                handleCheckboxChangeLeft(key, value)
                              }
                            />
                          </td>
                          <td>{value.OrdSchNo}</td>
                          <td>{value.PO}</td>
                          <td>{value.schTgtDateFormatted}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div
                className="mt-1"
                style={{
                  height: "180px",
                  overflowY: "scroll",
                  overflowX: "scroll",
                }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th>Dwg Name</th>
                      <th>Quantity</th>
                      <th>MProcess</th>
                      <th>Operation</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {preapreScheduleData?.map((data, key) => {
                      return (
                        <>
                          <tr>
                            <td>{data.DwgName}</td>
                            <td>{data.QtyScheduled}</td>
                            <td>{data.MProcess}</td>
                            <td>{data.Operation}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="">
                <div className="col-md-8 col-sm-12">
                  <button
                    className="button-style  group-button"
                    onClick={onclickofLeftShiftButton}
                  >
                    {"<<"}
                  </button>
                  <button
                    className="button-style  group-button"
                    onClick={onClickSelectAllRight}
                  >
                    Select All
                  </button>
                  <button
                    className="button-style group-button"
                    onClick={onClickReverse1}
                  >
                    Revers
                  </button>
                </div>
              </div>
              <div className="mt-1" style={{ overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border"
                  style={{ border: "1px", height: "360px" }}
                >
                  <thead className="tableHeaderBGColor table-space">
                    <tr>
                      <th>Select</th>
                      <th>Order Schedule No</th>
                      <th>PO</th>
                      <th>Target Date</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {oderSchedule.map((item, key) => {
                      const isChecked = selectedRows.some(
                        (selectedItem) =>
                          selectedItem.ScheduleId === item.ScheduleId
                      );

                      return (
                        <>
                          <tr
                            key={key}
                            className={
                              key === selectedRows?.index
                                ? "selcted-row-clr"
                                : ""
                            }
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(key, item)}
                              />
                            </td>
                            <td>{item.OrdSchNo}</td>
                            <td>{item.PO}</td>
                            <td>{item.schTgtDateFormatted}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              <Popup
                show={openCombinedSchedule}
                onHide={(e) => setOpenCombinedSchedule(e)}
                firstbutton={closeCombineScheduleModal}
                title="Magod Order"
                message={
                  <>
                    Combined order{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {combinedScheduleNo}
                    </span>{" "}
                    created
                  </>
                }
                firstbuttontext="OK"
              />

              <Popup
                show={openSchedule}
                onHide={(e) => setOpenSchedule(e)}
                firstbutton={closeScheduleModal}
                title="Magod Order"
                message={
                  <>
                    Combined Schedule{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {combinedScheduleNo}
                    </span>{" "}
                    Created
                  </>
                }
                firstbuttontext="OK"
              />

              <Popup
                show={openTasked}
                onHide={(e) => setOpenTasked(e)}
                firstbutton={closeTaskModal}
                // secondbutton={secbtnc}
                title="Magod Order"
                message="Combined Schedule Tasked"
                firstbuttontext="OK"
              />

              <Popup
                show={validationpopup}
                onHide={(e) => setValidationPopup(e)}
                firstbutton={validationModalClose}
                // secondbutton={secbtnc}
                title="Magod Order"
                message="Cannot Combine One Schedule, select more than one"
                firstbuttontext="OK"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
