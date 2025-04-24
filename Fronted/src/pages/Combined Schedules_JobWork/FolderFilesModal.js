import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useSchedule } from "../../context/CombScheduleContext";
import { Table } from 'react-bootstrap';
import { postRequest } from '../api/apiinstance';
import { endpoints } from '../api/constants';
import "@fortawesome/fontawesome-free/css/all.min.css";
export default function FolderFilesModal({ openfileModal, setOpenFileModal, files, selectedRow }) {

  const { rowselectleft, handleCheckboxChangeLeft } = useSchedule();

  const [selectedFileId, setSelectedFileId] = useState("");
  const [cmbfiles, setCmbFiles] = useState([]);

  console.log("context-rowselectleft-filemodal", rowselectleft);
  console.log("111-handleCheckboxChangeLeft", handleCheckboxChangeLeft);
  console.log("111-selectedRow", selectedRow?.OrdSchNo);

  useEffect(() => {
    // calling get dwgs api
    // bring the selected ScheduleId's to this modal
    let newdocNo = selectedRow?.OrdSchNo.substring(0, 6);
    let Doctype = "Order";
    if (rowselectleft.length > 0) {
      for (let i = 0; i < rowselectleft.length; i++) {
        let docNo = rowselectleft[i].Order_No;
        //  let srcPath = `\\Wo\\` + docNo + "\\DXF\\";
        // let desPath = '\\Wo\\' + newdocNo + '\\DXF\\';
        //   console.log(destPath);
        //let uname = username
        postRequest(endpoints.orddxffilesimporttocombsch, { Doctype, docNo, newdocNo }, (fileslist) => {
          // setBS_DxfFilesList(fileslist);
          console.log("fileslist---", fileslist);


        });
      }
    };

    let docno = selectedRow?.OrdSchNo.substring(0, 6);
    let desPath = `\\Wo\\` + docno + "\\DXF\\";
    console.log("file Details ");
    postRequest(endpoints.getDwgFiles, { desPath }, (FileDetails) => {
      console.log("file Details ", FileDetails);
      setCmbFiles(FileDetails);
    });

  }, [rowselectleft]);

   

 
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

  return (
    <div>
      <Modal show={openfileModal} onHide={() => setOpenFileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '14px' }}>Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* {files?.length === 0 ? (
      <p>No DWGs to show</p>
    ) : ( */}
            {/* // <ol>
      //   {files?.map((file, index) => (
      //     <li key={index}>
      //       <a href={file.url} target="_blank" rel="noopener noreferrer">
      //         {file.name}
      //       </a>
      //     </li>
      //   ))}
      // </ol> */}
            <Table>
              <thead className="tableHeaderBGColor">
                <tr style={{ backgroundColor: '#b0b3af', color: '#ffffff' }}>
                  <th style={{ whiteSpace: "nowrap" }}>File Name</th>
                  <th style={{ whiteSpace: "nowrap", textAlign: "right" }}>File Size</th>
                  <th colSpan={3} style={{ whiteSpace: "nowrap", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody className="tablebody">
                {cmbfiles.map((file) => (
                  <tr key={file.id} style={{
                    backgroundColor: selectedFileId === file.id ? "#98A8F8" : "",
                    cursor: "pointer"
                  }}
                    onClick={() => setSelectedFileId(file.id)}>
                    <td>{file.name}</td>
                    <td style={{ textAlign: 'right', marginRight: '10px' }}>{file.size}</td>
                    <td style={{ marginLeft: '30px', marginRight: '10px', textAlign: 'center' }}>
                      <i className='fa fa-download' style={{ cursor: "pointer", color: "#186603" }}
                        onClick={() => handleDownload(file)}></i>
                    </td>
                    {/* <td style={{ marginLeft: '30px', marginRight:'10px', textAlign:'center'}}>
              <i className='fa fa-upload' style={{ cursor: "pointer", color: "#007bff"}}
              onClick={() => handleUpload(file)}></i>
            </td> */}
                    <td style={{ marginLeft: '30px', marginRight: '10px', textAlign: 'center' }}>
                      <i className='fa fa-trash' style={{ cursor: "pointer", color: "#f20a15" }}
                      // onClick={() => handleDelete(file)}

                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* )} */}
          </div>
        </Modal.Body>

      </Modal>
    </div>
  );
}
