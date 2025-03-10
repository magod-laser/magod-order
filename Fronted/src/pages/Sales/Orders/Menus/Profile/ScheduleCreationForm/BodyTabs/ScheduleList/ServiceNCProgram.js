import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

function ServiceNCProgram() {
  return (
    <div>
      <div className="row">
        <h4 className="title">Production Program No Allotment Form</h4>
        <div className="row">
          <h4>Production Program No Manager</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 sm-12">
          <div className="row mt-2">
            <div className="col-md-6 sm-12 ">
              <label className="form-label">Task No</label>
              <input type="text" />
            </div>
            <div className="col-md-6 sm-12">
              <label className="form-label">Status</label>
              <input type="text" />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-6 sm-12 ">
              <label className="form-label">Assy Name</label>
              <input type="text" />
            </div>
            <div className="col-md-6 sm-12">
              <label className="form-label">Operation</label>
              <input type="text" />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-6 sm-12 ">
              <label className="form-label">Task Quantity</label>
              <input type="text" />
            </div>
            <div className="col-md-6 sm-12">
              <label className="form-label">Material</label>
              <input type="text" />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-6 sm-12 ">
              <label className="form-label">Machine</label>
              <select id="" className="ip-select">
                <option value="option1"></option>
                <option value="option1">option 1</option>
                <option value="option2">option 2</option>
                <option value="option3">option 3</option>
              </select>
            </div>

            {/* <div className="col-md-6 sm-12 mt-3">
              <Link to="/Orders/Service/OrderSchedule">
                <button className="button-style">Close</button>
              </Link>
            </div> */}
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-2">
            <button className="button-style">Add Program</button>
          </div>
          <div className="col-md-2">
            <button className="button-style">Delete Program</button>
          </div>
          <div className="col-md-2">
            <button className="button-style">Save</button>
          </div>
          <div className="col-md-3">
            <button className="button-style" style={{ width: "250px" }}>
              Send to Material Issue
            </button>
          </div>
          <div className="col-md-3">
            <Link to="/Orders/Service/OrderSchedule">
              <button className="button-style">Close</button>
            </Link>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-4 sm-12 mt-3" style={{ overflowY: "scroll" }}>
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
              <tbody className="tablebody"></tbody>
            </Table>
          </div>
          <div className="col-md-8 mt-3" style={{ overflowY: "scroll" }}>
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
              {/* <tbody className="tablebody"></tbody> */}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceNCProgram;
