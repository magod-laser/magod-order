import React from "react";
import { Form, FormLabel, Table } from "react-bootstrap";

function CombinedScheduleDetails() {
  return (
    <div>
      <div className="row">
        <div className="row">
          <div className="col-md-4 sm-12 ">
            <FormLabel>No</FormLabel>
            <input type="text" />
          </div>
          <div className="col-md-4 sm-12 ">
            <FormLabel>Customer</FormLabel>
            <input type="text" />
          </div>
          <div className="col-md-4 sm-12 ">
            <FormLabel>Sales Contact</FormLabel>
            <input type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 sm-12 ">
            <FormLabel>Type</FormLabel>
            <input type="text" />
          </div>
          <div className="col-md-4 sm-12 ">
            <FormLabel>PO No</FormLabel>
            <input type="text" />
          </div>
          <div className="col-md-4 sm-12 ">
            <FormLabel>Target Date</FormLabel>
            <input type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 sm-12 ">
            <FormLabel>Status</FormLabel>
            <input type="text" />
          </div>
          <div className="col-md-4 sm-12 ">
            <FormLabel>Instruction</FormLabel>
            <input type="text" />
          </div>
          <div className="col-md-4 sm-12 ">
            <FormLabel>Delivery Date</FormLabel>
            <input type="date" />
          </div>
          <div className="col-md-4 mb-2 col-sm-12">
            <label className="form-label"> Dealing Engineer</label>
            <select id="gstpan" className="ip-select">
              <option value="Select">option 1</option>

              <option value="GST">option 2</option>

              <option value="PAN">option 3</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className=" mt-4">
            <div style={{ height: "400px", overflowY: "scroll" }}>
              <Table
                striped
                className="table-data border"
                style={{ border: "1px" }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th>DwgName</th>
                    <th>Mtrl_Code</th>
                    <th>MProcess</th>
                    <th>Operation</th>
                    <th>QtyScheduled</th>
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

export default CombinedScheduleDetails;
