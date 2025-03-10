import React, { useState, useRef } from "react";

import Axios from "axios";
import { toast } from "react-toastify";

import ModalPackingNote from "../../../../../../../../../PDFs/PackingNote/ModalPackingNote";
import ModalInvoice from "../../../../../../../../../PDFs/Invoice/ModalInvoice";
import ModalAnnexure from "../../../../../../../../../PDFs/Annexure/ModalAnnexure";

export default function InvoicingInfo(props) {
  const layoutForInvoicingInfo = "border row rounded p-1 pb-3";

  const trnsMode = ["By Road", "By Hand", "By Air", "By Courier"];

  const cashMode = [
    "Cash on Delivery",
    "Cheque on Delivery",
    "Demand Draft on Delivery",
    "QR Code and RTGS",
  ];

  const createInvoiceWorkFunc = () => {
    props.setButtonClicked("Create Invoice");
    props.setConfirmModalOpen(true);
  };
  const createInvoiceValidationFunc = (e) => {
    const checkForZero = props.invDetailsData.filter(
      (obj) =>
        obj.Unit_Rate === 0 ||
        obj.Unit_Rate === 0.0 ||
        obj.Unit_Rate === "0" ||
        obj.Unit_Rate === "0.0" ||
        obj.Unit_Rate === "0.00" ||
        obj.Unit_Rate === null ||
        obj.Unit_Rate === "null" ||
        obj.Unit_Rate === "" ||
        obj.Qty === 0 ||
        obj.Qty === 0.0 ||
        obj.Qty === "0" ||
        obj.Qty === "0.0" ||
        obj.Qty === "0.00" ||
        obj.Qty === "null" ||
        obj.Qty === null ||
        obj.Qty === ""
    );

    if (checkForZero.length > 0) {
      toast.warning(
        "Check for zero value for quantity or rate, Correct and try again"
      );
      e.preventDefault();
    } else {
      if (props.TaxDropDownData?.length > 0 && props.invTaxData.length === 0) {
        toast.warning("Please select SGST and CST for Tax");
        e.preventDefault();
      } else if (
        props.invRegisterData.Del_Address.length === 0 ||
        props.invRegisterData.Del_Address === null ||
        props.invRegisterData.Del_Address === "null" ||
        props.invRegisterData.Del_Address === undefined ||
        props.invRegisterData.Del_Address === "undefined" ||
        props.invRegisterData.Del_Address === ""
      ) {
        toast.warning("Please enter customer delivery address");
        e.preventDefault();
      } else if (
        props.invRegisterData.DespatchDate === null ||
        props.invRegisterData.DespatchDate === undefined ||
        props.invRegisterData.DespatchDate === "" ||
        props.invRegisterData.DespatchDate === "null" ||
        props.invRegisterData.DespatchDate === "undefined" ||
        props.invRegisterData.DespatchDate.length === 0
      ) {
        toast.warning("Please enter Dispatch Date");
        e.preventDefault();
      } else if (
        props.invRegisterData.TptMode === null ||
        props.invRegisterData.TptMode === undefined ||
        props.invRegisterData.TptMode === "" ||
        props.invRegisterData.TptMode === "null" ||
        props.invRegisterData.TptMode === "undefined" ||
        props.invRegisterData.TptMode.length === 0
      ) {
        toast.warning("Please select Dispatch Mode");
        e.preventDefault();
      } else if (
        props.invRegisterData.TptMode === "By Road" &&
        (props.invRegisterData.VehNo === null ||
          props.invRegisterData.VehNo === undefined ||
          props.invRegisterData.VehNo === "" ||
          props.invRegisterData.VehNo === "null" ||
          props.invRegisterData.VehNo === "undefined" ||
          props.invRegisterData.VehNo.length === 0)
      ) {
        toast.warning("Please enter Vehicle Number");
        e.preventDefault();
      } else if (
        (props.invRegisterData.Del_ContactName === null ||
          props.invRegisterData.Del_ContactName === undefined ||
          props.invRegisterData.Del_ContactName === "" ||
          props.invRegisterData.Del_ContactName === "null" ||
          props.invRegisterData.Del_ContactName === "undefined" ||
          props.invRegisterData.Del_ContactName.length === 0) &&
        props.invRegisterData.DC_InvType === "Services"
      ) {
        toast.warning("Please enter delivery person name");
        e.preventDefault();
      } else if (
        (props.invRegisterData.Del_ContactNo === null ||
          props.invRegisterData.Del_ContactNo === undefined ||
          props.invRegisterData.Del_ContactNo === "" ||
          props.invRegisterData.Del_ContactNo === "null" ||
          props.invRegisterData.Del_ContactNo.length === 0) &&
        props.invRegisterData.DC_InvType === "Services"
      ) {
        toast.warning("Please enter delivery person contact number");
        e.preventDefault();
      } else if (
        props.invRegisterData?.BillType === "Cash" &&
        props.invRegisterData.PaymentTerms.length === 0
      ) {
        toast.warning("Please select the Cash Mode");
      } else if (
        props.invRegisterData?.BillType === "Credit" &&
        props.invRegisterData.PaymentTerms.length === 0
      ) {
        toast.warning("Please select the Credit Days");
      } else if (props.invRegisterData.BillType.length === 0) {
        toast.warning("Please select Bill Type");
        e.preventDefault();
      } else if (
        parseFloat(props.invRegisterData.GrandTotal).toFixed(2) < 0.0
      ) {
        toast.warning("Can't create the invoice with negative amount");
      } else if (props.invRegisterData.BillType.length > 0) {
        if (props.invRegisterData.BillType === "Cash") {
          if (
            props.invRegisterData.PaymentTerms === cashMode[0] ||
            props.invRegisterData.PaymentTerms === cashMode[3]
          ) {
            if (
              props.invRegisterData.PaymentReceiptDetails === null ||
              props.invRegisterData.PaymentReceiptDetails === undefined ||
              props.invRegisterData.PaymentReceiptDetails === "" ||
              props.invRegisterData.PaymentReceiptDetails === "null" ||
              props.invRegisterData.PaymentReceiptDetails.length < 8 ||
              props.invRegisterData.PymtAmtRecd.length === 0 ||
              parseFloat(props.invRegisterData.PymtAmtRecd).toFixed(1) === 0.0
            ) {
              toast.warning("Please enter the Cash Reciept No and Details");
              e.preventDefault();
            } else {
              if (
                parseFloat(props.invRegisterData.PymtAmtRecd).toFixed(2) <
                parseFloat(props.invRegisterData.GrandTotal).toFixed(2)
              ) {
                toast.warning("Amount collected is less then Invoice Amount");
                e.preventDefault();
              } else {
                createInvoiceWorkFunc();
              }
            }
          } else if (props.invRegisterData.PaymentTerms === cashMode[1]) {
            if (
              props.invRegisterData.PaymentReceiptDetails === null ||
              props.invRegisterData.PaymentReceiptDetails === undefined ||
              props.invRegisterData.PaymentReceiptDetails === "" ||
              props.invRegisterData.PaymentReceiptDetails === "null" ||
              props.invRegisterData.PaymentReceiptDetails.length < 8 ||
              props.invRegisterData.PymtAmtRecd.length === 0 ||
              parseFloat(props.invRegisterData.PymtAmtRecd).toFixed(1) === 0.0
            ) {
              toast.warning("Please enter the Cheque Details");
              e.preventDefault();
            } else {
              if (
                parseFloat(props.invRegisterData.PymtAmtRecd) <
                parseFloat(props.invRegisterData.GrandTotal)
              ) {
                toast.warning("Amount collected is less then Invoice Amount");
                e.preventDefault();
              } else {
                createInvoiceWorkFunc();
              }
            }
          } else if (props.invRegisterData.PaymentTerms === cashMode[2]) {
            if (
              props.invRegisterData.PaymentReceiptDetails === null ||
              props.invRegisterData.PaymentReceiptDetails === undefined ||
              props.invRegisterData.PaymentReceiptDetails === "" ||
              props.invRegisterData.PaymentReceiptDetails === "null" ||
              props.invRegisterData.PaymentReceiptDetails.length < 8 ||
              props.invRegisterData.PymtAmtRecd.length === 0 ||
              parseFloat(props.invRegisterData.PymtAmtRecd).toFixed(1) === 0.0
            ) {
              toast.warning("Please enter the DD Details");
              e.preventDefault();
            } else {
              if (
                parseFloat(props.invRegisterData.PymtAmtRecd).toFixed(2) <
                parseFloat(props.invRegisterData.GrandTotal).toFixed(2)
              ) {
                toast.warning("Amount collected is less then Invoice Amount");
                e.preventDefault();
              } else {
                createInvoiceWorkFunc();
              }
            }
          }
        } else {
          createInvoiceWorkFunc();
        }
      } else {
        createInvoiceWorkFunc();
      }
    }
  };

  const today = new Date();
  const todayDateforDispatch =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1 < 10 ? "0" : "") +
    (today.getMonth() + 1) +
    "-" +
    (today.getDate() + 1 < 10 ? "0" : "") +
    today.getDate();

  return (
    <>
      <div>
        {/* first row */}
        <div className="row">
          <div className="col-md-8">
            <b>Dispatch Info</b>
            <div className={layoutForInvoicingInfo}>
              <div className="col-md-4">
                <b>Dispatch Date</b>
                <input
                  type="date"
                  value={
                    props.invRegisterData?.DespatchDate?.split("T")[0]
                      ? props.invRegisterData.DespatchDate.split("T")[0]
                      : null
                  }
                  min={todayDateforDispatch}
                  name="DespatchDate"
                  onChange={props.inputHandler}
                  disabled={
                    props.invRegisterData.Inv_No ||
                    props.invRegisterData.DCStatus === "Cancelled"
                  }
                  className={
                    props.invRegisterData.Inv_No ||
                    props.invRegisterData.DCStatus === "Cancelled"
                      ? "input-disabled"
                      : ""
                  }
                />
              </div>
              <div className="col-md-4">
                <b>Dispatch Mode</b>

                {props.invRegisterData?.TptMode ? (
                  <select
                    style={{
                      fontSize: "inherit",
                    }}
                    name="TptMode"
                    onChange={props.inputHandler}
                    disabled={
                      props.invRegisterData.Inv_No ||
                      props.invRegisterData.DCStatus === "Cancelled"
                    }
                    className={
                      props.invRegisterData.Inv_No ||
                      props.invRegisterData.DCStatus === "Cancelled"
                        ? "ip-select input-disabled"
                        : "ip-select"
                    }
                  >
                    {trnsMode.map((val) =>
                      props.invRegisterData?.TptMode === val ? (
                        <option value={val} selected>
                          {val}
                        </option>
                      ) : (
                        <option value={val}>{val}</option>
                      )
                    )}
                  </select>
                ) : (
                  <select
                    style={{
                      fontSize: "inherit",
                    }}
                    name="TptMode"
                    onChange={props.inputHandler}
                    disabled={
                      props.invRegisterData.Inv_No ||
                      props.invRegisterData.DCStatus === "Cancelled"
                    }
                    className={
                      props.invRegisterData.Inv_No ||
                      props.invRegisterData.DCStatus === "Cancelled"
                        ? "ip-select input-disabled"
                        : "ip-select"
                    }
                  >
                    <option value="none" selected disabled hidden>
                      Select an Option
                    </option>
                    {trnsMode.map((val) => (
                      <option value={val}>{val}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="col-md-4">
                <b>Vehicle No.</b>
                <input
                  value={props.invRegisterData?.VehNo}
                  name="VehNo"
                  onChange={props.inputHandler}
                  disabled={
                    props.invRegisterData.Inv_No ||
                    props.invRegisterData.DCStatus === "Cancelled"
                  }
                  className={
                    props.invRegisterData.Inv_No ||
                    props.invRegisterData.DCStatus === "Cancelled"
                      ? "input-disabled"
                      : ""
                  }
                />
              </div>
            </div>
          </div>
          {/* delivery details */}
          <div className="col-md-4">
            <div>
              <b>Delivery Details</b>
              <div
                className="p-1 pb-2"
                style={{ border: "1px solid lightgray", borderRadius: "5px" }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <b>Person Name</b>
                    <input
                      name="Del_ContactName"
                      value={props.invRegisterData.Del_ContactName}
                      onChange={props.inputHandler}
                      disabled={
                        props.invRegisterData.Inv_No ||
                        props.invRegisterData.DCStatus === "Cancelled"
                      }
                      className={
                        props.invRegisterData.Inv_No ||
                        props.invRegisterData.DCStatus === "Cancelled"
                          ? "input-disabled"
                          : ""
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <b>Person Contact No</b>
                    <input
                      name="Del_ContactNo"
                      value={props.invRegisterData.Del_ContactNo}
                      onChange={props.inputHandler}
                      disabled={
                        props.invRegisterData.Inv_No ||
                        props.invRegisterData.DCStatus === "Cancelled"
                      }
                      className={
                        props.invRegisterData.Inv_No ||
                        props.invRegisterData.DCStatus === "Cancelled"
                          ? "input-disabled"
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* second row */}
        <div className="row">
          <div className="col-md-8">
            <div>
              <b>Invoice Summary</b>

              <div className={layoutForInvoicingInfo}>
                <div className="col-md-4">
                  <b>Net Total</b>
                  <input
                    type="number"
                    min="0"
                    value={parseFloat(props.invRegisterData?.Net_Total).toFixed(
                      2
                    )}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="col-md-4">
                  <b>Discount</b>
                  <input
                    type="number"
                    min="0"
                    value={props.invRegisterData?.Discount}
                    name="Discount"
                    onChange={props.handleChangeDiscountDelivery}
                    disabled={
                      props.invRegisterData.Inv_No ||
                      props.invRegisterData.DCStatus === "Cancelled"
                    }
                    className={
                      props.invRegisterData.Inv_No ||
                      props.invRegisterData.DCStatus === "Cancelled"
                        ? "input-disabled"
                        : ""
                    }
                  />
                </div>
                <div className="col-md-4">
                  <b>Delivery Charges</b>
                  <input
                    type="number"
                    min="0"
                    value={props.invRegisterData?.Del_Chg}
                    name="Del_Chg"
                    onChange={props.handleChangeDiscountDelivery}
                    disabled={
                      props.invRegisterData.Inv_No ||
                      props.invRegisterData.DCStatus === "Cancelled"
                    }
                    className={
                      props.invRegisterData.Inv_No ||
                      props.invRegisterData.DCStatus === "Cancelled"
                        ? "input-disabled"
                        : ""
                    }
                  />
                </div>
                <div className="col-md-4">
                  <b>Tax Amount</b>
                  {/* if net amount and tax amount is calculated then this ither wise that */}
                  <input
                    type="number"
                    name=""
                    id=""
                    value={parseFloat(props.invRegisterData?.TaxAmount).toFixed(
                      2
                    )}
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <b>Invoice Total</b>
                  <input
                    type="number"
                    min="0"
                    value={parseFloat(props.invRegisterData?.InvTotal).toFixed(
                      2
                    )}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="col-md-4">
                  <b>Round Off</b>
                  <input
                    type="number"
                    min="0"
                    value={props.invRegisterData?.Round_Off}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="col-md-4">
                  <b>Grand Total</b>
                  <input
                    type="number"
                    min="0"
                    value={parseFloat(
                      props.invRegisterData?.GrandTotal
                    ).toFixed(2)}
                    disabled
                    className="input-disabled"
                  />
                </div>
              </div>
            </div>
            <div>
              <b>Remarks</b>
              <div>
                <textarea
                  id=""
                  style={{
                    border: "1px solid lightgray",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                  value={props.invRegisterData?.Remarks}
                  name="Remarks"
                  onChange={props.inputHandler}
                  disabled={
                    props.invRegisterData.Inv_No ||
                    props.invRegisterData.DCStatus === "Cancelled"
                  }
                  className={
                    props.invRegisterData.Inv_No ||
                    props.invRegisterData.DCStatus === "Cancelled"
                      ? "input-disabled"
                      : ""
                  }
                ></textarea>
              </div>
            </div>
          </div>
          <div className="col-md-4 ">
            <div>
              <b>Payment Details</b>
              <div className={layoutForInvoicingInfo}>
                <div className="col-md-6">
                  <b>Bill Type</b>
                  <input
                    type="text"
                    value={props.invRegisterData?.BillType}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="col-md-6">
                  <b>Payment Terms</b>
                  <input
                    type="text"
                    value={props.invRegisterData?.PaymentTerms}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="col-md-6">
                  <b>Grand Total</b>
                  <input
                    type="text"
                    value={parseFloat(
                      props.invRegisterData?.GrandTotal
                    ).toFixed(2)}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="col-md-6">
                  <b>Amount Recieved</b>
                  <input
                    type="number"
                    min={"0"}
                    name="PymtAmtRecd"
                    value={props.invRegisterData?.PymtAmtRecd}
                    onChange={props.inputHandler}
                    disabled={
                      props.invRegisterData?.BillType === "Credit" ||
                      props.invRegisterData.Inv_No?.length > 0 ||
                      props.invRegisterData.DCStatus === "Cancelled"
                    }
                    className={
                      props.invRegisterData?.BillType === "Credit" ||
                      props.invRegisterData.Inv_No?.length > 0 ||
                      props.invRegisterData.DCStatus === "Cancelled"
                        ? "input-disabled"
                        : ""
                    }
                  />
                </div>

                {props.invRegisterData?.BillType === "Cash" ? (
                  <div className="col-md-12">
                    <b>Description</b>
                    <textarea
                      rows="4"
                      style={{ width: "100%" }}
                      name="PaymentReceiptDetails"
                      value={props.invRegisterData?.PaymentReceiptDetails}
                      onChange={props.inputHandler}
                      disabled={
                        props.invRegisterData.Inv_No?.length > 0 ||
                        props.invRegisterData.DCStatus === "Cancelled"
                      }
                      className={
                        props.invRegisterData.Inv_No?.length > 0 ||
                        props.invRegisterData.DCStatus === "Cancelled"
                          ? "input-disabled"
                          : ""
                      }
                    ></textarea>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* third row */}
      </div>
      {/* forth row */}
      <div className="row ">
        <div className="col-md-6">
          <button
            onClick={props.onSave}
            disabled={
              props.invRegisterData.Inv_No ||
              props.invRegisterData.DCStatus === "Cancelled"
            }
            className={
              props.invRegisterData.Inv_No ||
              props.invRegisterData.DCStatus === "Cancelled"
                ? "button-style button-disabled"
                : "button-style"
            }
          >
            Save Invoice
          </button>
          <span className="p-1"></span>
          <button
            disabled={
              props.invRegisterData.Inv_No ||
              props.invRegisterData.DCStatus === "Cancelled"
            }
            className={
              props.invRegisterData.Inv_No ||
              props.invRegisterData.DCStatus === "Cancelled"
                ? "button-style button-disabled"
                : "button-style"
            }
            onClick={createInvoiceValidationFunc}
          >
            Create Invoice
          </button>
          <span className="p-1"></span>
        </div>

        <div className="col-md-6">
          <div className="d-flex flex-row justify-content-end">
            <div className="col-md-3 p-0 d-flex justify-content-end">
              <button className="button-style " onClick={props.printPN}>
                Print PN
              </button>
            </div>
            {/* Print invoice */}
            <span className="p-1"></span>

            <div className="col-md-3 p-0 d-flex justify-content-end">
              <button
                disabled={!props.invRegisterData.Inv_No}
                className={
                  !props.invRegisterData.Inv_No
                    ? "button-style  button-disabled"
                    : "button-style "
                }
                onClick={
                  props.invDetailsData?.length > props.rowLimit
                    ? props.printAnnexure
                    : props.printInvoice
                }
              >
                {props.invDetailsData?.length > props.rowLimit
                  ? "Print Annexure"
                  : "Print Invoice"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* printable content */}

      <ModalPackingNote
        setPrintCopyModal={props.setPrintCopyModal}
        printCopyModal={props.printCopyModal}
        // data...
        invRegisterData={props.invRegisterData}
        invDetailsData={props.invDetailsData}
        invTaxData={props.invTaxData}
      />

      <ModalAnnexure
        setPrintAnneureModal={props.setPrintAnneureModal}
        printAnneureModal={props.printAnneureModal}
        // data...
        invRegisterData={props.invRegisterData}
        invDetailsData={props.invDetailsData}
        invTaxData={props.invTaxData}
      />

      <ModalInvoice
        setPrintInvoiceModal={props.setPrintInvoiceModal}
        printInvoiceModal={props.printInvoiceModal}
        rowLimit={props.rowLimit}
        // data...
        invRegisterData={props.invRegisterData}
        invDetailsData={props.invDetailsData}
        invTaxData={props.invTaxData}
      />
    </>
  );
}
