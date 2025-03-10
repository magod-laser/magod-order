import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FixturesCompleted() {
  return (
    <>
      <OrderList
        type={"Profile"}
        orderStatus={"Completed"}
        Order_Ref={"Fixture"}
      />
    </>
  );
}
