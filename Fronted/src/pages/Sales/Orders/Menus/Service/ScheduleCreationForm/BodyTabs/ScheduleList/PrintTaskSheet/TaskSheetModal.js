import React, { Fragment, useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import Modal from "react-bootstrap/Modal";
import TaskSheetPdf from "./TaskSheetPdf";
import { apipoints } from "../../../../../../../../api/isoForms/pdf";
import Axios  from "axios";

export default function TaskSheetModal({
  openPrintModal,
  formData,
  setOpenPrintModal,
}) {
  const handleClose = () => setOpenPrintModal(false);
  const [PDFData, setPDFData] = useState({});

  useEffect(() => {
    Axios
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
      <Modal fullscreen show={openPrintModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Task Sheet Form</Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-0 p-1">
          <Fragment>
            <PDFViewer width="1200" height="600" filename="TaskSheet.pdf">
              <TaskSheetPdf formData={formData} PDFData={PDFData} />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
