import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
// import { Tab, Table, Tabs, Form } from "react-bootstrap";
// Table

export default function FindOldPart(props) {
  const { OrderData, findOldpart, setfindOldpart } = props;
  // console.log("OrderData",OrderData)
  // console.log("findOldpart",findOldpart)
  const [selectedParts, setSelectedParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const selectItem = (findOldpartItem) => {
    const isSelected = selectedParts.some(
      (item) => item.id === findOldpartItem.id
    );

    setSelectedParts((prevSelectedParts) => {
      const updatedSelectedItems = isSelected
        ? prevSelectedParts.filter((item) => item.id !== findOldpartItem.id)
        : [...prevSelectedParts, findOldpartItem];

      ////  console.log("Selected Order details Rows:", updatedSelectedItems);

      return updatedSelectedItems;
    });
  };

  const filteredFindOldpart = findOldpart?.filter((item) =>
    item.DwgName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // table sorting
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
    const dataCopy = [...filteredFindOldpart];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Order_No" ||
          sortConfig.key === "UnitPrice" ||
          sortConfig.key === "MtrlCost" 
         
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
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
      <div>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <div className="row">
              <div className="col-md-5 mb-2 col-sm-12">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Search Part Name
                </label>
              </div>
              <div className="col-md-7 mt-2 col-sm-12">
                <input
                  className="in-field"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter DWG Name"
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ overflowY: "scroll", height: "300px" }}>
          <Table
            striped
            className="table-data border"
            style={{ border: "1px" }}
          >
            <thead
              className="tableHeaderBGColor"
              style={{ textAlign: "center" }}
            >
              <tr>
                <th onClick={() => requestSort("DwgName")} >DWG Name</th>
                <th onClick={() => requestSort("Mtrl_Code")}>Material</th>
                <th onClick={() => requestSort("Operation")}>Operation</th>
                <th onClick={() => requestSort("Mtrl_Source")}>Source</th>
                <th onClick={() => requestSort("Order_No")}>Order No</th>
                <th onClick={() => requestSort("UnitPrice")}>Unit Price</th>
                <th onClick={() => requestSort("MtrlCost")}>Material Price</th>
              </tr>
            </thead>

            <tbody className="tablebody" style={{ textAlign: "center" }}>
              {filteredFindOldpart?.length > 0 ? (
                // filteredFindOldpart.map((findOldpartItem, index) => {
                  sortedData()?.map((findOldpartItem, index) => {
                  const isSelected = selectedParts.includes(findOldpartItem);

                  return (
                    <tr
                      key={index}
                      onClick={() => selectItem(findOldpartItem)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#98a8f8" : "",
                      }}
                    >
                      <td>{findOldpartItem.DwgName}</td>
                      <td>{findOldpartItem.Mtrl_Code}</td>
                      <td>{findOldpartItem.Operation}</td>
                      <td>{findOldpartItem.Mtrl_Source}</td>
                      <td>{findOldpartItem.Order_No}</td>
                      <td>{findOldpartItem.UnitPrice}</td>
                      <td>{findOldpartItem.MtrlCost}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2}>No Items Added</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
