/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Table, Tabs, Form } from "react-bootstrap";
import { endpoints } from "../../../../../../api/constants";
import { getRequest, postRequest } from "../../../../../../api/apiinstance";
import AlertModal from "../../../../Menus/Service/Components/Alert";
import { ToastContainer, toast } from "react-toastify";
import OkayModal from "../../../../../../components/OkayModal";
import { use } from "react";

export default function ProductionScheduleCreation({
  OrderData,
  selectedItems,
  setScheduleListData,
  handleScheduleOptionChange,
  handleScheduleTypeChange,
  handleClearFilters,
  scheduleOption,
  scheduleType,
  OrdrDetailsData,
  selectedSrl,
  setSelectedSrl,
  selectedRows,
  setSelectedRows,
  setSelectedItems,
  setSelectedRowItems,
  setLastSlctedRow,
  setSelectedRow,
  fetchData,
}) {
  // API call to fetch schedule list
  const fetchScheduleList = (type) => {
    postRequest(
      endpoints.scheduleListbasedOnScheduleType,
      { OrderData, scheduleType: type },
      (response) => {
        // console.log("schedulelist response ", response);
        setScheduleListData(response);
      }
    );
  };
  const [smShow, setSmShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [ProfileDatatoSch, SetProfileDatatoSch] = useState();
  useEffect(() => {
    if (OrderData && scheduleType) {
      fetchScheduleList(scheduleType);
    }
  }, [OrderData, scheduleType]);

  useEffect(() => {
    setSelectedRows([]);
    setSelectedRowItems([]);
    setSelectedItems([]);
    setSelectedSrl([]);
    setLastSlctedRow(null);
    setSelectedRow(null);
  }, [scheduleType]);

  //onclick Refresh Status
  const onClickRefreshStatus = () => {
    toast.success("Status Updated", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  //Onclick Create Schedule
  const createSchedule = () => {
    console.log("enetring into create schedule", selectedItems.length);

    if (selectedItems.length === 0 && scheduleOption === "Partial Order") {
      toast.warning("Select Parts to add to Schedule", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      let filteredItems;

      if (scheduleType === "Job Work") {
        if (scheduleOption === "Full Order") {
          filteredItems = OrdrDetailsData.filter(
            (item) => item.Mtrl_Source === "Customer"
          );
          // Automatically select these items
          setSelectedItems(filteredItems);
          setSelectedRows(filteredItems);
          setSelectedRowItems(filteredItems);
        } else if (scheduleOption === "Partial Order") {
          filteredItems = selectedItems.filter(
            (item) => item.Mtrl_Source === "Customer"
          );
        }
      } else if (scheduleType === "Sales") {
        if (scheduleOption === "Full Order") {
          filteredItems = OrdrDetailsData.filter(
            (item) => item.Mtrl_Source === "Magod"
          );
          // Automatically select these items
          setSelectedItems(filteredItems);
          setSelectedRows(filteredItems);
          setSelectedRowItems(filteredItems);
        } else if (scheduleOption === "Partial Order") {
          filteredItems = selectedItems.filter(
            (item) => item.Mtrl_Source === "Magod"
          );
        }
      }

      // console.log("filteredItems is", filteredItems);

      // Check if filteredItems is empty
      if (!filteredItems || filteredItems.length === 0) {
        toast.warning("No items to schedule", {
          position: toast.POSITION.TOP_CENTER,
        });
        return; // Exit the function without making the API request
      }

      // Check if material and operation with table data
      //  if (!filteredItems || filteredItems.length === 0) {
      //   toast.warning("No items to schedule", {
      //     position: toast.POSITION.TOP_CENTER,
      //   });
      //   return; // Exit the function without making the API request
      // }

      // Filter items where Qty_Ordered is not less than or equal to QtyScheduled
      const filteredItems2 = filteredItems.filter(
        (item) => item.Qty_Ordered > item.QtyScheduled
      );

      // Check if filteredItems2 is empty
      if (filteredItems2.length === 0) {
        toast.warning("No items to schedule", {
          position: toast.POSITION.TOP_CENTER,
        });
        return; // Exit the function without making the API request
      }

      // get process list
      getRequest(endpoints.getProcessLists, (pdata) => {
        let arr = pdata.map((process) => ({
          ...process,
          label: process.Operation,
        }));

        // console.log("arr...", arr);

        // Check if the selected item's Operation exists in arr
        const allOperations = arr.map((proc) => proc.Operation);

        const hasValidOperation = filteredItems2.every((item) =>
          allOperations.includes(item.Operation)
        );

        if (!hasValidOperation) {
          toast.warning("Operation is not matching", {
            position: toast.POSITION.TOP_CENTER,
          });
          return; // Exit if operation does not match
        }
        getRequest(endpoints.getMaterials, (mtrldata) => {
          let materialArr = mtrldata.map((material) => ({
            ...material,
            label: material.Mtrl_Code,
          }));

          // console.log("all Material List: ", materialArr);
          // console.log("all Material Codes: ", materialArr.map(mtrl => mtrl.Mtrl_Code));

          // Check if the selected item's mtrl_code exists in materialArr
          // const allMtrlCodes = materialArr.map((mtrl) => mtrl === mtrl.Mtrl_Code);

          const allMtrlCodes = materialArr.map((mtrl) => mtrl.Mtrl_Code);

          const hasValidMtrlCode = filteredItems2.every((item) => {
            // console.log("all checking item:", item); // Log each item in filteredItems2
            // console.log("all Mtrl_Code in item:", item.Mtrl_Code);
            return allMtrlCodes.includes(item.Mtrl_Code);
          });

          // if (!hasValidMtrlCode) {

          if (!hasValidMtrlCode) {
            toast.warning("Material Code is not matching", {
              position: toast.POSITION.TOP_CENTER,
            });

            return; // Exit if material code does not match
          }

          // checking dxf existence before draft sch creation
          // console.log("OrderData...",OrderData);
          // console.log("OrdrDetailsData...",OrdrDetailsData);

          // postRequest(
          //   endpoints.checkmultiDxf,
          //   {orderno: OrderData.Order_No,Dwgname: OrdrDetailsData.DwgName },(response) => {
          //     if (response.message === 'Present') {
          //         //DWG Exists = checked
          //     }
          //     else if (response.message === 'Not Present'){
          //          //Dwg Exists = unchecked
          //          toast.warning("dxf are not present for the selected dwg names")
          //     }

          //   });
          console.log("OrderData", OrderData.Type);

          if (OrderData.Type === "Profile") {
            // checking dwg existence
            const dwgZeroItems = filteredItems2.filter(
              (item) => Number(item.Dwg) === 0
            );
            const dwgOneItems = filteredItems2.filter(
              (item) => Number(item.Dwg) === 1
            );
            SetProfileDatatoSch(dwgOneItems);

            console.log("dwgZeroItems", dwgZeroItems);
            console.log("dwgOneItems", dwgOneItems);

            // If any have dwg === 0, show their DWG names in a warning
            if (dwgZeroItems.length > 0) {
              const dwgNames = dwgZeroItems
                .map((item) => item.DwgName)
                .join(", ");
              alert(`Dxf not present for: ${dwgNames}`);
            }

            // If no valid dwg === 1 items, stop here
            if (dwgOneItems.length === 0) {
              toast.warning("No valid items with Dxf to schedule", {
                position: toast.POSITION.TOP_CENTER,
              });
              return;
            }

            // }

            console.log("filteredItems2", filteredItems2);
            postRequest(
              endpoints.CreateProductionSchedule,
              {
                OrderData,
                scheduleType: scheduleType,
                // selectedItems: filteredItems2,
                selectedItems: dwgOneItems,
                // selectedItems: OrderData.Type === "Profile" ? ProfileDatatoSch : filteredItems2,
                scheduleOption: scheduleOption,
                filteredItems: filteredItems,
              },
              (response) => {
                if (response.message === "Draft Schedule Created") {
                  // toast.success(response.message, {
                  //   position: toast.POSITION.TOP_CENTER,
                  // });
                  setModalMessage(response.message);
                  setSmShow(true);
                  // alert("Draft Schedule Created");
                  // setSmShow;
                  postRequest(
                    endpoints.getScheduleListData,
                    { Order_No: OrderData.Order_No },
                    (response) => {
                      // console.log("response");
                      setScheduleListData(response);
                    }
                  );
                } else {
                  setModalMessage(response.message); // Show error message in modal
                  setSmShow(true);
                  // toast.warning(response.message, {
                  //   position: toast.POSITION.TOP_CENTER,
                  // });
                }
              }
            );
          } else {
            console.log("filteredItems2", filteredItems2);
            postRequest(
              endpoints.CreateProductionSchedule,
              {
                OrderData,
                scheduleType: scheduleType,
                selectedItems: filteredItems2,
                // selectedItems: dwgOneItems,
                // selectedItems: OrderData.Type === "Profile" ? ProfileDatatoSch : filteredItems2,
                scheduleOption: scheduleOption,
                filteredItems: filteredItems,
              },
              (response) => {
                if (response.message === "Draft Schedule Created") {
                  // toast.success(response.message, {
                  //   position: toast.POSITION.TOP_CENTER,
                  // });
                  setModalMessage(response.message);
                  setSmShow(true);
                  // alert("Draft Schedule Created");
                  // setSmShow;
                  postRequest(
                    endpoints.getScheduleListData,
                    { Order_No: OrderData.Order_No },
                    (response) => {
                      // console.log("response");
                      setScheduleListData(response);
                    }
                  );
                } else {
                  setModalMessage(response.message); // Show error message in modal
                  setSmShow(true);
                  // toast.warning(response.message, {
                  //   position: toast.POSITION.TOP_CENTER,
                  // });
                }
              }
            );
          }
        });
      });

      // postRequest(
      //   endpoints.CreateProductionSchedule,
      //   {
      //     OrderData,
      //     scheduleType: scheduleType,
      //     selectedItems: filteredItems2,
      //     scheduleOption: scheduleOption,
      //     filteredItems:filteredItems

      //   },
      //   (response) => {
      //     if (response.message === "Draft Schedule Created") {
      //       toast.success(response.message, {
      //         position: toast.POSITION.TOP_CENTER,
      //       });
      //       postRequest(
      //         endpoints.getScheduleListData,
      //         { Order_No: OrderData.Order_No },
      //         (response) => {
      //           console.log("response");
      //           setScheduleListData(response);
      //         }
      //       );
      //     } else {
      //       toast.warning(response.message, {
      //         position: toast.POSITION.TOP_CENTER,
      //       });
      //     }
      //   }
      // );
    }
    // Clear selectedSrl after API call is complete
    // clearAllSelections();
    // window.location.reload();
  };
  const clearAllSelections = () => {
    setSelectedRows([]);
    setSelectedRowItems([]);
    setSelectedItems([]);
    setSelectedSrl([]); // This should clear the selectedSrl
    setLastSlctedRow(null);
    setSelectedRow(null);
  };

  // copy Dxf Button Click
  const fnCopyDxf = async () => {
    let custcd = OrderData.Cust_Code;
    let custpath = process.env.REACT_APP_SERVER_CUST_PATH;
    let orderno = OrderData.Order_No;
    let srcfolder = custpath + "\\" + custcd + "\\DXF\\";
    let destfolder =
      process.env.REACT_APP_SERVER_FILES + "\\" + orderno + "\\DXF\\";
    // let dwgelement = [];
    // console.log(OrdrDetailsData);
    // const zerodwgdata = OrdrDetailsData.filter((OrdrDetailsData) => element.includes(Dwg))
    // for (let i = 0; i < OrdrDetailsData.length; i++) {
    //   if (OrdrDetailsData[i].Dwg === 0) {
    //     const element = OrdrDetailsData[i].DwgName;
    //     dwgelement.push(...dwgelement,element);

    //   }
    // }

    let dwgelement = [];

    // Filter data where Dwg equals 0
    const zerodwgdata = OrdrDetailsData.filter((data) => data.Dwg === 0);

    // Extract only the DwgName from filtered data
    dwgelement = zerodwgdata.map((data) => data.DwgName);

    console.log("Filtered DWG Names:", dwgelement);

    console.log("dwgelement", dwgelement);
    await postRequest(
      endpoints.orderCopyDxf,
      { srcfolder, destfolder, orderdwg: dwgelement }, // custdwgname },
      (copydata) => {
        if (copydata.status == "success") {
          alert("Files Copied Sucessfully..");
        }
      }
    );

    //  console.log("OrdrDetailsData :",OrdrDetailsData);
  };

  // console.log("OrdrDetailsData == 123", OrdrDetailsData)

  // Check Dxf Button Click
  const fnCheckDxf = async () => {
    let orderno = OrderData.Order_No;
    await postRequest(endpoints.checkDxf, { orderno }, (checkdata) => {
      console.log("checkdata-msg", checkdata.status);
      // if(checkdata.status ="Order Folder does not exist") {
      if (checkdata.status.length > 0) {
        alert(checkdata.status);
      }
      // if(checkdata.data.length > 0){
      //   alert("data found");
      // }

      for (let i = 0; i < OrdrDetailsData.length; i++) {
        const isFilePresent = checkdata.data.some(
          (file) => file === OrdrDetailsData[i].DwgName
        );
        if (!isFilePresent) {
          postRequest(
            endpoints.UpdateOrdDWG,
            { orderno, orddwg: OrdrDetailsData[i].DwgName, intdwg: 0 },
            (resp) => {
              //  console.log(resp);
              fetchData();
            }
          );
        } else {
          postRequest(
            endpoints.UpdateOrdDWG,
            { orderno, orddwg: OrdrDetailsData[i].DwgName, intdwg: 1 },
            (resp) => {
              //           console.log(resp);
              fetchData();
            }
          );
        }
      }
    });
  };

  console.log("After sch selectedSrl:", selectedSrl);
  //   console.log("After clearing2:", selectedRows);
  //   console.log("After clearing2:", selectedItems);

  //Onclick of ShortClose
  const [openShortClose, setOpenShortClose] = useState(false);
  const onClickShortClose = () => {
    if (OrderData?.Order_Status === "ShortClosed") {
      setOpenShortClose(true);
    } else {
      toast.warning("Cancel Schedule No {0} before short closing the order", {
        position: toast.POSITION.TOP_CENTER,
      });
      postRequest(endpoints.shortcloseOrder, { OrderData }, (response) => {
        //  console.log(response.message);
        toast.success(response.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  };

  //onclick of yes in Shortclose
  const onClickYes = () => {
    postRequest(endpoints.shortclosetoRecorded, { OrderData }, (response) => {
      setOpenShortClose(false);
      toast.success(response.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  };

  //cancel Order
  const onClickCancel = () => {
    if (OrderData?.Order_Status === "Cancelled") {
      postRequest(endpoints.canceltoRecorded, { OrderData }, (response) => {
        // console.log(response.message);
        toast.success(response.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      postRequest(endpoints.cancelOrder, { OrderData }, (response) => {
        // console.log(response.message);
        if (response.message === "Order cancelled successfully") {
          toast.success(response.message, {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.warning(response.message, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
    }
  };

  //onClick Suspend Order
  const onClickSuspendOrder = () => {
    postRequest(endpoints.suspendOrder, { OrderData }, (response) => {
      toast.success(response.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  };

  //open Folder
  const openFolder = () => {};

  return (
    <>
      <div className="my-3">
        <div className="row">
          <div className="col-md-12 d-flex align-items-center flex-wrap">
            <div className="me-3 mb-2">
              <button
                className="button-style"
                onClick={onClickSuspendOrder}
                disabled={
                  OrderData?.Order_Status === "Closed" ||
                  OrderData?.Order_Status === "Cancelled" ||
                  OrderData?.Order_Status === "Dispatched" ||
                  OrderData?.Order_Status === "ShortClosed" ||
                  OrderData?.Order_Status === "Created" ||
                  OrderData?.Order_Status === "Recorded" ||
                  OrderData?.Order_Status === "Packed" ||
                  OrderData?.Order_Status === "Produced"
                }
              >
                Suspended Order
              </button>
            </div>

            <div className="me-3 mb-2">
              <button
                className="button-style"
                onClick={onClickCancel}
                disabled={
                  OrderData?.Order_Status === "Closed" ||
                  OrderData?.Order_Status === "Cancelled" ||
                  OrderData?.Order_Status === "Dispatched" ||
                  OrderData?.Order_Status === "Suspended" ||
                  OrderData?.Order_Status === "Recorded" ||
                  OrderData?.Order_Status === "Packed" ||
                  OrderData?.Order_Status === "Produced" ||
                  OrderData?.Order_Status === "ShortClosed"
                }
              >
                Cancel Order
              </button>
            </div>

            <div className="me-3 mb-2">
              <button
                className="button-style"
                onClick={onClickShortClose}
                disabled={
                  OrderData?.Order_Status === "Closed" ||
                  OrderData?.Order_Status === "Cancelled" ||
                  OrderData?.Order_Status === "Dispatched" ||
                  OrderData?.Order_Status === "Suspended" ||
                  OrderData?.Order_Status === "Recorded" ||
                  OrderData?.Order_Status === "Packed" ||
                  OrderData?.Order_Status === "Produced" ||
                  OrderData?.Order_Status === "Created"
                }
              >
                Short Close
              </button>
            </div>

            {/* <div className="me-3 mb-2 d-flex flex-row">
              <label className="form-label">Schedule Type</label>
              <div className="d-flex justify-content-center align-items-center" >
                <div
                  className="form-check me-3 d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="scheduleType"
                    value="Sales"
                    onChange={handleScheduleTypeChange}
                    style={{ verticalAlign: "middle" }}
                  />
                  <label
                    className="form-check-label mb-2"
                    style={{ lineHeight: "1.2" }}
                  >
                    Sales
                  </label>
                </div>
                <div
                  className="form-check d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="scheduleType"
                    checked={scheduleType === "Job Work"}
                    value="Job Work"
                    onChange={handleScheduleTypeChange}
                    style={{ verticalAlign: "middle" }}
                  />
                  <label
                    className="form-check-label mb-2"
                    style={{ lineHeight: "1.2" }}
                  >
                    Job Work
                  </label>
                </div>
              </div>
            </div>

            <div className="me-5 mt-5 mb-2 d-flex flex-row">
              <label className="form-label">Schedule Option</label>
              <div className="d-flex justify-content-center align-items-center">
                <div
                  className="form-check me-3 d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="scheduleOption"
                    value="Full Order"
                    checked={scheduleOption === "Full Order"}
                    onChange={handleScheduleOptionChange}
                    style={{ verticalAlign: "middle" }}
                  />
                  <label
                    className="form-check-label mb-2"
                    style={{ lineHeight: "1.2" }}
                  >
                    Full Order
                  </label>
                </div>
                <div
                  className="form-check d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="scheduleOption"
                    value="Partial Order"
                    onChange={handleScheduleOptionChange}
                    style={{ verticalAlign: "middle" }}
                  />
                  <label
                    className="form-check-label mb-2"
                    style={{ lineHeight: "1.2" }}
                  >
                    Partial Order
                  </label>
                </div>
              </div>
            </div> */}

            <div className="d-flex flex-column">
              {/* Schedule Type */}
              <div
                className="mb-3 d-flex align-items-center"
                style={{ gap: "15px", marginLeft: "50px" }}
              >
                <label className="form-label mb-0">Schedule Type</label>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "15px" }}
                >
                  <div
                    className="form-check d-flex align-items-center"
                    style={{ gap: "5px", marginLeft: "12px" }}
                  >
                    <input
                      className="form-check-input mt-3"
                      type="radio"
                      name="scheduleType"
                      value="Sales"
                      onChange={handleScheduleTypeChange}
                    />
                    <label className="form-check-label">Sales</label>
                  </div>
                  <div
                    className="form-check d-flex align-items-center"
                    style={{ gap: "5px", marginLeft: "30px" }}
                  >
                    <input
                      className="form-check-input mt-3"
                      type="radio"
                      name="scheduleType"
                      value="Job Work"
                      checked={scheduleType === "Job Work"}
                      onChange={handleScheduleTypeChange}
                    />
                    <label className="form-check-label">Job Work</label>
                  </div>
                </div>
              </div>

              {/* Schedule Option */}
              <div
                className="d-flex align-items-center"
                style={{ gap: "15px", marginLeft: "50px" }}
              >
                <label className="form-label mb-0">Schedule Option</label>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "15px" }}
                >
                  <div
                    className="form-check d-flex align-items-center"
                    style={{ gap: "5px" }}
                  >
                    <input
                      className="form-check-input mt-3"
                      type="radio"
                      name="scheduleOption"
                      value="Full Order"
                      checked={scheduleOption === "Full Order"}
                      onChange={handleScheduleOptionChange}
                    />
                    <label className="form-check-label">Full Order</label>
                  </div>
                  <div
                    className="form-check d-flex align-items-center"
                    style={{ gap: "5px" }}
                  >
                    <input
                      className="form-check-input mt-3"
                      type="radio"
                      name="scheduleOption"
                      value="Partial Order"
                      onChange={handleScheduleOptionChange}
                    />
                    <label className="form-check-label">Partial Order</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="me-3 mb-2" style={{ marginLeft: "70px" }}>
              <button className="button-style" onClick={onClickRefreshStatus}>
                Refresh Status
              </button>
            </div>

            <div className="me-3 mb-2">
              <button className="button-style" onClick={handleClearFilters}>
                Clear Filter
              </button>
            </div>

            <div className="mb-2">
              <button
                className="button-style"
                onClick={createSchedule}
                disabled={
                  OrderData?.Order_Status === "Closed" ||
                  OrderData?.Order_Status === "Cancelled" ||
                  OrderData?.Order_Status === "Dispatched" ||
                  OrderData?.Order_Status === "Suspended" ||
                  OrderData?.Order_Status === "Packed" ||
                  OrderData?.Order_Status === "Produced" ||
                  OrderData?.Order_Status === "Created" ||
                  OrderData?.Order_Status === "ShortClosed"
                }
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>

        <div className=" row mt-3 ">
          {/* <div className="col-md-1"></div> */}

          {/* <div className="col-md-6 justify-content-center"> */}
          {/* <div className="row"> */}
          {/* <div className="col-md-4 mt-3 col-sm-12">
                <button className="button-style" onClick={openFolder}>
                  Open Folder
                </button>
              </div> */}

          <div
            className="col-md-1 mt-3 col-sm-12"
            style={{ marginLeft: "420px" }}
          >
            <button className="button-style" onClick={fnCheckDxf}>
              Check DXF
            </button>
          </div>

          <div className="col-md-1 mt-3 col-sm-12">
            <button className="button-style" onClick={fnCopyDxf}>
              Copy DXF
            </button>
          </div>
          {/* </div> */}
          {/* </div> */}

          {/* <div className="col-md-5"></div> */}
        </div>
      </div>

      <AlertModal
        show={openShortClose}
        onHide={(e) => setOpenShortClose(e)}
        firstbutton={onClickYes}
        secondbutton={(e) => setOpenShortClose(e)}
        title="magod_Orders"
        message={`Do you wish to Reopen the Order?`}
        firstbuttontext="Yes"
        secondbuttontext="No"
      />
      <OkayModal smShow={smShow} setSmShow={setSmShow} message={modalMessage} />
    </>
  );
}
