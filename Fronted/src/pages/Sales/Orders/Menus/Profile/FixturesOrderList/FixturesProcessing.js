import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FixturesProcessing() {
  return (
    <>
      <OrderList
        type={"Profile"}
        orderStatus={"Processing"}
        Order_Ref={"Fixture"}
      />
    </>
  );
}
