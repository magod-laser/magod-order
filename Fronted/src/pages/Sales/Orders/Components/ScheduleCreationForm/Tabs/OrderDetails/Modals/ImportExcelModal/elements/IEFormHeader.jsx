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
const {dwgData, setDwgData, compareData, updatePara,MtrlFlg, setMtrlFlg}=props
const [buttonClickedFor, setButtonClickedFor] = useState("");
const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const noFileFoundFun = (e) => {
    setButtonClickedFor("");
    setConfirmModalOpen(false);
    props.setImportedExcelData([]);
    props.exportExcelTemplate();
  };

  // const handleChange = (e) => {
  //   const reader = new FileReader();
  //   if (e.target.files.length > 0) {
  //     reader.readAsBinaryString(e.target.files[0]);
  //     reader.onload = (e) => {
  //       const data = e.target.result;
  //       const workbook = XLSX.read(data, { type: "binary" });
  //       const sheetName = workbook.SheetNames[0];
  //       const sheet = workbook.Sheets[sheetName];
  //       const parsedData = XLSX.utils.sheet_to_json(sheet);
        
  //       if (
  //         parsedData.length > 0 &&
  //         !(
  //           parsedData[0].Dwg_Name === "" &&
  //           parsedData[0].Mtrl_Code === "" &&
  //           parsedData[0].Source === "" &&
  //           parsedData[0].Operation === "" &&
  //           parsedData[0].Order_Qty === "" &&
  //           parsedData[0].JW_Cost === "" &&
  //           parsedData[0].Mtrl_Cost === ""
  //         )
  //       ) {
  //           // 27-03-2025      
  //         if (
  //           parsedData?.[0]?.Dwg_Name &&
  //           parsedData?.[0]?.Mtrl_Code &&
  //           parsedData?.[0]?.Source &&
  //           parsedData?.[0]?.Operation &&
  //           "Order_Qty" in parsedData[0] &&
  //           parsedData[0].Order_Qty !== undefined &&
  //           "JW_Cost" in parsedData[0] &&
  //           parsedData[0].JW_Cost !== undefined &&
  //           "Mtrl_Cost" in parsedData[0] &&
  //           parsedData[0].Mtrl_Cost !== undefined
  //         ) {
  //           let isValid = true;
  //           let errors = [];

  //           // Validate based on Source type
  //           if (parsedData[0].Source === "Customer") {
  //             if (
  //               parsedData[0].JW_Cost === 0 ||
  //               parsedData[0].JW_Cost === 0.0 ||
  //               parsedData[0].JW_Cost === "0.00"
  //             ) {
  //               isValid = false;
  //               errors.push("JW_Cost should not be 0 for Customer");
  //             }
  //             // else if (parsedData[0].Mtrl_Cost !== 0) {
  //             //   isValid = false;
  //             //   errors.push("Mtrl_Cost should be 0 for Customer");
  //             // }
  //           } else if (parsedData[0].Source === "Magod") {
  //             if (
  //               parsedData[0].JW_Cost === 0 ||
  //               parsedData[0].JW_Cost === 0.0 ||
  //               parsedData[0].JW_Cost === "0.00"
  //             ) {
  //               isValid = false;
  //               errors.push("JW_Cost should not be 0 for Magod");
  //             }
  //             if (
  //               parsedData[0].Mtrl_Cost === 0 ||
  //               parsedData[0].Mtrl_Cost === "0" ||
  //               parsedData[0].Mtrl_Cost === 0.00 ||
  //               parsedData[0].Mtrl_Cost === "0.00"
  //             ) {
  //               isValid = false;
  //               errors.push("Mtrl_Cost should not be 0 for Magod");
  //             }
  //           } else {
  //             isValid = false;
  //             errors.push("Invalid Source (should be 'Customer' or 'Magod')");
  //           }

  //           if (!isValid) {
  //             toast.error(`Please Check: ${errors.join(", ")}`);
  //             props.setImportedExcelData([]);
  //             return;
  //           }

  //           let procData = props.procdata?.filter((obj) =>
  //             props.OrderData.Type === "Service"
  //               ? obj.Service !== 0
  //               : props.OrderData.Type === "Fabrication"
  //               ? obj.MultiOperation !== 0
  //               : obj.Profile !== 0
  //           );

  //           let matArray = props.mtrldata.map((element) => element.Mtrl_Code);
  //           let processArray = procData.map((element) => element.Operation);
  //           let finalArray = [];

  //           for (let i = 0; i < parsedData.length; i++) {
  //             let element = parsedData[i];

  //             // Check for material
  //             element.materialError = !matArray.includes(element.Mtrl_Code);

  //             // Check for source
  //             element.sourceError = ![
  //               "Magod",
  //               "magod",
  //               "Customer",
  //               "customer",
  //             ].includes(element.Source);

  //             // Check for operation
  //             element.operationError = !processArray.includes(
  //               element.Operation
  //             );

  //             finalArray.push(element);
  //           }

  //           props.setImportedExcelData(parsedData);
  //           toast.success("All order details correctly loaded.");
  //         } else {
  //           let missingFields = [];

  //           if (!("Dwg_Name" in parsedData[0])) missingFields.push("Dwg_Name");
  //           if (!("Mtrl_Code" in parsedData[0]))
  //             missingFields.push("Mtrl_Code");
  //           if (!("Source" in parsedData[0])) missingFields.push("Source");
  //           if (!("Operation" in parsedData[0]))
  //             missingFields.push("Operation");
  //           if (!("Order_Qty" in parsedData[0]))
  //             missingFields.push("Order_Qty");
  //           if (!("JW_Cost" in parsedData[0])) missingFields.push("JW_Cost");
  //           if (!("Mtrl_Cost" in parsedData[0]))
  //             missingFields.push("Mtrl_Cost");

  //           toast.error(
  //             `Template error: Missing fields - ${missingFields.join(", ")}`
  //           );
  //           console.log("Missing Fields:", missingFields);

  //           props.setImportedExcelData([]);
  //         }
  //       } else {
  //         toast.warning("Excel file has no data to import");
  //         props.setImportedExcelData([]);
  //       }

  //       // console.log("dataaaaaa", parsedData);
  //     };
  //   } else {
  //     props.setImportedExcelData([]);
  //     setButtonClickedFor("Import Excel");
  //     setConfirmModalOpen(true);
  //   }
  // };

// 07052025 ----------------

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
      console.log("parsedData", parsedData);

      if (parsedData.length === 0) {
        toast.warning("Excel file has no data to import");
        props.setImportedExcelData([]);
        return;
      }

      const requiredFields = [
        "Dwg_Name",
        "Mtrl_Code",
        "Source",
        "Operation",
        "Order_Qty",
        "JW_Cost",
        "Mtrl_Cost",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in parsedData[0])
      );

      if (missingFields.length > 0) {
        toast.error(`Template error: Missing fields - ${missingFields.join(", ")}`);
        console.log("Missing Fields:", missingFields);
        props.setImportedExcelData([]);
        return;
      }

      const matArray = props.mtrldata.map((el) => el.Mtrl_Code);
      const procData = props.procdata?.filter((obj) =>
        props.OrderData.Type === "Service"
          ? obj.Service !== 0
          : props.OrderData.Type === "Fabrication"
          ? obj.MultiOperation !== 0
          : obj.Profile !== 0
      );
      const processArray = procData.map((el) => el.Operation);

      const finalArray = parsedData.map((row, idx) => {
        const source = row.Source?.toLowerCase();
        console.log("source",source);
        
        const errors = [];

        row.jwCostError = false;
        row.mtrlCostError = false;
        row.sourceError = false;
        row.materialError = false;
        row.operationError = false;

        // Source-specific cost validation
        // if (source === "customer") {
        //   row.jwCostError = Number(row.JW_Cost) === 0;
        //   if (row.jwCostError) errors.push("JW_Cost should not be 0 for Customer");
        // } else if (source === "magod") {
        //   row.jwCostError = Number(row.JW_Cost) === 0;
        //   row.mtrlCostError = Number(row.Mtrl_Cost) === 0 || Number(row.Mtrl_Cost) === 0.00 || Number(row.Mtrl_Cost) === "0" || Number(row.Mtrl_Cost) === "0.00" ;
        //   if (row.jwCostError) errors.push("JW_Cost should not be 0 for Magod");
        //   if (row.mtrlCostError) errors.push("Mtrl_Cost should not be 0 for Magod") };
        console.log("source",source);
        if (source === "customer" || source === "Customer") {
          row.jwCostError = parseInt(row.JW_Cost) === 0;

          console.log("row.jwCostError ",  row.jwCostError );
          
          if (row.jwCostError) {
            console.log(`Row ${idx + 2}: JW_Cost Error (Customer) = ${row.JW_Cost}`);
            errors.push("JW_Cost should not be 0 for Customer");
          }
        } 
        
        else if (source === "magod" || source === "Magod") {
          console.log("row.JW_Cost",row.JW_Cost);
          console.log("row.Mtrl_Cost",row.Mtrl_Cost);
          console.log("Number(row.JW_Cost)",Number(row.JW_Cost));

          row.jwCostError = parseInt(row.JW_Cost) === 0  ;
          row.mtrlCostError = parseInt(row.Mtrl_Cost) === 0;

          console.log("row.mtrlCostError",row.mtrlCostError);
          console.log("row.jwCostError",row.mtrlCostError);
          
          
          if (row.mtrlCostError) {
            console.log(`Row ${idx + 2}: Mtrl_Cost Error (Magod) = ${row.Mtrl_Cost}`);
            errors.push("Mtrl_Cost should not be 0 for Magod");
          }
          if (row.jwCostError) {
            
            console.log(`Row ${idx + 2}: JW_Cost Error (Magod) = ${row.JW_Cost}`);
            errors.push("JW_Cost should not be 0 for Magod");
          }
        }
        
        else {
          row.sourceError = true;
          errors.push("Invalid Source (must be 'Customer' or 'Magod')");
        }

        // Material code validation
        row.materialError = !matArray.includes(row.Mtrl_Code);
        if (row.materialError) errors.push("Invalid Mtrl_Code");

        // Operation validation
        row.operationError = !processArray.includes(row.Operation);
        if (row.operationError) errors.push("Invalid Operation");

        // Final message
        if (errors.length > 0) {
          row.rowErrorMessage = `Row ${idx + 2}: ${errors.join(", ")}`;
        }

        return row;
      });

      const rowsWithErrors = finalArray.filter((row) => row.rowErrorMessage);

      if (rowsWithErrors.length > 0) {
        // toast.warning("Some rows have issues. Please check the highlighted fields.");
      //  alert("Some rows have issues. Please check the highlighted fields.");
        console.warn("Validation Errors:", rowsWithErrors.map((r) => r.rowErrorMessage));
      } else {
        toast.success("All order details correctly loaded.");
      }

      props.setImportedExcelData(finalArray);
    };
  } else {
    props.setImportedExcelData([]);
    setButtonClickedFor("Import Excel");
    setConfirmModalOpen(true);
  }
};

  console.log("OrderData", props.OrderData.Order_No);

  const loadToOrderFunc = () => {
    if (props.importedExcelData.length > 0) {
      console.log("entring into Excel loadToOrderFunc");
      console.log("props.importedExcelData", props.importedExcelData);

      let arr = [];

      for (let i = 0; i < props.importedExcelData.length; i++) {
        const element = props.importedExcelData[i];

        let obj = {
          Order_No: props.OrderData.Order_No,
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
            parseFloat(
              element.Source === "Magod" ? element.Mtrl_Cost || 0 : 0
            ) + parseFloat(element.JW_Cost || 0)
          ).toFixed(2),
          Qty_Ordered: element.Order_Qty || 0,
          Total: (
            parseFloat(element.Order_Qty || 0) *
            (parseFloat(
              element.Source === "Magod" ? element.Mtrl_Cost || 0 : 0
            ) +
              parseFloat(element.JW_Cost || 0))
          ).toFixed(2),
        };

        arr.push(obj);
      }
      console.log("arr", arr);
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
    } else {
      toast.warning("Please Load the data properly");
    }
  };

  const [orderTotal, setOrderTotal] = useState(0.0);
  const CompareAndUpdatePara = (e) => {
    setOrderTotal(props.orderTotal);
  };
 
   const [excelData, setExcelData] = useState();

  const checkMatching = () => {
    const updatedData = excelData.map((row) => {
      const isMatching =
        row.JWCost_Old === row.JWCost &&
        row.Mtrl_Code_Old &&
        row.Mtrl_Code === row.Mtrl_Code_Old &&
        row.Operation_Old &&
        row.Operation === row.Operation_Old;

      return { ...row, Matching: isMatching };
    });

    setExcelData(updatedData);
  };

  const handleUpdatePara = () => {
    if (
      window.confirm(
        "Do you wish to update Material, Operation, and Rates from Stored Data?"
      )
    ) {
      const updatedData = excelData.map((row) => {
        if (!row.Matching) {
          return {
            ...row,
            JWCost: row.JWCost_Old,
            Operation: row.Operation_Old,
            Mtrl_Code: row.Mtrl_Code_Old,
            MtrlCost: row.MtrlCost_Old,
            Matching: true, // reset after updating
          };
        }
        return row;
      });

      setExcelData(updatedData);
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
          {/* <input disabled value={orderTotal} className="in-field" /> */}
        </div>
      </div>
      {/* <div className="row">
       
      </div> */}
      <div className="d-flex justify-content-center">
        <button
          className="button-style m-1"
          // onClick={handleUpdatePara}
          // onClick={CompareAndUpdatePara}
          onClick={updatePara}
        >
          Update Para
        </button>
        <button
          className="button-style m-1"
          style={{ width: "auto" }}
          onClick={(e) => {
            setMtrlFlg(true)
            props.setSettingModal(true);
          }}
          // disabled={props.selectedRows.length < 1}
        >
          Set Material and Operation
        </button>
        {/* <button className="button-style m-1">Set Operation</button> */}
        {/* <button className="button-style m-1">Load Excel</button> */}
        <button
          className="button-style m-1"
          // onClick={checkMatching}
          // onClick={CompareAndUpdatePara}
          onClick={compareData}
        >
          Compare
        </button>
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
            // Check for JWCost === 0

            console.log("Check for JWCost === 0", props.importedExcelData);

            const jwCostZero = props.importedExcelData.some(
              (item) => item.JW_Cost === "0" || item.JW_Cost === 0
            );
            console.log("jwCostZero", jwCostZero);

            if (jwCostZero) {
              alert("JW Cost cannot be 0. Please correct the data.");
              return;
            }

            // ------
         console.log("importedExcelData",props.importedExcelData);
         
            const invalidItems = props.importedExcelData.filter(
              (item) =>
                (item.Mtrl_Cost === "0" || item.Mtrl_Cost === 0 || item.Mtrl_Cost === 0.0 || item.Mtrl_Cost === "0.00") &&
                item.Source === "Magod"
            );
            
            if (invalidItems.length > 0) {
              const drawingNames = invalidItems.map((item) => item.Dwg_Name || "Unknown Drawing").join(", ");
              alert(`Mtrl_Cost cannot be 0 for the following drawing(s): ${drawingNames}. Please correct the data.`);
              return;
            }
          
            // const MtrlCostZero = props.importedExcelData.some(
            //   (item) => (item.Mtrl_Cost === "0" || item.Mtrl_Cost === 0 || item.Mtrl_Cost === 0.00 || item.Mtrl_Cost === "0.00" )&& item.Source === "Magod"

            // );
            // console.log("MtrlCostZero", MtrlCostZero);

            // if (MtrlCostZero) {
            //   alert("Mtrl_Cost cannot be 0. Please correct the data.");
            //   return;
            // }
          
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
