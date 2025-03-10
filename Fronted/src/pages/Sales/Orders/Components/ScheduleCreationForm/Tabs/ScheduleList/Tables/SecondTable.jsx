import React, { useState } from "react";
import { Table } from "react-bootstrap";

export default function SecondTable(props) {

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
      const dataCopy = [...props.DwgNameList];
    
      if (sortConfig.key) {
        dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];
    
        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "QtyScheduled" ||
          sortConfig.key === "QtyProduced" ||
          sortConfig.key === "QtyPacked" ||
          sortConfig.key === "QtyDelivered" ||
          sortConfig.key === "JWCost" ||
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
        <Table striped className="table-data border table-space">
          <thead className="tableHeaderBGColor">
            <tr>
              <th onClick={() => requestSort("DwgName")}>Dwg Name</th>
              <th onClick={() => requestSort("Mtrl_Code")}>Mtrl Code</th>
              <th onClick={() => requestSort("Operation")}>Operation</th>
              <th onClick={() => requestSort("QtyScheduled")}>Scheduled</th>
              <th onClick={() => requestSort("QtyProduced")}>Produced</th>
              <th onClick={() => requestSort("QtyPacked")}>Packed</th>
              <th onClick={() => requestSort("QtyDelivered")}>Delivered</th>
              <th onClick={() => requestSort("JWCost")}>JW Cost</th>
              <th onClick={() => requestSort("MtrlCost")}>Mtrl Cost</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {/* {props.DwgNameList.map((item, key) => { */}
            {sortedData()?.map((item, key) => {
              return (
                <>
                  <tr>
                    <td>{item.DwgName}</td>
                    <td>{item.Mtrl_Code}</td>
                    <td>{item.Operation}</td>
                    <td>{item.QtyScheduled}</td>
                    <td>{item.QtyProduced}</td>
                    <td>{item.QtyPacked}</td>
                    <td>{item.QtyDelivered}</td>
                    <td>{item.JWCost}</td>
                    <td>{item.MtrlCost}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
}
