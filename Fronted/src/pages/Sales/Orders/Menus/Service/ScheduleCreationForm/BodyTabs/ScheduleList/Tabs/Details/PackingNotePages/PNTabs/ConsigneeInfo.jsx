import React from "react";

export default function ConsigneeInfo(props) {
  return (
    <>
      <div>
        {/* first row */}
        <div className="row">
          <div className="col-md-6">
            <b>Address</b>
            <textarea
              rows="5"
              style={{ width: "100%" }}
              value={
                props.invRegisterData?.Cust_Address === null ||
                props.invRegisterData?.Cust_Address === "null" ||
                props.invRegisterData?.Cust_Address === undefined ||
                props.invRegisterData?.Cust_Address === "undefined" ||
                props.invRegisterData?.Cust_Address === ""
                  ? ""
                  : props.invRegisterData?.Cust_Address
              }
              name="Cust_Address"
              disabled
              className="input-disabled"
            ></textarea>
          </div>
          <div className="col-md-6">
            <b>Delivery</b>
            <textarea
              rows="5"
              maxLength={"199"}
              style={{ width: "100%" }}
              value={
                props.invRegisterData?.Del_Address === null ||
                props.invRegisterData?.Del_Address === "null" ||
                props.invRegisterData?.Del_Address === undefined ||
                props.invRegisterData?.Del_Address === "undefined" ||
                props.invRegisterData?.Del_Address === ""
                  ? ""
                  : props.invRegisterData?.Del_Address
              }
              name="Del_Address"
              onChange={props.inputHandler}
              disabled={
                props.invRegisterData.Inv_No ||
                props.invRegisterData.DCStatus === "Cancelled"
              }
              className={
                props.invRegisterData.Inv_No ||
                props.invRegisterData.DCStatus === "Cancelled"
                  ? "input-disabled"
                  : ""
              }
            ></textarea>
          </div>
        </div>
        {/* second row */}
        <div className="row">
          <div className="col-md-6 p-0">
            <div className="row ">
              <div className="col-md-4">
                <b>District</b>
                <input
                  value={props.invRegisterData?.Cust_Place}
                  name="Cust_Place"
                  disabled
                  className="input-disabled"
                />
              </div>
              <div className="col-md-4">
                <b>State</b>
                <input
                  value={props.invRegisterData.Cust_State}
                  disabled
                  className="input-disabled"
                />
              </div>
              <div className="col-md-4">
                <b>Pin Code</b>
                <input
                  type="number"
                  min="0"
                  value={
                    props.invRegisterData?.PIN_Code === null ||
                    props.invRegisterData?.PIN_Code === "null" ||
                    props.invRegisterData?.PIN_Code === undefined ||
                    props.invRegisterData?.PIN_Code === "undefined" ||
                    props.invRegisterData?.PIN_Code === ""
                      ? ""
                      : props.invRegisterData?.PIN_Code
                  }
                  name="PIN_Code"
                  disabled
                  className="input-disabled"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6 p-0">
                <b>GST No</b>
                <input
                  value={
                    props.invRegisterData?.GSTNo === null ||
                    props.invRegisterData?.GSTNo === "null" ||
                    props.invRegisterData?.GSTNo === undefined ||
                    props.invRegisterData?.GSTNo === "undefined" ||
                    props.invRegisterData?.GSTNo === ""
                      ? ""
                      : props.invRegisterData?.GSTNo
                  }
                  disabled
                  className="input-disabled"
                />
              </div>
              <div className="col-md-6">
                <b>GST State</b>
                <input
                  value={
                    props.invRegisterData?.Cust_State === null ||
                    props.invRegisterData?.Cust_State === "null" ||
                    props.invRegisterData?.Cust_State === undefined ||
                    props.invRegisterData?.Cust_State === "undefined" ||
                    props.invRegisterData?.Cust_State === ""
                      ? ""
                      : props.invRegisterData?.Cust_State
                  }
                  disabled
                  className="input-disabled"
                />
              </div>
            </div>
          </div>
        </div>
        {/* third row */}
        <div className="row">
          <b>Schedule Intructions</b>
          <div className="col-md-12">
            <textarea
              id=""
              maxLength={"49"}
              style={{ width: "100%" }}
              name="Special_Instructions"
              value={props.invRegisterData.Special_Instructions}
              onChange={props.inputHandler}
              disabled={
                props.invRegisterData.Inv_No ||
                props.invRegisterData.DCStatus === "Cancelled"
              }
              className={
                props.invRegisterData.Inv_No ||
                props.invRegisterData.DCStatus === "Cancelled"
                  ? "input-disabled"
                  : ""
              }
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}
