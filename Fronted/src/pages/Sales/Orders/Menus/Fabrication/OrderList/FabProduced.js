import React from "react";
import OrderList from "../../../Components/OrderList/OrderList";

export default function FabProduced() {
  return (
    <>
      <OrderList type={"Fabrication"} orderStatus={"Produced"} />
    </>
  );
}
