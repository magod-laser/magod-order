import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getRequest, postRequest } from "../../api/apiinstance";
import { endpoints } from "../../api/constants";
import Popup from "../Components/Popup";
import { style } from "@mui/system";
import { useLocation } from "react-router-dom";
import { ScheduleDataContext } from "../../../context/CmbineSchDetailsTabContext";
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
  const { setBothScheduleData } = useContext(ScheduleDataContext);
  const [openCombinedSchedule, setOpenCombinedSchedule] = useState(false);
  const [openTasked, setOpenTasked] = useState(false);
  const [validationpopup, setValidationPopup] = useState();
  const [rowselectleftSales, setRowSelectLeftSales] = useState([]);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [cmbScheId, setcmbScheId] = useState();
  const [disableButtonPrep, setDisableButtonPrep] = useState();

  console.log("preapreScheduleData---", preapreScheduleData);
  console.log("beforecombine---", beforecombine);
  console.log("rowselectleft---", rowselectleft);
  console.log("preapreScheduleData---", preapreScheduleData);

  // const location = useLocation();
  //   const { selectedRow } = location?.state || {};

  //   console.log("selectedRow---",selectedRow);

  //SchedueleList Details
  const [scheduleListDetailsData, setScheduleListDetailsData] = useState([]);
  // const [preapreScheduleData, setPrepareScheduleData] = useState([]);

  const getScheduleListDetailssss = () => {
    postRequest(
      endpoints.getSchedudleDetails,
      {
        selectedRow: cmbScheId,
        Component: "Create",
      },
      (response) => {
        console.log("resss----create", response);
        setScheduleListDetailsData(response.data);
        setPrepareScheduleData(response.data);
      }
    );
  };
  console.log("type", type);
  console.log("cmbScheId", cmbScheId);
  // console.log("cmbScheId", selectedRow);

  const getScheduleListDetails = () => {
    if (type === "Sales") {
      console.log("Sales-----", "sales");
      postRequest(
        endpoints.scheduleListDetailssalescreate,
        {
          selectedRow: cmbScheId,
          Component: "Create",
        },
        (response) => {
          console.log("resss----sales", response.data);
          // setScheduleListDetailsData(response.data);
          setBothScheduleData(response.data);
          setScheduleListDetailsData(response.data);
          setPrepareScheduleData(response.data);
        }
      );
    } else {
      console.log("Job Work");
      postRequest(
        endpoints.getSchedudleDetails,
        {
          selectedRow: cmbScheId,
          Component: "Create",
        },
        (response) => {
          console.log("resss----", response);
          // setScheduleListDetailsData(response.data);
          setScheduleListDetailsData(response.data);
          setPrepareScheduleData(response.data);
        }
      );
    }
  };

  // setPrepareScheduleData(scheduleListDetailsData);
  console.log("Sales--scheduleListDetailsData", scheduleListDetailsData);
  console.log("Sales--preapreScheduleData", preapreScheduleData);

  useEffect(() => {
    getScheduleListDetails();
    // setPrepareScheduleData(scheduleListDetailsData);
  }, [cmbScheId]);
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

  // const onClickSelectAllRightSales = () => {
  //   const updatedSelectedRows = [...selectedRowsSales];

  //   oderSchedule.forEach((item) => {
  //     const selectedItemIndex = updatedSelectedRows.findIndex(
  //       (selectedItem) => selectedItem.TaskNo === item.TaskNo
  //     );

  //     if (selectedItemIndex !== -1) {
  //       // If the item is already selected, remove it
  //       updatedSelectedRows.splice(selectedItemIndex, 1);
  //     } else {
  //       // If the item is not selected, add it
  //       updatedSelectedRows.push(item);
  //     }
  //   });

  //   setSelectedRowsSales(updatedSelectedRows);
  // };
  const onClickSelectAllRightSales = () => {
    // Create a new selection that includes all items from oderSchedule
    const updatedSelectedRows = [
      ...selectedRowsSales,
      ...oderSchedule.filter(
        (item) =>
          !selectedRowsSales.some(
            (selectedItem) => selectedItem.TaskNo === item.TaskNo
          )
      ),
    ];

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
    // // If no rows are selected, select all rows; otherwise, do nothing
    // const updatedSelectedRows1 =
    //   rowselectleftSales.length === 0
    //     ? [...beforecombineSales]
    //     : [...beforecombineSales];
    // setRowSelectLeftSales(updatedSelectedRows1);
    setRowSelectLeftSales([...beforecombineSales]); // Always select all
  };

  // const onClickReverse = () => {
  //   // Create a reversed array of selected rows
  //   const reversedSelection = beforecombine
  //     .map((value) => {
  //       const isSelected = rowselectleft.some(
  //         (selectedItem) => selectedItem.TaskNo === value.TaskNo
  //       );
  //       return isSelected ? undefined : value;
  //     })
  //     .filter((value) => value !== undefined);
  //   // Update the rowselectleft state with the reversed selection
  //   setRowSelectLeft(reversedSelection);
  // };
  // const onClickReverse = () => {
  //   alert("revrse jab work left")
  //   const reversedSelection = beforecombine.filter(
  //     (item) =>
  //       !rowselectleft.some(
  //         (selectedItem) => selectedItem.TaskNo === item.TaskNo
  //       )
  //   );
  //   setRowSelectLeft(reversedSelection);
  // };
  const onClickReverse = () => {
    // Step 1: Find items that are not selected
    const reversedSelection = beforecombine.filter((item) => {
      const isSelected = rowselectleft.some(
        (selectedItem) => selectedItem.ScheduleId === item.ScheduleId
      );
      return !isSelected;
    });

    // Step 2: Keep selected items not in beforecombine
    const remainingSelection = rowselectleft.filter((selectedItem) => {
      const isPartOfCombine = beforecombine.some(
        (item) => item.ScheduleId === selectedItem.ScheduleId
      );
      return !isPartOfCombine;
    });

    const updatedSelection = [...reversedSelection, ...remainingSelection];

    setRowSelectLeft(updatedSelection);
  };

  // const onClickReverseSales = () => {
  //   // Create a reversed array of selected rows
  //   alert("reverse left sales")
  //   const reversedSelection = beforecombine
  //     .map((value) => {
  //       const isSelected = rowselectleftSales.some(
  //         (selectedItem) => selectedItem.TaskNo === value.TaskNo
  //       );
  //       return isSelected ? undefined : value;
  //     })
  //     .filter((value) => value !== undefined);
  //   // Update the rowselectleft state with the reversed selection
  //   setRowSelectLeftSales(reversedSelection);
  // };

  
  const onClickReverseSales = () => {

    const reversedSelection = beforecombineSales.filter((value) => {
      const isSelected = rowselectleftSales.some(
        (selectedItem) => selectedItem.TaskNo === value.TaskNo
      );
      return !isSelected;
    });

    const remainingSelection = rowselectleftSales.filter((selectedItem) => {
      const isPartOfCombine = beforecombineSales.some(
        (item) => item.TaskNo === selectedItem.TaskNo
      );
      return !isPartOfCombine;
    });

    const updatedSelection = [...reversedSelection, ...remainingSelection];

    

    setRowSelectLeftSales(updatedSelection);
  };
  
  
  
  const getAlldataAfterCombineSchedule = () => {
    postRequest(
      endpoints.afterCombinedSchedule,
      {
        combinedScheduleNo,
        type,
      },
      (response) => {
        console.log("response Jobwork", response.data);

        setBeforeCombine(response);
      }
    );
  };

  //Create Schedule
  const [combinedScheduleNo, setCombinedScheduleNo] = useState("");
  const onClickCreateSchedule = () => {
    // console.log("selectedSalesContact---check", selectedSalesContact);

    if (
      selectedSalesContact === "" ||
      selectedSalesContact === null ||
      selectedSalesContact === "undefined" ||
      selectedSalesContact === undefined
    ) {
      alert("Please Select Sales Contact");
      return;
    } else {
      if (type === "JobWork") {
        if (rowselectleft.length <= 1) {
          validationModal();
        } else {
          console.log("Hello Jobwork");

          postRequest(
            endpoints.CreateSchedule,
            {
              rowselectleft,
              custCode: custCode,
              selectedSalesContact: selectedSalesContact,
              Date: storedDate,
              ScheduleDate: ScheduleDate,
              Operation: preapreScheduleData[0].Operation,
              Mtrl_Source: preapreScheduleData[0].Mtrl_Source,
            },
            (response) => {
              // console.log("response----",response);
              // console.log("response----",response.cmbSchId);
              setcmbScheId(response.cmbSchId);

              setDisableButton(true);
              setDisableButtonPrep(true);
              console.log(
                "response after create is",
                response.combinedScheduleNos[0],
                "another is",
                response.combinedScheduleNos,
                "OrderDetails",
                response.odrdesDetails
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
              Operation: preapreScheduleData[0].Operation,
              Mtrl_Source: preapreScheduleData[0].Mtrl_Source,
            },
            (response) => {
              // console.log("response.cmbSchId", response.cmbSchId);
              console.log("response.cmbSchId", response);

              setcmbScheId(response.cmbSchId);
              setDisableButton(true);
              setDisableButtonPrep(true);
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
    setDisableButtonPrep(updatedSelection1Sales.length === 0);
    
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

  // ---------------------------------

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
    const dataCopy = [...oderSchedule];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (sortConfig.key === "OrdSchNo") {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        // Convert Printable_Order_Date to date object for proper sorting
        if (sortConfig.key === "schTgtDateFormatted") {
          valueA = new Date(valueA.split("/").reverse().join("-")); // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
          valueB = new Date(valueB.split("/").reverse().join("-"));
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
                disabled={disableButtonPrep}
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
                  <thead
                    className="tableHeaderBGColor"
                    style={{
                      textAlign: "center",
                      position: "sticky",
                      top: "-1px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <tr>
                      <th>Select</th>
                      <th>Task No</th>
                      <th>CustName</th>
                      <th>Mtrl Code</th>
                      <th style={{ textAlign: "center" }}>NoOfDwg</th>
                      <th style={{ textAlign: "center" }}>Total Parts</th>
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
                          <td
                            style={{
                              textAlign: "center",
                              paddingLeft: "10px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
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
                          <td style={{ textAlign: "center" }}>
                            {value.NoOfDwgs}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {value.TotalParts}
                          </td>
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
                              <td style={{ textAlign: "center" }}>
                                {item.NoOfDwgs}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {item.TotalParts}
                              </td>
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
                    Reverse
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
                    disabled={disableButtonPrep || disablebutton}
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
                style={{ overflowY: "scroll", height: "250px" }}
              >
                <Table striped className="table-data border">
                  <thead
                    className="tableHeaderBGColor"
                    style={{
                      textAlign: "center",
                      position: "sticky",
                      top: "-1px",
                      whiteSpace: "nowrap",
                      // color: "red",
                    }}
                  >
                    <tr>
                      <th>Select</th>
                      <th>Order Schedule No</th>
                      <th>PO</th>
                      <th>Target Date</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {beforecombine.map((value, key) => {
                      const date = new Date(value.schTgtDate);
                      const formattedDate = date.toLocaleDateString("en-GB");
                      console.log("formattedDate", formattedDate);

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
                          <td style={{ textAlign: "center" }}>
                            {value.OrdSchNo}
                          </td>
                          <td style={{ textAlign: "center" }}>{value.PO}</td>
                          <td style={{ textAlign: "center" }}>
                            {/* {value.schTgtDateFormatted} */}
                            {/* {value.schTgtDate} */}
                            {formattedDate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div
                className="mt-1"
                style={{
                  height: "240px",
                  overflowY: "scroll",
                  overflowX: "scroll",
                }}
              >
                <Table striped className="table-data border">
                  <thead
                    className="tableHeaderBGColor"
                    style={{
                      textAlign: "center",
                      position: "sticky",
                      top: "-1px",
                      whiteSpace: "nowrap",
                      // color: "red",
                    }}
                  >
                    <tr>
                      <th>Dwg Name</th>
                      <th style={{ textAlign: "right" }}>Quantity</th>
                      <th>MProcess</th>
                      <th>Operation</th>
                    </tr>
                  </thead>
                  {/* <tbody className="tablebody table-space">
                    {preapreScheduleData?.map((data, key) => {
                      return (
                        <>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              {data.DwgName}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {data.QtyScheduled}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {data.MProcess}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {data.Operation}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody> */}

                  {/* // Condtion based table mapping with prepare and sch dtat */}
                  <tbody className="tablebody table-space">
                    {(cmbScheId
                      ? scheduleListDetailsData
                      : preapreScheduleData
                    )?.map((data, key) => (
                      <tr key={key}>
                        <td style={{ textAlign: "center" }}>{data.DwgName}</td>
                        <td style={{ textAlign: "right" }}>
                          {data.QtyScheduled}
                        </td>
                        <td style={{ textAlign: "center" }}>{data.MProcess}</td>
                        <td style={{ textAlign: "center" }}>
                          {data.Operation}
                        </td>
                      </tr>
                    ))}
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
                    Reverse
                  </button>
                </div>
              </div>
              <div
                className="mt-1"
                // style={{ overflowY: "scroll" }}
                style={{
                  height: "500px",
                  overflowY: "scroll",
                  overflowX: "scroll",
                }}
              >
                <Table
                  // striped
                  bordered
                  className="table-data border"
                  style={{ border: "1px" }}
                >
                  <thead
                    className="tableHeaderBGColor"
                    style={{
                      textAlign: "center",
                      position: "sticky",
                      top: "-1px",
                      whiteSpace: "nowrap",
                      // color: "red",
                    }}
                  >
                    <tr>
                      <th>Select</th>
                      <th onClick={() => requestSort("OrdSchNo")}>
                        Order Schedule No
                      </th>
                      <th onClick={() => requestSort("PO")}>PO</th>
                      <th onClick={() => requestSort("schTgtDateFormatted")}>
                        Target Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tablebody table-space">
                    {/* {oderSchedule.map((item, key) => { */}
                    {sortedData()?.map((item, key) => {
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
                            <td style={{ textAlign: "center" }}>
                              {item.OrdSchNo}
                            </td>
                            <td style={{ textAlign: "center" }}>{item.PO}</td>
                            <td style={{ textAlign: "center" }}>
                              {item.schTgtDateFormatted}
                            </td>
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
