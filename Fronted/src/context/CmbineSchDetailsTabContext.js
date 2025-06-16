// ScheduleDataContext.js
import React, { createContext, useState } from "react";

export const ScheduleDataContext = createContext();

export const ScheduleDataProvider = ({ children }) => {
  const [scheduleListDetailsData, setScheduleListDetailsData] = useState([]);
  const [prepareScheduleData, setPrepareScheduleData] = useState([]);

  const setBothScheduleData = (data) => {
    console.log("setBothScheduleData called with:", data);
    setScheduleListDetailsData(data);
    setPrepareScheduleData(data);
  };

  return (
    <ScheduleDataContext.Provider
      value={{
        scheduleListDetailsData,
        prepareScheduleData,
        setBothScheduleData,
      }}
    >
      {children}
    </ScheduleDataContext.Provider>
  );
};
