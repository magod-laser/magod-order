import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Table } from "react-bootstrap";
import RegisterTable from "./Tables/RegisterTable";
import DetailTable from "./Tables/DetailTable";
import { toast } from "react-toastify";

export default function PackingNoteAndInvoice(props) {
  const nav = useNavigate();

  const [registerSelectedRow, setRegisterSelectedRow] = useState({});
  const [filteredDetailsData, setFilteredDetailsData] = useState([]);

  // console.log("registerSelectedRow", registerSelectedRow);

  function showInvoice() {
    if (registerSelectedRow.DC_Inv_No) {
      nav(`/Orders/Service/PackingNoteAndInvoiceDetails`, {
        state: registerSelectedRow.DC_Inv_No,
      });
    } else {
      toast.warning("Please select the Packing Note / Invoice");
    }
  }
  return (
    <>
      <button className="button-style ms-3 mb-1" onClick={showInvoice}>
        Show Invoice
      </button>
      <div className="row">
        <div
          className="col-md-5"
          style={{
            height: "auto",
            overflow: "auto",
          }}
        >
          <RegisterTable
            PNAndInvRegisterData={props.PNAndInvRegisterData}
            PNAndInvDetailsData={props.PNAndInvDetailsData}
            registerSelectedRow={registerSelectedRow}
            setRegisterSelectedRow={setRegisterSelectedRow}
            setFilteredDetailsData={setFilteredDetailsData}
          />
        </div>

        <div
          className="col-md-7"
          style={{
            height: "auto",
            overflow: "auto",
          }}
        >
          <DetailTable
            filteredDetailsData={filteredDetailsData}
            registerSelectedRow={registerSelectedRow}
          />
        </div>
      </div>
    </>
  );
}
