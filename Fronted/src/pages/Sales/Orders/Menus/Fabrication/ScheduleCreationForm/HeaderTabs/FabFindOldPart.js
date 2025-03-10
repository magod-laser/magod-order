import React from "react";
import { Table } from "react-bootstrap";

function FabFindOldPart() {
  return (
    <div>
      <div className="row mt-3 mb-3">
        <div className="col-md-4 col-sm-12">
          <div className="row">
            <div className="col-md-5 mb-2 col-sm-12">
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Search Part Name
              </label>
            </div>
            <div className="col-md-7  mb-2 col-sm-12">
              <input type="text" className="mt-1" />
            </div>
          </div>
        </div>
      </div>
      <Table
        striped
        className="table-data border mt-2"
        style={{ border: "1px", height: "200px", overflowY: "scroll" }}
      >
        <thead className="tableHeaderBGColor">
          <tr>
            <th>DWG Name</th>
            <th>Material</th>
            <th>Operation</th>
            <th>Source</th>
            <th>Order No</th>
          </tr>
        </thead>
        <tbody className="tablebody"></tbody>
      </Table>
    </div>
  );
}

export default FabFindOldPart;
