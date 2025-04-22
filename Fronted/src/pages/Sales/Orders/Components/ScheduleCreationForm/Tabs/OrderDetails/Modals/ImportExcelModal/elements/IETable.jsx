// import React from "react";
// import { Tab, Table, Tabs, Form } from "react-bootstrap";
// import { Typeahead } from "react-bootstrap-typeahead";

// export default function IETable(props) {
//   // console.log("propssss", props);

//   const handleChange = (
//     key,
//     name,
//     val,
//     materialError,
//     sourceError,
//     operationError
//   ) => {
//     // console.log("key", key);
//     // console.log("name", name);
//     // console.log("val", val);
//     // console.log("materialError", materialError);
//     // console.log("sourceError", sourceError);
//     // console.log("operationError", operationError);

//     let arr = [];
//     for (let i = 0; i < props.importedExcelData.length; i++) {
//       let element = props.importedExcelData[i];
//       if (i === key) {
//         element[name] = val;
//         element.materialError = materialError;
//         element.sourceError = sourceError;
//         element.operationError = operationError;
//       }
//       arr.push(element);
//     }

//     // console.log("arr", arr);
//     props.setImportedExcelData(arr);
//     // console.log("importedExcelData", importedExcelData);
//   };

//   // console.log("props.selectedRows", props.selectedRows);
//   console.log("props.procdata...123", props.procdata);
//   return (
//     <>
//       <div style={{ overflow: "auto" }}>
//         <Table striped className="table-data border" style={{ border: "1px" }}>
//           <thead
//             className="tableHeaderBGColor"
//             // style={{
//             //   textAlign: "center",
//             //   position: "sticky",
//             //   top: "-1px",
//             //   whiteSpace: "nowrap",
//             // }}
//           >
//             <tr>
//               <th>SL No</th>
//               <th>Drawing Name</th>
//               <th>Material Code</th>
//               <th>Source</th>
//               <th>Operation</th>
//               <th>Order Qty</th>
//               <th>JW Cost</th>
//               <th>Material Cost</th>
//               <th>Unit Price</th>
//             </tr>
//           </thead>
//           <tbody className="tablebody">
//             {props?.importedExcelData?.map((val, key) => (
//               <>
//                 <tr
//                   className={
//                     props.selectedRows.includes(key) ? "selected-row" : ""
//                   }
//                   onClick={(e) => {
//                     if (props.selectedRows.includes(key)) {
//                       props.setSelectedRows(
//                         props.selectedRows.filter((obj) => obj != key)
//                       );
//                     } else {
//                       props.setSelectedRows([...props.selectedRows, key]);
//                     }
//                   }}
//                 >
//                   <td>{key + 1}</td>
//                   <td>
//                     <input
//                       value={val.Dwg_Name}
//                       name="Dwg_Name"
//                       style={{ background: "transparent", border: "none" }}
//                       onChange={(e) => {
//                         handleChange(
//                           key,
//                           e.target.name,
//                           e.target.value || "",
//                           val.materialError,
//                           val.sourceError,
//                           val.operationError
//                         );
//                       }}
//                     />
//                   </td>
//                   <Typeahead
//   className={
//     val.materialError
//       ? "border rounded border-1 border-danger typeaheadClass"
//       : "typeaheadClass"
//   }
//   id="Mtrl_Code"
//   name="Mtrl_Code"
//   onChange={(e) => {
//     console.log("Selected:", e);
//     handleChange(
//       key,
//       "Mtrl_Code",
//       e.length > 0 ? e[0].label : "",
//       e.length > 0 ? false : true,
//       val.sourceError,
//       val.operationError
//     );
//   }}
//   onInputChange={(text) => {
//     console.log("Typed:", text);
//     handleChange(
//       key,
//       "Mtrl_Code",
//       text,
//       text.length > 0 ? false : true,
//       val.sourceError,
//       val.operationError
//     );
//   }}
//   options={props.mtrldata}
//   selected={val.Mtrl_Code ? [{ label: val.Mtrl_Code }] : []} // Ensuring selected value doesn't block typing
//   allowNew // Allows new user input
//   placeholder="Choose a Material..."
// />

//                   <td>
//                     {/* {val.Source} */}

//                     <Typeahead
//                       className={
//                         val.sourceError
//                           ? "border rounded border-1 border-danger typeaheadClass"
//                           : "typeaheadClass"
//                       }
//                       // className="ip-select"
//                       id="Source"
//                       name="Source"
//                       // labelKey="Operation"
//                       onChange={(e) => {
//                         handleChange(
//                           // key, "Source", e[0]
//                           key,
//                           "Source",
//                           e.length > 0 ? e[0].label : "",
//                           val.materialError,
//                           e.length > 0 ? false : true,
//                           val.operationError
//                         );
//                       }}
//                       options={props.materialSource}
//                       selected={[{ label: val.Source }]}
//                       placeholder="Choose a Source..."
//                     />
//                   </td>
//                  {/* OPeration typeahed */}
//                  <Typeahead
//   className={
//     val.operationError
//       ? "border rounded border-1 border-danger typeaheadClass"
//       : "typeaheadClass"
//   }
//   id="Operation"
//   name="Operation"
//   onChange={(e) => {
//     console.log("Selected:", e);
//     handleChange(
//       key,
//       "Operation",
//       e.length > 0 ? e[0].label : "",
//       val.materialError,
//       val.sourceError,
//       e.length > 0 ? false : true
//     );
//   }}
//   onInputChange={(text) => {
//     console.log("Typed:", text);
//     handleChange(
//       key,
//       "Operation",
//       text,
//       val.materialError,
//       val.sourceError,
//       text.length > 0 ? false : true
//     );
//   }}
//   options={props.procdata}
//   selected={val.Operation ? [{ label: val.Operation }] : []} // Prevent blocking input
//   allowNew // Enables free text input
//   placeholder="Choose an Operation..."
// />

//                   <td>
//                     <input
//                       type="number"
//                       min="0"
//                       value={val.Order_Qty}
//                       name="Order_Qty"
//                       style={{ background: "transparent", border: "none" }}
//                       onChange={(e) => {
//                         handleChange(
//                           key,
//                           e.target.name,
//                           e.target.value,
//                           val.materialError,
//                           val.sourceError,
//                           val.operationError
//                         );
//                       }}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       min="0"
//                       // value={val.JW_Cost}
//                       value={val.JW_Cost}
//                       name="JW_Cost"
//                       style={{ background: "transparent", border: "none" }}
//                       onChange={(e) => {
//                         handleChange(
//                           key,
//                           e.target.name,
//                           e.target.value,
//                           val.materialError,
//                           val.sourceError,
//                           val.operationError
//                         );
//                       }}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       min="0"
//                       // value={val.Mtrl_Cost}
//                       value={val.Mtrl_Cost}
//                       name="Mtrl_Cost"
//                       style={{ background: "transparent", border: "none" }}
//                       onChange={(e) => {
//                         handleChange(
//                           key,
//                           e.target.name,
//                           e.target.value,
//                           val.materialError,
//                           val.sourceError,
//                           val.operationError
//                         );
//                       }}
//                     />
//                   </td>
//                   <td>
//                     {(
//                       parseFloat(
//                         val.Source === "Magod" ? val.Mtrl_Cost || 0 : 0
//                       ) + parseFloat(val.JW_Cost || 0)
//                     ).toFixed(2)}

//                     {/* {(
//                     parseFloat(val.JW_Cost || 0) +
//                     parseFloat(val.Mtrl_Cost || 0)
//                   ).toFixed(2)} */}
//                   </td>
//                 </tr>
//               </>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     </>
//   );
// }

// 10022025 1343pm

import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { toast } from "react-toastify";

export default function IETable(props) {
  // Ensure Order_Srl is mapped
  const { dwgData, setDwgData, compareData, updatePara,MatchingFlag, setMatchingFlag,MtrlFlg, setMtrlFlg,newMtrlCodeUpdate,matchingRows } = props;

  // console.log("data-MatchingFlag",MatchingFlag);
  // console.log("data-MtrlFlg",MtrlFlg);
  console.log("data-matchingRows",matchingRows);
  // console.log("data-dwgData",dwgData);
  
  console.log("props.importedExcelData ==2", props.importedExcelData);
  
  useEffect(() => {
    const updatedData = props.importedExcelData.map((item, index) => ({
      ...item,
      Order_Srl: index + 1, // Assign SL No dynamically
    }));
    props.setImportedExcelData(updatedData);
  }, [props.importedExcelData.length]); // Run only when data length changes
  console.log("err-m", props.materialError);
  console.log("err-s", props.sourceError);
  console.log("err-o", props.operationError);
  const handleChange = (
    key,
    name,
    val,
    materialError,
    sourceError,
    operationError
  ) => {
    //  if (val.JW_Cost < 1) {
    //    toast.warning("Value should be greater than 0");
    //  }
    let updatedData = props.importedExcelData.map((item, index) =>
      index === key
        ? {
            ...item,
            [name]: val,
            materialError,
            sourceError,
            operationError,
            Order_Srl: key + 1, // Ensure Order_Srl is always correct
          }
        : item
    );

    props.setImportedExcelData(updatedData);
  };

  console.log("err-0", props?.importedExcelData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSort = (key) => {
    console.log("entering into the request sort");
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...props?.importedExcelData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];


;
        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Order_Qty" ||
          sortConfig.key === "JW_Cost" ||
          sortConfig.key === "Mtrl_Cost"
          
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopy;
  };


  const handleOldValChange = (key, field, value) => {
    const updatedOld = [...props.dwgData]; // assuming `oldData` is passed as props
    updatedOld[key][field] = value;
    setDwgData(updatedOld);
  };

console.log("data-selectedrow",props.selectedRows);

  return (
    <div style={{ overflow: "auto", height: " 500px" }}>
      {/* <Table striped className="table-data border"> */}
       <Table bordered hover className="table-data border">
        {/* <thead className="tableHeaderBGColor"> */}
        <thead  className="tableHeaderBGColor"
            style={{
              textAlign: "center",
              position: "sticky",
              top: "-1px",
              whiteSpace: "nowrap",
            }}>
          <tr>
            <th>SL No</th>
            <th>Drawing Name</th>
            <th >Material Code</th>
            {(MatchingFlag) ?
            <th >Old Material Code</th> : ""}   
            {(MtrlFlg)? <th>New material Code</th>:""}        
            <th>Source</th>
            <th>Operation</th>
            {MatchingFlag && <th>Old Operation</th>}          
            <th>Order Qty</th>
            <th>JW Cost</th>
            {MatchingFlag && <th>Old JW Cost</th>}
            <th>Material Cost</th>
            {MatchingFlag && <th>Old Mtrl cost</th>}
            <th>Unit Price</th>
          </tr>
        </thead>
 
        <tbody>
  {props?.importedExcelData?.map((val, key) => {
    const oldVal = props?.dwgData?.[key]; // match same index
    const matchingRows = props?.matchingRows?.[key]; // match same index
    
    return (
      <tr
        key={key}
        className={props.selectedRows.includes(key) ? "selected-row" : ""}
        // style={{
        //   backgroundColor: MatchingFlag
        //     ? (
        //         (val.Mtrl_Code !== oldVal?.Mtrl_Code && oldVal?.Mtrl_Code !== undefined) ||
        //         (val?.Operation !== oldVal?.Operation && oldVal?.Operation !== undefined) ||
        //         (val.JW_Cost !== parseFloat(oldVal?.JobWorkCost) && oldVal?.JobWorkCost !== undefined) ||
        //         (val?.Mtrl_Cost !== parseFloat(oldVal?.MtrlCost) && oldVal?.MtrlCost !== undefined)
        //       )
        //       ? "#ffb6c1" // light pink for mismatch
        //       : "#90ee90" // light green for match
        //     : "transparent", // default when not compared
        // }}
        // style={{
        //   backgroundColor: val.Matching
        //     ? "#90ee90" // green if Matching is true
        //     : "#ffb6c1", // pink for mismatch if Matching is false
        // }}

        style={{
  backgroundColor: props.MatchingFlag
    ? (val.Matching
        ? "#90ee90" // green if Matching is true
        : "#ffb6c1" // pink for mismatch if Matching is false
      )
    : "white", // default white before comparison
}}
        onClick={() => {
          props.setSelectedRows(
            props.selectedRows.includes(key)
              ? props.selectedRows.filter((obj) => obj !== key)
              : [...props.selectedRows, key]
          );
        }}
      >
        <td>{val.Order_Srl}</td>
        <td style={{ width: "150px" }}>
          <input
            value={val.Dwg_Name}
            name="Dwg_Name"
            style={{ background: "transparent", border: "none" }}
            onChange={(e) =>
              handleChange(
                key,
                e.target.name,
                e.target.value,
                val.materialError,
                val.sourceError,
                val.operationError
              )
            }
          />
        </td>

        <td>
          <Typeahead
            className={
              val.materialError
                ? "border rounded border-1 border-danger typeaheadClass"
                : "typeaheadClass"
            }
            id="Mtrl_Code"
            name="Mtrl_Code"
            onChange={(e) =>
              handleChange(
                key,
                "Mtrl_Code",
                e.length > 0 ? e[0].label : "",
                e.length > 0 ? false : true,
                val.sourceError,
                val.operationError
              )
            }
            onInputChange={(text) =>
              handleChange(
                key,
                "Mtrl_Code",
                text,
                text.length > 0 ? false : true,
                val.sourceError,
                val.operationError
              )
            }
            options={props.mtrldata}
            selected={val.Mtrl_Code ? [{ label: val.Mtrl_Code }] : []}
            allowNew
            placeholder="Choose a Material..."
          />
        </td>

        {MatchingFlag && (
          <td style={{ width: "200px" }}>
            <Typeahead
              className={
                val.materialError
                  ? "border rounded border-1 border-danger typeaheadClass"
                  : "typeaheadClass"
              }
              id="Mtrl_Code"
              name="Mtrl_Code"
              onChange={(e) =>
                handleOldValChange(
                  key,
                  "Mtrl_Code",
                  e.length > 0 ? e[0].label : ""
                )
              }
              onInputChange={(text) =>
                handleOldValChange(
                  key,
                  "Mtrl_Code",
                  text
                )
              }
              options={props.mtrldata}
              // selected={oldVal?.Mtrl_Code ? [{ label: oldVal?.Mtrl_Code }] : []}
              selected={val?.Mtrl_Code_Old ? [{ label: oldVal?.Mtrl_Code }] : []}
              allowNew
              placeholder="Choose a Material..."
            />
          </td>
        )}

        {MtrlFlg && (
          <td>
            <td style={{ textAlign: "center" }}>
              <input
                type="text"
                style={{ background: "transparent", border: "none", color: "black" }}
                value={val.newMtrlCode}
              />
            </td>
          </td>
        )}

        <td style={{ width: "140px" }}>
          <Typeahead
            className={
              val.sourceError
                ? "border rounded border-1 border-danger typeaheadClass"
                : "typeaheadClass"
            }
            id="Source"
            name="Source"
            onChange={(e) =>
              handleChange(
                key,
                "Source",
                e.length > 0 ? e[0].label : "",
                val.materialError,
                e.length > 0 ? false : true,
                val.operationError
              )
            }
            options={props.materialSource}
            selected={[{ label: val.Source }]}
            placeholder="Choose a Source..."
          />
        </td>

        <td style={{ width: "230px" }}>
          <Typeahead
            className={`typeaheadClass ${val.operationError ? "border rounded border-1 border-danger" : ""}`}
            id="Operation"
            name="Operation"
            onChange={(e) =>
              handleChange(
                key,
                "Operation",
                e.length > 0 ? e[0].label : "",
                val.materialError,
                val.sourceError,
                e.length > 0 ? false : true
              )
            }
            onInputChange={(text) =>
              handleChange(
                key,
                "Operation",
                text,
                val.materialError,
                val.sourceError,
                text.length > 0 ? false : true
              )
            }
            options={props.procdata}
            selected={val.Operation ? [{ label: val.Operation }] : []}
            allowNew
            placeholder="Choose an Operation..."
          />
        </td>

        {MatchingFlag && (
          <td style={{ width: "170px" }}>
            <Typeahead
              className={`typeaheadClass ${oldVal?.operationError ? "border rounded border-1 border-danger" : ""}`}
              id="Old_Operation"
              name="Old_Operation"
              onChange={(e) =>
                handleOldValChange(
                  key,
                  "Operation",
                  e.length > 0 ? e[0].label : ""
                )
              }
              onInputChange={(text) =>
                handleOldValChange(
                  key,
                  "Operation",
                  text
                )
              }
              options={props.procdata}
              // selected={oldVal?.Operation ? [{ label: oldVal.Operation }] : []}
              selected={val?.
                Operation_Old
                 ? [{ label: oldVal.Operation }] : []}
              allowNew
              placeholder="Choose an Operation..."
            />
          </td>
        )}

        <td style={{ width: "34px" }}>
          <input
            type="number"
            min="0"
            value={val.Order_Qty}
            name="Order_Qty"
            style={{ background: "transparent", border: "none", textAlign: "right" }}
            onChange={(e) =>
              handleChange(
                key,
                e.target.name,
                e.target.value,
                val.materialError,
                val.sourceError,
                val.operationError
              )
            }
          />
        </td>

        <td style={{ width: "70px" }}>
          <input
            type="number"
            min="0"
            value={val.JW_Cost}
            name="JW_Cost"
            style={{
              background: "rgb(255, 255, 204)",
              border: "none",
              borderRadius: "5px",
              textAlign: "right"
            }}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              if (newValue < 1) {
                toast.error("JW Cost must be greater than 0");
                return;
              }
              handleChange(
                key,
                e.target.name,
                newValue,
                val.materialError,
                val.sourceError,
                val.operationError
              );
            }}
          />
        </td>

        {MatchingFlag && (
          <td style={{ width: "24px" }}>
            <input
              type="number"
              // value={oldVal?.JobWorkCost || ""}
              value={val?.
                JW_Cost_Old || ""}
              name="old_JW_Cost"
              min="0"
              style={{
                background: "#fff9cc",
                border: "1px solid #ccc",
                borderRadius: "5px",
                textAlign: "right"
              }}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                handleOldValChange(key, "JobWorkCost", isNaN(newValue) ? 0 : newValue);
              }}
            />
          </td>
        )}

        <td style={{ width: "24px" }}>
          <input
            type="number"
            min="0"
            value={val.Mtrl_Cost}
            name="Mtrl_Cost"
            style={{
              background:
                val.Source === "Magod" || val.Source === "Customer"
                  ? "rgb(204, 255, 204)"
                  : "transparent",
              border: "none",
              borderRadius: "5px",
              textAlign: "right"
            }}
            onChange={(e) =>
              handleChange(
                key,
                e.target.name,
                e.target.value,
                val.materialError,
                val.sourceError,
                val.operationError
              )
            }
          />
        </td>

        {MatchingFlag && (
          <td style={{ width: "24px" }}>
            <input
              type="number"
              // value={oldVal?.MtrlCost || ""}
              value={val?.Mtrl_Cost_Old || ""}
              name="old_Mtrl_Cost"
              min="0"
              style={{
                background: "#fff9cc",
                border: "1px solid #ccc",
                borderRadius: "5px",
                textAlign: "right"
              }}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                handleOldValChange(key, "MtrlCost", isNaN(newValue) ? 0 : newValue);
              }}
            />
          </td>
        )}
        <td>
        <td style={{width:"24px"}}>
          {(
            parseFloat(val.Source === "Magod" ? val.Mtrl_Cost || 0 : 0) +
            parseFloat(val.JW_Cost || 0)
          ).toFixed(2)}
        </td>
        </td>
      </tr>
    );
  })}
</tbody>

      </Table>
    </div>
  );
}
