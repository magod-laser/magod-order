import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useSchedule } from "../../context/CombScheduleContext";
import { Table } from "react-bootstrap";
import { postRequest, postRequestFormData } from "../api/apiinstance";
import { endpoints } from "../api/constants";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";

export default function FolderFilesModal({
  openfileModal,
  setOpenFileModal,
  files,
  selectedRow,
}) {
  const { rowselectleft, handleCheckboxChangeLeft } = useSchedule();

  const [selectedFileId, setSelectedFileId] = useState("");
  const [cmbfiles, setCmbFiles] = useState([]);
  const [cmbfolders, setCmbFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [handleUploadMdl, sethandleUploadMdl] = useState(false);
  const [fuploadClose, setFUploadClose] = useState(false);

  const [filterSearch, setFilterSearch] = useState("");
  const [txtsearch, setTxtSearch] = useState("");
  // console.log("context-rowselectleft-filemodal", rowselectleft);
  // console.log("111-handleCheckboxChangeLeft", handleCheckboxChangeLeft);
  console.log("111-selectedRow", selectedRow?.OrdSchNo);

  let ordschno = selectedRow?.Order_No;

     console.log("selectedFolder",selectedFolder);

  useEffect(() => {
    
    let docNo = ordschno;
    let despath = process.env.REACT_APP_SERVER_FILES + `\\` + docNo + "\\";
    postRequest(endpoints.getFolders, { docNo, despath }, (folderslist) => {
      console.log("folderslist : ", folderslist);
      setCmbFolders(folderslist);
    });

 
    
    // calling get dwgs api
    // bring the selected ScheduleId's to this modal
    // let newdocNo = selectedRow?.OrdSchNo.substring(0, 6);
    // let Doctype = "Order";
    // if (rowselectleft.length > 0) {
    //   for (let i = 0; i < rowselectleft.length; i++) {
    //     let docNo = rowselectleft[i].Order_No;
    //     //  let srcPath = `\\Wo\\` + docNo + "\\DXF\\";
    //     // let desPath = '\\Wo\\' + newdocNo + '\\DXF\\';
    //     //   console.log(destPath);
    //     //let uname = username
    //     postRequest(
    //       endpoints.orddxffilesimporttocombsch,
    //       { Doctype, docNo, newdocNo },
    //       (fileslist) => {
    //         // setBS_DxfFilesList(fileslist);
    //         console.log("fileslist---", fileslist);
    //       }
    //     );
    //   }
    // }

   

    // let docno = selectedRow?.OrdSchNo.substring(0, 6);
     let destPath = process.env.REACT_APP_SERVER_FILES+ `\\` + docNo + "\\" + selectedFolder + "\\";
     console.log("desPath - useEff",destPath);
     
    console.log("selectedFolder Details ", selectedFolder);
    postRequest(endpoints.getDwgFiles, { docNo, destPath }, (FileDetails) => {
      console.log("file Details ", FileDetails);
      setCmbFiles(FileDetails);
    });
  // }, [rowselectleft]);
  }, [selectedFolder]);
  // }, []);

  // selectedFolder

  const uploadedfile = async (e) => {
    e.preventDefault();

    const fileInput = e.target.elements.DwguploadFile;

    if (!fileInput) {
      toast.error("Please Select File to Upload", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      return;
    }
  
    if (fileInput.size > 10485760) {
      // 10 MB in bytes
      toast.error("File size exceeds 10 MB", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      return;
    }
    let selfolder = selectedFolder;

    let file = fileInput.files[0];

    let docno = selectedRow.Order_No; // ordschno.substring(0, 6);
   // let flocked = false;
    // let folderpath =
    //   process.env.REACT_APP_SERVER_FILES +
    //   ordschno.substring(0, 6) +
    //   "\\" +
    //   selfolder +
    //   "\\"; // + files;
    // const formData = new FormData();
    // formData.append("file", file);
    // // formData.append("filename", selectedFile.name);
    // formData.append("folderPath", folderpath); // Your target destination

    // await postRequest(endpoints.updateUploadFiles, { docno, dwgfiles, flocked }, (res) => {
    // file, filename : selectedFile.name, folderpath
    // await postRequestFormData(endpoints.allFileUploads, formData, (res) => {
    //   console.log("allfileuploads - Response : ", res);
    //   // if (res.status === "Updated") {
    //   if (res.status === 200) {
    //     toast.success("File uploaded successfully!", {
    //       position: toast.POSITION.TOP_CENTER,
    //       autoClose: 900,
    //     });
    //     setFUploadClose(true);
    //     sethandleUploadMdl(false);
    //     fetchUpdatedDataup(folderpath); // Refetch the updated file list after upload
    //   }
    // });
  };

  // Function to refetch the updated file list
  const fetchUpdatedData = async () => {
    let filespath = "\\Wo\\" + selectedRow.Order_No + "\\DXF\\";
    try {
      await postRequest(
        endpoints.getDwgFiles,
        { docNo: selectedRow.Order_No, destPath: filespath },
        (response) => {
          console.log("Delete response : ", response);
          setCmbFiles(response); //.data); // Update state with the latest files
        }
      ); // docno: ordschno.substring(0, 6) });
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };

  // const fetchUpdatedDataup = async (fdrpath) => {
  //   try {
  //     let filespath = fdrpath;
  //     await postRequest(
  //       endpoints.getDwgFiles,
  //       { destPath: filespath },
  //       (response) => {
  //         console.log("Delete response : ", response);
  //         setCmbFiles(response); //.data); // Update state with the latest files
  //       }
  //     ); // docno: ordschno.substring(0, 6 });
  //   } catch (error) {
  //     console.error("Error fetching updated data:", error);
  //   }
  // };

  const handleUploadMdlClose = () => {
    sethandleUploadMdl(false);
  };

  // dounload Function
  const handleDownload = (file) => {
    // Create a Blob for the file content
    const blob = new Blob([file.fcontent], { type: "application/dxf" });

    // Create a temporary anchor element to download the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Set the file name with proper extension
    const extension = file.name.endsWith(".dxf") ? "" : ".dxf";
    link.download = file.name + extension;

    // Trigger the download
    document.body.appendChild(link); // Append the link to the document temporarily
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleDelete = async (file) => {
    // Confirm deletion (optional)
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${file.name}?`
    );
    if (!confirmDelete) return;
    if (confirmDelete) {
      try {
        console.log(
          "File Path to delete : ",
          process.env.REACT_APP_SERVER_FILES +"\\"+ selectedRow.Order_No +
            "\\DXF\\" +
            file.name
        );
        let desPath = `\\Wo\\` +selectedRow.Order_No + "\\DXF\\";
        const destpath =
          process.env.REACT_APP_SERVER_FILES + "\\" +
          selectedRow.Order_No +
          "\\DXF\\" +
          file.name;
          console.log("destpath - handleDelete",destpath);
          
        //  postRequest(endpoints.deleteDwgFile, { docno: ordschno.substring(0, 6), uploadfiles: file.name, filepath: destpath, fonlyPath:destPath }, (res) => {
        postRequest(
          endpoints.deleteDwgFile,
          {
            docno: selectedRow.Order_No,
            uploadfiles: file.name,
            filepath: destpath,
            desPath,
          },
          (res) => {
            console.log(res);
            // if (res.status === "Deleted") {
            if (res.length > 0) {
              alert("File Deleted Successfully");
              fetchUpdatedData();
              //  setBS_DxfFilesList((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
              setFUploadClose(true);
              sethandleUploadMdl(false);
            }
          }
        );
      } catch (error) {
        console.error("Error during file deletion:", error);
        alert("An error occurred while deleting the file.");
      }
    }
  };

  // Delete function
  // const handleDelete = async (file) => {
  //   // Confirm deletion (optional)
  //   const confirmDelete = window.confirm(`Are you sure you want to delete ${file.name}?`);
  //   if (!confirmDelete) return;

  //   try {
  //       let destPath = `\\Wo\\` + ordschno.substring(0, 6) + "\\DXF\\";
  //       const destpath = process.env.REACT_APP_SERVER_FILES + ordschno.substring(0, 6) + "\\DXF\\" + file.name;
  //       //  postRequest(endpoints.deleteDwgFile, { docno: ordschno.substring(0, 6), uploadfiles: file.name, filepath: destpath, fonlyPath:destPath }, (res) => {
  //       postRequest(endpoints.deleteDwgFile, { docno: ordschno.substring(0, 6), uploadfiles: file.name, filepath: destpath }, (res) => {
  //           console.log(res);
  //           if (res.status === "Deleted") {
  //               alert("File Deleted Successfully");
  //               // setBS_DxfFilesList((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
  //               setFUploadClose(true);
  //               sethandleUploadMdl(false);
  //           }
  //       });

  //   } catch (error) {
  //       console.error("Error during file deletion:", error);
  //       alert("An error occurred while deleting the file.");
  //   }
  // };

  const handleUpload = () => {
    //  alert("Clicked on Order dxf upload");
    let docno = ordschno.substring(0, 6);
    if (docno == "") {
      toast.info("Select Schedule to Upload Files", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      return;
    }
    //    alert("Upload Files");
    sethandleUploadMdl(true);
  };

  const handleFolderChange = (event) => {
    const folderName = event.target.value;
    console.log("Selected folder:", folderName);
    console.log("selectedRow.Order_No:", selectedRow.Order_No);
    setSelectedFolder(folderName);
    let docNo = selectedRow.Order_No;
    let destPath =
      process.env.REACT_APP_SERVER_FILES + "\\" +
      docNo +
      "\\" +
      folderName +
      "\\";

      console.log("destPath - handleChngefldr",destPath);
      
    postRequest(
      endpoints.getDwgFiles,
      { docNo, destPath },
      (fileslist) => {
        console.log("Files List : ", fileslist);
        setCmbFiles(fileslist);
        setFilterSearch(fileslist); // Initialize filterSearch with the fetched files
      }
    );
  };

  const filesearch = (e) => {
    //  setFilterSearch(BS_dxfFilesList);
    console.log("filesearch : ", e.target.value);
    console.log("BS_dxfFilesList : ", cmbfiles);
    const searchTerm = e.target.value.toLowerCase();
    const filteredArray = cmbfiles.filter((file) =>
      file.name.toLowerCase().includes(searchTerm)
    );
console.log("filteredArray",filteredArray);

    setFilterSearch(searchTerm ? filteredArray : cmbfiles);
    setTxtSearch(e.target.value);
  };

  const handleKeyDn = (event) => {
    if (event.key === " " && event.target.selectionStart === 0) {
      event.preventDefault(); // Prevent adding space at the beginning
    }
  };
  const handleCloseDwgFolder = () => setOpenFileModal(false);

  console.log("Comb_Order_No", selectedRow?.Order_No);

  return (
    <div>
      <Modal show={openfileModal} onHide={() => setOpenFileModal(false)}>
        <Modal.Header
            className="justify-content-md-center"
            style={{
              paddingTop: "10px",
              backgroundColor: "#283E81",
              color: "#ffffff",
            }}
          >
          <Modal.Title style={{ fontSize: "14px", }}>Open Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div
              className="col-md-1"
              style={{
                padding: "0px 0px 0px 0px",
                //   fontFamily: "Roboto",
                fontSize: "9px",
              }}
            >
              <label className="fa fa-folder" style={{ color: "#007bff" }} />
              {/* <label className="form-label">Select Folder</label> */}
            </div>
            <div
              className="col-md-4"
              style={{
                padding: "0px 0px 0px 0px",
                fontFamily: "Roboto",
                fontSize: "8px",
                height: "30px",
              }}
            >
              <select
                className="form-select"
                id="dxfFileSelect"
                value={selectedFolder}
                onChange={handleFolderChange}
                style={{ height: "29px", fontSize: "12px" }}
              >
                {/* (e) => setSelectedFolderId(e.target.value)}> */}
                <option value="">Select folder</option>
                {cmbfolders.map((fldr) => (
                  <option key={fldr.id} value={fldr.id}>
                    {fldr}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-1">
              <label className="fa fa-search" style={{ fontSize: "12px" }} />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                autoComplete="off"
                id="txtsearch"
                onKeyDown={handleKeyDn}
                onChange={(e) => filesearch(e)}
                value={txtsearch}
              />
            </div>
          </div>

          <div>
            <Table>
              <thead className="tableHeaderBGColor">
                <tr style={{ backgroundColor: "#b0b3af", color: "#ffffff" }}>
                  <th style={{ whiteSpace: "nowrap" }}>File Name</th>
                  <th style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                    File Size
                  </th>
                  <th
                    colSpan={3}
                    style={{ whiteSpace: "nowrap", textAlign: "center" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="tablebody">
                {filterSearch && filterSearch.length > 0 ? (
                  filterSearch.map((file) => (
                    <tr
                      key={file.id}
                      style={{
                        backgroundColor:
                          selectedFileId === file.id ? "#98A8F8" : "",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedFileId(file.id)}
                    >
                      <td>{file.name}</td>
                      <td style={{ textAlign: "right", marginRight: "10px" }}>
                        {file.size}
                      </td>
                      <td
                        style={{
                          marginLeft: "30px",
                          marginRight: "10px",
                          textAlign: "center",
                        }}
                      >
                        <i
                          className="fa fa-download"
                          style={{ cursor: "pointer", color: "#186603" }}
                          onClick={() => handleDownload(file)}
                        ></i>
                      </td>
                      <td
                        style={{
                          marginLeft: "30px",
                          marginRight: "10px",
                          textAlign: "center",
                        }}
                      >
                        <i
                          className="fa fa-upload"
                          style={{ cursor: "pointer", color: "#007bff" }}
                          onClick={() => handleUpload(file)}
                        ></i>
                      </td>
                      <td
                        style={{
                          marginLeft: "30px",
                          marginRight: "10px",
                          textAlign: "center",
                        }}
                      >
                        <i
                          className="fa fa-trash" // FontAwesome example
                          style={{ cursor: "pointer", color: "#f20a15" }}
                          onClick={() => handleDelete(file)} // Replace with your logic
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No files found</td>
                  </tr>
                )}
              </tbody>
            </Table>
            {/* )} */}
          </div>
          <div className="row">
  <div className="col-12">
    <div className="d-flex justify-content-end">
      <button
        onClick={handleCloseDwgFolder}
        className="button-style"
        style={{ width: "100px" }}
      >
        Close
      </button>
    </div>
  </div>
</div>

        </Modal.Body>
      </Modal>
    </div>
  );
}
