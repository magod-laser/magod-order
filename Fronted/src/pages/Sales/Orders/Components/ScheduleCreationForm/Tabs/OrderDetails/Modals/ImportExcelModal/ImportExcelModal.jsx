/** @format */

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import Modal from "react-bootstrap/Modal";
import IETable from "./elements/IETable";
import IEFormHeader from "./elements/IEFormHeader";
import { toast } from "react-toastify";
import Set from "./Modals/Set";
import { postRequest } from "../../../../../../../../api/apiinstance";
import { endpoints } from "../../../../../../../../api/constants";

export default function ImportExcelModal(props) {
  console.log("orderData", props.OrderData.Cust_Code);

  const [importedExcelData, setImportedExcelData] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  const [settingModal, setSettingModal] = useState(false);

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < importedExcelData.length; i++) {
      const element = importedExcelData[i];

      total = (
        parseFloat(total) +
        parseFloat(element.Order_Qty || 0) *
          (parseFloat(element.Source === "Magod" ? element.Mtrl_Cost || 0 : 0) +
            parseFloat(element.JW_Cost || 0))
      ).toFixed(2);
    }
    setOrderTotal(total);
  }, [importedExcelData]);

  // console.log("importedExcelData", importedExcelData);

  const closeModal = () => {
    props.setImportExcelModal(false);
    setImportedExcelData([]);
    setOrderTotal(0);
    setSelectedRows([]);
    setSettingModal(false);

    // clearing compare btn flags
    setMatchingFlag(false);
    setMtrlFlg(false);
    setMatchingRows(false);
  };

  function exportModifiedExcel() {
    let excelTemplateArray = [];

    for (let i = 0; i < importedExcelData.length; i++) {
      const element = importedExcelData[i];
      let obj = {
        Dwg_Name: element.Dwg_Name,
        Mtrl_Code: element.Mtrl_Code,
        Source: element.Source,
        Operation: element.Operation,
        Order_Qty: parseFloat(element.Order_Qty || 0).toFixed(2),
        JW_Cost: parseFloat(element.JW_Cost || 0).toFixed(2),
        Mtrl_Cost: parseFloat(element.Mtrl_Cost || 0).toFixed(2),
      };

      excelTemplateArray.push(obj);
    }

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(excelTemplateArray);

    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    XLSX.writeFile(wb, "Modified Customer Order Template.xlsx");
    toast.success("Export modified excel successful");
  }

  const materialSource = [
    {
      label: "Magod",
    },
    {
      label: "Customer",
    },
  ];

  function exportExcelTemplate() {
    const excelTemplateArray = [
      {
        Dwg_Name: "",
        Mtrl_Code: "",
        Source: "",
        Operation: "",
        Order_Qty: "",
        JW_Cost: "",
        Mtrl_Cost: "",
      },
    ];

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(excelTemplateArray);

    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    XLSX.writeFile(wb, "Import Customer Order Template.xlsx");
    toast.success("Export excel template successful");
  }

  const [dwgData, setDwgData] = useState([]);
  const [MatchingFlag, setMatchingFlag] = useState(false);
  const [MtrlFlg, setMtrlFlg] = useState(false);
  const [newMtrlCodeUpdate, setnewMtrlCodeUpdate] = useState([]);
  const [matchingRows, setMatchingRows] = useState([]);

  const compareData = async () => {
    
    // Step 1: Check if CustDwg folder has data
    await postRequest(
      endpoints.compareCustDwg,
      { ccode: props.OrderData.Cust_Code },
      (compareCustDwg) => {
        console.log("compareCustDwg", compareCustDwg);
        if (compareCustDwg.status === "Folder Not Found") {
          alert("Dwgs are not there in CustDwg folder");
          return;
        }
        if (compareCustDwg.status === "The Folder is empty") {
          alert("CustDwg folder is empty");
          return;
        }

        // Step 2: Fetch DWG data from DB
        postRequest(
          endpoints.getDwgData,
          {
            Cust_Code: props.OrderData.Cust_Code,
            importedExcelData: importedExcelData,
          },
          (detailsDataInImportExcel) => {
            console.log("data-old", detailsDataInImportExcel);
            setDwgData(detailsDataInImportExcel);
            console.log("data-new", importedExcelData);

            // if (detailsDataInImportExcel) {
            //   const dwgDataFromDB = detailsDataInImportExcel;

            //   const updatedData = importedExcelData.map((excelRow) => {

            // 	const dbRow = dwgDataFromDB.find(
            // 	  (db) =>
            // 		db.DwgName?.trim().toLowerCase() ===
            // 		excelRow.Dwg_Name?.trim().toLowerCase()
            // 	);
            // 	// if (dwgDataFromDB.length === 0 ) {
            // 	// 	return {
            // 	// 	  ...excelRow,
            // 	// 	  Matching: true,
            // 	// 	};
            // 	//   }
            // 	//   else if (!dbRow) {
            // 	// 		return {
            // 	// 		  ...excelRow,
            // 	// 		  Matching: false,
            // 	// 		};

            // 	//   }

            // 	if (!dbRow) {
            // 	  return {
            // 		...excelRow,
            // 		Matching: false,
            // 	  };
            // 	}

            // 	// Compare each field
            // 	const isMatching =
            // 	  excelRow.Mtrl_Code === dbRow.Mtrl_Code &&
            // 	  excelRow.Operation === dbRow.Operation &&
            // 	  parseFloat(excelRow.JW_Cost) === parseFloat(dbRow.JobWorkCost) &&
            // 	  parseFloat(excelRow.Mtrl_Cost) === parseFloat(dbRow.MtrlCost);

            // 	return {
            // 	  ...excelRow,
            // 	  JW_Cost_Old: dbRow.JobWorkCost,
            // 	  Mtrl_Cost_Old: dbRow.MtrlCost,
            // 	  Operation_Old: dbRow.Operation,
            // 	  Mtrl_Code_Old: dbRow.Mtrl_Code,
            // 	  Matching: isMatching,
            // 	};
            //   });

            //   setImportedExcelData(updatedData); // update state
            //   setMatchingRows(updatedData.filter((row) => row.Matching === false)); // only mismatched rows
            //   if (updatedData.some((row) => row.Matching === false)) {
            // 	setMatchingFlag(true);
            //   }
            // }

            // if (
            //   !detailsDataInImportExcel ||
            //   detailsDataInImportExcel.length === 0
            // ) {
            //   const updatedData = importedExcelData.map((excelRow) => ({
            //     ...excelRow,
            //     JW_Cost_Old: "",
            //     Mtrl_Cost_Old: "",
            //     Operation_Old: "",
            //     Mtrl_Code_Old: "",
            //     Matching: true,
            //   }));

            //   setImportedExcelData(updatedData);
            //   setMatchingRows([]); // No mismatches
            //   setMatchingFlag(true);

            //   return; // Exit early to skip the rest
            // } else {
            //   const dwgDataFromDB = detailsDataInImportExcel;

            //   const updatedData = importedExcelData.map((excelRow) => {
            //     const dbRow = dwgDataFromDB.find(
            //       (db) =>
            //         db.DwgName?.trim().toLowerCase() ===
            //         excelRow.Dwg_Name?.trim().toLowerCase()
            //     );

            //     console.log("dbRow", dbRow);

            //     // if (dwgDataFromDB.length === 0 ) {
            //     // 	return {
            //     // 	  ...excelRow,
            //     // 	  Matching: true,
            //     // 	};
            //     //   }
            //     //   else if (!dbRow) {
            //     // 		return {
            //     // 		  ...excelRow,
            //     // 		  Matching: false,
            //     // 		};

            //     //   }

            //     // if (!dbRow) {
            //     //   return {
            //     // 	...excelRow,
            //     // 	Matching: false,
            //     //   };
            //     // }
            //     //

            //     //---------

            //     // If no matching drawing in DB, mark as Matching: true (Excel-only)

            //     if (!dbRow) {
            //       return {
            //         ...excelRow,
            //         JW_Cost_Old: "",
            //         Mtrl_Cost_Old: "",
            //         Operation_Old: "",
            //         Mtrl_Code_Old: "",
            //         Matching: true, // consider it a match (green)
            //       };
            //     }

            //     // Compare each field
            //     const isMatching =
            //       excelRow.Mtrl_Code === dbRow.Mtrl_Code &&
            //       excelRow.Operation === dbRow.Operation &&
            //       parseFloat(excelRow.JW_Cost) ===
            //         parseFloat(dbRow.JobWorkCost) &&
            //       parseFloat(excelRow.Mtrl_Cost) === parseFloat(dbRow.MtrlCost);

            //     return {
            //       ...excelRow,
            //       JW_Cost_Old: dbRow.JobWorkCost,
            //       Mtrl_Cost_Old: dbRow.MtrlCost,
            //       Operation_Old: dbRow.Operation,
            //       Mtrl_Code_Old: dbRow.Mtrl_Code,
            //       Matching: isMatching,
            //     };
            //   });

            //   setImportedExcelData(updatedData); // update state
            //   setMatchingRows(
            //     updatedData.filter((row) => row.Matching === false)
            //   ); // only mismatched rows
            //   if (updatedData.some((row) => row.Matching === false)) {
            //     setMatchingFlag(true);
            //   }
            // }
            // -- 27-05-25
            if (
              !detailsDataInImportExcel ||
              detailsDataInImportExcel.length === 0
            ) {
              const updatedData = importedExcelData.map((excelRow) => ({
                ...excelRow,
                JW_Cost_Old: "",
                Mtrl_Cost_Old: "",
                Operation_Old: "",
                Mtrl_Code_Old: "",
                Matching: true,
              }));

              setImportedExcelData(updatedData);
              setMatchingRows([]); // No mismatches
              setMatchingFlag(true);

              return; // Exit early to skip the rest
            } else {
              const dwgDataFromDB = detailsDataInImportExcel;

              let hasAnyMatches = false;

              const updatedData = importedExcelData.map((excelRow) => {
                const dbRow = dwgDataFromDB.find(
                  (db) =>
                    db.DwgName?.trim().toLowerCase() ===
                    excelRow.Dwg_Name?.trim().toLowerCase()
                );

                if (!dbRow) {
                  return {
                    ...excelRow,
                    JW_Cost_Old: "",
                    Mtrl_Cost_Old: "",
                    Operation_Old: "",
                    Mtrl_Code_Old: "",
                    Matching: true,
                  };
                }

                // If match is found, set the flag
                hasAnyMatches = true;

                const isMatching =
                  excelRow.Mtrl_Code === dbRow.Mtrl_Code &&
                  excelRow.Operation === dbRow.Operation &&
                  parseFloat(excelRow.JW_Cost) ===
                    parseFloat(dbRow.JobWorkCost) &&
                  parseFloat(excelRow.Mtrl_Cost) === parseFloat(dbRow.MtrlCost);

                return {
                  ...excelRow,
                  JW_Cost_Old: dbRow.JobWorkCost,
                  Mtrl_Cost_Old: dbRow.MtrlCost,
                  Operation_Old: dbRow.Operation,
                  Mtrl_Code_Old: dbRow.Mtrl_Code,
                  Matching: isMatching,
                };
              });

              //  If no matches found in DB for any rows, treat like empty DB
              if (!hasAnyMatches) {
                const greenData = importedExcelData.map((excelRow) => ({
                  ...excelRow,
                  JW_Cost_Old: "",
                  Mtrl_Cost_Old: "",
                  Operation_Old: "",
                  Mtrl_Code_Old: "",
                  Matching: true,
                }));
                setImportedExcelData(greenData);
                setMatchingRows([]);
                setMatchingFlag(true);
                return;
              }

              // Otherwise handle normal match/mismatch
              setImportedExcelData(updatedData);
              setMatchingRows(
                updatedData.filter((row) => row.Matching === false)
              );

              if (updatedData.some((row) => row.Matching === false)) {
                setMatchingFlag(true);
              }
            }
            
          }
        );
      }
    );
  };

  // console.log("updatedData after compare", importedExcelData);

  const updatePara = () => {
    const updatedData = importedExcelData.map((excelRow) => {
      // Find matching row in dwgData
      const dbRow = dwgData.find(
        (db) =>
          db.DwgName?.trim().toLowerCase() ===
          excelRow.Dwg_Name?.trim().toLowerCase()
      );

      // If no matching row found, keep it unchanged
      if (!dbRow) return excelRow;

      // no dwgs in table

      // Return updated row with matched values and clear mismatches
      return {
        ...excelRow,
        Mtrl_Code: dbRow.Mtrl_Code,
        Operation: dbRow.Operation,
        JW_Cost: parseFloat(dbRow.JobWorkCost),
        Mtrl_Cost: parseFloat(dbRow.MtrlCost),
        Matching: true, // updated, now matching
        mismatches: {}, // clear mismatch indicators
      };
    });

    setImportedExcelData(updatedData); // Update state
  };

  // console.log("updatedData after Update para", importedExcelData);

  return (
    <>
      <Modal
        show={props.importExcelModal}
        onHide={closeModal}
        style={{ background: "#4d4d4d57" }}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Import from Excel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <IEFormHeader
            setImportedExcelData={setImportedExcelData}
            importedExcelData={importedExcelData}
            orderTotal={orderTotal}
            OrderData={props.OrderData}
            mtrldata={props.mtrldata}
            procdata={props.procdata}
            setSettingModal={setSettingModal}
            selectedRows={selectedRows}
            setOrdrDetailsData={props.setOrdrDetailsData}
            closeModal={closeModal}
            exportExcelTemplate={exportExcelTemplate}
            fetchData={props.fetchData}
            MtrlFlg={MtrlFlg}
            setMtrlFlg={setMtrlFlg}
            dwgData={dwgData}
            setDwgData={setDwgData}
            compareData={compareData}
            updatePara={updatePara}
          />
          <IETable
            importedExcelData={importedExcelData}
            setImportedExcelData={setImportedExcelData}
            mtrldata={props.mtrldata}
            procdata={props.procdata}
            materialSource={materialSource}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
            OrdrDetailsData={props.OrdrDetailsData}
            // setOrdrDetailsData={props.setOrdrDetailsData}
            dwgData={dwgData}
            setDwgData={setDwgData}
            compareData={compareData}
            updatePara={updatePara}
            MatchingFlag={MatchingFlag}
            setMatchingFlag={setMatchingFlag}
            MtrlFlg={MtrlFlg}
            setMtrlFlg={setMtrlFlg}
            setnewMtrlCodeUpdate={setnewMtrlCodeUpdate}
            newMtrlCodeUpdate={newMtrlCodeUpdate}
            matchingRows={matchingRows}
          />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div
            className="d-flex justify-content-between"
            style={{ width: "30%" }}
          >
            <button
              className="button-style m-0"
              style={{ width: "auto" }}
              onClick={() => {
                exportExcelTemplate();
              }}
            >
              Download Excel Template
            </button>
            <button
              className="button-style m-0"
              style={{ width: "auto" }}
              onClick={exportModifiedExcel}
              disabled={importedExcelData.length < 1}
            >
              Download Modified Excel
            </button>
          </div>
          <button
            className="button-style m-0"
            style={{ width: "60px" }}
            onClick={closeModal}
          >
            Exit
          </button>
        </Modal.Footer>
      </Modal>
      <Set
        settingModal={settingModal}
        setSettingModal={setSettingModal}
        mtrldata={props.mtrldata}
        procdata={props.procdata}
        importedExcelData={importedExcelData}
        setImportedExcelData={setImportedExcelData}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        setnewMtrlCodeUpdate={setnewMtrlCodeUpdate}
        newMtrlCodeUpdate={newMtrlCodeUpdate}
      />
    </>
  );
}
