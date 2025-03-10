import React from "react";
import OrderList from "../../../../Components/OrderList/OrderList";

export default function ServiceProduced() {
  return (
    <>
      <OrderList type={"Service"} orderStatus={"Produced"} />
    </>
  );
}
