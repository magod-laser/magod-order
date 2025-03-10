import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FabRecorded() {
  return (
    <>
      <OrderList type={"Fabrication"} orderStatus={"Recorded"} />
    </>
  );
}
