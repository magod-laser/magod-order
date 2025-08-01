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
import { endpoints } from "../../../../../../../../api/constants";
import { postRequest } from "../../../../../../../../api/apiinstance";

export default function ServiceModal({
  setServiceOpen,
  serviceOpen,
  setOpenPrintModal,
  formdata,
  Type,
}) {
  // console.log("in Print Modal",selectedWeek)

  console.log("formdata in service modal::", formdata);
  console.log("OrdSchNo", formdata[0]?.OrdSchNo);
  console.log("ScheduleId", formdata[0]?.ScheduleId);
  console.log("Order_No", formdata[0]?.Order_No);

  let SchId = formdata[0]?.ScheduleId;

  useEffect(() => {
    console.log(formdata[0]?.ScheduleId);
  }, [formdata[0]?.ScheduleId]);

  console.log("SchId outside useeffect::", SchId);
  const [Tabledata, setTabledata] = useState([]);


  // useEffect(() => {
  //   console.log("SchId in useEffect", SchId);
  //   console.log("formdata[0]?.ScheduleId in useEffect", formdata[0]?.ScheduleId);
  //   if (SchId){
  //     postRequest(
  //       endpoints.pdfdata,
  //       // { ScheduleId: formdata[0]?.ScheduleId },
  //       { ScheduleId: SchId },
  //       (response) => {
  //         console.log("Schedul response is", response);
  //         setTabledata(response);
  //       }
  //     );

  //   } else {
  //     console.log("ScheduleId is not available");

  //   }
  //   // }, [formdata[0]?.ScheduleId]);
  // }, [SchId, formdata[0]?.ScheduleId]);

  // useEffect(() => {
  //   const scheduleId = formdata[0]?.ScheduleId;
  
  //   if (!scheduleId) return;
  
  //   console.log("Calling API with ScheduleId:", scheduleId);
  
  //   postRequest(
  //     endpoints.pdfdata,
  //     { ScheduleId: scheduleId },
  //     (response) => {
  //       console.log("Schedule response is", response);
  //       setTabledata(response);
  //     }
  //   );
  // }, [formdata[0]?.ScheduleId]);


// Updated logic with async/await for fetching schedule data - Bodheesh
  // useEffect(() => {
  //   const scheduleId = formdata[0]?.ScheduleId;
  //   console.log("scheduleId === 1",SchId);
  //   console.log("scheduleId === 12",scheduleId);
    
  //   if (!SchId) return;
  
  //   const fetchData = async () => {
  //     try {
  //       console.log("Calling API with ScheduleId:", SchId);
  //       const response = await postRequest(endpoints.pdfdata, { ScheduleId: SchId });
  //       console.log("Schedule response is received in servicemodal::", response);
  //       setTabledata(response);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  
  //   fetchData();
  // }, [SchId]);
  useEffect(() => {
    if (!formdata || formdata.length === 0 || !formdata[0]?.ScheduleId || !SchId) {
      return; 
    }
  
    const scheduleId = formdata[0]?.ScheduleId;
    console.log("scheduleId from formdata:", scheduleId);
    console.log("SchId from state/prop:", SchId);
  
    const fetchData = async () => {
      try {
        console.log("Calling API with ScheduleId:", SchId);
        const response = await postRequest(endpoints.pdfdata, { ScheduleId: SchId });
        console.log("Schedule response received in servicemodal:", response);
        setTabledata(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [formdata, SchId]); 
  
  
  

 
  console.log("Tabledata logged in service modal ::", Tabledata);



  let OrderNo = formdata[0]?.Order_No;

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
  const [PDFData, setPDFData] = useState({});

  useEffect(() => {
    axios
      .get(apipoints.getPDFData,{
        unitName:UnitName
      })
      .then((response) => {
        console.log("getPDFData===", response.data[0]);

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
      const adjustment = "Schedule_" + formdata[0]?.OrdSchNo;

      await axios.post(`${baseURL}/PDF/set-adjustment-name`, {
        adjustment,
        WO: "WO",
        OrderNo: OrderNo,
        SchNo: formdata[0]?.OrdSchNo,
      });
      const blob = await pdf(
        <ServicePDF
          formdata={formdata}
          PDFData={PDFData}
          Tabledata={Tabledata}
          setTabledat={setTabledata}
        />
      ).toBlob();

      console.log("blob", blob);

      const file = new File([blob], "GeneratedPDF.pdf", {
        type: "application/pdf",
      });
      console.log("file", file);

      const formData = new FormData();

      formData.append("file", file);
      // formData.append("OrderNo", OrderNo);

      const response = await axios.post(`${baseURL}/PDF/save-pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("PDF saved successfully!");
      }
    } catch (error) {
      console.error("Error saving PDF to server:", error);
    }
  };

  useEffect(() => {
    if (serviceOpen) {
      const timeout = setTimeout(() => {
        savePdfToServer();
      }, 3000); // Adjust delay if needed

      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [serviceOpen]);
  return (
    <div>
      <Modal
        show={serviceOpen}
        fullscreen={fullscreen}
        // onHide={() => setServiceOpen(false)}
        onHide={() => {
          // savePdfToServer(); // Call the function before closing the modal
          setServiceOpen(false);
        }}
      >
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
              <ServicePDF
                formdata={formdata}
                PDFData={PDFData}
                Tabledata={Tabledata}
                setTabledat={setTabledata}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
