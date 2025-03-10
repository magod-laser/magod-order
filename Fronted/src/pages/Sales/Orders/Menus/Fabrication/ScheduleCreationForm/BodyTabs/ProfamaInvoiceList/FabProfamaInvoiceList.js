import React from "react";
import { Table } from "react-bootstrap";

function FabProfamaInvoiceList() {
  return (
    <div>
      <div className="row mt-3">
        <div className="col-md-2 col-sm-12">
          <button className="button-style ">Create Invoice</button>
        </div>
        <div className="col-md-2 col-sm-12">
          <button className="button-style ">Delete</button>
        </div>
        <div className="col-md-2 col-sm-12">
          <button className="button-style ">Open Invoice</button>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-3 col-md-12" style={{ overflowY: "scroll" }}>
          <Table
            striped
            className="table-data border mt-2"
            style={{ border: "1px", height: "400px" }}
          >
            <thead className="tableHeaderBGColor">
              <tr>
                <th>Inv Type</th>
                <th>Profarma Inv No</th>
                <th>Grand Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="tablebody"></tbody>
          </Table>
        </div>
        <div
          className="col-md-9 col-md-12"
          style={{ overflowY: "scroll", overflowX: "scroll" }}
        >
          <Table
            striped
            className="table-data border mt-2"
            style={{ border: "1px", height: "400px" }}
          >
            <thead className="tableHeaderBGColor">
              <tr>
                <th>Srl</th>
                <th style={{ whiteSpace: "nowrap" }}>Drawing Name</th>
                <th style={{ whiteSpace: "nowrap" }}>Material Code</th>
                <th>Quantity</th>
                <th style={{ whiteSpace: "nowrap" }}>Unit Rate</th>
                <th style={{ whiteSpace: "nowrap" }}>Profarma Deatil Id</th>
                <th style={{ whiteSpace: "nowrap" }}>Profarma Id</th>
                <th style={{ whiteSpace: "nowrap" }}>Profarma Srl</th>
                <th>Dwg_No</th>
                <th>Mtrl</th>
                <th>Qty</th>
                <th style={{ whiteSpace: "nowrap" }}>Unit Rate</th>
                <th style={{ whiteSpace: "nowrap" }}>Srl Amount</th>
                <th>Excise_CL_No</th>
              </tr>
            </thead>
            <tbody className="tablebody"></tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default FabProfamaInvoiceList;
