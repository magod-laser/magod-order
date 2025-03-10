/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Table, Tabs, Form } from "react-bootstrap";
import { endpoints } from "../../../../../../api/constants";
import { getRequest, postRequest } from "../../../../../../api/apiinstance";
import AlertModal from "../../../../Menus/Service/Components/Alert";
import { ToastContainer, toast } from "react-toastify";

export default function ProductionScheduleCreation({
  OrderData,
  selectedItems,
  setScheduleListData,
  handleScheduleOptionChange,
  handleScheduleTypeChange,
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

  useEffect(() => {
    if (OrderData && scheduleType) {
      fetchScheduleList(scheduleType);
    }
  }, [OrderData, scheduleType]);

  console.log("OrderData",OrderData);
  
  //onclick Refresh Status
  const onClickRefreshStatus = () => {
    toast.success("Status Updated", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  //Onclick Create Schedule
  const createSchedule = () => {
    if (selectedItems.length === 0 && scheduleOption === "Partial Order") {
      toast.warning("Select Parts to add to Schedule", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      let filteredItems;

      console.log(
        "scheduleOption is",
        scheduleOption,
        "scheduleType is",
        scheduleType
      );

      if (scheduleType === "Job Work") {
        if (scheduleOption === "Full Order") {
          filteredItems = OrdrDetailsData.filter(
            (item) => item.Mtrl_Source === "Customer"
          );
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
        } else if (scheduleOption === "Partial Order") {
          filteredItems = selectedItems.filter(
            (item) => item.Mtrl_Source === "Magod"
          );
        }
      }

      console.log("filteredItems is", filteredItems);

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
      
        console.log("arr...", arr);
      
        // Check if the selected item's Operation exists in arr
        const allOperations = arr.map((proc) => proc.Operation);
        
        const hasValidOperation = filteredItems2.every(item =>
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
      
          console.log("all Material List: ", materialArr);
          console.log("all Material Codes: ", materialArr.map(mtrl => mtrl.Mtrl_Code));
      
          // Check if the selected item's mtrl_code exists in materialArr
          // const allMtrlCodes = materialArr.map((mtrl) => mtrl === mtrl.Mtrl_Code);
      
          const allMtrlCodes = materialArr.map((mtrl) => mtrl.Mtrl_Code);

          const hasValidMtrlCode = filteredItems2.every((item) => {
            console.log("all checking item:", item); // Log each item in filteredItems2
            console.log("all Mtrl_Code in item:", item.Mtrl_Code);
            return allMtrlCodes.includes(item.Mtrl_Code);
          });
          
            if (!hasValidMtrlCode) {
            toast.warning("Material Code is not matching", {
              position: toast.POSITION.TOP_CENTER,
            });
            return; // Exit if material code does not match
          }
      
          postRequest(
            endpoints.CreateProductionSchedule,
            {
              OrderData,
              scheduleType: scheduleType,
              selectedItems: filteredItems2,
              scheduleOption: scheduleOption,
              filteredItems:filteredItems
              
            },
            (response) => {
              if (response.message === "Draft Schedule Created") {
                toast.success(response.message, {
                  position: toast.POSITION.TOP_CENTER,
                });
                postRequest(
                  endpoints.getScheduleListData,
                  { Order_No: OrderData.Order_No },
                  (response) => {
                    console.log("response");
                    setScheduleListData(response);
                  }
                );
              } else {
                toast.warning(response.message, {
                  position: toast.POSITION.TOP_CENTER,
                });
              }
            }
          );
        });
      })

     

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
    clearAllSelections();
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
      <div className="">
        <div className="row">
          <div className="col-md-2 col-sm-12">
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

          <div className="col-md-4 col-sm-12">
            <label className="form-label">Schedule Type</label>

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="row">
                  <div
                    className="col-md-2 col-sm-12"
                    style={{ marginLeft: "1px" }}
                  >
                    <input
                      class="form-check-input"
                      type="radio"
                      name="scheduleType"
                      value="Sales"
                      onChange={handleScheduleTypeChange}
                    />
                  </div>
                  <div
                    className="col-md-2 col-sm-12"
                    style={{ marginTop: "-8px" }}
                  >
                    <label className="form-label">Sales</label>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="d-flex" style={{ marginLeft: "13px" }}>
                  <div className="col-md-2 col-sm-12">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="scheduleType"
                      checked={scheduleType === "Job Work"}
                      value="Job Work"
                      onChange={handleScheduleTypeChange}
                    />
                  </div>
                  <div
                    className="col-md-2 col-sm-12"
                    style={{ marginTop: "-8px" }}
                  >
                    <label className="form-label label-space">Job Work</label>
                  </div>
                </div>
              </div>
            </div>

            <label className="form-label">Schedule Option</label>

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="row">
                  <div className="col-md-2 col-sm-12">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="scheduleOption"
                      value="Full Order"
                      checked={scheduleOption === "Full Order"}
                      onChange={handleScheduleOptionChange}
                    />
                  </div>
                  <div
                    className="col-md-2 col-sm-12"
                    style={{ marginTop: "-8px" }}
                  >
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Full Order
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="row">
                  <div className="col-md-2 col-sm-12">
                    <input
                      type="radio"
                      class="form-check-input"
                      name="scheduleOption"
                      value="Partial Order"
                      onChange={handleScheduleOptionChange}
                    />
                  </div>
                  <div
                    className="col-md-2 col-sm-12"
                    style={{ marginTop: "-8px" }}
                  >
                    <label className="form-label label-space">
                      Partial Order
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-sm-12">
            <button className="button-style " onClick={onClickRefreshStatus}>
              Refresh Status
            </button>

            <button className="button-style">Clear Filter</button>

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

        <div className="col-md-12 row">
          <div className="col-md-1"></div>

          <div className="col-md-6">
            <div className="row">
              {/* <div className="col-md-4 mt-3 col-sm-12">
                <button className="button-style" onClick={openFolder}>
                  Open Folder
                </button>
              </div> */}
              {/* 
              <div className="col-md-4 mt-3 col-sm-12">
                <button className="button-style">Check DXF</button>
              </div>

              <div className="col-md-4 mt-3 col-sm-12">
                <button className="button-style">Copy DXF</button>
              </div> */}
            </div>
          </div>

          <div className="col-md-5"></div>
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
    </>
  );
}
