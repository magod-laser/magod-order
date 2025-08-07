import React, { Fragment, useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Button, Modal } from "react-bootstrap";
import PrintInvoice from "./PrintInvoice";
import { endpoints } from "../../../../api/constants";
import { Axios } from "axios";
// import MLLogo from "../../../../../../../ML-LOGO.png";
// PrintInvoice

export default function ModalInvoiceAndAnnexure(props) {
  const handleClose = () => props.setPrintInvoiceModal(false);
const [PDFData, setPDFData] = useState({});
  const [UnitName, setUnitName] = useState();

    useEffect(() => {
        const storedData = localStorage.getItem("userData");
    
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            const AppunitName = parsedData.UnitName;
    
            if (AppunitName) {
              setUnitName(AppunitName);
            }
          } catch (err) {
            console.error("Error parsing userData from localStorage:", err);
          }
        } else {
          console.log("No userData in localStorage.");
        }
      }, []);
  
       
  function fetchPDFData() {
    Axios.post(endpoints.getPDFData, { UnitName: UnitName }).then((res) => {
      console.log(" axios response ::", res.data[0]);
      setPDFData(res.data[0]);
    });
  }

  useEffect(() => {
    if (props.printInvoiceModal) {
      fetchPDFData();
    }
  }, [props.printInvoiceModal]);

  return (
    <>
      <Modal fullscreen show={props.printInvoiceModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Print Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-0 p-1">
          <Fragment>
            <PDFViewer width="1358" height="595" filename="Invoice.pdf">
              <PrintInvoice
                rowLimit={props.rowLimit}
                invRegisterData={props.invRegisterData}
                invDetailsData={props.invDetailsData}
                invTaxData={props.invTaxData}
                PDFData={PDFData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}
