import React from "react";
import OrderList from "../../../../Components/OrderList/OrderList";

export default function ServiceCreated() {
  return (
    <>
      <OrderList type={"Service"} orderStatus={"Created"} />
    </>
  );
}
