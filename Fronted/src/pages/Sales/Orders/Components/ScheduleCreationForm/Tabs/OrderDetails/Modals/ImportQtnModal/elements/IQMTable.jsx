/** @format */

import React from "react";
import { Tab, Table, Tabs, Form } from "react-bootstrap";

export default function IQMTable(props) {
  console.log("QtnFormatt", props.QtnFormatt);

  console.log("props.filteredQtnListData", props.filteredQtnListData);

  return (
    <>
      <Table striped className="table-data border" style={{ border: "1px" }}>
        <thead className="tableHeaderBGColor">
          <tr>
            <th>SL No</th>
            <th>ID</th>
            <th>Qtn ID</th>
            {/* <th>Name</th> */}
            <th>
              <th>{props.QtnFormatt === "Service" ? "Name" : "Dwg name"}</th>
            </th>
            <th>Material</th>
            <th>Operation</th>
            <th>Quantity</th>
            {/* <th>Base Price</th> */}
            <th>{props.QtnFormatt === "Service" ? "Base Price" : "JW Rate"}</th>
            {/* <th>Discount Amount</th> */}
            <th>
              {props.QtnFormatt === "Service" ? "Discount Amount" : "JW Rate"}
            </th>
            {/* <th>Final Price</th> */}
            <th>
              {props.QtnFormatt === "Service" ? "Final Price" : "Tolerance"}
            </th>
            {/* <th>Total Amount</th> */}
            <th>
              {" "}
              {props.QtnFormatt === "Service" ? "Total Amount" : "Insp Level"}
            </th>{" "}
          </tr>
        </thead>
        <tbody className="tablebody">
          {props.filteredQtnListData?.length > 0 ? (
            props.filteredQtnListData?.map((val, key) => (
              <>
                <tr>
                  <td>{key + 1}</td>
                  {/* <td>{val.ID}</td> */}
                  <td>
                    {props.QtnFormatt === "Service" ? val.ID : val.ProfileId}
                  </td>
                  <td>{val.QtnId}</td>
                  {/* <td>{val.Name}</td> */}
                  <td>
                    {" "}
                    {props.QtnFormatt === "Service" ? val.Name : val.Dwg_Name}
                  </td>
                  {/* <td>{val.Material}</td> */}
                  <td>
                    {" "}
                    {props.QtnFormatt === "Service"
                      ? val.Material
                      : val.mtrl_code}
                  </td>
                  <td>{val.Operation}</td>
                  {/* <td>{val.Quantity}</td> */}
                  <td>
                    {" "}
                    {props.QtnFormatt === "Service" ? val.Quantity : val.Qty}
                  </td>

                  {/* <td>{parseFloat(val.BasePrice).toFixed(2)}</td> */}
                  <td>
                    {" "}
                    {props.QtnFormatt === "Service"
                      ? parseFloat(val.BasePrice).toFixed(2)
                      : val.Unit_JobWork_Cost}
                  </td>
                  {/* <td>{parseFloat(val.DiscountAmount).toFixed(2)}</td> */}
                  <td>
                    {" "}
                    {props.QtnFormatt === "Service"
                      ? parseFloat(val.DiscountAmount).toFixed(2)
                      : val.Unit_Material_cost}
                  </td>
                  <td>
                    {/* {(
                      parseFloat(val.BasePrice) - parseFloat(val.DiscountAmount)
                    ).toFixed(2)} */}
                    {props.QtnFormatt === "Service"
                      ? (
                          parseFloat(val.BasePrice) -
                          parseFloat(val.DiscountAmount)
                        ).toFixed(2)
                      : val.Tolerance}
                  </td>
                  <td>
                    {/* {(
                      parseFloat(val.Quantity) *
                      (parseFloat(val.BasePrice) -
                        parseFloat(val.DiscountAmount))
                    ).toFixed(2)} */}
                    {props.QtnFormatt === "Service"
                      ? (
                          parseFloat(val.Quantity) *
                          (parseFloat(val.BasePrice) -
                            parseFloat(val.DiscountAmount))
                        ).toFixed(2)
                      : val.InspLevel}
                  </td>
                </tr>
              </>
            ))
          ) : (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Select Quotation No</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}
