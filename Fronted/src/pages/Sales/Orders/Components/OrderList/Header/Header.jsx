import React from "react";

import { Link } from "react-router-dom";
import moment from "moment";
import * as XLSX from 'xlsx';
import { Typeahead } from "react-bootstrap-typeahead";

export default function Header(props) {
  const style = {
    boxHeight: {
      height: "111px",
    },
  };

  const PrintXLOrderListTable =()=>{
    console.log("props.FilteredOrderListData",props.FilteredOrderListData); 
      if(props.FilteredOrderListData.length>0){
        console.log("FilteredOrderListData",props.FilteredOrderListData);
        const columns=['Order_Status','Order_No','Order_Date','Cust_name','Delivery_Date','Contact_Name','Purchase_Order','Special_Instructions'];
        let fileName = "OrderListTable_"+props.FilteredOrderListData[0].Order_No +"_"+moment(new Date()).format("DDMMYYYY");
        exportToExcel(props.FilteredOrderListData,columns,fileName)
  
      }
    }
  
    const exportToExcel= (data, columns, filName) => {
      // const processedData = preprocessedData(data);
      // const filtereddata = processedData.map(row => {
      const filtereddata = data.map(row => {
        const filteredRow = {};
        columns.forEach(column => {
          if(row.hasOwnProperty(column)) {
            filteredRow[column] = row[column];
          }
        });
        return filteredRow;
      });
  
      const worksheet = XLSX.utils.json_to_sheet(filtereddata);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `${filName}.xlsx`);
    };
  
  return (
    <>
      <div className="row">
        <div className="col-md-10">
          <div>
            <label className="form-label">Search Order List</label>
            <div
              className="p-1 row d-flex align-items-center justify-content-between"
              style={{
                ...style.boxHeight,
                border: "1px solid lightgray",
                borderRadius: "5px",
              }}
            >
              {/* select customer */}
              <div className="col-md-9">
                <div className="d-flex field-gap">
                  <label className="form-label">Customer</label>
                  <Typeahead
                    className="ip-select mt-1"
                    placeholder="Select the Customer..."
                    selected={
                      props.selectedCust.length === 0 ? [] : props.selectedCust
                    }
                    options={props.CustData}
                    onChange={props.handleCustomerChange}
                  />
                </div>
              </div>
              {/* order status */}
              <div className="col-md-3">
                <div className="d-flex field-gap">
                  <label className="form-label label-space">Order Status</label>
                  <Typeahead
                    placeholder="Select Order Status..."
                    selected={
                      props.selectedOrderStatus.length === 0
                        ? []
                        : props.selectedOrderStatus
                    }
                    disabled={props.orderStatus !== "All"}
                    className={
                      props.orderStatus !== "All"
                        ? "input-disabled mt-1"
                        : "ip-select mt-1"
                    }
                    options={props.OrderStatus}
                    onChange={props.handleOrderStatusChange}
                  />
                </div>
              </div>
              {/* order type */}
              <div className="d-flex col-md-8 field-gap">
                <label className="form-label">Order Type</label>
                {props.orderTypeButtons.map((val) => (
                  <div className="col-md-3">
                    <button
                      className="button-style m-0 p-0 border rounded"
                      style={
                        !(props.selectedOrderType === val)
                          ? {
                              height: "auto",
                              width: "100%",
                              background: "none",
                              color: "black",
                            }
                          : { height: "auto", width: "100%" }
                      }
                      id="OrderType"
                      name={val}
                      onClick={props.handleOrderTypeChange}
                    >
                      {val}
                    </button>
                  </div>
                ))}
              </div>
              {/* clear filter */}
              <div className="col-md-2">
                <button
                  className="button-style m-0"
                  style={{ width: "100%" }}
                  onClick={props.handleClearFilter}
                >
                  Clear Filter
                </button>
              </div>
              
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div>
            <label className="form-label">Task Pane</label>
            <div
              className="p-1 row d-flex align-items-center"
              style={{
                ...style.boxHeight,
                border: "1px solid lightgray",
                borderRadius: "5px",
              }}
            >
              <div className="col-md-12">
                <Link
                  to={`/Orders/${props.type}/ScheduleCreationForm`}
                  state={props.selectedOrderRow.Order_No}
                >
                  <button
                    style={{ width: "100%" }}
                    disabled={!props.selectedOrderRow.Order_No}
                    className={
                      !props.selectedOrderRow.Order_No
                        ? "button-disabled button-style m-0"
                        : "button-style m-0"
                    }
                  >
                    Open Order
                  </button>
                </Link>
              </div>
              <button
              className="button-style"
              onClick={PrintXLOrderListTable}
              style={{ width: "89%" , marginLeft:"11px"}}
            >
              To Excel
            </button>
              {/* <div className="p-1"></div> */}
              <div className="col-md-12">
                <Link to="/Orders">
                  <button
                    className="button-style m-0"
                    style={{ width: "100%" }}
                  >
                    Close
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
