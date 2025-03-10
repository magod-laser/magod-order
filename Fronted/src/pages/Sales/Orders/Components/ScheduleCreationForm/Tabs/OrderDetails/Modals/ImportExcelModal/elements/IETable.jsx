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

import React, { useEffect } from "react";
import { Table } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

export default function IETable(props) {
  // Ensure Order_Srl is mapped
  useEffect(() => {
    const updatedData = props.importedExcelData.map((item, index) => ({
      ...item,
      Order_Srl: index + 1, // Assign SL No dynamically
    }));
    props.setImportedExcelData(updatedData);
  }, [props.importedExcelData.length]); // Run only when data length changes

  const handleChange = (key, name, val, materialError, sourceError, operationError) => {
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

  return (
    <div style={{ overflow: "auto" , height:" 500px"}}>
      <Table striped className="table-data border" >
        <thead className="tableHeaderBGColor">
          <tr>
            <th>SL No</th>
            <th>Drawing Name</th>
            <th>Material Code</th>
            <th>Source</th>
            <th>Operation</th>
            <th>Order Qty</th>
            <th>JW Cost</th>
            <th>Material Cost</th>
            <th>Unit Price</th>
          </tr>
        </thead>
        <tbody>
          {props?.importedExcelData?.map((val, key) => (
            <tr
              key={key}
              className={props.selectedRows.includes(key) ? "selected-row" : ""}
              onClick={() => {
                props.setSelectedRows(
                  props.selectedRows.includes(key)
                    ? props.selectedRows.filter((obj) => obj !== key)
                    : [...props.selectedRows, key]
                );
              }}
            >
              <td>{val.Order_Srl}</td>
              <td>
                <input
                  value={val.Dwg_Name}
                  name="Dwg_Name"
                  style={{ background: "transparent", border: "none" }}
                  onChange={(e) => handleChange(key, e.target.name, e.target.value, val.materialError, val.sourceError, val.operationError)}
                />
              </td>
              <td>
                <Typeahead
                  className={val.materialError ? "border rounded border-1 border-danger typeaheadClass" : "typeaheadClass"}
                  id="Mtrl_Code"
                  name="Mtrl_Code"
                  onChange={(e) => handleChange(key, "Mtrl_Code", e.length > 0 ? e[0].label : "", e.length > 0 ? false : true, val.sourceError, val.operationError)}
                  onInputChange={(text) => handleChange(key, "Mtrl_Code", text, text.length > 0 ? false : true, val.sourceError, val.operationError)}
                  options={props.mtrldata}
                  selected={val.Mtrl_Code ? [{ label: val.Mtrl_Code }] : []}
                  allowNew
                  placeholder="Choose a Material..."
                />
              </td>
              <td>
              {val.sourceError && <span className="text-danger">Source data error</span>}
                <Typeahead
                  className={val.sourceError ? "border rounded border-1 border-danger typeaheadClass" : "typeaheadClass"}
                  id="Source"
                  name="Source"
                  onChange={(e) => handleChange(key, "Source", e.length > 0 ? e[0].label : "", val.materialError, e.length > 0 ? false : true, val.operationError)}
                  options={props.materialSource}
                  selected={[{ label: val.Source }]}
                  placeholder="Choose a Source..."
                />
              </td>
  
              <td>
              {/* {val.operationError && <span className="text-danger">Operation data error</span>} */}
                <Typeahead
                  // className={val.operationError ? "border rounded border-1 border-danger typeaheadClass" : "typeaheadClass"}
                  className={`typeaheadClass ${val.operationError ? "border rounded border-1 border-danger" : ""}`}
  
                  id="Operation"
                  name="Operation"
                  onChange={(e) => handleChange(key, "Operation", e.length > 0 ? e[0].label : "", val.materialError, val.sourceError, e.length > 0 ? false : true)}
                  
                //  onChange={(e) => {
                //     const newValue = e.length > 0 ? e[0].label : "";
                //     const hasError = newValue.length === 0; // If empty, it's an error
                
                //     console.log("onChange Triggered");
                //     console.log("Selected Value:", newValue);
                //     console.log("operationError Before:", val.operationError);
                //     console.log("Setting operationError to:", hasError);
                
                //     handleChange(key, "Operation", newValue, val.materialError, val.sourceError, hasError);
                //   }}
                  onInputChange={(text) => handleChange(key, "Operation", text, val.materialError, val.sourceError, text.length > 0 ? false : true)}
                  options={props.procdata}
                  selected={val.Operation ? [{ label: val.Operation }] : []}
                  allowNew
                  placeholder="Choose an Operation..."
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={val.Order_Qty}
                  name="Order_Qty"
                  style={{ background: "transparent", border: "none" }}
                  onChange={(e) => handleChange(key, e.target.name, e.target.value, val.materialError, val.sourceError, val.operationError)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={val.JW_Cost}
                  name="JW_Cost"
                  style={{ background: "transparent", border: "none" }}
                  onChange={(e) => handleChange(key, e.target.name, e.target.value, val.materialError, val.sourceError, val.operationError)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={val.Mtrl_Cost}
                  name="Mtrl_Cost"
                  style={{ background: "transparent", border: "none" }}
                  onChange={(e) => handleChange(key, e.target.name, e.target.value, val.materialError, val.sourceError, val.operationError)}
                />
              </td>
              <td>
                {(
                  parseFloat(val.Source === "Magod" ? val.Mtrl_Cost || 0 : 0) +
                  parseFloat(val.JW_Cost || 0)
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
