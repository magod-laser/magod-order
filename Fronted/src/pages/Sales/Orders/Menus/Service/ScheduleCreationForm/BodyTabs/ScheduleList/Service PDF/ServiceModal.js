/** @format */

import React, { useState, Fragment, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
// import ProfileJobWorkPrint from '../Profile_JobWork/ProfileJobWorkPrint';

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
import ServicePDF from "./ServicePDF";
import axios, { Axios } from "axios";
import { apipoints } from "../../../../../../../../api/isoForms/pdf";
import { toast } from "react-toastify";
import { baseURL } from "../../../../../../../../../api/baseUrl";

export default function ServiceModal({
  setServiceOpen,
  serviceOpen,
  setOpenPrintModal,
  formdata,
  Type,
}) {
  // console.log("in Print Modal",selectedWeek)

  console.log("formdata", formdata);
  console.log("formdata", formdata[0]?.OrdSchNo);
  console.log("formdata", formdata[0]?.Order_No);

  let OrderNo  = formdata[0]?.Order_No;;

  const [fullscreen, setFullscreen] = useState(true);

  const [PDFData, setPDFData] = useState({});

  useEffect(() => {
    axios
      .get(apipoints.getPDFData)
      .then((response) => {
        setPDFData(response.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching", error);
      });
  }, []);

  console.log("PDFData is", PDFData);
  //save to server

  const savePdfToServer = async () => {
    try {
      // const adjustment = "ProdSchedule"; // Replace with the desired adjustment name
     const adjustment = "Schedule_" + formdata[0]?.OrdSchNo;// Replace with the desired adjustment name

      // Step 1: Set the adjustment name on the server
      await axios.post(`${baseURL}/PDF/set-adjustment-name`, {
        adjustment,
        WO: "WO",
        OrderNo: OrderNo,
        SchNo: formdata[0]?.OrdSchNo,
      });

      // Step 2: Generate the PDF as a Blob
      const blob = await pdf(
        <ServicePDF formdata={formdata} PDFData={PDFData} />
      ).toBlob();

      console.log("Blob size:", blob.size);
      if (blob.size === 0) {
        console.error("Generated PDF blob is empty!");
      }

      // Step 3: Create a File object for the PDF
      const file = new File([blob], "GeneratedPDF.pdf", {
        type: "application/pdf",
      });

      console.log("File type:", file.type);
      console.log("File size:", file.size);
      if (file.size === 0) {
        console.error("The file is empty or corrupted!");
      }

      // Step 4: Create FormData and append the file
      const formData = new FormData();
      formData.append("file", file);

      // Step 5: Send the PDF file to the server
      const response = await axios.post(`${baseURL}/PDF/save-pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("PDF saved successfully!");
      } else {
        toast.error("Failed to save PDF. Please try again.");
      }
    } catch (error) {
      console.error("Error saving PDF to server:", error);
      toast.error("An error occurred while saving the PDF.");
    }
  };
  return (
    <div>
      <Modal
        show={serviceOpen}
        fullscreen={fullscreen}
        onHide={() => setServiceOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {Type}{" "}
            <button
              className="button-style"
              variant="primary"
              style={{ fontSize: "10px", marginRight: "35px" }}
              onClick={savePdfToServer}
            >
              Save to Server
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <ServicePDF formdata={formdata} PDFData={PDFData} />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
