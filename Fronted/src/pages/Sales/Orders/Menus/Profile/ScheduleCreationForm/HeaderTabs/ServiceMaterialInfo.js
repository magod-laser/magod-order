import React from "react";
import { Table } from "react-bootstrap";

function ServiceMaterialInfo() {
  return (
    <div>
      <div className="row mt-3">
        <div className="col-md-4 col-sm-12">
          <h5>
            {" "}
            <b style={{ whiteSpace: "nowrap" }}>Stock Position</b>
          </h5>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <button className="button-style" style={{ width: "100px" }}>
                Load
              </button>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="row">
                <div className="col-md-5 mt-3 col-sm-12">
                  <input
                    style={{ width: "50px" }}
                    type="checkbox"
                    className="checkBoxStyle"
                  />
                </div>
                <div className="col-md-7 mt-1 col-sm-12">
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Magod Laser
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            className="mt-3"
            style={{ overflowY: "scroll", overflowX: "scroll" }}
          >
            <Table
              striped
              className="table-data border"
              style={{
                border: "1px",
                height: "200px",
              }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th>Material</th>
                  <th>Width</th>
                  <th>Length</th>
                  <th style={{ whiteSpace: "nowrap" }}>In Stock</th>
                  <th>Locked</th>
                  <th>Scrap</th>
                </tr>
              </thead>
              <tbody className="tablebody"></tbody>
            </Table>
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <h5>
            <b>Arrival</b>
          </h5>
          <div>
            <button className="button-style" style={{ width: "100px" }}>
              Load
            </button>
          </div>
          <div
            className="mt-3"
            style={{ overflowY: "scroll", overflowX: "scroll" }}
          >
            <Table
              striped
              className="table-data border"
              style={{
                border: "1px",
                height: "200px",
              }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>Cust Docu No</th>
                  <th style={{ whiteSpace: "nowrap" }}>RV No</th>
                  <th>Date</th>
                  <th style={{ whiteSpace: "nowrap" }}>Up Dated</th>
                </tr>
              </thead>
              <tbody className="tablebody"></tbody>
            </Table>
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <br></br>
          <br></br>
          <div
            className="mt-5"
            style={{
              overflowX: "scroll",
              overflowY: "scroll",
            }}
          >
            <Table
              striped
              className="table-data border"
              style={{ border: "1px", height: "200px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>Mtrl Code</th>
                  <th style={{ whiteSpace: "nowrap" }}>Length</th>
                  <th style={{ whiteSpace: "nowrap" }}>Width</th>
                  <th style={{ whiteSpace: "nowrap" }}>Quantity</th>
                  <th style={{ whiteSpace: "nowrap" }}>Up Dated</th>
                  {/* <th style={{ whiteSpace: "nowrap" }}>Order No</th> */}
                </tr>
              </thead>
              <tbody className="tablebody"></tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceMaterialInfo;
