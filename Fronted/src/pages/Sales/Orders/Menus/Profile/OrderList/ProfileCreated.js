import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function ProfileCreated() {
  return (
    <>
      <OrderList type={"Profile"} orderStatus={"Created"} />
    </>
  );
}
