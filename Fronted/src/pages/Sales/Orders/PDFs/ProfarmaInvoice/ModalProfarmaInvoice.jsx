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
  const [UnitName, setUnitName] = useState();

  const handleClose = () => props.setPrintInvoiceModal(false);

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

  const savePdfToServer = async () => {
    try {
      const adjustment = "Performa_Invoice"; 

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
            Print Profarma Invoice{" "}
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
