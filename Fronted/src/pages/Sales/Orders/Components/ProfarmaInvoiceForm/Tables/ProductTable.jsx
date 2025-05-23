import React from "react";
import { Button, Table } from "react-bootstrap";
export default function ProductTable(props) {
  return (
    <>
      <Table striped className="table-data border" style={{ border: "1px" }}>
        <thead className="tableHeaderBGColor">
          <tr>
            <th>Srl No</th>
            <th>Drawing No</th>
            <th>Material</th>
            <th>Quantity</th>
            <th>Unit Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody className="tablebody">
          {props.profarmaDetailsData?.map((val, key) => (
            <>
              <tr>
                <td>{key + 1}</td>
                <td>{val.Dwg_No}</td>
                <td>{val.Mtrl}</td>
                <td>
                  <input
                    type="text"
                    value={val.Qty}
                    min="1"
                    step="1" // Prevent decimals
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                    }}
                    disabled={props.profarmaMainData?.ProformaInvNo}
                    className={
                      props.profarmaMainData?.ProformaInvNo
                        ? "input-disabled"
                        : ""
                    }
                    // onChange={(e) => {
                    //   props.changeQTY(key, e.target.value || 0);
                    // }}
                    onChange={(e) => {
                      const inputValue = e.target.value;

                      // Allow only whole positive integers >= 1
                      if (/^[1-9]\d*$/.test(inputValue) || inputValue === "") {
                        props.changeQTY(key, inputValue);
                      }
                    }}
                  />

                  {/* {val.Qty} */}
                </td>
                <td>{parseFloat(val.Unit_Rate).toFixed(2)}</td>
                <td>
                  {(
                    parseFloat(val.DC_Srl_Amt) ||
                    parseFloat(val.Qty) * parseFloat(val.Unit_Rate)
                  ).toFixed(2)}
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </Table>
    </>
  );
}
