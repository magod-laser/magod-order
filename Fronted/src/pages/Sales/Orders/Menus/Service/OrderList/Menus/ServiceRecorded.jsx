import React from "react";
import OrderList from "../../../../Components/OrderList/OrderList";

export default function ServiceRecorded() {
  return (
    <>
      <OrderList type={"Service"} orderStatus={"Recorded"} />
    </>
  );
}
