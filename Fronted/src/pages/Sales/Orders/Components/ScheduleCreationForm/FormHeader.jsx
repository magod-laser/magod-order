/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Table, Tabs, Form } from "react-bootstrap";
import axios from "axios";

export default function FormHeader(props) {
  let navigate = useNavigate();
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

  const handleClick = () => {
    // const url = `C:\Magod`;
    // window.open(url);
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.setAttribute("directory", "");
    fileInput.setAttribute("webkitdirectory", ""); // For Safari support
    fileInput.setAttribute("mozdirectory", ""); // For Firefox support
    fileInput.setAttribute("msdirectory", ""); // For Edge support
    fileInput.setAttribute("odirectory", ""); // For Opera support
    fileInput.setAttribute("multiple", ""); // Allow selection of multiple directories (optional)
    fileInput.click();
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
              updateOrdrData();
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
