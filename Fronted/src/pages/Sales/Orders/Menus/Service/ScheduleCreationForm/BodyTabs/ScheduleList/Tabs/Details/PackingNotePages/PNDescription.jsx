import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Axios from "axios";
import { Form, Tab, Table, Tabs } from "react-bootstrap";
import { toast } from "react-toastify";

import FormHeader from "./FormHeader";
import ConsigneeInfo from "./PNTabs/ConsigneeInfo";
import InvoicingInfo from "./PNTabs/InvoicingInfo";

import ProductTable from "./Tables/ProductTable";
import TaxTable from "./Tables/TaxTable";

import SetRateModal from "./Modals/SetRateModal";
import ConfirmationModal from "./Modals/ConfirmationModal";

import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { endpoints } from "../../../../../../../../../../api/constants";

export default function PNDescrption(props) {
  const location = useLocation();

  const [DCInvNo, setDCInvNo] = useState(props.DcInvNo);
  const [invRegisterData, setInvRegisterData] = useState([]);
  const [invDetailsData, setInvDetailsData] = useState([]);
  const [invTaxData, setInvTaxData] = useState([]);
  const [loadRateEvent, setLoadRateEvent] = useState(false);

  const [setRateConsumerData, setSetRateConsumerData] = useState([]);
  const [showSetRateModal, setShowSetRateModal] = useState(false);

  const [TaxDropDownData, setTaxDropDownData] = useState([]);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [buttonClicked, setButtonClicked] = useState("");

  const [allStates, setAllStates] = useState([]);

  const [printCopyModal, setPrintCopyModal] = useState(false);
  const [printAnneureModal, setPrintAnneureModal] = useState(false);
  const [printInvoiceModal, setPrintInvoiceModal] = useState(false);

  const fetchData = () => {
    Axios.post(endpoints.aboutInvoicePN, {
      DCInvNo: DCInvNo,
    }).then((res) => {
      res.data.registerData[0].TptMode =
        res.data.registerData[0].TptMode || "By Hand";

      setInvRegisterData(res.data.registerData[0]);
      setInvDetailsData(res.data.detailsData);
      setInvTaxData(res.data.taxData);
      Axios.post(endpoints.getSetRateConsumerData, {
        scheduleId: res.data.registerData[0].ScheduleId,
      }).then((sechRes) => {
        setSetRateConsumerData(sechRes.data);
      });
      Axios.post(endpoints.getPnInvTaxData, {
        Cust_Code: res.data.registerData[0].Cust_Code,
        unitStateID: "29",
        unitGST: "29AABCM1970H1ZE",
      }).then((res) => {
        setTaxDropDownData(res.data);
      });
    });
    // get all states
    Axios.get(endpoints.getAllStates, {}).then((res) => {
      setAllStates(res.data);
    });
  };
  // UseEffects...................
  useEffect(() => {
    fetchData();
  }, []);

  const printPN = () => {
    setPrintCopyModal(true);
  };
  const printAnnexure = () => {
    setPrintAnneureModal(true);
  };
  const printInvoice = () => {
    setPrintInvoiceModal(true);
  };
  const rowLimit = 20;

  const deleteTaxFunc = () => {
    setInvTaxData([]);
    document.getElementById("taxDropdown").value = "none";
    let newInvTotal =
      parseFloat(invRegisterData?.Net_Total) -
      parseFloat(invRegisterData?.Discount) +
      parseFloat(invRegisterData?.Del_Chg);

    setInvRegisterData({
      ...invRegisterData,
      TaxAmount: 0.0,
      InvTotal: newInvTotal.toFixed(2),
    });
  };

  const inputHandler = (e) => {
    setInvRegisterData({
      ...invRegisterData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDiscountDelivery = (e) => {
    setInvTaxData([]);
    document.getElementById("taxDropdown").value = "none";
    let newInvTotal;
    let newGrandTotal;
    let newRoundOff;
    if (e.target.name === "Discount") {
      newInvTotal =
        parseFloat(invRegisterData?.Net_Total) -
        parseFloat(e.target.value.length > 0 ? e.target.value : 0) +
        parseFloat(invRegisterData?.Del_Chg);

      newGrandTotal = Math.round(newInvTotal);

      newRoundOff = newGrandTotal - newInvTotal;

      setInvRegisterData({
        ...invRegisterData,
        Discount: e.target.value.length > 0 ? e.target.value : 0,
        TaxAmount: 0.0,
        InvTotal: newInvTotal.toFixed(2),

        GrandTotal: newGrandTotal.toFixed(2),
        Round_Off: newRoundOff.toFixed(2),
      });
    } else if (e.target.name === "Del_Chg") {
      newInvTotal =
        parseFloat(invRegisterData?.Net_Total) -
        parseFloat(invRegisterData?.Discount) +
        parseFloat(e.target.value.length > 0 ? e.target.value : 0);

      newGrandTotal = Math.round(newInvTotal);

      newRoundOff = newGrandTotal - newInvTotal;

      setInvRegisterData({
        ...invRegisterData,
        Del_Chg: e.target.value.length > 0 ? e.target.value : 0,
        TaxAmount: 0.0,
        InvTotal: newInvTotal.toFixed(2),
        GrandTotal: newGrandTotal.toFixed(2),
        Round_Off: newRoundOff.toFixed(2),
      });
    }
  };

  const cancelPN = () => {
    Axios.post(endpoints.cancelPN, {
      invRegisterData: invRegisterData,
    }).then((res) => {
      if (res.data.flag === 1) {
        toast.success(res.data.message);
        setInvRegisterData({ ...invRegisterData, DCStatus: "Cancelled" });
      } else if (res.data.flag === 0) {
        toast.error(res.data.message);
      } else {
        toast.warning("Uncaught error in frontend");
      }
    });
  };

  const onSave = () => {
    Axios.post(endpoints.updatePNProfileData, {
      invRegisterData: invRegisterData,
      invTaxData: invTaxData,
    }).then((res) => {
      if (res) {
        if (res.data.status === 1) {
          fetchData();
          toast.success(res.data.comment);
        } else if (res.data.status === 0) {
          toast.error(res.data.comment);
        } else {
          toast.error("Uncaught Error");
        }
      }
    });
  };

  const handleCreateInvoice = () => {
    onSave();
    Axios.post(endpoints.createInvoice, {
      invRegisterData: invRegisterData,
    }).then((res) => {
      setInvRegisterData(res.data.registerData[0]);
      if (res.data.flag === 1) {
        toast.success(res.data.message);

        if (invDetailsData.length > rowLimit) {
          printAnnexure();
        } else {
          printInvoice();
        }
      } else if (res.data.flag === 0) {
        toast.error(res.data.message);
      } else {
        toast.warning("Uncaught error in frontend");
      }
    });
  };

  return (
    <>
      <div className="col-md-12">
        <h4 className="title">Packing Note Description Form</h4>
      </div>
      <div className="p-1"></div>
      <div className="border rounded">
        <FormHeader
          invRegisterData={invRegisterData}
          setInvRegisterData={setInvRegisterData}
          inputHandler={inputHandler}
        />

        <Tabs className="mt-3 p-2">
          <Tab eventKey="consigneeInfo" title="Consignee Info">
            <ConsigneeInfo
              invRegisterData={invRegisterData}
              setInvRegisterData={setInvRegisterData}
              inputHandler={inputHandler}
              setAllStates={setAllStates}
              allStates={allStates}
            />
          </Tab>
          <Tab eventKey="Invoicing Info" title="Invoicing Info">
            <InvoicingInfo
              invRegisterData={invRegisterData}
              setInvRegisterData={setInvRegisterData}
              invDetailsData={invDetailsData}
              setInvDetailsData={setInvDetailsData}
              invTaxData={invTaxData}
              setInvTaxData={setInvTaxData}
              inputHandler={inputHandler} //func
              deleteTaxFunc={deleteTaxFunc} //func
              handleChangeDiscountDelivery={handleChangeDiscountDelivery}
              handleCreateInvoice={handleCreateInvoice}
              onSave={onSave}
              setButtonClicked={setButtonClicked}
              setConfirmModalOpen={setConfirmModalOpen}
              confirmModalOpen={confirmModalOpen}
              printInvoice={printInvoice}
              printAnnexure={printAnnexure}
              printPN={printPN}
              setPrintInvoiceModal={setPrintInvoiceModal}
              setPrintAnneureModal={setPrintAnneureModal}
              setPrintCopyModal={setPrintCopyModal}
              printInvoiceModal={printInvoiceModal}
              printAnneureModal={printAnneureModal}
              printCopyModal={printCopyModal}
              rowLimit={rowLimit}
              TaxDropDownData={TaxDropDownData}
            />
          </Tab>
        </Tabs>
        <div className="m-3 border-top mb-2"></div>
        {/* button start here */}

        <div className="row">
          <div className="col-md-6 ">
            <div className="d-flex justify-content-space mt-3">
              <button
                onClick={() => {
                  setLoadRateEvent(true);
                }}
                disabled={
                  invRegisterData.Inv_No ||
                  invRegisterData.DCStatus === "Cancelled"
                }
                className={
                  invRegisterData.Inv_No ||
                  invRegisterData.DCStatus === "Cancelled"
                    ? "button-style button-disabled m-0"
                    : "button-style m-0"
                }
              >
                Load Rates
              </button>
              <div className="p-1"></div>

              <button
                onClick={() => setShowSetRateModal(true)}
                disabled={
                  invRegisterData.Inv_No ||
                  invRegisterData.DCStatus === "Cancelled"
                }
                className={
                  invRegisterData.Inv_No ||
                  invRegisterData.DCStatus === "Cancelled"
                    ? "button-style button-disabled m-0"
                    : "button-style m-0"
                }
              >
                Set Rates
              </button>
              <div className="p-1"></div>
              <button
                disabled={
                  invRegisterData.Inv_No ||
                  invRegisterData.DCStatus === "Cancelled"
                }
                className={
                  invRegisterData.Inv_No ||
                  invRegisterData.DCStatus === "Cancelled"
                    ? "button-style button-disabled m-0"
                    : "button-style m-0"
                }
                // onClick={cancelPN}
                onClick={(e) => {
                  setButtonClicked("Cancel PN");
                  setConfirmModalOpen(true);
                }}
              >
                Cancel PN
              </button>
              <div className="p-1"></div>

              <Link to="/PackingAndInvoices">
                <button className="button-style m-0">Close</button>
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-end">
              <div className="d-flex justify-content-space">
                <div>
                  <b>Assessable Value</b>
                  <input
                    type="number"
                    min="0"
                    value={(
                      parseFloat(invRegisterData?.Net_Total) -
                      parseFloat(invRegisterData?.Discount) +
                      parseFloat(invRegisterData?.Del_Chg)
                    ).toFixed(2)}
                    disabled
                    className="input-disabled"
                  />
                </div>

                <div className="p-1"></div>
                <div>
                  <b>Select Tax</b>
                  <select
                    id="taxDropdown"
                    style={{
                      fontSize: "inherit",
                    }}
                    onChange={(e) => {
                      const newTaxOn = TaxDropDownData[
                        e.target.value
                      ].TaxOn.replace("(", "")
                        .replace(")", "")
                        .split("+");

                      let applicableTaxes = [];
                      let arr = [];
                      if (
                        TaxDropDownData[
                          e.target.value
                        ].UnderGroup.toUpperCase() === "INCOMETAX" ||
                        TaxDropDownData[
                          e.target.value
                        ].UnderGroup.toUpperCase() === "INCOME TAX"
                      ) {
                        for (let i = 1; i < newTaxOn.length; i++) {
                          const element = newTaxOn[i];
                          TaxDropDownData.filter(
                            (obj) => obj.TaxID === parseInt(element)
                          ).map((value, key) => applicableTaxes.push(value));
                        }
                        applicableTaxes.push(TaxDropDownData[e.target.value]);

                        let TaxableAmount = (
                          parseFloat(invRegisterData?.Net_Total) -
                          parseFloat(invRegisterData?.Discount) +
                          parseFloat(invRegisterData?.Del_Chg)
                        ).toFixed(2);

                        let TotalTaxAmount = 0;

                        for (let i = 0; i < applicableTaxes.length; i++) {
                          const element = applicableTaxes[i];
                          if (
                            element.UnderGroup.toUpperCase() === "INCOMETAX" ||
                            element.UnderGroup.toUpperCase() === "INCOME TAX"
                          ) {
                            let TaxableAmntForTCS =
                              parseFloat(TaxableAmount) +
                              parseFloat(TotalTaxAmount);
                            let TaxAmtForRow = (
                              (TaxableAmntForTCS *
                                parseFloat(element.Tax_Percent)) /
                              100
                            ).toFixed(2);
                            TotalTaxAmount =
                              parseFloat(TotalTaxAmount) +
                              parseFloat(TaxAmtForRow);

                            arr = [
                              ...arr,
                              {
                                TaxID: element.TaxID,
                                TaxOn: element.TaxOn,
                                TaxPercent: element.Tax_Percent,
                                Tax_Name: element.TaxName,
                                TaxableAmount: TaxableAmntForTCS,
                                TaxAmt: TaxAmtForRow,
                              },
                            ];
                          } else {
                            let TaxAmtForRow = (
                              (TaxableAmount *
                                parseFloat(element.Tax_Percent)) /
                              100
                            ).toFixed(2);
                            TotalTaxAmount =
                              parseFloat(TotalTaxAmount) +
                              parseFloat(TaxAmtForRow);

                            if (arr.length > 0) {
                              arr = [
                                ...arr,
                                {
                                  TaxID: element.TaxID,
                                  TaxOn: element.TaxOn,
                                  TaxPercent: element.Tax_Percent,
                                  Tax_Name: element.TaxName,
                                  TaxableAmount: TaxableAmount,
                                  TaxAmt: TaxAmtForRow,
                                },
                              ];
                            } else {
                              arr = [
                                {
                                  TaxID: element.TaxID,
                                  TaxOn: element.TaxOn,
                                  TaxPercent: element.Tax_Percent,
                                  Tax_Name: element.TaxName,
                                  TaxableAmount: TaxableAmount,
                                  TaxAmt: TaxAmtForRow,
                                },
                              ];
                            }
                          }
                        }

                        setInvTaxData(arr);

                        let newInvTotal =
                          parseFloat(TaxableAmount) +
                          parseFloat(TotalTaxAmount);

                        let newGrandTotal = Math.round(newInvTotal);
                        let newRoundOff = newGrandTotal - newInvTotal;

                        setInvRegisterData({
                          ...invRegisterData,
                          TaxAmount: parseFloat(TotalTaxAmount).toFixed(2),
                          InvTotal: newInvTotal.toFixed(2),
                          GrandTotal: newGrandTotal.toFixed(2),
                          Round_Off: newRoundOff.toFixed(2),
                        });
                      } else {
                        for (let i = 0; i < newTaxOn.length; i++) {
                          const element = newTaxOn[i];
                          if (parseInt(element) === 1) {
                            applicableTaxes.push(
                              TaxDropDownData[e.target.value]
                            );
                          } else {
                            // filter gets the data in array, there may be more then 1 rows, so mappppp....
                            TaxDropDownData.filter(
                              (obj) => obj.TaxID === parseInt(element)
                            ).map((value, key) => applicableTaxes.push(value));
                          }
                        }

                        let TaxableAmount = (
                          parseFloat(invRegisterData?.Net_Total) -
                          parseFloat(invRegisterData?.Discount) +
                          parseFloat(invRegisterData?.Del_Chg)
                        ).toFixed(2);
                        let TotalTaxAmount = 0;
                        for (let i = 0; i < applicableTaxes.length; i++) {
                          const element = applicableTaxes[i];

                          let TaxAmtForRow = (
                            (TaxableAmount * parseFloat(element.Tax_Percent)) /
                            100
                          ).toFixed(2);
                          TotalTaxAmount =
                            parseFloat(TotalTaxAmount) +
                            parseFloat(TaxAmtForRow);
                          if (arr.length > 0) {
                            arr = [
                              ...arr,
                              {
                                TaxID: element.TaxID,
                                TaxOn: element.TaxOn,
                                TaxPercent: element.Tax_Percent,
                                Tax_Name: element.TaxName,
                                TaxableAmount: TaxableAmount,
                                TaxAmt: TaxAmtForRow,
                              },
                            ];
                          } else {
                            arr = [
                              {
                                TaxID: element.TaxID,
                                TaxOn: element.TaxOn,
                                TaxPercent: element.Tax_Percent,
                                Tax_Name: element.TaxName,
                                TaxableAmount: TaxableAmount,
                                TaxAmt: TaxAmtForRow,
                              },
                            ];
                          }
                        }

                        setInvTaxData(arr);
                        let newInvTotal =
                          parseFloat(TaxableAmount) +
                          parseFloat(TotalTaxAmount);

                        let newGrandTotal = Math.round(newInvTotal);
                        let newRoundOff = newGrandTotal - newInvTotal;

                        setInvRegisterData({
                          ...invRegisterData,
                          TaxAmount: parseFloat(TotalTaxAmount).toFixed(2),
                          InvTotal: newInvTotal.toFixed(2),
                          GrandTotal: newGrandTotal.toFixed(2),
                          Round_Off: newRoundOff.toFixed(2),
                        });
                      }
                    }}
                    disabled={
                      invRegisterData.Inv_No ||
                      invRegisterData.DCStatus === "Cancelled"
                    }
                    className={
                      invRegisterData.Inv_No ||
                      invRegisterData.DCStatus === "Cancelled"
                        ? "ip-select mt-1 input-disabled"
                        : "ip-select mt-1"
                    }
                  >
                    <option value="none" selected disabled hidden>
                      Select an Option
                    </option>
                    {TaxDropDownData?.map((taxVal, key) => (
                      <option value={key}>{taxVal.TaxName}</option>
                    ))}
                  </select>
                </div>
                <div className="p-1"></div>
                <button
                  onClick={deleteTaxFunc}
                  disabled={
                    invRegisterData.Inv_No ||
                    invRegisterData.DCStatus === "Cancelled"
                  }
                  className={
                    invRegisterData.Inv_No ||
                    invRegisterData.DCStatus === "Cancelled"
                      ? "button-style button-disabled m-0"
                      : "button-style m-0"
                  }
                >
                  Delete Taxes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="m-3 border-top"></div>
        {/* table starts here */}
        <div className="row">
          {/* product table */}
          <div
            className="col-md-6"
            style={{ maxHeight: "50vh", overflow: "auto" }}
          >
            <ProductTable
              invDetailsData={invDetailsData}
              loadRateEvent={loadRateEvent}
            />
          </div>
          {/* tax table */}
          <div className="col-md-6">
            <TaxTable invTaxData={invTaxData} />
          </div>
        </div>
        <div className="p-3"></div>
      </div>
      <div>
        <SetRateModal
          showSetRateModal={showSetRateModal}
          setShowSetRateModal={setShowSetRateModal}
          DCInvNo={DCInvNo}
          invDetailsData={invDetailsData}
          setRateConsumerData={setRateConsumerData}
          setInvRegisterData={setInvRegisterData}
          invRegisterData={invRegisterData}
          setInvTaxData={setInvTaxData}
          deleteTaxFunc={deleteTaxFunc}
          onSave={onSave}
        />
        <ConfirmationModal
          confirmModalOpen={confirmModalOpen}
          setConfirmModalOpen={setConfirmModalOpen}
          yesClickedFunc={
            buttonClicked === "Cancel PN"
              ? cancelPN
              : buttonClicked === "Create Invoice"
              ? handleCreateInvoice
              : ""
          }
          message={
            buttonClicked === "Cancel PN"
              ? "Are you sure to cancel the PN ?"
              : buttonClicked === "Create Invoice"
              ? "Are you sure to create invoice ?"
              : ""
          }
        />
      </div>
    </>
  );
}
