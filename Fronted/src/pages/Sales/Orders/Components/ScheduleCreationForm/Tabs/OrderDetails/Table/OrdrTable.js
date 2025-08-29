/* eslint-disable no-unused-vars */

import { React, useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

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
    // hande arrow keys
    currentIndex,
    setCurrentIndex,
    goToFirst,
    goToPrevious,
    goToNext,
    goToLast,
  } = props;

  useEffect(() => {
    setDetailsColour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OrdrDetailsData]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const getRowBackgroundColor = (order) => {
    if (order.Qty_Ordered === 0) return "lavender";
    else if (
      props.OrderData?.Order_Status === "Recorded" &&
      order.QtyScheduled === 0
    )
      return "lightblue";
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
    else return "";
  };
  // sorting function for table headings of the table
  const requestSort = (key) => {
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

  //adjustable table
  const columns = [
    { key: "select", label: "Select", resizable: true },
    { key: "slNo", label: "Sl No", resizable: true },
    { key: "DwgName", label: "Drawing/Part Name", resizable: true },
    ...(OrderData?.Type === "Profile"
      ? [{ key: "dwgExists", label: "Dwg Exists", resizable: true }]
      : []),
    { key: "Mtrl_Code", label: "Material", resizable: true },
    { key: "Operation", label: "Operation", resizable: true },
    { key: "Mtrl_Source", label: "Source", resizable: true },
    {
      key: "Qty_Ordered",
      label: "Qty Ordered",
      resizable: true,
      editable: true,
    },
    { key: "JWCost", label: "JW Cost", resizable: true, editable: true },
    { key: "MtrlCost", label: "Mtrl Cost", resizable: true, editable: true },
    { key: "UnitPrice", label: "Unit Rate", resizable: true },
    // { key: "LOC", label: "LOC", resizable: true },
    // { key: "Holes", label: "Pierces", resizable: true },
    ...(OrderData?.Type === "Profile"
      ? [{ key: "LOC", label: "LOC", resizable: true }]
      : []),
    ...(OrderData?.Type === "Profile"
      ? [{ key: "Holes", label: "Pierces", resizable: true }]
      : []),
    { key: "InspLevel", label: "Insp Level", resizable: true },
    { key: "PackingLevel", label: "Packing Level", resizable: true },
    { key: "tolerance", label: "Tolerance", resizable: true },
    { key: "Total", label: "Total", resizable: true },
  ];

  const defaultColumnWidths = {
    select: 60,
    SrlNo: 60,
    DwgName: 200,
    dwgExists: 100,
    Mtrl_Code: 100,
    Operation: 120,
    Mtrl_Source: 100,
    Qty_Ordered: 70,
    JWCost: 70,
    MtrlCost: 70,
    UnitPrice: 70,
    LOC: 70,
    Holes: 70,
    InspLevel: 100,
    PackingLevel: 100,
    tolerance: 90,
    Total: 80,
  };

  const [columnWidths, setColumnWidths] = useState(
    columns.reduce(
      (acc, col) => ({
        ...acc,
        [col.key]: defaultColumnWidths[col.key] || 100,
      }),
      {}
    )
  );

  const handleResize = (key, event, { size }) => {
    setColumnWidths((prev) => ({
      ...prev,
      [key]: size.width,
    }));
  };

  return (
    <>
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
              {columns.map(({ key, label, resizable }) => (
                <th key={key} style={{ whiteSpace: "nowrap" }}>
                  {resizable ? (
                    <ResizableBox
                      width={columnWidths[key]}
                      height={30}
                      axis="x"
                      resizeHandles={["e"]}
                      onResizeStop={(e, data) => handleResize(key, e, data)}
                    >
                      <span
                        onClick={() => requestSort && requestSort(key)}
                        style={{
                          display: "inline-block",
                          width: "100%",
                          cursor: "pointer",
                        }}
                      >
                        {label}
                      </span>
                    </ResizableBox>
                  ) : (
                    <span onClick={() => requestSort && requestSort(key)}>
                      {label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* {filteredData && filteredData.length > 0 ? (
              sortedData()?.map((OrdrDetailsItem, i) => {
                const backgroundColor = getRowBackgroundColor(OrdrDetailsItem);
                return (
                  <tr
                    key={i}
                    onClick={() => handleRowClick(OrdrDetailsItem)}
                    style={{
                      cursor: "pointer",

                      backgroundColor:
                        selectedRow &&
                        selectedRow.OrderDetailId ===
                          OrdrDetailsItem.OrderDetailId
                          ? "#98a8f8"
                          : backgroundColor,
                      whiteSpace: "nowrap",
                    }}
                    data-srlstatus={OrdrDetailsItem.SrlStatus}
                  >
                    <td
                      style={{
                        textAlign: "center",
                        paddingLeft: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Form.Check
                        type="checkbox"
                        id={`select-checkbox-${i}`}
                        checked={selectedRows.some(
                          (row) =>
                            row.OrderDetailId === OrdrDetailsItem.OrderDetailId
                        )}
                        onChange={() => handleCheckboxChange(OrdrDetailsItem)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>{i + 1}</td>

                    <td
                      className="dwg-name"
                      style={{ width: columnWidths.DwgName }}
                    >
                      {OrdrDetailsItem.DwgName}
                    </td>
                    {props.OrderData?.Type === "Profile" ? (
                      <td>
                        <Form.Check
                          style={{
                            textAlign: "center",
                            paddingLeft: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          type="checkbox"
                          id="selected"
                          checked={!!OrdrDetailsItem.Dwg}
                          readOnly
                        />
                      </td>
                    ) : null}
                    <td>
                      {OrdrDetailsItem.Type === "Service"
                        ? OrdrDetailsItem.Material
                        : OrdrDetailsItem.Mtrl_Code}
                    </td>
                    <td>{OrdrDetailsItem.Operation}</td>
                    <td>{OrdrDetailsItem.Mtrl_Source}</td>
                    <td>
                      {" "}
                      <input
                        className="table-cell-editor"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",

                          textAlign: "end",
                          paddingLeft: "10px",
                          justifyContent: "end",
                          alignItems: "end",
                        }}
                        value={OrdrDetailsItem.Qty_Ordered}
                        onChange={(e) =>
                          handleJWMR(i, "Qty_Ordered", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        className="table-cell-editor"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          textAlign: "end",
                          paddingLeft: "10px",
                          justifyContent: "end",
                          alignItems: "end",
                        }}
                        value={OrdrDetailsItem.JWCost}
                        onChange={(e) => {
                          handleJWMR(i, "JWCost", e.target.value, true);
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
                          textAlign: "end",
                          paddingLeft: "10px",
                          justifyContent: "end",
                          alignItems: "end",
                        }}
                        value={OrdrDetailsItem.MtrlCost}
                        disabled={
                          OrdrDetailsItem.Mtrl_Source &&
                          ordrDetailsChange.MtrlSrc === "Customer"
                        }
                        onChange={(e) => {
                          handleJWMR(i, "MtrlCost", e.target.value, true);
                        }}
                      />
                    </td>
                    {OrdrDetailsItem.Mtrl_Source === "Customer" ? (
                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          textAlign: "end",
                          paddingLeft: "10px",
                          justifyContent: "end",
                          alignItems: "end",
                        }}
                      >
                        {parseFloat(OrdrDetailsItem.JWCost).toFixed(2)}
                      </td>
                    ) : (
                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          textAlign: "end",
                          paddingLeft: "10px",
                          justifyContent: "end",
                          alignItems: "end",
                        }}
                      >
                        {(
                          parseFloat(OrdrDetailsItem.MtrlCost) +
                          parseFloat(OrdrDetailsItem.JWCost)
                        ).toFixed(2)}
                      </td>
                    )}
                    {props.OrderData?.Type === "Profile" ? (
                      <td>{OrdrDetailsItem.LOC}</td>
                    ) : null}
                    {props.OrderData?.Type === "Profile" ? (
                      <td>{OrdrDetailsItem.Holes}</td>
                    ) : null}
                    <td>{OrdrDetailsItem.InspLevel}</td>
                    <td>{OrdrDetailsItem.PackingLevel}</td>
                    <td>{OrdrDetailsItem.tolerance}</td>

                    {OrdrDetailsItem.Mtrl_Source === "Customer" ? (
                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          textAlign: "end",
                          paddingLeft: "10px",
                          justifyContent: "end",
                          alignItems: "end",
                        }}
                      >
                        {parseFloat(
                          OrdrDetailsItem.JWCost * OrdrDetailsItem.Qty_Ordered
                        ).toFixed(2)}
                      </td>
                    ) : (
                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          textAlign: "end",
                          paddingLeft: "10px",
                          justifyContent: "end",
                          alignItems: "end",
                        }}
                      >
                        {parseFloat(
                          OrdrDetailsItem.UnitPrice *
                            OrdrDetailsItem.Qty_Ordered
                        ).toFixed(2)}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              // <div
              //   style={{
              //     display: "flex",
              //     flexDirection: "column",
              //     alignItems: "center",
              //     justifyContent: "center",
              //     paddingRight: "150px",
              //     textAlign: "center",
              //     color: "black",
              //   }}
              // >
              //   <div
              //     className="spinner-border text-primary"
              //     role="status"
              //     style={{ width: "3rem", height: "3rem" }}
              //   >
              //     <span className="visually-hidden">Loading...</span>
              //   </div>
              //   <div style={{ marginTop: "10px", fontWeight: "500" }}>
              //      Please wait...
              //   </div>
              // </div>
              // <tbody>
              //     <tr>{""}</tr>
              //     <tr>{""}</tr>

              //   <tr>
              //     <td colSpan="100%" style={{ padding: "40px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "black",
                }}
              >
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{
                    margin: "10px 20px 10px 300px",
                    width: "3rem",
                    height: "3rem",
                  }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div
                  style={{ margin: "10px 20px 10px 300px", fontWeight: "500" }}
                >
                  Please wait...
                </div>
              </div>
              //     </td>
              //   </tr>
              // </tbody>
            )} */}
            {sortedData()?.map((OrdrDetailsItem, i) => {
              const backgroundColor = getRowBackgroundColor(OrdrDetailsItem);
              return (
                <tr
           
            
                  key={i}
                  onClick={() => handleRowClick(OrdrDetailsItem)}
                  style={{
                    cursor: "pointer",

                    backgroundColor:
                      selectedRow &&
                      selectedRow.OrderDetailId ===
                        OrdrDetailsItem.OrderDetailId
                        ? "#98a8f8" 
                        : backgroundColor, 
                    whiteSpace: "nowrap",
                  }}
                  data-srlstatus={OrdrDetailsItem.SrlStatus}
                >
                  <td
                    style={{
                      textAlign: "center",
                      paddingLeft: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`select-checkbox-${i}`}
                      checked={selectedRows.some(
                        (row) =>
                          row.OrderDetailId === OrdrDetailsItem.OrderDetailId
                      )}
                      onChange={() => handleCheckboxChange(OrdrDetailsItem)} 
                      onClick={(e) => e.stopPropagation()} 
                    />
                  </td>
                  <td>{i + 1}</td>
                  
                  <td
                    className="dwg-name"
                    style={{ width: columnWidths.DwgName }}
                  >
                    {OrdrDetailsItem.DwgName}
                  </td>
                  {props.OrderData?.Type === "Profile" ? (
                    <td>
                      <Form.Check
                        style={{
                          textAlign: "center",
                          paddingLeft: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        type="checkbox"
                        id="selected"
                        checked={!!OrdrDetailsItem.Dwg} 
                        readOnly 

                        
                      />
                    </td>
                  ) : null}
                  <td>
                    {OrdrDetailsItem.Type === "Service"
                      ? OrdrDetailsItem.Material
                      : OrdrDetailsItem.Mtrl_Code}
                  </td>
                  <td>{OrdrDetailsItem.Operation}</td>
                  <td>{OrdrDetailsItem.Mtrl_Source}</td>
                  <td>
                    {" "}
                    <input
                      className="table-cell-editor"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",

                        textAlign: "end",
                        paddingLeft: "10px",
                        justifyContent: "end",
                        alignItems: "end",
                      }}
                      value={OrdrDetailsItem.Qty_Ordered}
                     
                      onChange={(e) =>
                        handleJWMR(i, "Qty_Ordered", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      className="table-cell-editor"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        textAlign: "end",
                        paddingLeft: "10px",
                        justifyContent: "end",
                        alignItems: "end",
                      }}
                      value={OrdrDetailsItem.JWCost}
                      onChange={(e) => {
                        handleJWMR(i, "JWCost", e.target.value, true);
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
                        textAlign: "end",
                        paddingLeft: "10px",
                        justifyContent: "end",
                        alignItems: "end",
                      }}
                      value={OrdrDetailsItem.MtrlCost}
                      disabled={OrdrDetailsItem.Mtrl_Source && ordrDetailsChange.MtrlSrc === "Customer"}
                      onChange={(e) => {
                        handleJWMR(i, "MtrlCost", e.target.value, true);
                      }}

                    />
                  </td>
                  {OrdrDetailsItem.Mtrl_Source === "Customer" ? (
                    <td
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        textAlign: "end",
                        paddingLeft: "10px",
                        justifyContent: "end",
                        alignItems: "end",
                      }}
                    >
                      
                      {parseFloat(OrdrDetailsItem.JWCost).toFixed(2)}
                    </td>
                  ) : (
                    <td
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        textAlign: "end",
                        paddingLeft: "10px",
                        justifyContent: "end",
                        alignItems: "end",
                      }}
                    >
                      
                      {(
                        parseFloat(OrdrDetailsItem.MtrlCost) +
                        parseFloat(OrdrDetailsItem.JWCost)
                      ).toFixed(2)}
                    </td>
                  )}
                  {props.OrderData?.Type === "Profile" ? (
                    <td>{OrdrDetailsItem.LOC}</td>
                  ) : null}
                  {props.OrderData?.Type === "Profile" ? (
                    <td>{OrdrDetailsItem.Holes}</td>
                  ) : null}
                  <td>{OrdrDetailsItem.InspLevel}</td>
                  <td>{OrdrDetailsItem.PackingLevel}</td>
                  <td>{OrdrDetailsItem.tolerance}</td>
                 
                  {OrdrDetailsItem.Mtrl_Source === "Customer" ? (
                    <td
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        textAlign: "end",
                        paddingLeft: "10px",
                        justifyContent: "end",
                        alignItems: "end",
                      }}
                    >
                      {parseFloat(
                        OrdrDetailsItem.JWCost * OrdrDetailsItem.Qty_Ordered
                      ).toFixed(2)}
                    </td>
                  ) : (
                    <td
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        textAlign: "end",
                        paddingLeft: "10px",
                        justifyContent: "end",
                        alignItems: "end",
                      }}
                    >
                      {parseFloat(
                        OrdrDetailsItem.UnitPrice * OrdrDetailsItem.Qty_Ordered
                      ).toFixed(2)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* <div>
        <button onClick={goToFirst}>First</button>
        <button onClick={goToPrevious}>Previous</button>
        <span>
          {filteredData.length > 0
            ? ` ${currentIndex + 1} of ${filteredData.length}`
            : "No data available"}
        </span>
        <button onClick={goToNext}>Next</button>
        <button onClick={goToLast}>Last</button>
      </div> */}
      </div>
      <div>
        <button className="button-style" onClick={goToFirst}>
          First
        </button>
        <button className="button-style" onClick={goToPrevious}>
          Previous
        </button>
        <span>
          {filteredData.length > 0
            ? ` ${currentIndex + 1} of ${filteredData.length}`
            : "No data available"}
        </span>
        <button className="button-style" onClick={goToNext}>
          Next
        </button>
        <button className="button-style" onClick={goToLast}>
          Last
        </button>
      </div>
    </>
  );
}

export default OrdrTable;
