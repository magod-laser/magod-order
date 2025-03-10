import axios from "axios";
import React, { useEffect, useState } from "react";
import CombinedScheduleList from "../../../ScheduleList/Order/CombinedScheduleList";

export default function CombinedScheduleListSales() {
  const[type,setType]=useState("Sales");

  return (
    <div>
      <CombinedScheduleList type={type}/>
    </div>
  );
}
