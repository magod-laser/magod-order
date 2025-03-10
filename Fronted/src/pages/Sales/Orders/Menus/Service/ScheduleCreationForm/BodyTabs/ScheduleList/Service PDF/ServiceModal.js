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
} from "@react-pdf/renderer";
import ServicePDF from "./ServicePDF";
import axios from "axios";
import { apipoints } from "../../../../../../../../api/isoForms/pdf";

export default function ServiceModal({
  setServiceOpen,
  serviceOpen,
  setOpenPrintModal,
  formdata,
  Type,
}) {
  // console.log("in Print Modal",selectedWeek)

  console.log("formdata", formdata);

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

  return (
    <div>
      <Modal
        show={serviceOpen}
        fullscreen={fullscreen}
        onHide={() => setServiceOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{Type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <ServicePDF formdata={formdata} PDFData={PDFData}/>
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
