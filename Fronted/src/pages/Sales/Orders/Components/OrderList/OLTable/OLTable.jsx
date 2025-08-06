import React, { useState } from "react";
import { Table } from "react-bootstrap";

export default function OLTable(props) {
  console.log("props.FilteredOrderListData", props.FilteredOrderListData);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSort = (key) => {
    console.log("entering into the request sort");
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...props.FilteredOrderListData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (sortConfig.key === "Order_No") {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        // Convert Printable_Order_Date to date object for proper sorting
        if (
          sortConfig.key === "Printable_Order_Date" ||
          sortConfig.key === "Printable_Delivery_Date"
        ) {
          valueA = new Date(valueA.split("/").reverse().join("-")); // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
          valueB = new Date(valueB.split("/").reverse().join("-"));
        }
        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopy;
  };

  return (
    <>
      <div style={{ maxHeight: "50vh", overflow: "auto" }}>
        <Table striped className="table-data border" style={{ border: "1px" }}>
          <thead className="tableHeaderBGColor">
            <tr>
              <th>SL No</th>
              <th onClick={() => requestSort("Order_Status")}>Status</th>
              <th onClick={() => requestSort("Order_No")}>Order No</th>
              <th onClick={() => requestSort("Printable_Order_Date")}>Date</th>
              <th onClick={() => requestSort("Cust_name")}>Customer</th>
              <th onClick={() => requestSort("Printable_Delivery_Date")}>
                Delivery Date
              </th>
              <th onClick={() => requestSort("Contact_Name")}>Contact Name</th>
              <th onClick={() => requestSort("Purchase_Order")}>PO No</th>
              <th>Special Instructions</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {/* {props.FilteredOrderListData.map((val, key) => ( */}
            {sortedData()?.map((val, key) => (
              <>
                <tr
                  onClick={() => {
                    props.handleOrderRowSelection(val);
                  }}
                  className={
                    val.Order_No === props.selectedOrderRow?.Order_No
                      ? "rowSelectedClass"
                      : ""
                  }
                >
                  <td>{key + 1}</td>
                  <td>{val.Order_Status}</td>
                  <td>{val.Order_No}</td>
                  <td>{val.Printable_Order_Date}</td>
                  <td>{val.Cust_name}</td>
                  <td>{val.Printable_Delivery_Date}</td>
                  <td>{val.Contact_Name}</td>
                  <td>{val.Purchase_Order}</td>
                  <td>{val.Special_Instructions}</td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
