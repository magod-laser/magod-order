import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function ProfilePacked() {
  return (
    <>
      <OrderList type={"Profile"} orderStatus={"Packed"} />
    </>
  );
}
