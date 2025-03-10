import axios from "axios";
import React, { useEffect, useState } from "react";
import CombinedScheduleListClosed from "../../../ScheduleList/Closed/CombinedScheduleListClosed";


export default function CombinedScheduleListClosedJW() {
const[type,setType]=useState("JobWork");
  

  return (
    <div>
     <CombinedScheduleListClosed type={type}/>
    </div>
  );
}
