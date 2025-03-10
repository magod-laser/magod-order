import React, { useState, Fragment, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { PDFViewer, StyleSheet, Image } from "@react-pdf/renderer";
import SolidStatePdf from "./SolidStatePdf";
import { apipoints } from "../../../../../../../../api/isoForms/pdf";
import Axios  from "axios";

export default function SolidStateModal({
  solidStateFormOpen,
  setSolidStateFormOpen,
  formData,
}) {
  const [fullscreen, setFullscreen] = useState(true);
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

  const handleClose = () => {
    setSolidStateFormOpen(false);
  };

  return (
    <div>
      <Modal
        show={solidStateFormOpen}
        fullscreen={fullscreen}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title> Parameter Sheet - Solid State Laser</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer
              width="1200"
              height="600"
              filename="ParameterSolidState.pdf"
            >
              <SolidStatePdf formData={formData} PDFData={PDFData}/>
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
