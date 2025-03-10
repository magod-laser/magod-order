import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FabAll() {
  return (
    <>
      <OrderList type={"Fabrication"} orderStatus={"All"} />
    </>
  );
}
