/** @format */

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import ConfirmationModal from "../../../../../../../Modal/ConfirmationModal";

import { toast } from "react-toastify";
import {
  getRequest,
  postRequest,
} from "../../../../../../../../../../../src/pages/api/apiinstance";
import { endpoints } from "../../../../../../../../../../../src/pages/api/constants";
export default function IEFormHeader(props) {
  // const [importedExcelData, setImportedExcelData] = useState([]);

  const [buttonClickedFor, setButtonClickedFor] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const noFileFoundFun = (e) => {
    // console.log("download the file.......");
    setButtonClickedFor("");
    setConfirmModalOpen(false);
    props.setImportedExcelData([]);
    props.exportExcelTemplate();
  };

  // console.log("mtrldata", props.mtrldata);

  // console.log("props in excel", props.procdata);
  // console.log("procdata", props.procdata);
  const handleChange = (e) => {
    const reader = new FileReader();

    if (e.target.files.length > 0) {
      reader.readAsBinaryString(e.target.files[0]);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        if (
          parsedData.length > 0 &&
          !(
            parsedData[0].Dwg_Name === "" &&
            parsedData[0].Mtrl_Code === "" &&
            parsedData[0].Source === "" &&
            parsedData[0].Operation === "" &&
            parsedData[0].Order_Qty === "" &&
            parsedData[0].JW_Cost === "" &&
            parsedData[0].Mtrl_Cost === ""
          )
        ) {
          if (
            parsedData[0].Dwg_Name &&
            parsedData[0].Mtrl_Code &&
            parsedData[0].Source &&
            parsedData[0].Operation &&
            parsedData[0].Order_Qty &&
            parsedData[0].JW_Cost &&
            parsedData[0].Mtrl_Cost
          ) {
            let procData = props.procdata?.filter((obj) =>
              props.OrderData.Type === "Service"
                ? obj.Service !== 0
                : props.OrderData.Type === "Fabrication"
                ? obj.MultiOperation !== 0
                : obj.Profile !== 0
            );

            // console.log("procData", procData);

            let matArray = [];
            let processArray = [];
            let finalArray = [];

            // making array for material
            for (let i = 0; i < props.mtrldata.length; i++) {
              const element = props.mtrldata[i];
              matArray.push(element.Mtrl_Code);
            }

            // making array for process data
            for (let i = 0; i < procData.length; i++) {
              const element = procData[i];
              processArray.push(element.ProcessDescription);
            }

            for (let i = 0; i < parsedData.length; i++) {
              let element = parsedData[i];

              // check for material
              if (matArray.includes(element.Mtrl_Code)) {
                element.materialError = false;
              } else {
                element.materialError = true;
              }

              // check for source
              if (
                element.Source === "Magod" ||
                element.Source === "magod" ||
                element.Source === "Customer" ||
                element.Source === "customer"
              ) {
                element.sourceError = false;
              } else {
                element.sourceError = true;
              }

              // check for operation
              if (processArray.includes(element.Operation)) {
                element.operationError = false;
              } else {
                element.operationError = true;
              }

              // console.log("processArray", processArray);
              // console.log("element.Operation", element.Operation);
              finalArray.push(element);
            }

            // console.log("finalArray", finalArray);

            // for (let i = 0; i < parsedData.length; i++) {
            //   const element0 = parsedData[i];
            //   for (let i = 0; i < props.mtrldata.length; i++) {
            //     const element1 = props.mtrldata[i];

            //     if (element0.Mtrl_Code === element1.Mtrl_Code) {
            //       newArray.push(element0);

            //       // console.log("element0.Mtrl_Code", element0.Mtrl_Code);
            //       // console.log("element1.Mtrl_Code", element1.Mtrl_Code);
            //     }
            //   }
            // }

            props.setImportedExcelData(parsedData);
            toast.success("All order details correctly loaded.");
          } else {
            toast.error(
              `Template error, Please click on "Download Excel Template"`
            );
            props.setImportedExcelData([]);
          }
        } else {
          toast.warning("Excel file has no data to import");
          props.setImportedExcelData([]);
        }

        // console.log("dataaaaaa", parsedData);
      };
    } else {
      props.setImportedExcelData([]);
      setButtonClickedFor("Import Excel");
      setConfirmModalOpen(true);
    }
  };
console.log("OrderData",props.OrderData.Order_No);


  const loadToOrderFunc = () => {
    if (props.importedExcelData.length > 0) {
      console.log("entring into Excel loadToOrderFunc");
      console.log("props.importedExcelData",props.importedExcelData);

    
      let arr = [];
  
      for (let i = 0; i < props.importedExcelData.length; i++) {
        const element = props.importedExcelData[i];
  
        let obj = {
          Order_No:props.OrderData. Order_No,
          Cust_Code: props.OrderData.Cust_Code,
          Order_Srl: i + 1,
          DwgName: element.Dwg_Name || "",
          Mtrl_Code: element.Mtrl_Code || "",
          MProcess: "Process 1",
          Operation: element.Operation || "",
          Mtrl_Source: element.Source || "",
          InspLevel: "Insp1",
          tolerance: "Standard(+/-0.1mm)- 100 Microns",
          PackingLevel: "Pkng1",
          JWCost: parseFloat(element.JW_Cost || 0).toFixed(2),
          MtrlCost: parseFloat(element.Mtrl_Cost || 0).toFixed(2),
          // OrderValue:props.orderTotal,
          UnitPrice: (
            parseFloat(element.Source === "Magod" ? element.Mtrl_Cost || 0 : 0) +
            parseFloat(element.JW_Cost || 0)
          ).toFixed(2),
          Qty_Ordered: element.Order_Qty || 0,
          Total: (
            parseFloat(element.Order_Qty || 0) *
            (parseFloat(element.Source === "Magod" ? element.Mtrl_Cost || 0 : 0) +
              parseFloat(element.JW_Cost || 0))
          ).toFixed(2),
        };
  
        arr.push(obj);
      }
  console.log("arr",arr);
  // API CALL TO INSERT
     postRequest(
          endpoints.postDetailsDataInImportExcel,
          {
            detailsData: arr,
          },
          (detailsDataInImportExcel) => {
            // console.log("detailsDataInImportAtn", detailsDataInImportAtn);
            if (detailsDataInImportExcel.result) {
              props.setOrdrDetailsData(arr);
              toast.success("Srls loaded to order successfull.");
              props.closeModal();
              props.fetchData();
            } else {
              toast.warning("uncaught backend error");
            }
          }
        );
  
      props.setOrdrDetailsData(arr);
  
      // toast.success("Srls loaded to order successfull.");
      // props.closeModal();
    }else{
 toast.warning("Please Load the data properly");
    }
  };

  // console.log("orderDEtailsData",OrdrDetailsData);
  
  // console.log(
  //   "dsdsdsdsd",
  //   props.importedExcelData.filter(
  //     (obj) => obj.materialError || obj.sourceError || obj.operationError
  //   )
  // );
  return (
    <>
      <div
        className="row d-flex justify-content-between"
        // style={{
        //   textAlign: "center",
        //   position: "sticky",
        //   top: "-1px",
        //   whiteSpace: "nowrap",
        // }}
      >
        <div
          className="col-md-3"
          style={{
            textAlign: "center",
            position: "sticky",
            top: "-1px",
            whiteSpace: "nowrap",
          }}
        >
          <label className="form-label label-space">Load Excel</label>

          {/* <b>Load Excel</b> */}
          <input
            type="file"
            name=""
            id=""
            accept=".xlsx, .xls"
            onChange={handleChange}
            className="in-field"

            // onFocus={handleOnFocus}
            // className="button-style m-1"
          />
        </div>
        <div className="col-md-3">
          {/* <b>Order Total</b> */}

          <label className="form-label label-space">Order Total</label>

          <input disabled value={props.orderTotal} className="in-field" />
        </div>
      </div>
      {/* <div className="row">
       
      </div> */}
      <div className="d-flex justify-content-center">
        {/* <button className="button-style m-1">Update Para</button> */}
        <button
          className="button-style m-1"
          style={{ width: "auto" }}
          onClick={(e) => {
            props.setSettingModal(true);
          }}
          disabled={props.selectedRows.length < 1}
        >
          Set Material and Operation
        </button>
        {/* <button className="button-style m-1">Set Operation</button> */}
        {/* <button className="button-style m-1">Load Excel</button> */}
        {/* <button className="button-style m-1">Compare</button> */}
        <button
          className="button-style m-1"
          disabled={
            props.importedExcelData.length === 0 ||
            props.importedExcelData.filter(
              (obj) =>
                obj.materialError || obj.sourceError || obj.operationError
            ).length > 0
          }
          onClick={(e) => {
            setButtonClickedFor("Load to Order");
            setConfirmModalOpen(true);
          }}
        >
          Load to Order
        </button>
      </div>

      <ConfirmationModal
        setConfirmModalOpen={setConfirmModalOpen}
        confirmModalOpen={confirmModalOpen}
        yesClickedFunc={
          buttonClickedFor === "Import Excel"
            ? noFileFoundFun
            : buttonClickedFor === "Load to Order"
            ? loadToOrderFunc
            : ""
        }
        message={
          buttonClickedFor === "Import Excel"
            ? "You need a excel template for importing. Do you wish to save the template?"
            : buttonClickedFor === "Load to Order"
            ? "Are you sure to add the srls to order?"
            : ""
        }
      />
    </>
  );
}
