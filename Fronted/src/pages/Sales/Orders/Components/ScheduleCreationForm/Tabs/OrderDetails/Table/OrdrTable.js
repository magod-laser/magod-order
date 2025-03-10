// import { React, useState, useEffect } from "react";
// import { Table, Form } from "react-bootstrap";

// function OrdrTable(props) {
//   const {
//     OrderData,
//     OrderCustData,
//     OrdrDetailsData,
//     selectedItems,
//     selectedRowItem,
//     imprtDwgObj,
//     selectItem,
//     setDetailsColour,
//     calculateMinSrlStatus,
//     updateOrderStatus,
//     getStatusText,
//     scheduleType,
//     scheduleOption,
//     handleSelectAll,
//     handleReverseSelection,
//     filteredData,
//     setFilteredData,
//     newSerial,
//     setNewSerial,
//     ordrDetailsChange,
//     setordrDetailsChange,
//     handleJWMR,
//     handleRowSelection,
//     handleMultipleRowSelection,
//     handleRowClick,
//     handleCheckboxChange,
//     selectedRow,
//     setSelectedRow,
//     selectedRows,
//     setSelectedRows,
//     setSelectedRowItems,
//     selectedRowItems,
//     sortConfig,
//     setSortConfig,
//     sortedData,
//     LastSlctedRow,
//   } = props;

//   useEffect(() => {
//     setDetailsColour();
//   }, [OrdrDetailsData]);

//   // const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

//   const getRowBackgroundColor = (order) => {
//     if (order.Qty_Ordered === 0) return "lavender";
//     else if (order.QtyDelivered >= order.Qty_Ordered) return "lightgreen";
//     else if (order.QtyDelivered > 0 && order.QtyPacked >= order.Qty_Ordered)
//       return "orange";
//     else if (order.QtyPacked >= order.Qty_Ordered) return "lightgreen";
//     else if (order.QtyPacked > 0 && order.QtyProduced >= order.Qty_Ordered)
//       return "greenyellow";
//     else if (order.QtyProduced >= order.Qty_Ordered) return "yellow";
//     else if (order.QtyProduced > 0 && order.QtyScheduled >= order.Qty_Ordered)
//       return "greenyellow";
//     else if (order.QtyScheduled >= order.Qty_Ordered) return "lightyellow";
//     else if (order.QtyScheduled > 0) return "lightcoral";
//     else return "lightblue";
//   };
//   // sorting function for table headings of the table
//   const requestSort = (key) => {
//     console.log("entering into the request sort");
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // const sortedData = () => {
//   //   const dataCopy = [...filteredData];

//   //   if (sortConfig.key) {
//   //     dataCopy.sort((a, b) => {
//   //       let valueA = a[sortConfig.key];
//   //       let valueB = b[sortConfig.key];

//   //       // Convert only for the "intiger" columns
//   //       if (
//   //         sortConfig.key === "LOC" ||
//   //         sortConfig.key === "Holes" ||
//   //         sortConfig.key === "JWCost" ||
//   //         sortConfig.key === "MtrlCost" ||
//   //         sortConfig.key === "UnitPrice" ||
//   //         sortConfig.key === "Qty_Ordered" ||
//   //         sortConfig.key === "Total"
//   //       ) {
//   //         valueA = parseFloat(valueA);
//   //         valueB = parseFloat(valueB);
//   //       }

//   //       if (valueA < valueB) {
//   //         return sortConfig.direction === "asc" ? -1 : 1;
//   //       }
//   //       if (valueA > valueB) {
//   //         return sortConfig.direction === "asc" ? 1 : -1;
//   //       }
//   //       return 0;
//   //     });
//   //   }
//   //   return dataCopy;
//   // };

//   return (
//     <div style={{ overflow: "auto", height: "350px" }}>
//       <Table bordered hover className="table-data border">
//         <thead
//           className="tableHeaderBGColor"
//           style={{
//             textAlign: "center",
//             position: "sticky",
//             top: "-1px",
//             whiteSpace: "nowrap",
//           }}
//         >
//           <tr>
//             <th style={{ whiteSpace: "nowrap" }}>Select</th>
//             <th onClick={() => requestSort("DwgName")}>Drawing/Part Name</th>
//             {props.OrderData?.Type === "Profile" ? (
//               <th style={{ whiteSpace: "nowrap" }}>Dwg Exists</th>
//             ) : null}{" "}
//             <th onClick={() => requestSort("Mtrl_Code")}>Material</th>
//             <th onClick={() => requestSort("Operation")}>Operation</th>
//             <th onClick={() => requestSort("Mtrl_Source")}>Source</th>
//             <th onClick={() => requestSort("InspLevel")}>Insp Level</th>
//             <th onClick={() => requestSort("tolerance")}>Tolerance</th>
//             <th onClick={() => requestSort("PackingLevel")}>Packing Level</th>
//             <th onClick={() => requestSort("LOC")}>LOC</th>
//             <th onClick={() => requestSort("Holes")}>Pierces</th>
//             <th onClick={() => requestSort("JWCost")}>JW Cost</th>
//             <th onClick={() => requestSort("MtrlCost")}>Mtrl Cost</th>
//             <th onClick={() => requestSort("UnitPrice")}>Unit Rate</th>
//             <th onClick={() => requestSort("Qty_Ordered")}>Qty Ordered</th>
//             <th onClick={() => requestSort("Total")}>Total</th>
//           </tr>
//         </thead>
//         <tbody style={{ textAlign: "center" }}>
//           {sortedData()?.map((OrdrDetailsItem, i) => {
//             const backgroundColor = getRowBackgroundColor(OrdrDetailsItem);
//             // const isSelected = selectedRows.includes(OrdrDetailsItem); // Check if the row is selected
//             return (
//               <tr
//                 // key={i}
//                 // onClick={() => selectItem(OrdrDetailsItem, false)}
//                 // onClick={() => selectItem(OrdrDetailsItem, imprtDwgObj)}
//                 // onClick={() => selectedRowItem(OrdrDetailsItem, imprtDwgObj)}
//                 // style={{
//                 //   cursor: "pointer",
//                 //   backgroundColor: selectedItems?.includes(OrdrDetailsItem)
//                 //     ? "#98a8f8"
//                 //     : backgroundColor,
//                 //   whiteSpace: "nowrap",
//                 // }}
//                 // // className="order-details-row"

//                 // data-srlstatus={OrdrDetailsItem.SrlStatus}
//                 // key={i}
//                 // onClick={() => handleRowClick(OrdrDetailsItem)}
//                 // style={{
//                 //   cursor: "pointer",
//                 //   backgroundColor:
//                 //     selectedRow &&
//                 //     selectedRow.Order_Srl === OrdrDetailsItem.Order_Srl
//                 //       ? "#98a8f8" // Highlight color for the selected row
//                 //       : backgroundColor, // Default background color
//                 //   whiteSpace: "nowrap",
//                 // }}
//                 // data-srlstatus={OrdrDetailsItem.SrlStatus}
//                 key={i}
//                 onClick={() => handleRowClick(OrdrDetailsItem)}
//                 style={{
//                   cursor: "pointer",

//                   backgroundColor:
//                     selectedRow &&
//                     selectedRow.Order_Srl === OrdrDetailsItem.Order_Srl
//                       ? "#98a8f8" // Set the background color to red for the selected row
//                       : backgroundColor, // Default background color
//                   whiteSpace: "nowrap",
//                 }}
//                 data-srlstatus={OrdrDetailsItem.SrlStatus}
//               >
//                 <td>
//                   <Form.Check
//                     type="checkbox"
//                     id={`select-checkbox-${i}`}
//                     checked={selectedRows.some(
//                       (row) => row.Order_Srl === OrdrDetailsItem.Order_Srl
//                     )}
//                     onChange={() => handleCheckboxChange(OrdrDetailsItem)} // Passed the entire row data
//                     onClick={(e) => e.stopPropagation()} // Prevent triggering row click
//                   />
//                 </td>
//                 {/* <td>
//                   <Form.Check type="checkbox" id={`select-checkbox-${i}`} />
//                 </td> */}

//                 <td>{OrdrDetailsItem.DwgName}</td>
//                 {props.OrderData?.Type === "Profile" ? (
//                   <td>
//                     <Form.Check type="checkbox" id="selected" defaultChecked />
//                   </td>
//                 ) : null}
//                 <td>{OrdrDetailsItem.Mtrl_Code}</td>
//                 <td>{OrdrDetailsItem.Operation}</td>
//                 <td>{OrdrDetailsItem.Mtrl_Source}</td>
//                 <td>{OrdrDetailsItem.InspLevel}</td>
//                 <td>{OrdrDetailsItem.tolerance}</td>
//                 <td>{OrdrDetailsItem.PackingLevel}</td>
//                 <td>{OrdrDetailsItem.LOC}</td>
//                 <td>{OrdrDetailsItem.Holes}</td>
//                 {/* <td>
// 									{" "}
// 									<input value={OrdrDetailsItem.JWCost} />{" "}
// 								</td> */}

//                 <td>
//                   {" "}
//                   <input
//                     className="table-cell-editor"
//                     style={{
//                       backgroundColor: "transparent",
//                       border: "none",
//                     }}
//                     value={OrdrDetailsItem.JWCost}
//                     // onChange={(e) => handleJWMR(i, "JWCost", e.target.value)}
//                     onChange={(e) => {
//                       handleJWMR(i, "JWCost", e.target.value, true); // Pass `true` for JRM
//                     }}
//                   />
//                 </td>
//                 {/* <td>
//                   <input
//                     className="table-cell-editor"
//                     style={{
//                       backgroundColor: "transparent",
//                       border: "none",
//                     }}
//                     value={LastSlctedRow?.JWCost || ""}
//                     onChange={(e) => {
//                       handleJWMR(i, "JWCost", e.target.value); // Pass field and value
//                     }}
//                   />
//                 </td> */}
//                 {/* <td>
// 									<input value={OrdrDetailsItem.MtrlCost} />
// 								</td> */}
//                 <td>
//                   {" "}
//                   <input
//                     className="table-cell-editor"
//                     style={{
//                       backgroundColor: "transparent",
//                       border: "none",
//                     }}
//                     value={OrdrDetailsItem.MtrlCost}
//                     // onChange={(e) => handleJWMR(i, "MtrlCost", e.target.value)}
//                     onChange={(e) => {
//                       handleJWMR(i, "MtrlCost", e.target.value, true); // Pass `true` for JRM
//                     }}
//                   />
//                 </td>
//                 <td>
//                   {/* <input value={OrdrDetailsItem.UnitPrice} /> */}
//                   {OrdrDetailsItem.UnitPrice}
//                 </td>
//                 {/* <td> */}
//                 {/* <input value={OrdrDetailsItem.Qty_Ordered} /> */}
//                 {/* {OrdrDetailsItem.Qty_Ordered} */}
//                 {/* </td> */}
//                 <td>
//                   {" "}
//                   <input
//                     className="table-cell-editor"
//                     style={{
//                       backgroundColor: "transparent",
//                       border: "none",
//                     }}
//                     value={OrdrDetailsItem.Qty_Ordered}
//                     // onChange={(e) =>
//                     //   handleJWMR(i, "Qty_Ordered", e.target.value)
//                     // }
//                     onChange={(e) => {
//                       handleJWMR(i, "Qty_Ordered", e.target.value, true); // Pass `true` for JRM
//                     }}
//                   />
//                 </td>
//                 {/* <td>
//                   {" "}
//                   <input
//                     className="table-cell-editor"
//                     style={{
//                       backgroundColor: "transparent",
//                       border: "none",
//                     }}
//                     value={LastSlctedRow?.Qty_Ordered}
//                     // onChange={(e) =>
//                     //   handleJWMR(i, "Qty_Ordered", e.target.value)
//                     // }
//                     onChange={(e) => {
//                       handleJWMR(i, "Qty_Ordered", e.target.value, true); // Pass `true` for JRM
//                     }}
//                   />
//                 </td> */}
//                 <td>
//                   {parseFloat(
//                     OrdrDetailsItem.UnitPrice * OrdrDetailsItem.Qty_Ordered
//                   ).toFixed(2)}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </Table>
//     </div>
//   );
// }

// export default OrdrTable;



import { React, useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";

function OrdrTable(props) {
  const {
    OrderData,
    OrderCustData,
    OrdrDetailsData,
    selectedItems,
    selectedRowItem,
    imprtDwgObj,
    selectItem,
    setDetailsColour,
    calculateMinSrlStatus,
    updateOrderStatus,
    getStatusText,
    scheduleType,
    scheduleOption,
    handleSelectAll,
    handleReverseSelection,
    filteredData,
    setFilteredData,
    newSerial,
    setNewSerial,
    ordrDetailsChange,
    setordrDetailsChange,
    handleJWMR,
    handleRowSelection,
    handleMultipleRowSelection,
    handleRowClick,
    handleCheckboxChange,
    selectedRow,
    setSelectedRow,
    selectedRows,
    setSelectedRows,
    setSelectedRowItems,
    selectedRowItems,
  } = props;

  useEffect(() => {
    setDetailsColour();
  }, [OrdrDetailsData]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const getRowBackgroundColor = (order) => {
    if (order.Qty_Ordered === 0) return "lavender";
    else if (order.QtyDelivered >= order.Qty_Ordered) return "lightgreen";
    else if (order.QtyDelivered > 0 && order.QtyPacked >= order.Qty_Ordered)
      return "orange";
    else if (order.QtyPacked >= order.Qty_Ordered) return "lightgreen";
    else if (order.QtyPacked > 0 && order.QtyProduced >= order.Qty_Ordered)
      return "greenyellow";
    else if (order.QtyProduced >= order.Qty_Ordered) return "yellow";
    else if (order.QtyProduced > 0 && order.QtyScheduled >= order.Qty_Ordered)
      return "greenyellow";
    else if (order.QtyScheduled >= order.Qty_Ordered) return "lightyellow";
    else if (order.QtyScheduled > 0) return "lightcoral";
    else return "lightblue";
  };
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
    const dataCopy = [...filteredData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "LOC" ||
          sortConfig.key === "Holes" ||
          sortConfig.key === "JWCost" ||
          sortConfig.key === "MtrlCost" ||
          sortConfig.key === "UnitPrice" ||
          sortConfig.key === "Qty_Ordered" ||
          sortConfig.key === "Total"
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
    <div style={{ overflow: "auto", height: "350px" }}>
      <Table bordered hover className="table-data border">
        <thead
          className="tableHeaderBGColor"
          style={{
            textAlign: "center",
            position: "sticky",
            top: "-1px",
            whiteSpace: "nowrap",
          }}
        >
          <tr>
            <th style={{ whiteSpace: "nowrap" }}>Select</th>
            {/* <th style={{ whiteSpace: "nowrap" }}>Order_SRL</th> */}
            <th onClick={() => requestSort("DwgName")}>Drawing/Part Name</th>
            {props.OrderData?.Type === "Profile" ? (
              <th style={{ whiteSpace: "nowrap" }}>Dwg Exists</th>
            ) : null}{" "}
            <th onClick={() => requestSort("Mtrl_Code")}>Material</th>
            <th onClick={() => requestSort("Operation")}>Operation</th>
            <th onClick={() => requestSort("Mtrl_Source")}>Source</th>
            <th onClick={() => requestSort("Qty_Ordered")}>Qty Ordered</th>
            <th onClick={() => requestSort("JWCost")}>JW Cost</th>
            <th onClick={() => requestSort("MtrlCost")}>Mtrl Cost</th>
            <th onClick={() => requestSort("UnitPrice")}>Unit Rate</th>
            <th onClick={() => requestSort("LOC")}>LOC</th>
            <th onClick={() => requestSort("Holes")}>Pierces</th>
            <th onClick={() => requestSort("InspLevel")}>Insp Level</th>
            <th onClick={() => requestSort("PackingLevel")}>Packing Level</th>
            <th onClick={() => requestSort("tolerance")}>Tolerance</th>
            {/* <th onClick={() => requestSort("LOC")}>LOC</th> */}
           
           
      
            <th onClick={() => requestSort("Total")}>Total</th>
          </tr>
        </thead>
        <tbody  >
        {/* style={{ textAlign: "center" }} */}
          {sortedData()?.map((OrdrDetailsItem, i) => {
            const backgroundColor = getRowBackgroundColor(OrdrDetailsItem);
            // const isSelected = selectedRows.includes(OrdrDetailsItem); // Check if the row is selected
            return (
              <tr
                // key={i}
                // onClick={() => selectItem(OrdrDetailsItem, false)}
                // onClick={() => selectItem(OrdrDetailsItem, imprtDwgObj)}
                // onClick={() => selectedRowItem(OrdrDetailsItem, imprtDwgObj)}
                // style={{
                //   cursor: "pointer",
                //   backgroundColor: selectedItems?.includes(OrdrDetailsItem)
                //     ? "#98a8f8"
                //     : backgroundColor,
                //   whiteSpace: "nowrap",
                // }}
                // // className="order-details-row"

                // data-srlstatus={OrdrDetailsItem.SrlStatus}
                // key={i}
                // onClick={() => handleRowClick(OrdrDetailsItem)}
                // style={{
                //   cursor: "pointer",
                //   backgroundColor:
                //     selectedRow &&
                //     selectedRow.Order_Srl === OrdrDetailsItem.Order_Srl
                //       ? "#98a8f8" // Highlight color for the selected row
                //       : backgroundColor, // Default background color
                //   whiteSpace: "nowrap",
                // }}
                // data-srlstatus={OrdrDetailsItem.SrlStatus}
                key={i}
                onClick={() => handleRowClick(OrdrDetailsItem)}
                style={{
                  cursor: "pointer",

                  backgroundColor:
                    selectedRow &&
                    selectedRow.Order_Srl === OrdrDetailsItem.Order_Srl
                      ? "#98a8f8" // Set the background color to red for the selected row
                      : backgroundColor, // Default background color
                  whiteSpace: "nowrap",
                }}
                data-srlstatus={OrdrDetailsItem.SrlStatus}
              >
                <td 
                  style={{ textAlign: "center", paddingLeft: "10px", display: "flex", justifyContent: "center", alignItems: "center"  }}                
                >
                  <Form.Check

                    type="checkbox"
                    id={`select-checkbox-${i}`}
                    checked={selectedRows.some(
                      (row) => row.Order_Srl === OrdrDetailsItem.Order_Srl
                    )}
                    onChange={() => handleCheckboxChange(OrdrDetailsItem)} // Passed the entire row data
                    onClick={(e) => e.stopPropagation()} // Prevent triggering row click
                  />
                </td>
                {/* <td>
                  <Form.Check type="checkbox" id={`select-checkbox-${i}`} />
                </td> */}

                {/* <td>{OrdrDetailsItem.Order_Srl}</td> */}
                <td>{OrdrDetailsItem.DwgName}</td>
                {props.OrderData?.Type === "Profile" ? (
                  <td>
                    <Form.Check type="checkbox" id="selected" defaultChecked />
                  </td>
                ) : null}
                <td>{OrdrDetailsItem.Mtrl_Code}</td>
                <td>{OrdrDetailsItem.Operation}</td>
                <td>{OrdrDetailsItem.Mtrl_Source}</td>
                <td>
                  {" "}
                  <input
                    className="table-cell-editor"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                    value={OrdrDetailsItem.Qty_Ordered}
                    // onChange={(e) =>
                    //   handleJWMR(i, "Qty_Ordered", e.target.value)
                    // }
                    onChange={(e) => {
                      handleJWMR(i, "Qty_Ordered", e.target.value, true); // Pass `true` for JRM
                    }}
                  />
                </td>
                <td>
                  {" "}
                  <input
                    className="table-cell-editor"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                    value={OrdrDetailsItem.JWCost}
                    // onChange={(e) => handleJWMR(i, "JWCost", e.target.value)}
                    onChange={(e) => {
                      handleJWMR(i, "JWCost", e.target.value, true); // Pass `true` for JRM
                    }}
                  />
                </td>
                <td>
                  {" "}
                  <input
                    className="table-cell-editor"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                    value={OrdrDetailsItem.MtrlCost}
                    // onChange={(e) => handleJWMR(i, "MtrlCost", e.target.value)}
                    onChange={(e) => {
                      handleJWMR(i, "MtrlCost", e.target.value, true); // Pass `true` for JRM
                    }}
                  />
                </td>
                <td>
                  {/* <input value={OrdrDetailsItem.UnitPrice} /> */}
                  {OrdrDetailsItem.UnitPrice}
                </td>
                <td>{OrdrDetailsItem.LOC}</td>
                <td>{OrdrDetailsItem.Holes}</td>
                <td>{OrdrDetailsItem.InspLevel}</td>
                <td>{OrdrDetailsItem.PackingLevel}</td>

                <td>{OrdrDetailsItem.tolerance}</td>
               
                {/* <td>
									{" "}
									<input value={OrdrDetailsItem.JWCost} />{" "}
								</td> */}

               
                {/* <td>
									<input value={OrdrDetailsItem.MtrlCost} />
								</td> */}
                
               
                {/* <td> */}
                {/* <input value={OrdrDetailsItem.Qty_Ordered} /> */}
                {/* {OrdrDetailsItem.Qty_Ordered} */}
                {/* </td> */}
                
                <td>
                  {parseFloat(
                    OrdrDetailsItem.UnitPrice * OrdrDetailsItem.Qty_Ordered
                  ).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default OrdrTable;

