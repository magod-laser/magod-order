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
import PrintInvoiceAndAnnexure from "./PrintAnnexure";
// import MLLogo from "../../../../../../../ML-LOGO.png";
// PrintInvoiceAndAnnexure

export default function ModalInvoiceAndAnnexure(props) {
  const handleClose = () => props.setPrintAnneureModal(false);

  return (
    <>
      <Modal fullscreen show={props.printAnneureModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Print Annexure</Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-0 p-1">
          <Fragment>
            <PDFViewer
              width="1358"
              height="595"
              filename="InvoiceAndAnnexure.pdf"
            >
              <PrintInvoiceAndAnnexure
                invRegisterData={props.invRegisterData}
                invDetailsData={props.invDetailsData}
                invTaxData={props.invTaxData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}
