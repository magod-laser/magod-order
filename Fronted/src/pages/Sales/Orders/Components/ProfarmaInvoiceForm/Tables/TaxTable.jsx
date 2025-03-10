import React from "react";
import { Button, Table } from "react-bootstrap";

export default function TaxTable(props) {
  // console.log("props in tax table", props);
  return (
    <>
      <Table striped className="table-data border" style={{ border: "1px" }}>
        <thead className="tableHeaderBGColor">
          <tr>
            <th>Tax Name</th>
            <th>Taxable Amount</th>
            <th>Tax Percent</th>
            <th>Tax Amount</th>
          </tr>
        </thead>
        <tbody className="tablebody">
          {props.profarmaTaxData?.map((val, key) => (
            <>
              <tr>
                <td>{val.Tax_Name}</td>
                <td>{val.TaxableAmount}</td>
                <td>{val.TaxPercent}</td>
                <td>{val.TaxAmt}</td>
              </tr>
            </>
          ))}
        </tbody>
      </Table>
    </>
  );
}
