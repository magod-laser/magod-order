import React, { Fragment, useState } from "react";
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
import PrintPackingNote from "./PrintPackingNote";
import { useEffect } from "react";
import { Axios } from "axios";
import { endpoints } from "../../../../api/constants";


// PrintPackingNote
export default function ModalPackingNote(props) {
  const handleClose = () => props.setPrintCopyModal(false);
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

  // console.log("props... in modal", props);
  const rowLimit = 20;

  function* chunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
  }

  const [PDFData, setPDFData] = useState({});
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
      <Modal
        fullscreen
        // show={true}
        show={props.printCopyModal}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Print Packing Note</Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-0 p-1">
          <Fragment>
            <PDFViewer width="1358" height="595" filename="PackingNote.pdf">
              <PrintPackingNote
                PDFData={PDFData}
                invRegisterData={props.invRegisterData}
                // invDetailsData={props.invDetailsData}
                invTaxData={props.invTaxData}
                invDetailsData={[...chunks(props?.invDetailsData, rowLimit)]}
                rowLimit={rowLimit}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}
