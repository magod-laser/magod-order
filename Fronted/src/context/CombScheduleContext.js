import React, { createContext, useContext, useState } from "react";

const ScheduleContext = createContext();
export const useSchedule = () => useContext(ScheduleContext);

export const ScheduleProvider = ({ children }) => {
  const [rowselectleft, setRowSelectLeft] = useState([]);

  // This function updates context state
  const handleCheckboxChangeLeft = (index, item) => {

    console.log("Before update:", rowselectleft);
    const updatedSelection = [...rowselectleft];
    const selectedItemIndex = updatedSelection.findIndex(
      (selectedItem) => selectedItem.ScheduleId === item.ScheduleId
    );

    if (selectedItemIndex !== -1) {
      updatedSelection.splice(selectedItemIndex, 1); // Remove if already selected
    } else {
      updatedSelection.push(item); // Add if not selected
    }

    console.log("After update:", updatedSelection);
    setRowSelectLeft(updatedSelection);
  };

  console.log("context - rowselectleft",rowselectleft);
  
  return (
    <ScheduleContext.Provider
      value={{
        rowselectleft,
        setRowSelectLeft, // available if manual updates needed
        handleCheckboxChangeLeft, // reusable logic
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
