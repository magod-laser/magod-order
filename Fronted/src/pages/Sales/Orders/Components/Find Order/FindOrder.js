import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");
export default function FindOrder(props) {
  console.log("Type", props.Type);

  const [orderNoData, setorderNoData] = useState();
  const [selectedorderNo, setSelectedorderNo] = useState();
  useEffect(() => {
    async function fetchData() {
      await postRequest(
        endpoints.getOrderDataforFindOrder,
        { ordtype: props.Type },
        (FindOrderData) => {
          //console.log(FindOrderData);
          setorderNoData(FindOrderData);
        }
      );
    }
    fetchData();
  }, []);
  //console.log("orderNoData", orderNoData);

  return (
    <div>
      <div className="row">
        <h4 className="title">Find Order</h4>

        <div className="row">
          <div className="d-flex col-md-4 sm-12 mt-2" style={{gap:'10px'}}>
            <label className="form-label" style={{whiteSpace:'nowrap'}}>Order No</label>
            {/* <input type="text" /> */}
            {orderNoData?.length > 0 ? (
              <Typeahead
                className="ip-select"
                id="basic-example"
                options={orderNoData.map((item) => ({
                  label: item.Order_No,
                  value: item.Order_No,
                }))}
                placeholder="Select ..."
                onChange={(selected) => {
                  // Handle the selected item
                  //console.log("Selected order No", selected[0]?.value);
                  setSelectedorderNo(selected[0]?.value);
                }}
              />
            ) : (
              ""
            )}
          </div>
          <div className="col-md-7 sm-12">
            <Link
              to={
                props.Type === "Profile"
                  ? `/Orders/Profile/ScheduleCreationForm`
                  : props.Type === "Service"
                  ? `/Orders/Service/ScheduleCreationForm`
                  : props.Type === "Fabrication"
                  ? `/Orders/Fabrication/ScheduleCreationForm`
                  : null
              }
              state={selectedorderNo}
            >
              <button
                className={
                  selectedorderNo
                    ? "button-style"
                    : "button-style button-disabled"
                }
                disabled={!selectedorderNo}
                
              >
                Open
              </button>
            </Link>
          </div>
          <div className="col-md-1 sm-12">
            <Link to={"/Orders"}>
              <button className="button-style" style={{float:'right'}}>Close</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
