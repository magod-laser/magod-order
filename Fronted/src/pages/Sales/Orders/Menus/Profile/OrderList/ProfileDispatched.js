import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function ProfileDispatched() {
  return (
    <>
      <OrderList type={"Profile"} orderStatus={"Dispatched"} />
    </>
  );
}
