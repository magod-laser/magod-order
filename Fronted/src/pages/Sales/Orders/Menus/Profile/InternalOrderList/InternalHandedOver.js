import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function InternalHandedOver() {
  return (
    <>
      <OrderList
        type={"Profile"}
        orderStatus={"HandedOver"}
        Order_Ref={"Profile"}
      />
    </>
  );
}
