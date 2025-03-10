import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import PrintPDF from "./PrintPDF";
import axios from "axios";
import { baseURL } from "../../../api/baseUrl";
import { toast } from "react-toastify";

export default function PrintModal({
  setServiceOpen,
  serviceOpen,
  setOpenPrintModal,
  selectedRow,
}) {
  const [fullscreen, setFullscreen] = useState(true);

  // Function to save the PDF to the server
  const savePdfToServer = async () => {
    try {
      const adjustment = "CombinedSchedule"; // Replace with the desired adjustment name

      // Step 1: Set the adjustment name on the server
      await axios.post(`${baseURL}/PDF/set-adjustment-name`, { adjustment });

      // Step 2: Generate the PDF as a Blob
      const blob = await pdf(<PrintPDF formdata={selectedRow} />).toBlob();

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
          <Modal.Title>Service</Modal.Title>
          <button
            style={{ marginLeft: "80%" }}
            className="button-style group-button"
            onClick={savePdfToServer}
          >
            Save to server
          </button>
        </Modal.Header>
        <Modal.Body>
          <PDFViewer width="100%" height="600" filename="GeneratedPDF.pdf">
            <PrintPDF formdata={selectedRow} />
          </PDFViewer>
        </Modal.Body>
      </Modal>
    </div>
  );
}
