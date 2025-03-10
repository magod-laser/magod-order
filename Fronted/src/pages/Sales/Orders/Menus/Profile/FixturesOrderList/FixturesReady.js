import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FixturesReady() {
  return (
    <>
      <OrderList type={"Profile"} orderStatus={"Ready"} Order_Ref={"Fixture"} />
    </>
  );
}
