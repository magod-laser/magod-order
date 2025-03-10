import React from "react";
import { Table } from "react-bootstrap";

function PrepareSchedule() {
  return (
    <div className="row">
      <div className="col-md-6 ">
        <div className="row mt-3">
          <button className="button-style  " style={{ width: "100px" }}>
            Select All
          </button>
          <button className="button-style  " style={{ width: "90px" }}>
            Revers
          </button>
          <button className="button-style  " style={{ width: "50px" }}>
            {">>"}
          </button>
          <button className="button-style  " style={{ width: "170px" }}>
            Prepare Schedule
          </button>
          <button className="button-style  " style={{ width: "160px" }}>
            Create Schedule
          </button>
        </div>
        <div className="row">
          <div
            className="mt-4"
            style={{ height: "300px", overflowY: "scroll" }}
          >
            <Table
              striped
              className="table-data border"
              style={{ border: "1px" }}
            >
              <thead className="tableHeaderBGColor tablebody">
                <tr>
                  <th>Select</th>
                  <th>TaskNo</th>
                  <th style={{ whiteSpace: "nowrap" }}>Cust_ Name</th>
                  <th>Mtrl_Code</th>
                  <th>NoOfDwgs</th>
                  <th>TotalParts</th>
                  <th>Operation</th>
                </tr>
              </thead>

              <tbody className="tablebody"></tbody>
            </Table>
          </div>
        </div>

        <div className="row">
          <div
            className="mt-4"
            style={{ height: "400px", overflowY: "scroll" }}
          >
            <Table
              striped
              className="table-data border"
              style={{ border: "1px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th>DwgName</th>
                  <th>Quantity</th>
                  <th>DwgStatus</th>
                  <th>Task_Part_ID</th>
                  <th>NcTaskId</th>
                  <th>TaskNo</th>
                  <th>ScheduleID</th>
                  <th>SchDetailsId</th>
                  <th>PartID</th>
                  <th>DwgName</th>
                  <th>QtyToNest</th>
                  <th>QtyToNest</th>
                  <th>QtyNested</th>
                  <th>QtyProduced</th>
                  <th>QtyCleared</th>
                  <th>Remarks</th>
                  <th>LOC</th>
                  <th>Pierces</th>
                  <th>Part_Area</th>
                  <th>Unit_Wt</th>
                  <th>QtnDetailId</th>
                  <th>OutOpen</th>
                  <th>DwgStatus</th>
                  <th>InspLevel</th>
                </tr>
              </thead>

              <tbody className="tablebody"></tbody>
            </Table>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <h5 className="mt-2">
          <b>Task Type</b>
        </h5>
        <div className="row mt-3">
          <button className="button-style  " style={{ width: "50px" }}>
            {"<<"}
          </button>

          <button className="button-style  " style={{ width: "130px" }}>
            Select All
          </button>

          <button className="button-style  " style={{ width: "100px" }}>
            Revers
          </button>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <div style={{ height: "650px", overflowY: "scroll" }}>
              <Table
                striped
                className="table-data border"
                style={{ border: "1px" }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th>Select</th>
                    <th>TaskNo</th>
                    <th>Dwgs</th>
                    <th>Parts</th>
                    <th>Cust_Name</th>
                  </tr>
                </thead>

                <tbody className="tablebody"></tbody>
              </Table>
            </div>
          </div>

          <div className="col-md-6 cmt-3">
            <div style={{ height: "650px", overflowY: "scroll" }}>
              <Table
                striped
                className="table-data border"
                style={{ border: "1px" }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th>Material</th>
                    <th>Operation</th>
                    <th>Dwgs</th>
                    <th>TotalParts</th>
                  </tr>
                </thead>

                <tbody className="tablebody"></tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrepareSchedule;
