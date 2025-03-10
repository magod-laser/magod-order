import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function ProfileAll() {
  return (
    <>
      <OrderList type={"Profile"} orderStatus={"All"} />
    </>
  );
}
