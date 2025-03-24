/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Table, Tabs, Form } from "react-bootstrap";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
//"../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

export default function FormHeader(props) {
  let navigate = useNavigate();
  let [dxfFolderShow, setDxfFolderShow] = useState(false);
  const [BS_dxfFilesList, setBS_DxfFilesList] = useState([]);
  let [selectedFile, setSelectedFile] = useState(null);
  const [fuploadClose, setFUploadClose] = useState(false);
  const [handleUploadMdl, sethandleUploadMdl] = useState(false);

  const {
    OrderData,
    OrderCustData,
    handleRegisterBtn,

    handleSaveBtn,
    isButtonDisabled,
    openRegisterOrder,
    closeRegisterOrder,
    openModal,
    closeModal,
    updateOrdrData,
    saveJWMRChanges,
  } = props;
  const [folders, setFolders] = useState([]);

  // const FolderExplorer = () => {
  // 	// useEffect(() => {
  // 	const fetchFolders = async () => {
  // 		try {
  // 			const response = await axios.post(
  // 				"http://localhost:6001/user/api/folder-structure"
  // 			);
  // 			setFolders(response.data);
  // 		} catch (error) {
  // 			console.error("Error fetching folder structure:", error);
  // 		}
  // 	};

  // 	fetchFolders();
  // 	// }, []);
  // };

  // const openFolder = () => {
  // Create a hidden file input element
  // const fileInput = document.createElement("input");
  // fileInput.type = "file";
  // fileInput.setAttribute("directory", "");
  // fileInput.setAttribute("webkitdirectory", ""); // For Safari support
  // fileInput.setAttribute("mozdirectory", ""); // For Firefox support
  // fileInput.setAttribute("msdirectory", ""); // For Edge support
  // fileInput.setAttribute("odirectory", ""); // For Opera support
  // fileInput.setAttribute("multiple", ""); // Allow selection of multiple directories (optional)
  // fileInput.click();
  // 	axios
  // 		.post("http://localhost:6001/user/api/open-explorer", {
  // 			// params: { path: "E:/" }, // Use forward slashes or properly escape backslashes
  // 			// params: { path: "E:\\\\" }, // Escaped backslashes
  // 		})
  // 		.then((response) => {
  // 			console.log(response.data); // Handle success
  // 		})
  // 		.catch((error) => {
  // 			console.error("Error opening path:", error); // Handle error
  // 		});
  // };
  const openFolder = () => {
    alert("openFolder");
    axios
      // .post("http://172.16.20.61:6001/user/openexplorer", {
      .post("http://localhost:6001/user/openexplorer", {
        // Sending the path in the request body to the backend
        // path: "E:After-Restoration", // Ensure this is the path you want to open
        // path: "C:\\", // Try a simple path
      })
      .then((response) => {
        // Handle success
        // console.log("Folder opened successfully:", response.data);
      })
      .catch((error) => {
        // Handle error
        // console.error("Error opening path:", error);
      });
  };
  // };

  const handleClick = async () => {
    let docNo = props.OrderData.Order_No;
    
    let Doctype = "Order";
    let mspath = process.env.REACT_APP_SERVER_FILES;
    let mpath = `${mspath}\\${docNo}\\DXF\\`;

    //***************************************************** */
    // Popup to open the folder 
    //***************************************************** */
    setDxfFolderShow(true);

    let destPath = `\\Wo\\` + docNo + "\\DXF\\";
    console.log("despath : ", destPath);
    await postRequest(endpoints.getDwgFiles, { Doctype, docNo, destPath }, (fileslist) => {
      console.log("fileslist : ", fileslist.files);
      setBS_DxfFilesList(fileslist);
    });

    ///////////////////////
    // const url = `C:\Magod`;
    // window.open(url);
    // Create a hidden file input element
    // const fileInput = document.createElement("input");
    // fileInput.type = "file";
    // fileInput.setAttribute("directory", "");
    // fileInput.setAttribute("webkitdirectory", ""); // For Safari support
    // fileInput.setAttribute("mozdirectory", ""); // For Firefox support
    // fileInput.setAttribute("msdirectory", ""); // For Edge support
    // fileInput.setAttribute("odirectory", ""); // For Opera support
    // fileInput.setAttribute("multiple", ""); // Allow selection of multiple directories (optional)
    // fileInput.click();
  };

  const handleCloseDwgFolder = () => setDxfFolderShow(false);

  const handleFileSelect = async (filenm) => {
    setSelectedFile(filenm);

    await postRequest(endpoints.CheckDwgFileStatus, { docno: props.OrderData.Order_No, uploadfiles: filenm.name }, (res) => {
      console.log(res);
      if (res.status === "Locked") {
        toast.error("File is Locked by another User", { position: toast.POSITION.TOP_CENTER, autoClose: 2000 });
        return;
      }
    });

    let file = new Blob([filenm.fcontent], { type: "application/dxf" });

    // Create a link element
    const element = document.createElement("a");

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
    alert("Clicked on Order dxf download");
    if (selectedFile) {
      const link = document.createElement('a');
      link.href = selectedFile.url; // Assuming the file object has a 'url' field
      link.download = selectedFile.name; // Use the file name for download
      console.log(selectedFile.name);
      link.click();
      let flocked = true;
      let docno = props.OrderData.Order_No;

      await postRequest(endpoints.updateUploadFiles, { docno, uploadfiles: selectedFile.name, flocked }, (res) => {
        console.log(res);
        if (res.status === "Updated") {
          //toast.success("File Uploaded Successfully");
          setFUploadClose(true);
          sethandleUploadMdl(false);
        }
      });

      sethandleUploadMdl(false);
    }


  };

  const handleUpload = () => {
    alert("Clicked on Order dxf upload");
    let docno = props.OrderData.Order_No;
    if (docno == "") {
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
            // onClick={() => {
            //   if (!isButtonDisabled) {
            //     handleRegisterBtn();
            //   }
            // }}
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
    }
    else{
      updateOrdrData();
    }

            }}
          // onClick={props.openModal}
          >
            Save
          </button>
          {/* <button
            className="button-style"
            onClick={() => {
              saveJWMRChanges();
            }}
            // onClick={props.openModal}
          >
            Save1
          </button> */}
          <button className="button-style" onClick={handleClick}>
            Open folder
          </button>
          {/* <a
						href="file:///C:/Magod"
						target="_blank">
						Open Folder
					</a> */}
          {/* <button
						className="button-style"
						onClick={openFolder}>
						Open folder
					</button> */}

          {/* <Link to={"/Orders/FindOrder"}> */}
          {/* <Link> */}
          <button
            className="button-style "
            // onClick={() => navigate(-1)}
            onClick={() => navigate("/Orders")}
            style={{ float: "right" }}
          >
            Close
          </button>
          {/* </Link> */}
        </div>
        {/* Displaying Dxf Files from respective folder on Click of Order Dxf Button */}
        <div className="row">
          <Modal show={dxfFolderShow}>
            <Modal.Header className="justify-content-md-center" style={{ paddingTop: '10px', backgroundColor: '#283E81', color: '#ffffff' }}>
              <Modal.Title style={{ fontFamily: 'Roboto', fontSize: '18px' }}>Drawing Folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <div className='row'>
                <div className='col-md-12' style={{ padding: '0px 10px 0px 10px', fontFamily: 'Roboto', fontSize: '12px' }}>
                  <Table striped className="table-data border">
                    <thead className="tableHeaderBGColor">
                      <tr>
                        {/* <th style={{ whiteSpace: "nowrap" }}>Select</th> */}
                        <th style={{ whiteSpace: "nowrap" }}>File Name</th>
                        <th style={{ whiteSpace: "nowrap", textAlign: 'right' }}>File Size</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {/* {BS_dxfFilesList.map((file, index) => (
                        <tr key={index}
                          onClick={() => handleFileSelect(file)}
                          className={selectedFile === file ? '#b8d6f5' : ''} style={{ cursor: "pointer" }}>

                          <td style={{ Width: '250px' }}>{file.name}</td>
                          <td style={{ textAlign: 'right' }}>{file.size}</td>
                        </tr>
                      ))} */}


                      {(BS_dxfFilesList?.length > 0) ? BS_dxfFilesList.map((file, index) => (
                        <tr key={index} onClick={() => handleFileSelect(file)} style={{ cursor: "pointer" }} className={selectedFile === file ? '#b8d6f5' : ''}>
                          <td style={{ Width: '250px' }}>{file.name}</td>
                          <td style={{ textAlign: 'right' }}>{file.size}</td>
                        </tr>
                      )) : <tr><td>No files found</td></tr>}

                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <button onClick={handleDownload} className="button-style " style={{ width: "100px" }} disabled={!selectedFile}>Download</button>
                </div>
                <div className="col-md-3">
                  {" "}
                  <button onClick={handleUpload} className="button-style " style={{ width: "100px" }}>Upload</button>
                </div>
                <div className="col-md-3">
                  {""}
                  <button onClick={handleCloseDwgFolder} className="button-style " style={{ width: "100px" }}>Close</button>
                </div>
              </div>
            </Modal.Body>
          </Modal >

        </div>
      </div>

      {/* <div className="row">
        <div className="col-md-6 "></div>
        <div className="col-md-6">
          <button
            className="button-style"
            // onClick={() => {
            //   openRegisterOrder();
            // }}
          >
            Register Order
          </button>
          <button
            className="button-style"
            // onClick={openModal}
          >
            Save
          </button>
          <Link to={"/Orders/FindOrder"}>
            <button
              className="button-style "
              // onClick={() => navigate(-1)}
            >
              Close
            </button>
          </Link>
        </div>
      </div> */}
    </>
  );
}
