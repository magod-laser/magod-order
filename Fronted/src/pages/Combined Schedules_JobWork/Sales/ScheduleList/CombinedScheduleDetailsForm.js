import React from "react";
import { Table, Tab, Tabs } from "react-bootstrap";
function CombinedScheduleDetailsForm() {
  return (
    <div>
      <h4 className="title">Combined Schedule Details Form</h4>
      <div className="ip-box">
        <div className="row">
          <div className="col-md-4 mb-2 col-sm-12">
            <label className="form-label">No</label>
            <input class="" type="text" style={{ borderRadius: "0" }} />
          </div>
          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label">Customer</label>
            <input class="" type="text" style={{ borderRadius: "0" }} />
          </div>
          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label"> Sales Contact</label>
            <input class="" type="text" style={{ borderRadius: "0" }} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-2 col-sm-12">
            <label className="form-label">Type</label>
            <input class="" type="text" style={{ borderRadius: "0" }} />
          </div>
          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label">PO No</label>
            <input class="" type="text" style={{ borderRadius: "0" }} />
          </div>
          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label"> Target Date</label>
            <input class="" type="text" style={{ borderRadius: "0" }} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-2 col-sm-12">
            <label className="form-label">Status</label>
            <input class="" type="text" style={{ borderRadius: "0" }} />
          </div>
          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label">Instruction</label>
            <input class="" type="text" style={{ borderRadius: "0" }} />
          </div>
          <div className="col-md-4  mb-2 col-sm-12">
            <label className="form-label"> Delivery Date</label>
            <input className="mt-1" name="UnistallDate" type="date" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-2 col-sm-12">
            <label className="form-label"> Dealing Engineer</label>
            <select id="gstpan" className="ip-select">
              <option value="Select">option 1</option>

              <option value="GST">option 2</option>

              <option value="PAN">option 3</option>
            </select>
          </div>
        </div>
      </div>
      <div
        className="row justify-content-center mt-5"
        style={{ display: "flex" }}
      >
        <button className="button-style" style={{ width: "60px" }}>
          Save
        </button>
        <button className="button-style" style={{ width: "150px" }}>
          Distribute Parts
        </button>
        <button className="button-style" style={{ width: "270px" }}>
          Update To Original Schedule
        </button>
        <button className="button-style" style={{ width: "120px" }}>
          Short Close
        </button>
        <button className="button-style" style={{ width: "80px" }}>
          Cancel
        </button>
        <button className="button-style" style={{ width: "130px" }}>
          Open Folder
        </button>
        <button className="button-style" style={{ width: "150px" }}>
          Copy Drawings
        </button>
        <button className="button-style" style={{ width: "60px" }}>
          Print
        </button>
        {/* <button className="button-style" style={{ width: "170px" }}>
          NC Programming
        </button> */}
      </div>

      <Tabs className=" tab_font mt-4">
        <Tab eventKey="" title="Schedule Details">
          <div className="row">
            <div className="col-md-8">
              {" "}
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
                  <tbody className="tablebody"></tbody>
                </Table>
              </div>
            </div>
            <div className="col-md-4">
              {" "}
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
                      <th>Selected</th>
                      <th>Schedule</th>
                      <th>Scheduled</th>
                      <th>Cleared</th>
                      <th>Distributed</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody"></tbody>
                </Table>
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="combinedScheduleDetails" title="Combined Tasks">
          <button
            className="button-style"
            style={{ width: "200px", marginLeft: "15px" }}
          >
            Update Task
          </button>
          <div className="row">
            <div className="col-md-8">
              <div style={{ height: "400px", overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor tablebody">
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
                  <tbody className="tablebody"></tbody>
                </Table>
              </div>
              <div
                style={{ height: "250px", width: "400px", overflowY: "scroll" }}
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
                  <thead className="tableHeaderBGColor tablebody">
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
              {" "}
              <div style={{ height: "650px", overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor tablebody">
                    <tr>
                      <th>Dwg Name</th>
                      <th>Qty To Nest</th>
                      <th>Qty Nested</th>
                      <th>Qty Produced</th>
                      <th>Qty Cleared</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody"></tbody>
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
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor tablebody">
                    <tr>
                      <th>OrderSrcNo</th>
                      <th>Delivery Date</th>
                      <th>Schedule Status</th>
                      <th>PO</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody"></tbody>
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
                  <thead className="tableHeaderBGColor tablebody">
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
                  <tbody className="tablebody"></tbody>
                </Table>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default CombinedScheduleDetailsForm;
