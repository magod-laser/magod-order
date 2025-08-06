
import React, { useState } from "react";
import NewOrder from "../../../Components/NewOrder";

function FabNewOrder() {
  // eslint-disable-next-line no-unused-vars
  const [FabType, setFabType] = useState("Fabrication");
  return (
    <div>
      <NewOrder Type={FabType} />
    </div>
  );
}

export default FabNewOrder;
