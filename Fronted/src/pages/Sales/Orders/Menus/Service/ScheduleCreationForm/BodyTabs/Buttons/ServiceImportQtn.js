import React from "react";
import { Tabs, Tab, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

function ServiceImportQtn() {
  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <h4 className="title">Quotation Import Form</h4>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Select Quotation No</label>
          <select id="" className="ip-select">
            <option value="option1">option 1</option>
            <option value="option2">option 2</option>
            <option value="option3">option 3</option>
          </select>
        </div>

        <div className="col-md-4 sm-12 ">
          <label className="form-label">Customer Name</label>
          <input className="mt-2" type="text" />
        </div>

        <div className="col-md-4 sm-12 ">
          <label className="form-label">Quotation Type</label>
          <input className="mt-2" type="text" />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Valid Up To</label>
          <input type="date" />
        </div>
        <div className="col-md-4 sm-12 mt-3">
          {/* <button className="button-style">Load Quotation</button> */}
          <Link to="/Orders/Service/ScheduleCreationForm">
            <button className="button-style">Load Quotation</button>
          </Link>
        </div>
      </div>

      <div className="row">
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className=" tab_font mt-4"
        >
          <Tab eventKey="profile" title="Profile" style={{ margin: "0px" }}>
            <div style={{ overflowY: "scroll" }}>
              <Table
                striped
                className="table-data border mt-2"
                style={{ border: "1px", height: "300px" }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th>Dwg_Name</th>
                    <th>Operation</th>
                    <th>Material</th>
                    <th>Qty</th>
                    <th>JW Rate</th>
                    <th>Mtrl Rate</th>
                    <th>Tolerance</th>
                    <th>Insp Level</th>
                  </tr>
                </thead>

                <tbody className="tablebody"></tbody>
              </Table>
            </div>
          </Tab>
          <Tab eventKey="service" title="Service">
            <div style={{ overflowY: "scroll" }}>
              <Table
                striped
                className="table-data border mt-2"
                style={{ border: "1px", height: "300px" }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>ID</th>
                    <th style={{ whiteSpace: "nowrap" }}>Qtn Id</th>
                    <th style={{ whiteSpace: "nowrap" }}>Name</th>
                    <th style={{ whiteSpace: "nowrap" }}>Material</th>
                    <th style={{ whiteSpace: "nowrap" }}>Operation</th>
                    <th style={{ whiteSpace: "nowrap" }}>Quantity</th>
                    <th style={{ whiteSpace: "nowrap" }}>Base Price</th>
                    <th style={{ whiteSpace: "nowrap" }}>Discount Amount</th>
                    <th style={{ whiteSpace: "nowrap" }}>Final Price</th>
                    <th style={{ whiteSpace: "nowrap" }}>Total Amount</th>
                  </tr>
                </thead>

                <tbody className="tablebody"></tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default ServiceImportQtn;
