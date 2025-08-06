

import React, { useState } from "react";
import FindOrder from "../../../Components/Find Order/FindOrder";

function FabFindOrder(props) {
  // eslint-disable-next-line no-unused-vars
  const [fabType, setFabType] = useState("Fabrication");
  return (
    <div>
      <FindOrder Type={fabType} />
    </div>
  );
}

export default FabFindOrder;
