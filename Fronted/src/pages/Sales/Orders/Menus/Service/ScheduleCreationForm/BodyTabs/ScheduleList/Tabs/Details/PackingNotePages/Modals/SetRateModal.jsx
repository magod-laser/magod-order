import React from "react";
import Modal from "react-bootstrap/Modal";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

import Axios from "axios";
import { endpoints } from "../../../../../../../../../../../api/constants";

export default function SetRateModal(props) {
  const updatedRates = props.invDetailsData;
  const updatingTheRateFunction = (newRates) => {
    Axios.post(endpoints.updateRatesPN, {
      newRates: newRates,
    }).then((res) => {
      if (res.data) {
        props.setShowSetRateModal(false);
        toast.success(res.data);
      }
    });

    let newNetTotal = 0;
    let newRoundOff = 0;
    let newGrandTotal = 0;

    for (let i = 0; i < newRates.length; i++) {
      const element = newRates[i];

      newNetTotal =
        newNetTotal +
        parseFloat(element.Qty) *
          (parseFloat(element.JW_Rate) + parseFloat(element.Mtrl_rate));
    }

    newGrandTotal = Math.round(newNetTotal);
    newRoundOff = parseFloat(newGrandTotal) - parseFloat(newNetTotal);

    // setting the nettotal , discount, del charg, tax amount, inv total, round off, grand total
    props.setInvRegisterData({
      ...props.invRegisterData,
      Net_Total: newNetTotal.toFixed(2),
      Discount: "0.00",
      Del_Chg: "0.00",
      TaxAmount: "0.00",
      InvTotal: newNetTotal.toFixed(2),
      Round_Off: newRoundOff.toFixed(2),
      GrandTotal: newGrandTotal.toFixed(2),
    });

    // delete tax
    props.setInvTaxData([]);
    document.getElementById("taxDropdown").value = "none";
    // props.deleteTaxFunc();

    // props.onSave();
  };

  return (
    <>
      <Modal
        size="lg"
        show={props.showSetRateModal}
        onHide={() => props.setShowSetRateModal(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Set Rates
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <b>Customer</b>
              <input
                type="text"
                defaultValue={props.setRateConsumerData[0]?.Cust_Name}
                disabled
                className="input-disabled"
              />
            </div>
            <div className="col-md-4">
              <b>Sales Contact</b>
              <input
                type="text"
                defaultValue={props.setRateConsumerData[0]?.SalesContact}
                disabled
                className="input-disabled"
              />
            </div>
            <div className="col-md-4">
              <b>PO No.</b>
              <input
                type="text"
                defaultValue={props.setRateConsumerData[0]?.PO_No}
                disabled
                className="input-disabled"
              />
            </div>
            <div className="col-md-4">
              <b>Schedule No.</b>
              <input
                type="text"
                defaultValue={props.setRateConsumerData[0]?.ScheduleId}
                disabled
                className="input-disabled"
              />
            </div>
            <div className="col-md-4">
              <b>Schedule Type</b>
              <input
                type="text"
                defaultValue={props.setRateConsumerData[0]?.ScheduleType}
                disabled
                className="input-disabled"
              />
            </div>
            <div className="col-md-4">
              <b>Schedule Status</b>
              <input
                type="text"
                defaultValue={props.setRateConsumerData[0]?.Schedule_Status}
                disabled
                className="input-disabled"
              />
            </div>
          </div>
          <div className="border-top m-3"></div>

          {/* table */}

          <div>
            <Table
              striped
              className="table-data border"
              style={{ border: "1px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th>SL No</th>
                  <th>Drawing Name</th>
                  <th>Material</th>
                  <th>JW Cost</th>
                  <th>Material Cost</th>
                </tr>
              </thead>
              <tbody className="tablebody">
                {props.invDetailsData.map((val, i) => (
                  <>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{val.Dwg_No}</td>
                      <td>{val.Mtrl}</td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          defaultValue={val.JW_Rate}
                          className="border-0"
                          onChange={(e) => {
                            updatedRates[i].JW_Rate = e.target.value;
                            updatedRates[i].Unit_Rate = (
                              parseFloat(e.target.value || 0) +
                              parseFloat(updatedRates[i].Mtrl_rate || 0)
                            ).toFixed(2);
                          }}
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          defaultValue={val.Mtrl_rate}
                          disabled={
                            props.invRegisterData?.DC_InvType === "Job Work"
                          }
                          className={
                            props.invRegisterData?.DC_InvType === "Job Work"
                              ? "border-0 input-disabled"
                              : "border-0"
                          }
                          onChange={(e) => {
                            updatedRates[i].Mtrl_rate = e.target.value;
                            updatedRates[i].Unit_Rate = (
                              parseFloat(e.target.value || 0) +
                              parseFloat(updatedRates[i].JW_Rate || 0)
                            ).toFixed(2);
                          }}
                        />
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="row">
            <div className="d-flex justify-content-between p-0">
              <button
                className="button-style m-0 "
                onClick={() => {
                  props.setShowSetRateModal(false);
                }}
              >
                Close
              </button>
              <button
                className="button-style m-0 "
                onClick={() => {
                  updatingTheRateFunction(updatedRates);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
