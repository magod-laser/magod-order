import React from "react";
import { Table } from "react-bootstrap";

export default function DetailTable(props) {
  return (
    <>
      <Table
        striped
        className="table-data border"
        style={{ border: "1px", overflow: "auto" }}
      >
        <thead className="tableHeaderBGColor">
          <tr className="label-space">
            <th>Drawing Name</th>
            <th>Material</th>
            <th>Quantity</th>
            <th>Mtrl Value</th>
            <th>JW Value</th>
            <th>Draft_dc_inv_Details</th>
            <th>DC_Inv_No</th>
            <th>DC_Inv_Srl</th>
            <th>ScheduleID</th>
            <th>OrderSchDetailsID</th>
            <th>Cust_Code</th>
            <th>Dwg_Code</th>
            <th>Dwg_No</th>
            <th>Mtrl</th>
            <th>Material</th>
            <th>Qty</th>
            <th>QtyReturned</th>
            <th>UOM</th>
            <th>Unit_Wt</th>
            <th>DC_Srl_Wt</th>
            <th>WtReturned</th>
            <th>Unit Rate</th>
            <th>DC_Srl_Amt</th>
            <th>Excise_CL_no</th>
            <th>SrlType</th>
            <th>Mtrl_rate</th>
            <th>JW_Rate</th>
            <th>PackingLevel</th>
            <th>InspLevel</th>
            <th>Mprocess</th>
            <th>Operation</th>
            <th>TotalWeight</th>
            <th>Desp Status</th>
            <th>Total Amount</th>
            <th>Selected</th>
          </tr>
        </thead>
        <tbody className="tablebody">
          {props.filteredDetailsData?.map((val, key) => (
            <tr>
              <td>{val.Dwg_No}</td>
              <td>{val.Material}</td>
              <td>{val.Qty}</td>
              <td>{val.Mtrl_rate}</td>
              <td>{val.JW_Rate}</td>
              <td>{val.Draft_dc_inv_DetailsID}</td>
              <td>{val.DC_Inv_No}</td>
              <td>{val.DC_Inv_Srl}</td>
              <td>{val.ScheduleID}</td>
              <td>{val.OrderSchDetailsID}</td>
              <td>{val.Cust_Code}</td>
              <td>{val.Dwg_Code}</td>
              <td>{val.Dwg_No}</td>
              <td>{val.Mtrl}</td>
              <td>{val.Material}</td>
              <td>{val.Qty}</td>
              <td>{val.QtyReturned}</td>
              <td>{val.UOM}</td>
              <td>{val.Unit_Wt}</td>
              <td>{val.DC_Srl_Wt}</td>
              <td>{val.WtReturned}</td>
              <td>{val.Unit_Rate}</td>
              <td>{val.DC_Srl_Amt}</td>
              <td>{val.Excise_CL_no}</td>
              <td>{val.SrlType}</td>
              <td>{val.Mtrl_rate}</td>
              <td>{val.JW_Rate}</td>
              <td>{val.PkngLevel}</td>
              <td>{val.InspLevel}</td>
              <td></td>
              <td></td>
              <td>{props.registerSelectedRow.Total_Wt}</td>
              <td>{val.DespStatus}</td>
              <td>{props.registerSelectedRow.GrandTotal}</td>
              <td>
                <input type="checkbox" name="" id="" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
