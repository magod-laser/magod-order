import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PNDescription from "./PackingNotePages/PNDescription";

export default function PackingNoteAndInvoiceDetails() {
  const location = useLocation();

  const [DcInvNo, setDcInvNo] = useState(location?.state);

  return (
    <>
      <div>
        <PNDescription DcInvNo={DcInvNo} />
      </div>
    </>
  );
}
