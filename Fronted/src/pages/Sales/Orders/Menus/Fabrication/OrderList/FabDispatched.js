import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FabDispatched() {
  return (
    <>
      <OrderList type={"Fabrication"} orderStatus={"Dispatched"} />
    </>
  );
}
