import React from "react";
import OrderList from "../../../../Components/OrderList/OrderList";

export default function ServiceProcessing() {
  return (
    <>
      <OrderList type={"Service"} orderStatus={"Processing"} />
    </>
  );
}
