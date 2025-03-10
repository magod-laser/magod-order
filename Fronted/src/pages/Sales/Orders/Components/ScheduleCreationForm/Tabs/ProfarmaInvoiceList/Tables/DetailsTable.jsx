import React from "react";
import { Tab, Table, Tabs, Form } from "react-bootstrap";

export default function DetailsTable(props) {
  return (
    <>
      <Table striped className="table-data border" style={{ border: "1px" }}>
        <thead className="tableHeaderBGColor">
          <tr className="label-space">
            <th>Srl</th>
            <th>Drawing Name</th>
            <th>Material Code</th>
            <th>Quantity</th>
            <th>Unit Rate</th>
            <th>Proforma Detail Id</th>
            <th>Proforma Id</th>
            <th>Proforma Srl</th>
            <th>Dwg_No</th>
            <th>Mtrl</th>
            <th>Qty</th>
            <th>Unit Rate</th>
            <th>Srl Amount</th>
            <th>Excise CL No</th>
          </tr>
        </thead>
        <tbody className="tablebody">
          {props.filteredDetailsData?.map((val, key) => (
            <tr>
              <td>{key + 1}</td>
              <td>{val.Dwg_No}</td>
              <td>{val.Mtrl}</td>
              <td>{val.Qty}</td>
              <td>{parseFloat(val.Unit_Rate).toFixed(2)}</td>
              <td>{val.ProfarmaDetailID}</td>
              <td>{val.ProfarmaID}</td>
              <td>{val.ProFarmaSrl}</td>
              <td>{val.Dwg_No}</td>
              <td>{val.Mtrl}</td>
              <td>{val.Qty}</td>
              <td>{parseFloat(val.Unit_Rate).toFixed(2)}</td>
              <td>
                {(
                  parseFloat(val.DC_Srl_Amt) ||
                  parseFloat(val.Qty) * parseFloat(val.Unit_Rate)
                ).toFixed(2)}
              </td>
              <td>{val.Excise_CL_no}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
