import React from "react";
import OrderList from "../../../../Components/OrderList/OrderList";

export default function ServiceAll() {
  return (
    <>
      <OrderList type={"Service"} orderStatus={"All"} />
    </>
  );
}
