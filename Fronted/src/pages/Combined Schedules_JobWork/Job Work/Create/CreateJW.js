import React, { useEffect, useState } from "react";
import Create from '../../Create/create'

export default function CreateJW() {
  const[type,setType]=useState("JobWork");
  // console.log("type is",type);

  return (
    <div>
     <Create type={type}/>
    </div>
  );
}
