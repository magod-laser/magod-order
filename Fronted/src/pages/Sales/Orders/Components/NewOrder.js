/** @format */

import React, { useEffect, useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast, useToastContainer } from "react-toastify";
import { useOrderContext } from "../../../../context/OrderContext";
import AlertModal from "./Components/Alert";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function NewOrder(props) {
  // const [searchParams] = useSearchParams();

  let navigate = useNavigate();
  let { orders, setOrderState } = useOrderContext() || {};
  let [orderno, setOrderno] = useState("");

  let [formPaymentTerms, setFormPaymentTerms] = useState("");
  let [salesExecdata, setSalesExecdata] = useState([]);
  //let [selectCust, setSelectCust] = useState("");
  let [custdata, setCustdata] = useState([]);
  let [statesdata, setStatesdata] = useState([]);
  let [creditTermsdata, setCreditTermsdata] = useState([]);
  let [qtnnossentdata, setQtnNosSentData] = useState([]);
  let [selectedqtnno, setSelectedqtnno] = useState([]);

  let [quotationNo, setQuotationNo] = useState("");
  let [CustomerName, setCustomerName] = useState("");
  let [CustCode, setCustCode] = useState("");
  let [formOrderDate, setFormOrderDate] = useState("");
  const [formDeliveryDate, setformDeliveryDate] = useState("");
  let [CustomerContact, setCustomerContact] = useState("");
  let [GSTIN, setGSTIN] = useState("");
  let [formBillingAddress, setFormBillingAddress] = useState("");
  let [formSpecialInstructions, setFormSpecialInstructions] = useState("");
  let [formBillingState, setFormBillingState] = useState("");
  let [formMagodDelivery, setFormMagodDelivery] = useState(false);
  let [formShippingAddress, setFormShippingAddress] = useState("Ex Factory");
  let [formGSTTaxState, setFormGSTTaxState] = useState("");
  let [formTransportCharges, setFormTransportCharges] = useState("");
  let [formquotationNo, setFormQuotationNo] = useState("");
  let [purchaseorder, setPurchaseorder] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [SmShow, setSmShow] = useState(false);
  // let Oformat = searchParams.get("OrdType");

  // Alert Modals
  const [alertModal, setAlertModal] = useState(false);

  //login user name
  const [userName, setuserName] = useState("");

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("LazerUser"));
    setuserName(data.data[0].Name);

    var currentDate = new Date();
    // console.log("curr date", currentDate);

    currentDate.setDate(currentDate.getDate() + 2);
    var formattedDate = currentDate.toISOString().slice(0, 10);
    setformDeliveryDate(formattedDate);

    // console.log("second", formattedDate);

    setFormOrderDate(new Date().toISOString().slice(0, 10));
    // console.log("first", new Date().toISOString().slice(0, 10));

    async function fetchData() {
      await postRequest(endpoints.getCustomers, {}, (cdata) => {
        console.log("cdata", cdata);
        setCustdata(cdata);
      });

      await postRequest(endpoints.getSalesExecLists, {}, (sdata) => {
        {
          // console.log(sdata);
        }
        setSalesExecdata(sdata);
      });
      await postRequest(endpoints.getStates, {}, (sdata) => {
        setStatesdata(sdata);
      });
      await postRequest(endpoints.getCreditTerms, {}, (tcdata) => {
        setCreditTermsdata(tcdata);
        //        setLoaded(true);
      });

      await postRequest(
        endpoints.getQuoteNosSent,
        { ordtype: props.Type },
        (qtnsentdata) => {
          //Console.log(qtnsentdata);
          setQtnNosSentData(qtnsentdata);
        }
      );
    }
    fetchData();
  }, []);

  useEffect(() => {
    toggleSelectDisabled();
  }, [isChecked]);
  // alert modals for register and save
  const openModal = (e) => {
    e.preventDefault();
    setAlertModal(true);
    // SaveOrder(e);
  };
  const closeModal = () => {
    setAlertModal(false);
  };

  let selectQtns = (selectedqtnno) => {
    setQuotationNo(selectedqtnno[0].QtnNo);
    setFormQuotationNo(selectedqtnno[0].QtnNo);
    if (selectedqtnno.length == 0 || selectedqtnno[0].QtnID == undefined)
      return;
    setQuotationNo(selectedqtnno[0].QtnNo);
    setFormQuotationNo(selectedqtnno[0].QtnNo);
  };

  let handleInputChange = (input) => {
    selectedqtnno = input;
  };

  let selectCust = async (e) => {
    let cust;
    // console.log("custdata.length", custdata.length);

    for (let i = 0; i < custdata.length; i++) {
      if (custdata[i]["Cust_Code"] === e[0].Cust_Code) {
        cust = custdata[i];
        break;
      }
    }
    // console.log("cust", cust);

    setCustCode(cust.Cust_Code);
    setCustomerContact(
      cust.PurchaseContact1
        ? cust.PurchaseContact1
        : cust.PurchaseContact2
        ? cust.PurchaseContact2
        : ""
    );
    setFormPaymentTerms(cust.CreditTerms);
    setGSTIN(cust.GSTNo);
    setFormBillingAddress(cust.Address);
    setFormBillingState(cust.State);
    setFormGSTTaxState(cust.State);

    //setCustCode(e.target.value);
    //  setCustomerName(e.target.elements.Cust_name.value);
    for (let i = 0; i < custdata.length; i++) {
      if (custdata[i].Cust_Code == e[0].Cust_Code) {
        document.getElementById("formPaymentTerms").value = cust.CreditTerms;
        document.getElementById("formBillingAddress").value = cust.Address;
        // document.getElementById("formGSTNNo").value = cust?.GSTNo;
        if (cust?.StateId === "00" || cust?.StateId === 0) {
          toast.warning("Please update StateId in CustomerInfo.");
        } else if (cust?.GSTNo) {
          document.getElementById("formGSTNNo").value = cust.GSTNo;
        } else {
          toast.warning("Please update GST number in CustomerInfo.");
        }
        document.getElementById("formBillingState").value = cust.State;
        document.getElementById("formGSTTaxState").value = cust.State;
        break;
      }
    }
  };

  const [selectedOrderType, setSelectedOrderType] = useState("Complete");

  function handleOrderTypeChange(event) {
    // const selectedOrderType = event.target.value;
    // Do something with the selected order type
    // console.log("Selected order type:", event.target.value);
    setSelectedOrderType(event.target.value);
    // You can perform any action here based on the selected value
  }

  // console.log("selectedOrderType", selectedOrderType);

  async function SaveOrder(e) {
    if (e) {
      e.preventDefault();
      // toast.error("Event", e);
    } else {
      // console.error("Event object is undefined in SaveOrder function.");
      toast.error("Event object is undefined in SaveOrder function.", {
        autoClose: 1500,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 1500);
      return;
    }
    e.preventDefault();

    if(e.target.elements?.formPurchaseOrderNo.value.length > 100){
      // toast.error("Data too long for the column Purchase_Order at row 1!");
      alert("Data too long for Purchase_Order field, Data not Saved..")
      return;
    }
    else if(e.target.elements?.formSpecialInstructions.value.length > 100){
      // toast.error("Data too long for Special_Instruction field, Data not Saved..!");
      alert("Data too long for Special_Instruction field, Data not Saved..")
      return;

    }
    // Order_Type = "complete"
    // Type = "Service"
    // console.log("Type", e.target.elements?.formOrderType.value);
    // let ordertype = selectedOrderType;
    let ordertype = props.Type;
    let type = selectedOrderType;
    // console.log("ordertype", ordertype);
    let purchaseorder = e.target.elements?.formPurchaseOrderNo.value;

    let qtnno = formquotationNo;
    let deldate = e.target.elements?.formDeliveryDate.value;
    let deliverydate = deldate;
    // console.log("deliverydate", deliverydate);
    let paymentterms = e.target.elements?.formPaymentTerms.value;
    let salesContact = e.target.elements?.formSalesContact.value;
    // console.log("asdfghjkl...", salesContact);
    //let customername = e.target.elements.CustomerName.value;
    // postRequest(endpoints.getCustomerDets, { CustomerName }, (data) => {
    //   setCustCode(data.Cust_code);
    //   setCustomerContact(data.Cust_contact);
    //   setGSTIN(data.GSTIN);
    // });
    //let custcode = CustCode;
    ////Console.log(custcode);
    //let customer = ''; //CustomerName; // e.target.elements.CustName.value;
    // postRequest(endpoints.getCustomerDets, { custcode }, (data) => {
    //   customer = data.Cust_name;
    // })
    ////Console.log(customer);
    //  let CustomerContact = e.target.elements.formCustomerContact.value;
    let receivedby = e.target.elements?.formReceivedBy.value;
    let RecordedBy = e.target.elements?.formRecordedBy.value;
    // let gstin = e.target.elements.formGSTNNo.value;
    let DealingEngineer = e.target.elements?.formDealingEngineer.value;
    let DeliveryMode = e.target.elements?.formDeliveryMode.value;
    let billingAddress = e.target.elements?.formBillingAddress.value;
    let SpecialInstructions = e.target.elements?.formSpecialInstructions.value;
    let BillingState = e.target.elements?.formBillingState?.value;
    // let MagodDelivery = e.target.elements.formMagodDelivery.value;
    let MagodDelivery = formMagodDelivery;
    //console.log("MagodDelivery", MagodDelivery);
    let shippingAddress = e.target.elements?.formShippingAddress.value;
    let GSTTaxState = e.target.elements?.formGSTTaxState.value;
    let Transportcharges = e.target.elements?.formTransportCharges.value;

    // console.log("MagodDelivery", MagodDelivery);
    if (!isChecked) {
      deliveryModeSelectRef?.current.reportValidity();
    }
    await postRequest(
      endpoints.saveCreateOrder,
      {
        ordertype,
        type,
        purchaseorder,
        qtnno,
        deliverydate,
        paymentterms,
        salesContact,
        CustCode,
        CustomerContact,
        receivedby,
        RecordedBy,
        GSTIN,
        DealingEngineer,
        DeliveryMode,
        billingAddress,
        SpecialInstructions,
        BillingState,
        MagodDelivery,
        shippingAddress,
        GSTTaxState,
        Transportcharges,
      },
      async (resp) => {
        setOrderno(resp.orderno);
        // postRequest(endpoints.getCustomerDets, { CustCode }, (custdata) => {
        //   //Console.log(custdata[0]["Cust_name"]
        //   setCustomerName(custdata[0]["Cust_name"]);
        // })
        let orders = {
          orderno: resp.orderno,
          ordertype: ordertype,
          purchaseorder: purchaseorder,
          paymentterms: paymentterms,
          qtnno: qtnno,
          deliverydate: deliverydate,
          salesContact: salesContact,
          custcode: CustCode,
          customer: CustomerName, // customer
          CustomerContact: CustomerContact,
          receivedby: receivedby,
          RecordedBy: RecordedBy,
          DealingEngineer: DealingEngineer,
          DeliveryMode: DeliveryMode,
          MagodDelivery: MagodDelivery,

          Transportcharges: Transportcharges,
        };
        // await setOrderState(orders);
        //   localStorage.setItem("LazerOrder", JSON.stringify(orderno,customer))
        let Ordno = resp.orderno;

        toast.success("Order Created with " + Ordno, { autoClose: 2100 });
        setTimeout(() => {
          if (Ordno != null) {
            if (props.Type === "Profile") {
              navigate("/Orders/Profile/ScheduleCreationForm", {
                state: Ordno,
              });
            } else if (props.Type === "Fabrication") {
              navigate("/Orders/Fabrication/ScheduleCreationForm", {
                state: Ordno,
              });
            } else if (props.Type === "Service") {
              navigate("/Orders/Service/ScheduleCreationForm", {
                state: Ordno,
              });
            }
          } else {
            toast.error(
              "Order Not Created",
              { autoClose: 1000 },
              { position: toast.POSITION.TOP_CENTER }
            );
          }
        }, 1700);
      }
    );
  }

  const POInputChange = (e) => {
    e.preventDefault();
    setPurchaseorder(e.target.value);
    if (e.target.value.length > 100) {
      // toast.error("PO No cannot be more than 100 characters!");
      toast.error("Data too long for the column Purchase_Order at row 1!");

    }
  };

  const handleSpecialInstructionsChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setFormSpecialInstructions(value);
  
    // Check if length exceeds 100 characters
    if (value.length > 100) {
      // toast.error("Special Instructions cannot be more than 100 characters!");
      toast.error(
        "Data too long for the column Special_Instructions at row 1!!"
      );
    }
  }
  const handleCheckboxChange = () => {
    const newCheckedValue = !isChecked;
    setChecked(newCheckedValue);
    setFormMagodDelivery(newCheckedValue);
    if (newCheckedValue === true) {
      setFormShippingAddress(formBillingAddress);
    } else {
      setFormShippingAddress("Ex Factory");
    }
  };
  // const TransportChargesInpChnage = (e) => {
  //   e.preventDefault();
  ////console.log(e.target.value);
  //   setFormTransportCharges(true);
  // };
  const handleSaveButtonClick = () => {
    setSmShow(true);
  };

  // Ref for the select element
  const deliveryModeSelectRef = useRef(null);

  // Function to toggle the disabled attribute of the select field
  const toggleSelectDisabled = () => {
    const select = deliveryModeSelectRef.current;
    if (isChecked && select.disabled) {
      select.disabled = false;
      select.required = true; // Make it required
      select.classList.add("required"); // Add class to indicate required field
    } else if (!isChecked && !select.disabled) {
      select.disabled = true;
      select.required = false; // Remove required attribute
      select.classList.remove("required"); // Remove class
    }
  };

  return (
    <div>
      <div className="row">
        <h4 className="title">New Order Entry Form: {props.Type}</h4>
      </div>

      <Form className="form" onSubmit={SaveOrder}>
        <div className="d-flex col-md-12 justify-content-end mb-2">
          <button
            className={
              purchaseorder ? "button-style" : "button-style button-disabled"
            }
            // className="button-style button-disabled"
            // onClick={openModal}
            // onClick={(e) => openModal(e)}
            disabled={!purchaseorder}
          >
            Save Order
          </button>
        </div>

        <div className="form-bg">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Order No</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    type="text"
                    className="input-field"
                    id="orderno"
                    disabled
                    value={orderno}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12 "
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">PO No</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    id="formPurchaseOrderNo"
                    className="input-field"
                    type="text"
                    maxLength={101}
                    onChange={POInputChange}
                    required
                    placeholder="Please ented PO No with DC No"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12 "
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Order Date</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    id="formOrderDate"
                    className="input-field"
                    type="date"
                    disabled
                    value={formOrderDate}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12">
              {/* <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Quotation No</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  {qtnnossentdata.length > 0 ? (
                    <Typeahead
                      id="basic-example"
                      className="in-fields"
                      labelKey="QtnNo"
                      onChange={selectQtns}
                      onInputChange={handleInputChange}
                      options={qtnnossentdata}
                      placeholder="Choose Quotation..."
                    ></Typeahead>
                  ) : (
                    ""
                  )}
                </div>
              </div> */}
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Delivery Date</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    id="formDeliveryDate"
                    className="input-field"
                    defaultValue={formDeliveryDate}
                    min={formOrderDate}
                    type="date"
                  />{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Order Type</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <select
                    id="formOrderType"
                    className="ip-select input-field"
                    onChange={handleOrderTypeChange}
                  >
                    {/* <option value="">Select Order Type</option> */}
                    {/* <option value="">Complete</option> */}
                    <option value="Complete">Complete</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Open">Open</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              {/* <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Delivery Date</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    id="formDeliveryDate"
                    className="in-fields"
                    type="date"
                  />{" "}
                </div>
              </div> */}
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Sales Contact</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <select
                    className="ip-select input-field"
                    id="formSalesContact"
                    defaultValue={userName}
                    required
                  >
                    <option>{userName}</option>
                    {salesExecdata.map((sdata) => {
                      return (
                        <option value={sdata["Name"]}>{sdata["Name"]}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Payment Terms</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    id="formPaymentTerms"
                    className="input-field"
                    type="text"
                    disabled
                    value={formPaymentTerms}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              {/* <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Sales Contact</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <select
                    className="ip-select in-fields"
                    id="formSalesContact"
                    defaultValue={userName}
                  >
                    <option>{userName}</option>
                    {salesExecdata.map((sdata) => {
                      return (
                        <option value={sdata["Name"]}>{sdata["Name"]}</option>
                      );
                    })}
                  </select>
                </div>
              </div> */}
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Received By</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <select
                    className="ip-select input-field"
                    id="formReceivedBy"
                    required
                  >
                    {/* <option>*** Select ***</option>  */}
                    <option>{userName}</option>
                    {salesExecdata.map((sdata) => {
                      return (
                        <option value={sdata["Name"]}>{sdata["Name"]}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Customer Name</label>
                </div>
                <div className="col-md-8 col-sm-12 ">
                  {custdata.length > 0 ? (
                    <Typeahead
                      id="basic-example"
                      className="input-field"
                      labelKey="Cust_name"
                      onChange={selectCust}
                      options={custdata}
                      placeholder="Choose a Customer..."
                      required
                    ></Typeahead>
                  ) : (
                    ""
                  )}
                  {/* {custdata.length > 0 && (
                    <div className="dropdown-indicator"></div>
                  )} */}

                  {/* <select className='ip-select' type="text" id="formCustomerName" onChange={selectCust}>
                    <option>Select Customer</option>
                    {custdata.map((cust) => {
                      return (
                        <option value={cust["Cust_Code"]}>{cust["Cust_name"]}</option>
                      )
                    })}
                  </select> */}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Recorded By</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <select
                    className="ip-select input-field"
                    id="formRecordedBy"
                    required
                  >
                    {/* <option>*** Select ***</option> */}
                    <option>{userName}</option>
                    {salesExecdata.map((sdata) => {
                      return (
                        <option value={sdata["Name"]}>{sdata["Name"]}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Contact Name</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    id="CustomerContact"
                    className="input-field"
                    type="text"
                    onChange={(e) => setCustomerContact(e.target.value)}
                    value={CustomerContact}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              {" "}
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Dealing Engineer</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <select
                    className="ip-select input-field"
                    id="formDealingEngineer"
                    required
                  >
                    <option>{userName}</option>
                    {salesExecdata.map((sdata) => {
                      return (
                        <option value={sdata["Name"]}>{sdata["Name"]}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">GST No</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    id="formGSTNNo"
                    className="input-field"
                    disabled
                    type="text"
                    value={GSTIN}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              {" "}
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">GST Tax State</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  {/* <select className="ip-select in-fields" id="formGSTTaxState">
                    <option>Select State</option>
                    {statesdata.map((stat) => {
                      return (
                        <option value={stat["Id"]}>{stat["State"]}</option>
                      );
                    })}
                  </select> */}
                  <input
                    id="formGSTTaxState"
                    className="input-field"
                    disabled
                    type="text"
                    value={formGSTTaxState}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Billing Address</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <textarea
                    id="formBillingAddress"
                    className="input-field"
                    type="text"
                    onChange={(e) => setFormBillingAddress(e.target.value)}
                    value={formBillingAddress}
                    style={{
                      borderRadius: "0",
                      height: "50px",
                      width: "100%",
                    }}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              {" "}
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Special Instructions</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <textarea
                    id="formSpecialInstructions"
                    className="input-field"
                    type="text"
                    maxLength={101}
                    // onChange={(e) => setFormSpecialInstructions(e.target.value)}
                    onChange={handleSpecialInstructionsChange}
                    value={formSpecialInstructions}
                    style={{
                      borderRadius: "0",
                      height: "50px",
                      width: "100%",
                    }}
                  />{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4  col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Billing State</label>
                </div>
                {/* <div className="col-md-8  mb-2 col-sm-12">
                  <select className="ip-select in-fields" id="formBillingState">
                    <option>Select State</option>
                    {statesdata.map((stat) => {
                      return (
                        <option value={stat["Id"]}>{stat["State"]}</option>
                      );
                    })}
                  </select>
                </div> */}
                <div className="col-md-8 col-sm-12">
                  <input
                    id=""
                    className="input-field"
                    disabled
                    type="text"
                    value={formBillingState}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12">
              {" "}
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Delivery Mode</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <select
                    id="formDeliveryMode"
                    className="ip-select input-field"
                    required
                    disabled={!isChecked}
                    ref={deliveryModeSelectRef}
                  >
                    <option value="">Select Delivery Mode</option>
                    <option value="By Lorry">By Lorry</option>
                    <option value="By Courier">By Courier</option>
                    <option value="By Air Cargo">By Air Cargo</option>
                    <option value="By Ship">By Ship</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Shipping Address</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <textarea
                    id="formShippingAddress"
                    className="input-field"
                    type="text"
                    // placeholder="EX Factory"
                    onChange={(e) => setFormShippingAddress(e.target.value)}
                    value={formShippingAddress}
                    style={{
                      borderRadius: "0",
                      height: "50px",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div
                  className="col-md-4 col-sm-12"
                  style={{ textAlign: "right" }}
                >
                  <label className="form-label">Transport Charges</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <select
                    id="formTransportCharges"
                    className="ip-select input-field"
                    required
                    disabled={!isChecked}
                  >
                    <option value=""> Select </option>
                    <option value="Customer Account">Customer Account</option>
                    <option value="Magod Account">Magod Account</option>
                  </select>

                  {/* <input id="formTransportCharges" type="text" placeholder="Enter Transport Charges" /> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="row">
              <div
                className="col-md-2 col-sm-12"
                style={{ textAlign: "right", marginTop: "-10px" }}
              >
                <label className="form-label">Magod Delivery</label>
              </div>
              <div className="col-md-1 col-sm-12 mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  checked={formMagodDelivery}
                  id="formMagodDelivery"
                  onChange={handleCheckboxChange}
                  disabled={!formBillingAddress}
                />
              </div>
            </div>
          </div>
        </div>
        <AlertModal
          show={alertModal}
          onHide={() => setAlertModal(false)}
          firstbutton={(e) => {
            SaveOrder(e);
            setAlertModal(false);
          }}
          title="magod_Order"
          message="Order Created"
          firstbuttontext="Ok"
        />
      </Form>
      {/* <AlertModal
        show={alertModal}
        onHide={(e) => setAlertModal(e)}
        firstbutton={(e) => {
          SaveOrder(e); // Invoke SaveOrder with the event object when the button is clicked
          setAlertModal(false); // Close the modal after invoking SaveOrder
        }}
        titl
        title="magod_Order"
        message="Order Created"
        firstbuttontext="Ok"
      /> */}
    </div>
  );
}

export default NewOrder;
