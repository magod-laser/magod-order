import axios from "axios";
import React, { useEffect, useState } from "react";
import CombinedScheduleListClosed from "../../../ScheduleList/Closed/CombinedScheduleListClosed";

export default function CombinedScheduleListClosedSales() {
  const[type,setType]=useState("Sales");

  // console.log("type in sales page ",type);

  return (
    <div>
      <CombinedScheduleListClosed type={type}/>
    </div>
  );
}
