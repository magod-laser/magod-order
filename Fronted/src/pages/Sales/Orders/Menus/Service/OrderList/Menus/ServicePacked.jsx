import React from "react";
import OrderList from "../../../../Components/OrderList/OrderList";

export default function ServicePacked() {
  return (
    <>
      <OrderList type={"Service"} orderStatus={"Packed"} />
    </>
  );
}
