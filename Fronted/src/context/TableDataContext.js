import React, { useState, useContext } from "react";

const TableDataContext = React.createContext();

export function useTableDataContext() {
  return useContext(TableDataContext);
}

export function TableDataProvider({ children }) {
  const [tableData, setTableData] = useState([]);

  function updateTableData(data) {
    console.log("updateTableData - Context");
    console.log(data);
    setTableData(data);
  }

  return (
    <TableDataContext.Provider value={{ tableData, updateTableData }}>
      {children}
    </TableDataContext.Provider>
  );
}
