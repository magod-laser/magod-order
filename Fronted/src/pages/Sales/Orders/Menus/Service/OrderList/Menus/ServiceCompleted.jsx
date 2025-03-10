import React from "react";
import OrderList from "../../../../Components/OrderList/OrderList";
export default function ServiceCompleted() {
  return (
    <>
      <OrderList type={"Service"} orderStatus={"Completed"} />
    </>
  );
}
