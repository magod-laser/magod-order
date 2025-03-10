import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FabCompleted() {
  return (
    <>
      <OrderList type={"Fabrication"} orderStatus={"Completed"} />
    </>
  );
}
