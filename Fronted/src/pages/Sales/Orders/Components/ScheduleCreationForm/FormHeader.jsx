/** @format */

import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { Table,} from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
const {  postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

export default function FormHeader(props) {
  let navigate = useNavigate();
  let [dxfFolderShow, setDxfFolderShow] = useState(false);
  const [BS_dxfFilesList, setBS_DxfFilesList] = useState([]);
  let [selectedFile, setSelectedFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [fuploadClose, setFUploadClose] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [handleUploadMdl, sethandleUploadMdl] = useState(false);

  const {
    // OrderData,
    // OrderCustData,
    // handleRegisterBtn,
    // handleSaveBtn,
    // isButtonDisabled,
    // openRegisterOrder,
    // closeRegisterOrder,
    // openModal,
    // closeModal,
    updateOrdrData,
    // saveJWMRChanges,
  } = props;

  const handleClick = async () => {
    let docNo = props.OrderData.Order_No;

    let Doctype = "Order";
    let mspath = process.env.REACT_APP_SERVER_FILES;
    // eslint-disable-next-line no-unused-vars
    let mpath = `${mspath}\\${docNo}\\DXF\\`;

    // Popup to open the folder 
    setDxfFolderShow(true);

    let destPath = `\\Wo\\` + docNo + "\\DXF\\";
    console.log("despath : ", destPath);
    await postRequest(endpoints.getDwgFiles, { Doctype, docNo, destPath }, (fileslist) => {
      console.log("fileslist : ", fileslist.files);
      setBS_DxfFilesList(fileslist);
    });

  };

  const handleCloseDwgFolder = () => setDxfFolderShow(false);

  const handleFileSelect = async (filenm) => {
    setSelectedFile(filenm);

    await postRequest(endpoints.CheckDwgFileStatus, { docno: props.OrderData.Order_No, uploadfiles: filenm.name }, (res) => {
      console.log(res);
      if (res.status === "Locked") {
        //toast.error("File is Locked by another User", { position: toast.POSITION.TOP_CENTER, autoClose: 1200 });
        alert("File is Locked by another User");
        return;
      }
    });

    let file = new Blob([filenm.fcontent], { type: "application/dxf" });

    // Create a link element
    const element = document.createElement("a");
    //29-03-25
    if (getRightmostCharactersAfterDot(filenm.name) !== "dxf") {
      alert("File Selected: " + getRightmostCharactersAfterDot(filenm.name));
      element.download = filenm.name + ".dxf"; // file.name;
    } else {
      element.download = filenm.name; // file.name;
    }
 
    // Create a URL for the Blob and set it as the href attribute
    element.href = URL.createObjectURL(file);
    // Append the link to the body
    document.body.appendChild(element);

    // Programmatically click the link to trigger the download
    element.click();

    handleDownload();

  }

  const handleDownload = async () => {
   // alert("Clicked on Order dxf download");
    if (selectedFile) {
      try {
        // Create a Blob from the file content
        const blob = new Blob([selectedFile.fcontent], { type: 'application/octet-stream' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create an anchor tag to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedFile.name; // File name for the downloaded file

        // Append the link to the document and simulate a click
        document.body.appendChild(link);
        link.click();

        // Cleanup: Remove the link and revoke the Blob URL to free memory
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Update server with the file download info
        let flocked = true;
        let docno = props.OrderData.Order_No;

        await postRequest(endpoints.updateUploadFiles, { docno, uploadfiles: selectedFile.name, flocked }, (res) => {
          console.log(res);
          if (res.status === "Updated") {
            setFUploadClose(true);
            sethandleUploadMdl(false);
          }
        });

        sethandleUploadMdl(false);
      } catch (error) {
        console.error("Error during file download", error);
      //  alert("An error occurred while saving the file to the local drive.");
      }
    } else {
      alert("No file selected!");
    }
  };


  const handleUpload = () => {
    alert("Clicked on Order dxf upload");
    let docno = props.OrderData.Order_No;
    if (docno === "") {
      toast.info("Order No Upload Files", { position: toast.POSITION.TOP_CENTER, autoClose: 1500 });
      return;
    }
    alert("Upload Files");
    sethandleUploadMdl(true);
  };



  const getRightmostCharactersAfterDot = (str) => {
    const parts = str.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  };

  return (
    <>
      <div className="col-md-12">
        <h4 className="title">Schedule List Creation Form</h4>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h5 className="">
            <label className="form-label">
              Order No: {props.OrderData?.Type} - {props.OrderData?.Order_No}
            </label>
            <> </>
            <label className="form-label">
              {props.OrderCustData?.Cust_name} - (
              {props.OrderCustData?.Cust_Code})
            </label>
          </h5>
        </div>
        <div className="col-md-4">
          <button
            className="button-style"
           
            onClick={props.openRegisterOrder}
            disabled={
              props.isButtonDisabled ||
              props.OrderData?.Order_Status === "Recorded" ||
              props.OrderData?.Order_Status === "Processing"
            }
          >
            Register Order
          </button>
          <button
            className="button-style"
            onClick={() => {
              if (props.saveJWMRChanges) {
                props.saveJWMRChanges();
              } else {
                updateOrdrData();
              }
            }}
            // onClick={props.openModal}
          >
            Save
          </button>
          
          <button className="button-style" onClick={handleClick}>
            Open folder
          </button>
         
          <button
            className="button-style "
            
            onClick={() => {
              const orderNo = props.OrderData?.Order_No;
              const fromPath = props.fromPath;
              console.log("clicked close button");
             
              const sharedState = {
                Order_No: props.FabOrderNo,
                Type: "Fabrication",
                Cust_Code: props.Cust_Code,
              };
              console.log("sharedState", sharedState);
              
              if (
                (orderNo?.startsWith("6") || orderNo?.startsWith("7")) &&
                (fromPath === "/Orders/Profile/ProfileOpenSchedule" ||
                  fromPath === "/Orders/Service/ServiceOpenSchedule")
              ) {
                // console.log("6,7--2");
                // alert("Please check with Fabrication Order")
                navigate(-2);
                // navigate("/Orders/Fabrication/FabricationOpenSchedule", {
                //   state: sharedState,
                // });
              } else if (orderNo?.startsWith("6") || orderNo?.startsWith("7")) {
                // console.log("6,7--1");
                navigate(-1);
                // navigate("/Orders/Fabrication/FabricationOpenSchedule");
              } else if (props.OrderData?.Order_No.startsWith('2')) {
                navigate("/Orders");
              } else {
                // console.log("--/");
                navigate("/"); // optional fallback
              }
            }}
            
            style={{ float: "right" }}
          >
            Close
          </button>
          {/* </Link> */}
        </div>
        {/* Displaying Dxf Files from respective folder on Click of Order Dxf Button */}
        <div className="row">
          <Modal show={dxfFolderShow}>
            <Modal.Header
              className="justify-content-md-center"
              style={{
                paddingTop: "10px",
                backgroundColor: "#283E81",
                color: "#ffffff",
              }}
            >
              <Modal.Title style={{ fontFamily: "Roboto", fontSize: "18px" }}>
                Drawing Folder
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div
                  className="col-md-12"
                  style={{
                    padding: "0px 10px 0px 10px",
                    fontFamily: "Roboto",
                    fontSize: "12px",
                  }}
                >
                  <Table striped className="table-data border">
                    <thead className="tableHeaderBGColor">
                      <tr>
                        {/* <th style={{ whiteSpace: "nowrap" }}>Select</th> */}
                        <th style={{ whiteSpace: "nowrap" }}>File Name</th>
                        <th
                          style={{ whiteSpace: "nowrap", textAlign: "right" }}
                        >
                          File Size
                        </th>
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      
                      {BS_dxfFilesList?.length > 0 ? (
                        BS_dxfFilesList.map((file, index) => (
                          <tr
                            key={index}
                            onClick={() => handleFileSelect(file)}
                            style={{ cursor: "pointer" }}
                            className={selectedFile === file ? "#b8d6f5" : ""}
                          >
                            <td style={{ Width: "250px" }}>{file.name}</td>
                            <td style={{ textAlign: "right" }}>{file.size}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>No files found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <button
                    onClick={handleDownload}
                    className="button-style "
                    style={{ width: "100px" }}
                    disabled={!selectedFile}
                  >
                    Download
                  </button>
                </div>
                <div className="col-md-3">
                  {" "}
                  <button
                    onClick={handleUpload}
                    className="button-style "
                    style={{ width: "100px" }}
                  >
                    Upload
                  </button>
                </div>
                <div className="col-md-3">
                  {""}
                  <button
                    onClick={handleCloseDwgFolder}
                    className="button-style "
                    style={{ width: "100px" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>

      
    </>
  );
}
