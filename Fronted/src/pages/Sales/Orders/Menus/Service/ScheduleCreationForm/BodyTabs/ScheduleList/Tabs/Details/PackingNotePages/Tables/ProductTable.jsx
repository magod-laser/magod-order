import React, { useState } from "react";
import { Form, Tab, Table, Tabs } from "react-bootstrap";

export default function ProductTable(props) {
  return (
    <div>
      <Table striped className="table-data border" style={{ border: "1px" }}>
        <thead className="tableHeaderBGColor">
          <tr>
            <th>Drawing Name</th>
            <th>Material</th>
            <th>Quantity</th>
            <th>Unit Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody className="tablebody">
          {props.invDetailsData.map((val, i) => (
            <tr>
              <td>{val.Dwg_No}</td>
              <td>{val.Mtrl}</td>
              <td>{val.Qty}</td>
              {props.loadRateEvent ? (
                <>
                  <td>
                    {(
                      parseFloat(val.JW_Rate) + parseFloat(val.Mtrl_rate)
                    ).toFixed(2)}
                  </td>
                  <td>
                    {(
                      parseFloat(val.Qty) *
                      (parseFloat(val.JW_Rate) + parseFloat(val.Mtrl_rate))
                    ).toFixed(2)}
                  </td>
                </>
              ) : (
                <>
                  <td>---</td>
                  <td>---</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
