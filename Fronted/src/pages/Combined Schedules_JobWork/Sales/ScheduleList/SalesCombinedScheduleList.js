import React from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function SalesCombinedScheduleList() {
  const navigate = useNavigate();
  return (
    <div>
      <h4 className="title">Combined Schedule List</h4>{" "}
      <div className="row mt-4 mb-1 ">
        <button
          className="button-style"
          onClick={() =>
            navigate(
              "/Orders/CombinedSchedules/Sales/ScheduleList/ScheduleDetails"
            )
          }
          style={{ width: "130px" }}
        >
          Open
        </button>
      </div>
      <div style={{ overflowY: "scroll" }}>
        <Table
          striped
          className="table-data border mt-2"
          style={{ border: "1px", height: "400px", overflowY: "scroll" }}
        >
          <thead className="tableHeaderBGColor">
            <tr>
              <th>Selected</th>
              <th>Schedule No</th>
              <th>Customer</th>
              <th>Target Date</th>
              <th>Delivary Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="tablebody"></tbody>
        </Table>
      </div>
    </div>
  );
}

export default SalesCombinedScheduleList;
