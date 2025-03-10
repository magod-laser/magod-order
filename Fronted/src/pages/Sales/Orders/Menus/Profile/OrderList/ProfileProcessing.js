import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function ProfileProcessing() {
  return (
    <>
      <OrderList type={"Profile"} orderStatus={"Processing"} />
    </>
  );
}
