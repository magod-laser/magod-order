import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function InternalProcessing() {
  return (
    <>
      <OrderList
        type={"Profile"}
        orderStatus={"Processing"}
        Order_Ref={"Profile"}
      />
    </>
  );
}
