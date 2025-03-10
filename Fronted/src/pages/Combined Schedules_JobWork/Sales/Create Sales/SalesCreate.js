import React, { useEffect, useState } from "react";
import Create from '../../Create/create'

export default function SalesCreate() {
  const[type,setType]=useState("Sales");
  console.log("type in sales page",type);

  console.log("page called")

  return (
    <div>
     <Create type={type}/>
    </div>
  );
}
