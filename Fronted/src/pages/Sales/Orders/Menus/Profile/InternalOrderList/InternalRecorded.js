import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function InternalRecorded() {
  return (
    <>
      <OrderList
        type={"Profile"}
        orderStatus={"Recorded"}
        Order_Ref={"Profile"}
      />
    </>
  );
}
