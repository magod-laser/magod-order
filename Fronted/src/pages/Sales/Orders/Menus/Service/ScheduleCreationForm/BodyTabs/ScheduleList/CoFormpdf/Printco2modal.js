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
import COForm from "./COForm";
import { apipoints } from "../../../../../../../../api/isoForms/pdf";
import Axios  from "axios";

export default function Printco2modal({
  openPrintModal,
  setOpenPrintModal,
  formData,
}) {
  const [fullscreen, setFullscreen] = useState(true);


  // Data need to get from local storage
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

      // Fetching PDF data
  const [PDFData, setPDFData] = useState({});

  useEffect(() => {
    Axios
      .get(apipoints.getPDFData,{
        unitName:UnitName
      })
      .then((response) => {
        setPDFData(response.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching", error);
      });
  }, []);


  const handleClose = () => setOpenPrintModal(false);

  return (
    <div>
      <Modal fullscreen show={openPrintModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Parameter Sheet - CO2 Laser</Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-0 p-1">
          <Fragment>
            <PDFViewer
              width="1200"
              height="600"
              filename="ParameterSheetCO2form.pdf"
            >
              <COForm formData={formData} PDFData={PDFData} />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
