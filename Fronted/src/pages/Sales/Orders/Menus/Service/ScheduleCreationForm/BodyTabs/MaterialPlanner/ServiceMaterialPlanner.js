import React from "react";
import { Form, Table } from "react-bootstrap";

function ServiceMaterialPlanner() {
  return (
    <div>
      <div className="row mt-3">
        <div className="col-md-2 col-sm-12">
          <button className="button-style "> Create DXF WS</button>
        </div>
        <div className="col-md-2 col-sm-12">
          <button className="button-style ">Create Parts WS</button>
        </div>
        <div className="col-md-2 col-sm-12">
          <button className="button-style ">Read WS</button>
        </div>
        <div className="col-md-2 col-sm-12">
          <button className="button-style ">Print Estimate</button>
        </div>
        <div style={{ overflowY: "scroll" }}>
          <Table
            striped
            className="table-data border mt-4"
            style={{ border: "1px", height: "400px" }}
          >
            <thead className="tableHeaderBGColor">
              <tr>
                <th>Task No</th>
                <th>Material</th>
                <th>Source</th>
                <th>Operation</th>
                <th>Dwgs</th>
                <th>Total Parts</th>
              </tr>
            </thead>
            <tbody className="tablebody"></tbody>
          </Table>
        </div>

        <div className="row">
          <div className="col-md-4 col-sm-12">
            <Table
              striped
              className="table-data border mt-2"
              style={{ border: "1px", height: "200px", overflowY: "scroll" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th>Length(mm)</th>
                  <th>Width(mm)</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody className="tablebody"></tbody>
            </Table>
          </div>
          <div className="col-md-4 col-sm-12">
            <Form>
              <div className="ip-box form-bg">
                <div className="row ">
                  <div className="col-md-4 col-sm-12">
                    <label className=" form-label">Task No</label>
                    <label className=" form-label mt-1">Length</label>
                    <label className="form-label mt-3">Width</label>
                    <label className=" form-label mt-3">Quantity</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h4>Task No</h4>
                    <input className="mt-2 in-fields" type="text" />
                    <input className="mt-3 in-fields" type="text" />
                    <input className="mt-3 mb-4 in-fields" type="text" />
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceMaterialPlanner;
