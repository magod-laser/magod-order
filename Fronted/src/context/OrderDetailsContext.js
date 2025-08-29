// OrderDetailsContext.js
import React, { createContext, useContext, useState } from "react";

const OrderDetailsContext = createContext();

export const OrderDetailsProvider = ({ children }) => {
  const [ConordrDetailsData, setConOrdrDetailsData] = useState(null);

  return (
    <OrderDetailsContext.Provider
      value={{ ConordrDetailsData, setConOrdrDetailsData }}
    >
      {children}
    </OrderDetailsContext.Provider>
  );
};

export const useOrderDetails = () => useContext(OrderDetailsContext);
