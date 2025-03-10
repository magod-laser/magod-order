import React from "react";
import { Table } from "react-bootstrap";

export default function RegisterTable(props) {
  return (
    <>
      <Table striped className="table-data border" style={{ border: "1px" }}>
        <thead className="tableHeaderBGColor">
          <tr>
            <th>PN No</th>
            <th>PN Date</th>
            <th>Inv No</th>
            <th>Inv Date</th>
            <th>Grand Total</th>
            <th>Received</th>
            <th>Total_Wt</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="tablebody">
          {props.PNAndInvRegisterData?.map((val, key) => (
            <tr
              className={
                val.DC_Inv_No === props.registerSelectedRow.DC_Inv_No
                  ? "rowSelectedClass"
                  : ""
              }
              onClick={() => {
                if (val.DC_Inv_No === props.registerSelectedRow.DC_Inv_No) {
                  props.setRegisterSelectedRow({});
                  props.setFilteredDetailsData([]);
                } else {
                  // console.log("vallll", val);
                  props.setRegisterSelectedRow(val);
                  const arr = props.PNAndInvDetailsData.filter(
                    (obj) => obj.DC_Inv_No === val.DC_Inv_No
                  );

                  props.setFilteredDetailsData(arr);
                }
              }}
            >
              <td>{val.DC_No}</td>
              <td>{val.Printable_Dc_inv_Date}</td>
              <td>{val.Inv_No}</td>
              <td>{val.Printable_Inv_Date}</td>
              <td>{parseFloat(val.GrandTotal).toFixed(2)}</td>
              <td>{parseFloat(val.PymtAmtRecd).toFixed(2)}</td>
              <td>{parseFloat(val.Total_Wt).toFixed(3)}</td>
              <td>{val.DCStatus}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
