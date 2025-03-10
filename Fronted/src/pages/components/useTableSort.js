import { useState } from "react";

const useTableSort = (data, defaultKey = null) => {
  const [sortConfig, setSortConfig] = useState({ key: defaultKey, direction: "asc" });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (!sortConfig.key) return data;

    const dataCopy = [...data];
    dataCopy.sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      // Convert only for integer/numeric columns
      if (["Order_No", "UnitPrice", "MtrlCost", "Qty"].includes(sortConfig.key)) {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      }

      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return dataCopy;
  };

  return { sortedData, requestSort, sortConfig };
};

export default useTableSort;
