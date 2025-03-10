import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
// import Dispatched from "../OrderList/Dispatched";
import { toast, ToastContainer } from "react-toastify";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

export default function InternalCompleted(props) {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let [custdata, setCustdata] = useState([]);
  let [Bs_order, setBs_order] = useState([]);
  let [ordstatus, setOrdstatus] = useState("");
  let [StrOrderType, setStrOrderType] = useState("");
  let [custcode, setCustCode] = useState("");
  let [ordstatdata, setOrdstatdata] = useState([]);
  let [selectedOrderID, setSelectedOrderID] = useState("");
  let [orderNo, setOrderNo] = useState("");

  // let [strType, setStrType] = useState(searchParams.get("ordformat"));
  let [strType, setStrType] = useState("Profile");
  let [strstatus, setStrstatus] = useState(searchParams.get("ordstatus"));
  let [FormOK, setFormOK] = useState(false);
  let [strInternalType, setStrInternalType] = useState("Normal");

  //strInternalType = "Normal";
  useEffect(() => {
    async function fetchData() {
      await postRequest(endpoints.getCustomers, {}, (custdata) => {
        console.log(custdata);
        setCustdata(custdata);
      });

      await postRequest(endpoints.getOrderStatusList, {}, (ordstatdata) => {
        console.log(ordstatdata);
        setOrdstatdata(ordstatdata);
      });
    }
    fetchData();
  }, []);

  let selectedCust = async (e) => {
    //   e.preventDefault();
    let cust = {};
    for (let i = 0; i < custdata.length; i++) {
      if (e.length > 0 && custdata[i]["Cust_Code"] === e[0].Cust_Code) {
        cust = custdata[i];
        break;
      }
    }
    setCustCode(cust.Cust_Code != undefined ? cust.Cust_Code : "");

    // postRequest(
    //   endpoints.getCustomerDetails, { custcode: cust.Cust_Code, },
    //   (resp) => {
    //     console.log(resp)
    //     let excustdata = resp[0];
    //     if (excustdata == undefined) return;
    //     //   console.log(resp[0]["EMail"])
    //     setCustNameselected(resp[0]["Cust_name"]);
    //     setCustomername(resp[0]["Cust_name"]);

    //     setCustCode(excustdata.Cust_Code);
    //     setFormEmailId(excustdata.EMail);
    //     setFormContact(excustdata.PurchaseContact1 ? excustdata.PurchaseContact1 : excustdata.PurchaseContact2 ? excustdata.PurchaseContact2 : "")
    //     setFormCustTele(excustdata.TelePurchase1 ? excustdata.TelePurchase1 : excustdata.TelePurchase2 ? excustdata.TelePurchase2 : "")
    //     setFormCustAddr(excustdata.Address ? excustdata.Address : "")
    //   })
  };

  let selectOStatus = async (e) => {
    setStrstatus(e.target.value);
    call_setupdata(e.target.value);
    setOrdstatus(e.target.value);
  };

  let OrderDetailsList = async (id, bs_ord) => {
    console.log("Order Details List Function");
    console.log(id);
    setSelectedOrderID(id);
    console.log(bs_ord);
    setOrderNo(bs_ord.Order_No);
    console.log(bs_ord.Order_No);
  };

  let clearFilters = async (e) => {
    custcode = "";
    StrOrderType = "";
    strstatus = "";
    //  RadioButton1.Checked = false;
    // RadioButton2.Checked = false;
    // RadioButton3.Checked = false;
    // call_setupdata()
  };

  let ordtyperadbutton = async (e) => {
    console.log(e.target.value);
    setStrOrderType(e.target.value);
  };

  const call_setupdata = async (ordstatus) => {
    // console.log(ordstatus);
    // console.log(StrOrderType);
    // console.log(strType);
    // console.log(searchParams.get("ordstat"));
    await postRequest(
      endpoints.getOrderListData,
      {
        otype: strType,
        ordstatus: ordstatus,
        strInternalType: strInternalType,
      },
      (bs_order) => {
        console.log("bs_order.......", bs_order);
        setBs_order(bs_order);
        setFormOK(true);
      }
    );
  };

  let renderInternalOrderList = (bs_ord, id) => {
    console.log(bs_ord);

    switch (ordstatus) {
      case "Recorded":
        return (
          <tr
            style={{
              backgroundColor:
                selectedOrderID === id ? "#98A8F8" : "GreenYellow",
              cursor: "pointer",
            }}
            id={id}
            onClick={() => {
              OrderDetailsList(id, bs_ord);
            }}
          >
            <td>{bs_ord["Order_Status"]}</td>
            <td>{bs_ord["Order_No"]}</td>
            <td>{moment(bs_ord["Order_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Cust_name"]}</td>
            <td>{moment(bs_ord["Delivery_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Contact_Name"]}</td>
            <td>{bs_ord["Purchase_Order"]}</td>
            <td>{bs_ord["Special_Instructions"]}</td>
          </tr>
        );
        break;
      case "Processing":
        return (
          <tr
            style={{
              backgroundColor: selectedOrderID === id ? "#98A8F8" : "Honeydew",
              cursor: "pointer",
            }}
            id={id}
            onClick={() => {
              OrderDetailsList(id, bs_ord);
            }}
          >
            <td>{bs_ord["Order_Status"]}</td>
            <td>{bs_ord["Order_No"]}</td>
            <td>{moment(bs_ord["Order_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Cust_name"]}</td>
            <td>{moment(bs_ord["Delivery_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Contact_Name"]}</td>
            <td>{bs_ord["Purchase_Order"]}</td>
            <td>{bs_ord["Special_Instructions"]}</td>
          </tr>
        );
        break;
      case "Completed":
        return (
          <tr
            style={{
              backgroundColor:
                selectedOrderID === id ? "#98A8F8" : "LightGreen",
              cursor: "pointer",
            }}
            id={id}
            onClick={() => {
              OrderDetailsList(id, bs_ord);
            }}
          >
            <td>{bs_ord["Order_Status"]}</td>
            <td>{bs_ord["Order_No"]}</td>
            <td>{moment(bs_ord["Order_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Cust_name"]}</td>
            <td>{moment(bs_ord["Delivery_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Contact_Name"]}</td>
            <td>{bs_ord["Purchase_Order"]}</td>
            <td>{bs_ord["Special_Instructions"]}</td>
          </tr>
        );
        break;
      case "Ready":
        return (
          <tr
            style={{
              backgroundColor:
                selectedOrderID === id ? "#98A8F8" : "YellowGreen",
              cursor: "pointer",
            }}
            id={id}
            onClick={() => {
              OrderDetailsList(id, bs_ord);
            }}
          >
            <td>{bs_ord["Order_Status"]}</td>
            <td>{bs_ord["Order_No"]}</td>
            <td>{moment(bs_ord["Order_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Cust_name"]}</td>
            <td>{moment(bs_ord["Delivery_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Contact_Name"]}</td>
            <td>{bs_ord["Purchase_Order"]}</td>
            <td>{bs_ord["Special_Instructions"]}</td>
          </tr>
        );
        break;
      case "Dispatched":
        return (
          <tr
            style={{
              backgroundColor: selectedOrderID === id ? "#98A8F8" : "Green",
              cursor: "pointer",
            }}
            id={id}
            onClick={() => {
              OrderDetailsList(id, bs_ord);
            }}
          >
            <td>{bs_ord["Order_Status"]}</td>
            <td>{bs_ord["Order_No"]}</td>
            <td>{moment(bs_ord["Order_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Cust_name"]}</td>
            <td>{moment(bs_ord["Delivery_Date"]).format("DD/MM/YYYY")}</td>
            <td>{bs_ord["Contact_Name"]}</td>
            <td>{bs_ord["Purchase_Order"]}</td>
            <td>{bs_ord["Special_Instructions"]}</td>
          </tr>
        );
        break;
      default:
        break;
    }
  };

  let openorder = async () => {
    console.log("Open Order Function");
    //  if (orderNo != "") {
    alert("Order No : " + orderNo + " is opened successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
    //  navigate("/orders/OrderDetails/" + orderNo);
    //  }
  };

  return (
    <div>
      <div className="row">
        <h4 className="title">
          Internal Order List : {props.Type} - Completed
        </h4>
      </div>
      <div className="row mt-2">
        <div className="col-md-2 sm-12">
          <h6>Task Pane</h6>
          <div className="row">
            <div className="col-md-6 sm-4">
              <button
                className="button-style"
                style={{ width: "120px" }}
                onClick={() => openorder()}
              >
                Open Order
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 sm-4 mt-1">
              <button className="button-style" style={{ width: "120px" }}>
                Exit
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-10 sm-12">
          <h6>Search Order List</h6>
          <div className="row">
            <div className="col-md-6 sm-12">
              <div className="row">
                <div className="col-md-4 sm-12">
                  <label className="form-label">Customer</label>
                </div>
                <div className="col-md-8 sm-12">
                  {custdata.length > 0 ? (
                    <Typeahead
                      id="basic-example"
                      labelKey="Cust_name"
                      onChange={selectedCust}
                      options={custdata}
                      placeholder="Choose a Customer..."
                    ></Typeahead>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="row mt-2">
                <div
                  className="col-md-6 sm-12"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <label className="form-label">Order Type</label>
                  <div className="mt-2">
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio1"
                        value="Complete"
                        style={{ marginTop: "12px" }}
                        onChange={ordtyperadbutton}
                      />
                      <label class="form-check-label" for="inlineRadio1">
                        Complete
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio2"
                        value="Scheduled"
                        onChange={ordtyperadbutton}
                        style={{ marginTop: "12px" }}
                      />
                      <label class="form-check-label" for="inlineRadio2">
                        Scheduled
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio3"
                        value="Open"
                        onChange={ordtyperadbutton}
                        style={{ marginTop: "12px" }}
                      />
                      <label class="form-check-label" for="inlineRadio3">
                        Open
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 sm-12">
              <div className="row">
                <div className="col-md-4 sm-12">
                  <label className="form-label">Order Status</label>
                </div>
                <div className="col-md-8 sm-12 ">
                  {/* {searchParams.get("ordstat") == "All" ? ( */}
                  {ordstatdata.length > 0 ? (
                    <select
                      className="ip-select col-md-6"
                      controlId="ordstatus"
                      onChange={selectOStatus}
                    >
                      <option value="" disabled selected>
                        ** Select **{" "}
                      </option>
                      {ordstatdata.map((ordstat) => {
                        return (
                          <option value={ordstat["Status"]}>
                            {ordstat["Status"]}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-4 sm-12 mt-3">
                  <button
                    className="button-style"
                    style={{ width: "120px" }}
                    onClick={clearFilters}
                  >
                    Clear Filter
                  </button>
                </div>
                <div className="col-md-4 sm-12 mt-3">
                  <Link to={"/Orders"}>
                    <button className="button-style" style={{ width: "120px" }}>
                      Close
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-2 mb-4"
        style={{ overflowY: "scroll", height: "400px" }}
      >
        <Table striped className="table-data border" style={{ border: "1px" }}>
          <thead className="tableHeaderBGColor">
            <tr>
              <th>Status</th>
              <th>Order No</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Delivery Date</th>
              <th>Contact Name</th>
              <th>PO No</th>
              <th>Special Instructions</th>
            </tr>
          </thead>

          <tbody className="tablebody">
            {Bs_order != null && Bs_order.length > 0
              ? Bs_order.map((bs_ord, id) =>
                  renderInternalOrderList(bs_ord, id)
                )
              : ""}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
