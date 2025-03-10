/** @format */

import React, { Fragment, useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  pdf,
} from "@react-pdf/renderer";
import { Button, Modal } from "react-bootstrap";
import PrintProfarmaInvoice from "./PrintProfarmaInvoice";
import { endpoints } from "../../../../api/constants";
import Axios from "axios";
import axios from "axios";
import { toast } from "react-toastify";
import { baseURL } from "../../../../../api/baseUrl";

export default function ModalProfarmaInvoice(props) {
  const [PDFData, setPDFData] = useState({});

  const handleClose = () => props.setPrintInvoiceModal(false);

  function fetchPDFData() {
    Axios.post(endpoints.getPDFData, {}).then((res) => {
      setPDFData(res.data[0]);
    });
  }

  // const base64String = PDFData.split(",")[1];

  // // Send the base64 string to the backend
  //     await axios.post('http://localhost:6000/pdf/upload-pdf', {
  //       pdfData: base64String,
  //       fileName: `invoice_${Date.now()}.pdf`,
  //     });

  // useEffect(() => {
  //   fetchPDFData();
  // }, []);

  // const savePdfToServer = async () => {
  //   try {
  //     // Generate the Blob from PdfAdjustment
  //     const blob = await pdf(
  //       <PrintProfarmaInvoice
  //         PDFData={PDFData}
  //         rowLimit={props.rowLimit}
  //         profarmaMainData={props.profarmaMainData}
  //         profarmaDetailsData={props.profarmaDetailsData}
  //         profarmaTaxData={props.profarmaTaxData}
  //       />
  //     ).toBlob();

  //     // Convert Blob to File
  //     const file = new File([blob], "GeneratedPDF.pdf", {
  //       type: "application/pdf",
  //     });

  //     // Create a FormData object
  //     const formData = new FormData();

  //     const adjustment = "Adjustment_Invoices"; // Replace with the actual name you want to send
  //     formData.append("file", file);
  //     formData.append("adjustment", adjustment);

  //     // Send the PDF to the backend
  //     const response = await axios.post(baseURL + `/PDF/save-pdf`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (response.status === 200) {
  //       toast.success("PDF saved successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error saving PDF to server:", error);
  //   }
  // };


   const savePdfToServer = async () => {
     try {
       const adjustment = "Performa_Invoice"; // Replace with the actual name you want to send

       // Step 1: Call the API to set the adjustment name
       await axios.post(baseURL + `/PDF/set-adjustment-name`, { adjustment });
       const blob = await pdf(
         <PrintProfarmaInvoice
          PDFData={PDFData}
          rowLimit={props.rowLimit}
          profarmaMainData={props.profarmaMainData}
          profarmaDetailsData={props.profarmaDetailsData}
          profarmaTaxData={props.profarmaTaxData}
        />
       ).toBlob();

       const file = new File([blob], "GeneratedPDF.pdf", {
         type: "application/pdf",
       });

       const formData = new FormData();

       formData.append("file", file);

       const response = await axios.post(baseURL + `/PDF/save-pdf`, formData, {
         headers: { "Content-Type": "multipart/form-data" },
       });

       if (response.status === 200) {
         toast.success("PDF saved successfully!");
       }
     } catch (error) {
       console.error("Error saving PDF to server:", error);
     }
   };
  return (
    <>
      <Modal fullscreen show={props.printInvoiceModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title
            style={{
              // fontSize: "12px",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            Print Proforma Invoice{" "}
            <div>
              <button
                className="button-style"
                variant="primary"                
                style={{ fontSize: "10px", marginRight: "35px" }}
                onClick={savePdfToServer}
              >
                Save to Server
              </button>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-0 p-1">
          <Fragment>
            <PDFViewer width="1358" height="595" filename="Invoice.pdf">
              <PrintProfarmaInvoice
                PDFData={PDFData}
                rowLimit={props.rowLimit}
                profarmaMainData={props.profarmaMainData}
                profarmaDetailsData={props.profarmaDetailsData}
                profarmaTaxData={props.profarmaTaxData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}
