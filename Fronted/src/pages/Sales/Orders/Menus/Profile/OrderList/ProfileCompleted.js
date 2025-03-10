import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function ProfileCompleted() {
  return (
    <>
      <OrderList type={"Profile"} orderStatus={"Completed"} />
    </>
  );
}
