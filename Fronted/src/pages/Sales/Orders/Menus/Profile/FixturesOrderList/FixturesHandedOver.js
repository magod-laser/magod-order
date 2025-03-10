import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FixturesHandedOver() {
  return (
    <>
      <OrderList
        type={"Profile"}
        orderStatus={"HandedOver"}
        Order_Ref={"Fixture"}
      />
    </>
  );
}
