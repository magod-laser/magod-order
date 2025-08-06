import React from "react";
import { Table  } from "react-bootstrap";

export default function MainTable(props) {
  return (
    <>
      <Table striped className="table-data border" style={{ border: "1px" }}>
        <thead className="tableHeaderBGColor">
          <tr>
            <th>Inv Type</th>
            <th>Proforma Inv No</th>
            <th>Grand Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="tablebody">
          {props.profarmaInvMain?.map((val, key) => (
            <tr
              className={
                props.selectedProfarmaMainRow.ProfarmaID === val.ProfarmaID
                  ? "rowSelectedClass"
                  : ""
              }
              onClick={(e) => {
                props.filterDetailsRow(val);
              }}
            >
              <td>{val.InvType}</td>
              <td>{val.ProformaInvNo}</td>
              {/* {val.InvType === "Job Work" ?  <td>{val.GrandTotal}</td> :  <td>{val.GrandTotal}</td> } */}
              <td>{val.GrandTotal}</td>
              <td>{val.Status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
