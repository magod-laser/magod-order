import React, { useState, useContext } from "react";

const OrderContext = React.createContext();

export function useOrderContext() {
    return useContext(OrderContext);
}

export function OrderProvider({children}) {
    const [orders, setOrder] = useState();

    function setOrderState(orders) {
        console.log("setOrderState - Context");
        console.log(orders);
        setOrder(orders);
    }
    return (
        <OrderContext.Provider value={{orders, setOrderState}}>
            {children}
        </OrderContext.Provider>
    );
}