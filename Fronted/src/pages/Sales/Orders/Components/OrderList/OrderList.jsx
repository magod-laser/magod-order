import React, { useState, useEffect } from "react";
import Axios from "axios";

import { Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apipoints } from "../../../../api/OrderList/OrderList";
import { Typeahead } from "react-bootstrap-typeahead";

import Header from "./Header/Header";
import OLTable from "./OLTable/OLTable";

export default function OrderList(props) {
  const [OriginalOrderListData, setOriginalOrderListData] = useState([]);
  const [FilteredOrderListData, setFilteredOrderListData] = useState([]);
  const [CustData, setCustData] = useState([]);

  const [OrderStatus, setOrderStatus] = useState([
    { label: "Created" },
    { label: "Recorded" },
    { label: "Processing" },
    { label: "Suspended" },
    { label: "Partial" },
    { label: "ShortClosed" },
    { label: "Completed" },
    { label: "Ready" },
    { label: "Dispatched" },
    { label: "Closed" },
    { label: "Cancelled" },
  ]);
  const orderTypeButtons = ["Complete", "Scheduled", "Open"];

  const [selectedCust, setSelectedCust] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState([]);
  const [selectedOrderType, setSelectedOrderType] = useState("");

  const [selectedOrderRow, setSelectedOrderRow] = useState({});

  const fetchData = () => {
    Axios.post(apipoints.getOrderListByType, {
      type: props.type,
      Order_Status: props.orderStatus,
      Order_Ref: props.Order_Ref,
    }).then((res) => {
      setOriginalOrderListData(res.data);
      setFilteredOrderListData(res.data);
      Axios.post(apipoints.getOrderListByTypeGroupedCustomer, {
        type: props.type,
        Order_Status: props.orderStatus,
        Order_Ref: props.Order_Ref,
      }).then((res) => {
        // let arr = [{ label: "All", Cust_Code: "All" }];

        let arr = [];
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].label = res.data[i].Cust_name;
          arr.push(res.data[i]);
        }
        setCustData(arr);
      });
    });
    if (props.orderStatus !== "All") {
      const arr = OrderStatus.filter((obj) => obj.label === props.orderStatus);
      setSelectedOrderStatus(arr);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedOrderRow({});
    let filteredArr = OriginalOrderListData;

    if (
      selectedCust.length > 0 &&
      (selectedCust[0].Cust_Code != undefined ||
        selectedCust[0].Cust_Code != null ||
        selectedCust[0].Cust_Code != "") &&
      selectedOrderStatus.length > 0 &&
      (selectedOrderStatus[0].label != undefined ||
        selectedOrderStatus[0].label != null ||
        selectedOrderStatus[0].label != "") &&
      selectedOrderType.length > 0 &&
      (selectedOrderType != undefined ||
        selectedOrderType != null ||
        selectedOrderType != "")
    ) {
      filteredArr = OriginalOrderListData.filter(
        (obj) =>
          obj.Cust_Code === selectedCust[0].Cust_Code &&
          obj.Order_Status === selectedOrderStatus[0].label &&
          obj.Order_Type === selectedOrderType
      );
    } else if (
      selectedCust.length > 0 &&
      (selectedCust[0].Cust_Code != undefined ||
        selectedCust[0].Cust_Code != null ||
        selectedCust[0].Cust_Code != "") &&
      selectedOrderStatus.length > 0 &&
      (selectedOrderStatus[0].label != undefined ||
        selectedOrderStatus[0].label != null ||
        selectedOrderStatus[0].label != "")
    ) {
      filteredArr = OriginalOrderListData.filter(
        (obj) =>
          obj.Cust_Code === selectedCust[0].Cust_Code &&
          obj.Order_Status === selectedOrderStatus[0].label
      );
    } else if (
      selectedOrderStatus.length > 0 &&
      (selectedOrderStatus[0].label != undefined ||
        selectedOrderStatus[0].label != null ||
        selectedOrderStatus[0].label != "") &&
      selectedOrderType.length > 0 &&
      (selectedOrderType != undefined ||
        selectedOrderType != null ||
        selectedOrderType != "")
    ) {
      filteredArr = OriginalOrderListData.filter(
        (obj) =>
          obj.Order_Status === selectedOrderStatus[0].label &&
          obj.Order_Type === selectedOrderType
      );
    } else if (
      selectedCust.length > 0 &&
      (selectedCust[0].Cust_Code != undefined ||
        selectedCust[0].Cust_Code != null ||
        selectedCust[0].Cust_Code != "") &&
      selectedOrderType.length > 0 &&
      (selectedOrderType != undefined ||
        selectedOrderType != null ||
        selectedOrderType != "")
    ) {
      filteredArr = OriginalOrderListData.filter(
        (obj) =>
          obj.Cust_Code === selectedCust[0].Cust_Code &&
          obj.Order_Type === selectedOrderType
      );
    } else if (
      selectedCust.length > 0 &&
      (selectedCust[0].Cust_Code != undefined ||
        selectedCust[0].Cust_Code != null ||
        selectedCust[0].Cust_Code != "")
    ) {
      filteredArr = OriginalOrderListData.filter(
        (obj) => obj.Cust_Code === selectedCust[0].Cust_Code
      );
    } else if (
      selectedOrderStatus.length > 0 &&
      (selectedOrderStatus[0].label != undefined ||
        selectedOrderStatus[0].label != null ||
        selectedOrderStatus[0].label != "")
    ) {
      filteredArr = OriginalOrderListData.filter(
        (obj) => obj.Order_Status === selectedOrderStatus[0].label
      );
    } else if (
      selectedOrderType.length > 0 &&
      (selectedOrderType != undefined ||
        selectedOrderType != null ||
        selectedOrderType != "")
    ) {
      filteredArr = OriginalOrderListData.filter(
        (obj) => obj.Order_Type === selectedOrderType
      );
    } else {
    }
    setFilteredOrderListData(filteredArr);
  }, [selectedCust, selectedOrderStatus, selectedOrderType]);

  const handleCustomerChange = (e) => {
    setSelectedCust(e);
  };

  const handleOrderStatusChange = (e) => {
    setSelectedOrderStatus(e);
  };

  const handleOrderTypeChange = (e) => {
    if (selectedOrderType === e.target.name) {
      setSelectedOrderType("");
    } else {
      setSelectedOrderType(e.target.name);
    }
  };

  const handleClearFilter = () => {
    setSelectedCust([]);
    setSelectedOrderType("");

    if (props.orderStatus === "All") {
      setSelectedOrderStatus([]);
    }
  };

  const handleOrderRowSelection = (rowVal) => {
    // console.log("rowvallllll", rowVal);
    if (rowVal.Order_No === selectedOrderRow.Order_No) {
      setSelectedOrderRow({});
    } else {
      setSelectedOrderRow(rowVal);
    }
  };

  return (
    <>
      <div>
        <h4 className="title m-0">
          Order List : {props.type} - {props.orderStatus}
        </h4>

        <div>
          <Header
            type={props.type}
            orderStatus={props.orderStatus}
            CustData={CustData}
            OrderStatus={OrderStatus}
            orderTypeButtons={orderTypeButtons}
            selectedCust={selectedCust}
            selectedOrderStatus={selectedOrderStatus}
            selectedOrderType={selectedOrderType}
            handleCustomerChange={handleCustomerChange}
            handleOrderStatusChange={handleOrderStatusChange}
            handleOrderTypeChange={handleOrderTypeChange}
            handleClearFilter={handleClearFilter}
            selectedOrderRow={selectedOrderRow}
            FilteredOrderListData={FilteredOrderListData}
          />
          <div className="p-1"></div>
          <OLTable
            FilteredOrderListData={FilteredOrderListData}
            selectedOrderRow={selectedOrderRow}
            handleOrderRowSelection={handleOrderRowSelection}
          />
        </div>
      </div>
      <div className="p-3"></div>
    </>
  );
}
