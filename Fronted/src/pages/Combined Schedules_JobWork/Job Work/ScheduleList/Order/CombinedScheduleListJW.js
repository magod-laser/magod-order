import axios from "axios";
import React, { useEffect, useState } from "react";
import CombinedScheduleList from "../../../ScheduleList/Order/CombinedScheduleList";

export default function CombinedScheduleListJW() {
 const[type,setType]=useState("JobWork");

  return (
    <div>
     <CombinedScheduleList type={type}/>
    </div>
  );
}
