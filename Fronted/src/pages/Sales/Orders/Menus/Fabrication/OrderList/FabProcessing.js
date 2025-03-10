import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FabProcessing() {
  return (
    <>
      <OrderList type={"Fabrication"} orderStatus={"Processing"} />
    </>
  );
}
