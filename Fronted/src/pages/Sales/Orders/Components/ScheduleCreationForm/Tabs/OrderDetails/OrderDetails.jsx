/** @format */

import React, { useEffect, useState } from "react";
import { useOrderContext } from "../../../../../../../context/OrderContext";
import OrdrTable from "./Table/OrdrTable";
import Drawings from "./Tabs/Drawings";
import OrdrDtls from "./Tabs/OrdrDtls";
import { Tab, Tabs } from "react-bootstrap";
import ImportDwgModal from "./Modals/ImportDwgModal";
import ImportOldOrderModal from "./Modals/ImportOldOrderModal/ImportOldOrderModal";
import ImportQtnModal from "./Modals/ImportQtnModal/ImportQtnModal";
import { toast } from "react-toastify";
import ImportExcelModal from "./Modals/ImportExcelModal/ImportExcelModal";
import BulkChangeModal from "./Modals/BulkChangeModal";
import ConfirmationModal from "../../../../Modal/ConfirmationModal";
import Loading from "../../Loading";
import { Profiler } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import { Helper } from "dxf";
const {
  getRequest,
  postRequest,
} = require("../../../../../../api/apiinstance");
const { endpoints } = require("../../../../../../api/constants");

export default function OrderDetails(props) {
  const {
    OrderData,
    OrderCustData,
    OrdrDetailsData,
    setOrdrDetailsData,
    selectItem,
    selectedItems,
    setSelectedItems,
    fetchData,
    BomData,
    setBomData,
    handleSelectAll,
    handleReverseSelection,
    LastSlctedRow,
    setLastSlctedRow,
    handleBulkCngBtn,
    selectedSrl,

    // handleMtrlCodeTypeaheadChange,
    newSerial,
    setNewSerial,
    ordrDetailsChange,
    setordrDetailsChange,
    blkChange,
    setBlkChange,
    imprtDwgObj,
    setImprtDwgObj,
    handleChange,
    InputField,
    setDetailsColour,
    calculateMinSrlStatus,
    updateOrderStatus,
    getStatusText,
    scheduleType,
    scheduleOption,
    filteredData,
    setFilteredData,
    selectedRowItem,
    Dwglist,
    handleJWMR,
    handleRowClick,
    handleCheckboxChange,
    selectedRow,
    setSelectedRow,
    selectedRows,
    setSelectedRows,
    setSelectedRowItems,
    selectedRowItems,
    setSelectedSrl,
    sortConfig,
    setSortConfig,
    sortedData,
    OrdrDetailsItem,

    // hande arrow keys
    currentIndex,
    setCurrentIndex,
    goToFirst,
    goToPrevious,
    goToNext,
    goToLast,
    FindOldOrderButtonData,
    OdrDtlMtrlSrc,
  } = props;

  console.log("list--1", selectedItems);
  console.log("list--2", selectedRows);
  useEffect(() => {
    setSelectedItems(selectedRows);
  }, [selectedRows]);

  const [groupBoxAddSrlVisible, setGroupBoxAddSrlVisible] = useState(true);

  const [buttonClicked, setButtonClicked] = useState("");
  // confirmation modal413
  const [ConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  // import from excel
  const [importExcelModal, setImportExcelModal] = useState(false);
  // import qoutation
  const [importQtnMdl, setImportQtnMdl] = useState(false);

  const [isLoading, setisLoading] = useState(false);

  console.log("filteredData - asdf", filteredData);
  // console.log("LastSlctedRow", LastSlctedRow);
  // console.log("LastSlctedRow", LastSlctedRow);

  function importExcelFunc() {
    setImportExcelModal(true);
  }

  let lastOrderSrl = 0;

  for (let i = 0; i < OrdrDetailsData.length; i++) {
    const element = OrdrDetailsData[i];

    if (element.Order_Srl > lastOrderSrl) {
      lastOrderSrl = element.Order_Srl;
    }
  }

  var newOrderSrl = lastOrderSrl + 1;

  var Cust_Code = props.OrderCustData?.Cust_Code;
  var OrderNo = props.OrderData?.Order_No;
  var Type = props.OrderData?.Type;
  var QtnNo = props.OrderData?.QtnNo;
  var SalesContact = props.OrderData?.SalesContact;
  var Delivery_Date = props.OrderData?.Delivery_Date;
  var RecordedBy = props.OrderData?.RecordedBy;
  var Order_Received_By = props.OrderData?.Order_Received_By;
  var Purchase_Order = props.OrderData?.Purchase_Order;
  var Payment = props.OrderData?.Payment;

  const [mtrldata, setMtrldata] = useState([]);
  const [procdata, setProcdata] = useState([]);
  const [inspdata, setInspdata] = useState([]);
  const [packdata, setPackdata] = useState([]);
  const [tolerancedata, setTolerancedata] = useState([]);
  const [salesExecdata, setSalesExecdata] = useState([]);
  const [strtolerance, setStrTolerance] = useState("");
  const [gradeid, setGradeID] = useState("");
  const [strmtrlcode, setStrMtrlCode] = useState("");
  //25032025
  const [materia, setMaterial] = useState("");
  const [DwgName, setDwgName] = useState("");
  const [quantity, setQuantity] = useState(1.0);
  const [jwRate, setJwRate] = useState(0.0);
  const [materialRate, setMaterialRate] = useState(0.0);
  const [unitPrice, setUnitPrice] = useState(0.0);
  const [Operation, setOperation] = useState("");
  //25032025
  const [thicknes, setThickness] = useState("");
  const [specificw, setSpecificWt] = useState(0);
  const [grad, setGrade] = useState("");
  const [HasBOM, setHasBOM] = useState(0);
  const [Dwg, setDwg] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [blkCngCheckBox, setBlkCngCheckBox] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  // SURESH SIR
  let [dxfFileData, setDxfFileData] = useState("");
  let [selectedDwgId, setSelectedDwgId] = useState(0);
  let [lengthOfCut, setLengthOfCut] = useState(0);
  let [noOfPierces, setNoofPierces] = useState(0);
  let [imprtDwgData, setImprtDwgData] = useState([]);
  let [process, setProcess] = useState("");
  let [dxfmaterial, setDxfMaterial] = useState("");

  const [NewSrlFormData, setNewSrlFormData] = useState({
    DrawingName: "",
    Material: "",
    MtrlSrc: "Customer",
    Operation: "",
    Quantity: quantity,
    JW_Rate: jwRate,
    Mtrl_Rate: materialRate,
    UnitPrice: unitPrice,
    InspLvl: "Insp1",
    PkngLvl: "Pkng1",
  });

  useEffect(() => {
    postRequest(
      endpoints.getCustomerDets,
      { custcode: Cust_Code },
      (custdata) => {
        // setCustomer(custdata[0]["Cust_name"]);
        // setCustdata(custdata);
      }
    );

    postRequest(endpoints.getSalesExecLists, {}, (sdata) => {
      setSalesExecdata(sdata);
    });
    postRequest(
      endpoints.getSalesIndiExecLists,
      { salesContact: SalesContact },
      (sdata) => {
        // setSalesExecContact(sdata[0]["Name"]);
      }
    );

    postRequest(
      endpoints.getSalesIndiExecLists,
      { salesContact: Order_Received_By },
      (rcvddata) => {
        // setReceivedBy(rcvddata[0]["Name"]);
      }
    );
    getRequest(endpoints.getMaterials, (mtrldata) => {
      let arr = [];
      for (let i = 0; i < mtrldata.length; i++) {
        mtrldata[i].label = mtrldata[i].Mtrl_Code;
        arr.push(mtrldata[i]);
      }

      setMtrldata(arr);
    });
    getRequest(endpoints.getProcessLists, (pdata) => {
      console.log("pdata---", pdata);

      let arr = [];

      for (let i = 0; i < pdata.length; i++) {
        pdata[i].label = pdata[i].Operation;
        arr.push(pdata[i]);
      }

      setProcdata(arr);
    });

    getRequest(endpoints.getToleranceTypes, (ttdata) => {
      setTolerancedata(ttdata);
    });
    getRequest(endpoints.getInspectionLevels, (ildata) => {
      setInspdata(ildata);
    });
    getRequest(endpoints.getPackingLevels, (pckdata) => {
      setPackdata(pckdata);
    });
  }, []);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleDwgInputChange = (event) => {
    const newValue = event.target.value;
    setDwgName(newValue);

    setNewSrlFormData({
      ...NewSrlFormData,
      DrawingName: newValue,
    });
  };

  const handleblkCngCheckBox = (index) => {
    const newCheckboxValues = [...blkCngCheckBox];
    newCheckboxValues[index] = !newCheckboxValues[index];
    setBlkCngCheckBox(newCheckboxValues);
  };

  const insertnewsrldata = () => {
    postRequest(
      endpoints.InsertNewSrlData,
      {
        OrderNo: OrderNo,
        newOrderSrl: newOrderSrl,
        custcode: Cust_Code,
        DwgName: DwgName,
        Dwg_Code: "",
        dwg: Dwg,
        tolerance: "",
        HasBOM: HasBOM,
        Qty_Ordered: quantity,
        JwCost: jwRate,
        mtrlcost: materialRate,
        strmtrlcode: strmtrlcode,
        material: materia,
        Operation: Operation,

        NewSrlFormData: NewSrlFormData,
      },
      (InsertedNewSrlData) => {
        if (InsertedNewSrlData.affectedRows != 0) {
          fetchData();
          alert("Added serial successfully");
          handleCloseImportDwg();
        } else {
          toast.warning("Serial not added check once");
          handleCloseImportDwg();
        }
      }
    );
  };

  let blkCngCheckBoxx = blkCngCheckBox;

  let updateblkcngOrdrData = () => {
    console.log("sssselectedItems-------",selectedItems);
    
    handleClosesetBulkChnangMdl();

    selectedItems.forEach((element, index) => {
      // element.DwgName = blkCngCheckBoxx[0]
      //   ? blkChange.DwgName
      //   : element.DwgName;
      element.Mtrl_Code = blkCngCheckBoxx[1]
        ? LastSlctedRow?.Mtrl_Code
        : element.Mtrl_Code;
      element.Mtrl_Source = blkCngCheckBoxx[2]
        ? blkChange.material
        : element.Mtrl_Source;
      element.Operation = blkCngCheckBoxx[3]
        ? blkChange.Operation
        : element.Operation;
      element.quantity = blkCngCheckBoxx[4]
        ? blkChange.quantity
        : element.quantity;
      element.JWCost = blkCngCheckBoxx[5] ? blkChange.jwRate : element.JWCost;
      element.UnitPrice = blkCngCheckBoxx[6]
        ? blkChange.unitPrice
        : element.UnitPrice;
      element.MtrlCost = blkCngCheckBoxx[7]
        ? blkChange.materialRate
        : element.MtrlCost;
      element.InspLevel = blkCngCheckBoxx[8]
        ? blkChange.InspLvl
        : element.InspLevel;
      element.PackingLevel = blkCngCheckBoxx[9]
        ? blkChange.PkngLvl
        : element.PackingLevel;
    });

    postRequest(
      endpoints.bulkChangeUpdate,
      {
        selectedItems: selectedItems,
        OrderNo: OrderNo,
        custcode: Cust_Code,
        OrderSrl: selectedSrl,
        MtrlSrc: blkChange.MtrlSrc,
      },
      (blkChngData) => {
        if (blkChngData.affectedRows !== 0) {
          // toast.success("Updated successfully");
          alert("Updated successfully");
         fetchData();
          handleClosesetBulkChnangMdl();
        } else {
          toast.warning("Serial not updated, check once");
        }

        // Clear selectedSrl after API call is complete
        clearAllSelections();
      }
    );
  };

  // Function to clear all selections
  const clearAllSelections = () => {
    setSelectedRows([]);
    setSelectedRowItems([]);
    setSelectedItems([]);
    setSelectedSrl([]); // This should clear the selectedSrl
    setLastSlctedRow(null);
    setSelectedRow(null);
  };

  // console.log("blukchangeSelectedItems", selectedItems);
  // console.log("AAfter bulkchange SelectedSrl", selectedSrl);
  let singleupdateOrdrData = () => {
    postRequest(
      endpoints.singleChangeUpdate,
      {
        OrderNo: OrderNo,
        custcode: Cust_Code,
        quantity: quantity,
        OrderSrl: selectedSrl,
        JwCost: jwRate,
        mtrlcost: materialRate,
      },
      (singleChngData) => {
        ////// //console.log(" blkChngData", blkChngData);
        if (singleChngData.affectedRows != 0) {
          alert("Updated successfully");
          // toast.success("Updated successfully");
          fetchData();
        } else {
          toast.warning("Serial not updated check once");
        }
      }
    );
  };
  const handleMtrlCodeTypeaheadChangeeee = (selectedOptions) => {
    setSelectedItems(selectedOptions);

    const selectedValue =
      selectedOptions.length > 0 ? selectedOptions[0]?.Mtrl_Code : " ";
    setStrMtrlCode(selectedValue);
  };
  console.log("strmtrlcode1", strmtrlcode);

  const handleMtrlCodeTypeaheadChange = (selectedOptions) => {
    // setSelectedItems(selectedOptions);
    if (selectedOptions.length > 0) {
      setLastSlctedRow(selectedOptions[0]);
    }
    const selectedValue =
      selectedOptions.length > 0 ? selectedOptions[0]?.Mtrl_Code : " ";
    setStrMtrlCode(selectedValue);
  };
  console.log("strmtrlcode2", strmtrlcode);

  const handleInputChange = (input) => {
    setLastSlctedRow((prevSelectedItem) => ({
      ...prevSelectedItem,
      Mtrl_Code: input,
    }));
  };

  const selectMtrl = async (e) => {
    e.preventDefault();
    setStrMtrlCode(e.target.value);
    setNewSrlFormData({
      ...NewSrlFormData,
      Material: e.target.value,
    });
  };
  const selectProc = async (e) => {
    e.preventDefault();
    setOperation(e.target.value);
    setNewSrlFormData({
      ...NewSrlFormData,
      Operation: e.target.value,
    });
  };
  const selectInsp = async (e) => {
    e.preventDefault();
    setNewSrlFormData({
      ...NewSrlFormData,
      InspLvl: e.target.value,
    });
  };

  const selectPack = async (e) => {
    e.preventDefault();
    setNewSrlFormData({
      ...NewSrlFormData,
      PkngLvl: e.target.value,
    });
  };

  const selectTolerance = (e) => {
    e.preventDefault();
    let toltype;
    for (let i = 0; i < tolerancedata.length; i++) {
      if (tolerancedata[i]["ToleranceType"] === e.target.value) {
        toltype = tolerancedata[i];
        break;
      }
    }
    setStrTolerance(e.target.value);
  };
  const selectMtrlSrc = async (e) => {
    e.preventDefault();
    setNewSrlFormData({
      ...NewSrlFormData,
      MtrlSrc: e.target.value,
    });
  };

  const [importdwgshow, setImportDwgShow] = useState(false);

  const handleImportDwg = () => {
    setImportDwgShow(true);
  };
  const handleCloseImportDwg = () => {
    setImportDwgShow(false);
    setQuantity(0.0);
    setJwRate(0.0);
    setMaterialRate(0.0);
    setUnitPrice(0.0);

    setNewSerial((prevState) => ({
      ...prevState,
      DwgName: "",
      material: "",
      strmtrlcode: "",
      Operation: "",
      InspLvl: "",
      PkngLvl: "",
      MtrlSrc: "",
      quantity: 0.0,
      jwRate: 0.0,
      materialRate: 0.0,
      unitPrice: 0.0,
    }));
  };

  // IMPORT DWG MODAL
  const [importdwgmdlshow, setImportDwgmdlShow] = useState(false);

  const handleImportDwgmdl = () => {
    if (props.OrderData?.Order_Status === "Processing") {
      toast.warning("Cannot import after the Order is Processing");
    } else {
      setImportDwgmdlShow(true);
    }
  };
  const handleCloseImportDwgmdl = () => {
    setImportDwgmdlShow(false);
  };
  // IMPORT OLD ORDER MODAL
  const [importOldOrdrMdl, setImportOldOrdrMdl] = useState(false);

  const handleImportOldOrdrMdl = () => {
    if (props.OrdrDetailsData.length > 0) {
      setConfirmationModalOpen(true);
    } else {
      setImportOldOrdrMdl(true);
    }
  };
  useEffect(() => {
    FindOldOrderButtonData();
  }, []);

  const handleImportFromExcelModal = () => {
    if (props.OrdrDetailsData.length > 0) {
      setConfirmationModalOpen(true);
    } else {
      setImportExcelModal(true);
    }
  };

  const handleCloseImportOldOrdrMdl = () => {
    setImportOldOrdrMdl(false);
  };
  // BULK CHANGE MODAL
  const [bulkChnangMdl, setBulkChnangMdl] = useState(false);

  const handlebulkChnangMdl = () => {
    const hasScheduled = selectedItems?.some((item) => item.QtyScheduled !== 0);

    if (hasScheduled) {
      toast.warning(
        "The selected DWGs are already scheduled."
      );
      setBulkChnangMdl(false);
    } else {
      setBulkChnangMdl(true);
    }
  };
  const handleClosesetBulkChnangMdl = () => {
    setBulkChnangMdl(false);
    setBlkChange((prevState) => ({
      ...prevState,
      DwgName: "",
      material: "",
      strmtrlcode: "",
      Operation: "",
      InspLvl: "",
      PkngLvl: "",
      MtrlSrc: "",
      quantity: 0.0,
      jwRate: 0.0,
      materialRate: 0.0,
      unitPrice: 0.0,
    }));
    setBlkCngCheckBox([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    setSelectedRows([]);
    setSelectedItems([]);
  };

  // const [refresh, setRefresh] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  //DELETE BUTTON 
  function deleteRowsBySrl() {
    // Avoid unnecessary state updates
    const orderNo = props.OrderData.Order_No;

    // Step 1: Request to delete the serial numbers
    postRequest(
      endpoints.postDeleteDetailsBySrl,
      {
        Order_No: orderNo,
        selectedSrl: selectedSrl,
        selectedItems: selectedItems,
      },
      (deleteData) => {
        // Step 2: Handle success and failure scenarios for the delete request
        if (deleteData.success === true) {
          toast.success("Serial Deleted successfully");

          // Step 3: Fetch updated data and update UI
          postRequest(
            endpoints.getOrdDetailsData,
            { Order_No: orderNo },
            (updatedData) => {
              if (updatedData && updatedData.length > 0) {
                console.log("Updated data found:", updatedData);

                // Step 4: Sort the data based on Order_Srl to maintain relative order
                const sortedData = updatedData.sort(
                  (a, b) => a.Order_Srl - b.Order_Srl
                );
                const reIndexedData = sortedData.map((item, idx) => ({
                  ...item,
                  Order_Srl: idx + 1,
                }));

                // Step 5: Update the state and database in parallel
                // Update state with new order details
                setOrdrDetailsData(reIndexedData);

                // Step 6: Batch update the serial numbers in the database
                updateSerialNumbersInDatabase(reIndexedData, orderNo);
              } else {
                // Handle the edge case: If no updated data is found, refresh the data
                fetchData();
              }
            }
          );
        } else {
          toast.warning("Not Deleted, Please Check Once");
        }
      }
    );
  }

  // Batch update serial numbers in the database
  function updateSerialNumbersInDatabase(reIndexedData, orderNo) {
    const updatePromises = reIndexedData.map((item) =>
      postRequest(
        endpoints.ordertablevaluesupdate,
        {
          Order_No: orderNo,
          Order_Srl: item.Order_Srl,
          OrderDetailID: item.OrderDetailID,
          field: "Order_Srl",
          value: item.Order_Srl,
        },
        (updateResult) => updateResult
      )
    );

    // Handle all updates
    Promise.all(updatePromises)
      .then(() => {
        console.log("All serial numbers updated in the database");
        // Clear selections and reset the state
        clearSelections();
        setLastSlctedRow(null);
        setordrDetailsChange([]);
      })
      .catch((error) => {
        console.error("Error updating serial numbers:", error);
        // In case of failure, still update UI with the latest data
        clearSelections();
        setLastSlctedRow(null);
        setordrDetailsChange([]);
      });
  }

  // useEffect(() => {
  //   deleteRowsBySrl();
  // }, []);

  function clearSelections() {

    setSelectedRows([]); // Clear multi-selection
    setSelectedItems([]); // Clear selected item list
    setSelectedSrl([]); // Clear selected serial numbers
    setLastSlctedRow(null); // Reset last selected row
    setSelectedRow(null);    // Reset single selected row
  }

  function deleteRowsByOrderNoFunc() {
    postRequest(
      endpoints.postDeleteDetailsByOrderNo,
      { Order_No: props.OrderData.Order_No, filteredData: filteredData },
      (deleteData) => {
        if (deleteData.flag > 0) {
          setOrdrDetailsData([]);
          alert("Serial Deleted sucessfully");
          // toast.success("Serial Deleted sucessfully");
          setConfirmationModalOpen(false);

          if (buttonClicked === "Import Qtn") {
            setImportQtnMdl(true);
          } else if (buttonClicked === "Import Old Order") {
            setImportOldOrdrMdl(true);
          } else if (buttonClicked === "Import From Excel") {
            setImportExcelModal(true);
          } else {
          }
        } else {
          toast.warning(deleteData);
        }
      }
    );
  }
  // ImportQtnMdl
  const handleImportQtnMdl = () => {
    if (props.OrdrDetailsData.length > 0) {
      setConfirmationModalOpen(true);
    } else {
      setImportQtnMdl(true);
    }
  };

  // PartId DROPDOWN
  const [selectedPartId, setSelectedPartId] = useState([]);
  const [BomArry, setBomArry] = useState([]);
  const [magodCode, setMagodCode] = useState();

  //NEW CODE
  const handleSelectChange = (selected) => {
    const selectedPartId = selected[0]?.label;
    const magodCodee = selected[0]?.magodCode;
    setMagodCode(selected[0]?.magodCode);
    // Filter the BomData to get the array of objects matching the selected part ID
    const arr = BomData.filter((obj) => obj.AssyCust_PartId === selectedPartId);

    // Update the state with the filtered array
    setBomArry(arr);
    setSelectedPartId(selected);

    // Check if the selected part ID is in AssyCust_PartId
    const hasBOM = BomData.some((obj) => obj.AssyCust_PartId === selectedPartId)
      ? 1
      : 0;
    setHasBOM(hasBOM);

    // Get the MagodCode for the selected part ID
    const selectedMagodCode = BomData.find(
      (obj) => obj.AssyCust_PartId === selectedPartId
    )?.Magod;
  };
  // Map BomData to options with labels
  const options = BomData?.map((item) => {
    return {
      label: item.AssyCust_PartId || "",
      magodCode: item.MagodCode || "",
    };
  }).filter((option) => option.label !== "");

  //SURESH SIR CODE REALATED TO DXF
  function arrayBufferToString(buffer, encoding, callback) {
    var blob = new Blob([buffer], { type: "text/plain" });
    var reader = new FileReader();
    reader.onload = function (evt) {
      callback(evt.target.result);
    };
    reader.readAsText(blob, encoding);
  }

  async function dxfupload(files, destPath, response) {
    const data = new FormData();
    // console.log(files.length);
    for (let i = 0; i < files.length; i++) {
      data.append("files", files[i]);
    }
    // let API = process.env.REACT_APP_API_KEY;
    // let API = "http://localhost:6001";
    let API = "http://localhost:4011";

    const rawResponse = await fetch(`${API}/file/uploaddxf`, {
      method: "POST",
      headers: {
        Accept: "multipart/form-data",
        destinationPath: destPath,
        // 'Content-Type': 'multipart/form-data'
      },
      body: data,
    });
    const content = await rawResponse.json();
    response(content);
  }

  async function copydxf(files, destPath, response) {
    // console.log("DXF Copy files path : " + destPath);
    const data = new FormData();
    //   console.log(files);
    for (let i = 0; i < files.length; i++) {
      data.append("files", files[i]);
    }

    let API = process.env.REACT_APP_API_KEY;
    const rawResponse = await fetch(`${API}/file/copydxf`, {
      method: "POST",
      headers: {
        Accept: "multipart/form-data",
        destinationPath: destPath,
        // 'Content-Type': 'multipart/form-data'
      },
      body: data,
    });
    const content = await rawResponse.json();
    response(content);
  }

  const drawSvg = (text) => {
    // console.log(text);
    setDxfFileData(text);
    //   console.log(String(text));
    const helper = new Helper(text);
    let svg = helper.toSVG();
    let svgContainer = document.getElementById("dxf-content-container");
    svgContainer.innerHTML = svg;
  };

  let displaydrawing = (file) => {
    let reader = new FileReader();
    reader.onload = function (event) {
      let text = event.target.result;
      drawSvg(text);
    };
    //  reader.readAsText(file.asInstanceOf[Blob]);
    reader.readAsText(file);
  };
  const [svgContent, setSvgContent] = useState(null);

  const ShowDfxForm = async () => {
    if (!window.dxffile) {
      return alert("No DXF file selected");
    }

    try {
      // Step 1: Check if the service is running
      // const statusRequest = await fetch('http://127.0.0.1:21341/status', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      // });

      // const statusResponse = await statusRequest.json();

      // // Step 2: Check service status
      // if (statusResponse.status === 'Service is running') {
      // Call service to send the file
      let launchservice = await filetoService(window.dxffile);

      // If service responds successfully, load the DXF file
      if (launchservice.status === 200) {
        let svgContainer = document.getElementById("dxf-content-container");

        // Step 3: Fetch the processed file (assuming it returns as SVG or DXF data)
        const fileRequest = await fetch("http://127.0.0.1:21341/showdxf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: window.dxffile.name, // Make sure this is the right filename
          }),
        });

        const fileResponse = await fileRequest.json(); // Assuming the response is in JSON format

        // Step 4: Set the SVG content into the state
        // if (fileResponse && fileResponse.svgContent) {
        //   setSvgContent(fileResponse.svgContent); // Store the SVG data in the component state
        // } else {
        //   console.error("No SVG content received");
        // }
      }
      // } else {
      //   alert("Service is not running. Please start the service.");
      // }
    } catch (error) {
      // console.error("Error:", error);
      //alert("Failed to connect to the DXF service. Please ensure the service is running.");
    }
  };

  let [selectedDwg, setSelectedDwg] = useState("");
  // let [dwgopen, setDwgOpen] = useState(false);
  const funcEditDXF = async () => {
    // if (dwgopen) {
    //   setDwgOpen(false);
    //   return alert("Selected DXF File is kept Open below");
    // }
    if (selectedDwg !== "" || selectedDwg != null) {
      // console.log(selectedDwg);
      let srcpath = `\\Wo\\` + OrderNo + "\\DXF";
      postRequest(endpoints.getOrdDxf, { selectedDwg, srcpath }, (respfile) => {
        console.log("respfile : ", respfile);
        filetoService(window.respfile);
        //   setDwgOpen(true);
      });
    }
    // }
    // if (!window.dxffile) return alert("No DXF file selected");
    // if (selectedDwg === window.dxffile.name) {
    //   return alert("Selected DXF File is kept Open below");
    // }
    if (!window.dxffile) return alert("No DXF file selected");
    try {
      const request = await fetch("http://127.0.0.1:21341/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      if (response.status == "Service is running") {
        let launchservice = await filetoService(window.dxffile);
        setSelectedDwg(window.dxffile.name);
        // console.log(launchservice);
        if (launchservice.status === 200) {
          if (window.confirm("Click OK to Load the edited file.")) {
            const readreq = await fetch("http://127.0.0.1:21341/getFile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filename: window.dxffile.name,
              }),
            });
            const readres = await readreq.json();
            if (readres.status === "File retrived") {
              arrayBufferToString(
                new Uint8Array(readres.data.data),
                "UTF-8",
                async (filecontentdata) => {
                  drawSvg(filecontentdata);
                  let newdxf = new File(
                    [filecontentdata],
                    window.dxffile.name,
                    { type: "text/plain" }
                  );
                  // console.log(newdxf);
                  window.dxffile = newdxf;

                  // let qno = quotationNo.replaceAll("/", "_");
                  // let month = qno.split("_")[1]
                  // let monthName = ["January", "Febraury", "March", "April", "May", "June",
                  //   "July", "August", "September", "October", "November", "December"][parseInt(month) - 1]

                  let destPath = `\\Wo\\` + OrderNo + "\\DXF";
                  await dxfupload([newdxf], destPath, (res) => {
                    if (res.status === "success") {
                      alert("DXF file updated successfully");
                      
                      // toast.success("DXF file updated successfully");
                    }
                  });
                  
                }
              );
            }
          }
        }
        // console.log(launchservice);
      }
    } catch (error) {
      // console.log(error);
      if (
        window.confirm(
          "LazerCADService is not installed / running. Do you want to Download the installer ?"
        )
      ) {
        let dwl = document.createElement("a");
        dwl.href = require("./../../../../../../../lib/LazerCADServiceInstaller.exe");
        // dwl.href = require("../../../../../../../../src/lib/LazerCADServiceInstaller.exe");
        //    "../../../../../../lib/LazerCADServiceInstaller.exe");
        //  dwl.href = require("../../../../../../lib/LazerCADServiceInstaller.exe");
        dwl.download = "LazerCADServiceInstaller.exe";
        dwl.click();
      } else {
        toast.warning(
          "LazerCADService is not installed / running. Please install it first."
        );
      }
    }
  };

  const filetoService = async (file) => {
    // console.log("1234", file,file.name,selectedItems,dxfmaterial);
    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("material", selectedItems[0].material);
    formData.append("process", selectedItems[0].Operation);
    formData.append("source", "Customer");
    formData.append("qty", quantity);
    // console.log(formData);
    const res = await fetch("http://127.0.0.1:21341/editdxf", {
      method: "POST",
      body: formData,
    });
    return res;
  };

  useEffect(() => {
    console.log("gradeid useeffect---", gradeid);
    setGradeID(gradeid);
  }, [gradeid]);

  // Insert order details flag 1,2,3
  const PostOrderDetails = async (flag, imprtDwgObj) => {
    console.log("entering post order details");

    console.log("OrderDetails.jsx - imprtDwgObj ", imprtDwgObj);
    // setisLoading(true);
    let requestData = {};

    const isValidForFlag1 = () => {
      if (requestData.DwgName === "") {
        toast.error("DwgName is mandatory");
        return false;
      }
      if (requestData.strmtrlcode === "") {
        toast.error("Material is mandatory");
        return false;
      }
      if (LastSlctedRow?.Mtrl_Code === "") {
        toast.error("Material is mandatory");
        return false;
      }
      if (requestData.Operation === "") {
        toast.error("Operation is mandatory");
        return false;
      }
      if (requestData.NewSrlFormData.MtrlSrc === "") {
        toast.error("Material source is mandatory");
        return false;
      }

      if (quantity === 0 || isNaN(quantity) || quantity === "0") {
        toast.error("Quantity should be greater than 0");
        return false;
      }
      // if (jwRate === 0 || isNaN(jwRate) || jwRate === "0") {
      //   toast.error("JWRate should be greater than 0");
      //   return false;
      // }

      if (
        (requestData.NewSrlFormData.MtrlSrc === "magod" &&
          materialRate === 0) ||
        isNaN(materialRate) ||
        materialRate === "0"
      ) {
        toast.error("MaterialRate should be greater than 0");
        return false;
      }
      setisLoading(true);
      setImportDwgShow(false);
      return true;
    };
    const isValidForFlag3 = () => {
      setisLoading(true);
      return true;
    };
    if (flag === 1) {
      requestData = {
        flag: flag,
        OrderNo: OrderNo,
        newOrderSrl: newOrderSrl,
        custcode: Cust_Code,
        DwgName: newSerial.DwgName,
        Dwg_Code: "",
        dwg: Dwg,
        HasBOM: HasBOM,
        Qty_Ordered: quantity,
        JwCost: jwRate,
        mtrlcost: materialRate,
        // UnitPrice: unitPrice,
        UnitPrice: parseFloat(jwRate) + parseFloat(materialRate),
        strmtrlcode: strmtrlcode,
        material: materia,
        Operation: Operation,
        NewSrlFormData: NewSrlFormData,
        tolerance: "Standard(+/-0.1mm)- 100 Microns",
      };

      // Only run validation for flag 1
      if (!isValidForFlag1()) {
        setisLoading(false);
        return;
      }
    }
    //Suresh sir - 20/01/2025
    else if (flag === 2) {
      let thickness;
      let material;
      let grade;
      let gradeIdd;
      let specificwt;
      console.log(" entring into the flag 2");

      
      let impDwgFileData = [];
      let dwgnamefiles = imprtDwgObj.dgfiles.files;
      console.log("strmtrlcode===4", imprtDwgObj.strmtrlcode);

      await postRequest(
        endpoints.getmtrldetsbymtrlcode,
        { MtrlCode: imprtDwgObj.strmtrlcode },
        async (mtrldata1) => {
          if (mtrldata1.length > 0) {
            console.log("1175  - MtrlData : ", mtrldata1);
            setThickness(mtrldata1[0]["Thickness"]);
            setGradeID(mtrldata1[0]["MtrlGradeID"]);

            setMaterial(mtrldata1[0]["Mtrl_Type"]);
            setGrade(mtrldata1[0]["Grade"]);
            setSpecificWt(mtrldata1[0]["Specific_Wt"]);
            material = mtrldata1[0]["Mtrl_Type"];
            grade = mtrldata1[0]["Grade"];
            gradeIdd = mtrldata1[0]["MtrlGradeID"];
            console.log("===thickeness", mtrldata1[0]["Thickness"]);

            thickness = mtrldata1[0]["Thickness"];
            specificwt = mtrldata1[0]["Specific_Wt"];

            let thck = mtrldata1[0]["Thickness"];
            let spwt = mtrldata1[0]["Specific_Wt"];
          }
        }
      );
      console.log("gradeid----", gradeid);
      console.log("gradeIdd----", gradeIdd);

      for (let i = 0; i < dwgnamefiles.length; i++) {
        // console.log("FileName : " + dwgnamefiles[i].name);
      }
      let destPath = ``;
      destPath = `\\Wo\\` + OrderNo + "\\DXF\\";

      await dxfupload(dwgnamefiles, destPath, (res) => {
        // console.log(res);
      });
      // CHECKING 24032025
      for (let i = 0; i < dwgnamefiles.length; i++) {
        console.log(
          "material, grade, thickness ",
          material + " " + grade + " " + thickness
        );

        await locCalc(dwgnamefiles[i], material, grade, thickness, (output) => {
          impDwgFileData = [
            ...impDwgFileData,
            {
              files: dwgnamefiles[i],
              lengthOfCut: output.lengthOfCut,
              noOfPierces: output.noOfPierces,
              file: dwgnamefiles[i].name,
              jwcost:
                output.lengthOfCut * imprtDwgObj.dblCuttingRate +
                output.noOfPierces * imprtDwgObj.dblPierceRate,
              mtrlcost: 0,
              unitPrice:
                output.lengthOfCut * imprtDwgObj.dblCuttingRate +
                output.noOfPierces * imprtDwgObj.dblPierceRate,
              total:
                (output.lengthOfCut * imprtDwgObj.dblCuttingRate +
                  output.noOfPierces * imprtDwgObj.dblPierceRate) *
                imprtDwgObj.quantity,
            },
          ];
        });

        window.dxffiles = dwgnamefiles[i];

        await postRequest(
          endpoints.dxfCopy,
          { Dwg: dwgnamefiles[i].name, destPath: destPath },
          (res) => {
            // console.log(res);
          }
        );
        //        copydxf(dwgnamefiles, destPath, (res) => { });
      }
      // console.log("impDwgFileData", impDwgFileData);
      requestData = {
        flag: flag,
        imprtDwgData: {
          OrderNo: OrderNo,
          newOrderSrl: newOrderSrl,
          custcode: Cust_Code,
          dwg: imprtDwgObj.Dwg,
          Qty_Ordered: imprtDwgObj.quantity,
          JwCost: imprtDwgObj.jwRate,
          mtrlcost: imprtDwgObj.materialRate,
          strmtrlcode: imprtDwgObj.strmtrlcode,
          material: material,
          // mtrl: gradeid,
          mtrl: gradeIdd,
          Delivery_Date: Delivery_Date,
          //  Operation: Operation,
          Operation: imprtDwgObj.stroperation,
          Thickness: thickness,
          NewSrlFormData: NewSrlFormData,
          tolerance: imprtDwgObj.strtolerance,
          insplevel: imprtDwgObj.InspLvl, // .insplevel,
          packinglevel: imprtDwgObj.PkngLvl, // .packinglevel,
          impDwgFileData: impDwgFileData,
        },
      };
      console.log("requestData---", requestData);
    } else if (flag === 3) {
      // setHasBOM(1);
      // setisLoading(true);
      requestData = {
        flag: flag,
        OrderNo: OrderNo,
        newOrderSrl: newOrderSrl,
        custcode: Cust_Code,
        DwgName: selectedPartId[0].label,
        Dwg_Code: magodCode,
        dwg: Dwg,
        tolerance: "Standard(+/-0.1mm)- 100 Microns",
        HasBOM: HasBOM,
        Qty_Ordered: 1,
        JwCost: BomArry[0]?.JobWorkCost,
        mtrlcost: BomArry[0]?.MtrlCost,
        UnitPrice: parseFloat(jwRate) + parseFloat(materialRate),
        strmtrlcode: BomArry[0]?.Material,
        material: materia,
        // material: BomArry[0]?.Material,
        // Operation: Operation,
        Operation: BomArry[0]?.Operation,
        insplevel: "Insp1",
        packinglevel: "Pkng1",
        delivery_date: "",
        NewSrlFormData: NewSrlFormData,
      };
      // Only run validation for flag 3
      if (!isValidForFlag3()) {
        setisLoading(false);
        return;
      }
    } else {
    }

    // console.log("===requestData", requestData);
    postRequest(
      endpoints.InsertNewSrlData,

      { requestData: requestData },
      (InsertedNewSrlData) => {
        if (InsertedNewSrlData.affectedRows != 0) {
          setisLoading(false);
          // toast.success("Added serial successfully");
          alert("Added serial successfully");

          setSelectedPartId([]);
          //   handleCloseImportDwg;
          setHasBOM(0);
          // setBomArry([]);
          fetchData();
          handleCloseImportDwg();
          setImportDwgShow(false);
          setImportDwgmdlShow(false);
        } else {
          // setisLoading(false);
          toast.warning("Serial not added");
          handleCloseImportDwg();
        }
      }
    );
  };

  const PostSrlData = () => {};
  console.log("PostSrlData - material : ", materia);
  //SURESH SIR CODE REALATED TO DXF
  let locCalc = async (drwfile, material, grade, thickness, cb) => {
    // console.log("123",drwfile, material, grade, thickness, cb);

    const formData = new FormData();
    // console.log("formData",formData);

    //  window.dxffiles.forEach(async (dfile) => {
    formData.append("file", drwfile); //files[i]);
    formData.append("thickness", thickness);
    formData.append("specficWeight", specificw); // resp[0].Specific_Wt);

    console.log("Sending to Service");
    // const getCalcReq = await fetch('http://127.0.0.1:21341/getCalc', {
    const getCalcReq = await fetch("http://localhost:21341/getCalc", {
      //const getCalcReq = await fetch(process.env.GETCALC_API, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    console.log("getCalcReq", getCalcReq);

    const res = await getCalcReq.json();
    setLengthOfCut(res.data.lengthOfCut);
    setNoofPierces(res.data.noOfPierces);

    // console.log("Length of Cut 1: ", res.data.lengthOfCut);
    // console.log("No of Pierces 2 : ", res.data.noOfPierces);

    cb({
      lengthOfCut: res.data.lengthOfCut,
      noOfPierces: res.data.noOfPierces,
    });
  };

  //24-03-2025
  // const PostSrlData = () => { };

  // SURESH SIR CODE RELATED TO DXF
  // const locCalc = async (drwfile, material, grade, thickness, specificwt, cb) => {
  //   const formData = new FormData();
  //   formData.append("file", drwfile);
  //   formData.append("thickness", thickness);
  //   formData.append("specificWeight", specificwt);

  //   console.log("Sending to Service");

  //   let response;
  //   for (let attempt = 0; attempt < 3; attempt++) {
  //     alert("2403entering to the http://localhost:21341/getCalc")
  //     try {
  //       const getCalcReq = await fetch("http://localhost:21341/getCalc", {
  //         method: "POST",
  //         headers: {
  //           Accept: "application/json",
  //         },
  //         body: formData,
  //       });
  //       console.log("2403getCalcReq", getCalcReq);

  //       if (!getCalcReq.ok) throw new Error(`HTTP error! status: ${getCalcReq.status}`);

  //       response = await getCalcReq.json();
  //       console.log("2403response", response);

  //       break; // Exit loop if successful
  //     } catch (err) {
  //       console.log("2403err");

  //       if (attempt === 2) throw err;
  //       await new Promise(resolve => setTimeout(resolve, 1000)); // Retry after delay
  //     }
  //   }

  //   cb({
  //     lengthOfCut: response.data.lengthOfCut,
  //     noOfPierces: response.data.noOfPierces,
  //   });
  // };

  // const locCalc = async (drwfile, material, grade, thickness, specificwt, cb) => {
  //   console.log("123", drwfile, material, grade, thickness, specificwt, cb);

  //   const formData = new FormData();
  //   formData.append("file", drwfile);
  //   formData.append("thickness", thickness);
  //   formData.append("specificWeight", specificwt);

  //   console.log("Sending to Service");

  //   let response;
  //   const TIMEOUT = 5000; // 5 seconds timeout

  //   for (let attempt = 0; attempt < 3; attempt++) {
  //     alert("2403 entering http://localhost:21341/getCalc, attempt: " + (attempt + 1));
  //     console.log("form data:::", formData);

  //     const controller = new AbortController(); // Create an AbortController instance
  //     const timeoutId = setTimeout(() => controller.abort(), TIMEOUT); // Set timeout to abort request

  //     try {
  //       const getCalcReq = await fetch("http://localhost:21341/getCalc", {
  //         method: "POST",
  //         headers: { Accept: "application/json" },
  //         body: formData,
  //         signal: controller.signal, // Attach abort signal
  //       });

  //       clearTimeout(timeoutId); // Clear timeout if request completes successfully

  //       console.log("2403 getCalcReq", getCalcReq);
  //       if (!getCalcReq.ok) throw new Error(`HTTP error! status: ${getCalcReq.status}`);

  //       response = await getCalcReq.json();
  //       console.log("2403 response", response);

  //       break; // Exit loop if successful
  //     } catch (err) {
  //       console.log("2403 Error", err.message);
  //       if (attempt === 2) throw err; // Throw error if all attempts fail
  //     }

  //     await new Promise(resolve => setTimeout(resolve, 500)); // Short delay before retry
  //   }

  //   cb({
  //     lengthOfCut: response?.data?.lengthOfCut || 0,
  //     noOfPierces: response?.data?.noOfPierces || 0,
  //   });
  // };

  // Drawing/Part Name	Material	Operation	Source	Insp Level	Tolerance	Packing Level	LOC	Pierces	JW Cost	Mtrl Cost	Unit Rate	Qty Ordered	Total
  const PrintXLOrderTable = () => {
    // console.log("filteredData", filteredData);
    if (filteredData.length > 0) {
      // console.log("filteredData", filteredData);
      const columns = [
        "DwgName",
        "Mtrl_Code",
        "Operation",
        "Mtrl_Source",
        "InspLevel",
        "tolerance",
        "PackingLevel",
        "LOC",
        "Holes",
        "JWCost",
        "MtrlCost",
        "UnitPrice",
        "Qty_Ordered",
        "Total",
      ];
      let fileName =
        "OrderTable_" +
        filteredData[0].Order_No +
        "_" +
        moment(new Date()).format("DDMMYYYY");
      exportToExcel(filteredData, columns, fileName);
    }
  };

  const exportToExcel = (data, columns, filName) => {
    const processedData = preprocessedData(data);
    const filtereddata = processedData.map((row) => {
      const filteredRow = {};
      columns.forEach((column) => {
        if (row.hasOwnProperty(column)) {
          filteredRow[column] = row[column];
        }
      });
      return filteredRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(filtereddata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filName}.xlsx`);
  };

  const preprocessedData = (data) => {
    return data.map((row) => ({
      ...row,
      Total: parseFloat(row["UnitPrice"] * row["Qty_Ordered"]).toFixed(2),
    }));
  };

  return (
    <>
      <ConfirmationModal
        confirmModalOpen={ConfirmationModalOpen}
        setConfirmModalOpen={setConfirmationModalOpen}
        yesClickedFunc={deleteRowsByOrderNoFunc}
        message={
          "There are other serials in this order, \n You must delete them to copy the old order, \n Delete Now?"
        }
      />

      <ImportDwgModal
        importdwgmdlshow={importdwgmdlshow}
        setImportDwgmdlShow={setImportDwgmdlShow}
        handleImportDwgmdl={handleImportDwgmdl}
        handleCloseImportDwgmdl={handleCloseImportDwgmdl}
        mtrldata={mtrldata}
        selectMtrl={selectMtrl}
        strmtrlcode={strmtrlcode}
        procdata={procdata}
        selectProc={selectProc}
        selectMtrlSrc={selectMtrlSrc}
        tolerancedata={tolerancedata}
        selectTolerance={selectTolerance}
        inspdata={inspdata}
        selectInsp={selectInsp}
        packdata={packdata}
        selectPack={selectPack}
        InputField={InputField}
        quantity={quantity}
        setQuantity={setQuantity}
        jwRate={jwRate}
        setJwRate={setJwRate}
        materialRate={materialRate}
        setMaterialRate={setMaterialRate}
        unitPrice={unitPrice}
        setUnitPrice={setUnitPrice}
        DwgName={DwgName}
        handleDwgInputChange={handleDwgInputChange}
        PostSrlData={PostSrlData}
        selectedItems={selectedItems}
        selectItem={selectItem}
        handleMtrlCodeTypeaheadChange={handleMtrlCodeTypeaheadChange}
        PostOrderDetails={PostOrderDetails}
        // ----NEW------
        imprtDwgObj={imprtDwgObj}
        setImprtDwgObj={setImprtDwgObj}
        handleChange={handleChange}
        selectedRowItem={selectedRowItem}
      />
      <ImportOldOrderModal
        importOldOrdrMdl={importOldOrdrMdl}
        setImportOldOrdrMdl={setImportOldOrdrMdl}
        //
        oldOrderListData={props.oldOrderListData}
        oldOrderDetailsData={props.oldOrderDetailsData}
        OrderData={props.OrderData}
        // table data
        OrdrDetailsData={props.OrdrDetailsData}
        setOrdrDetailsData={props.setOrdrDetailsData}
        // handleImportOldOrdrMdl={handleImportOldOrdrMdl}
        // handleCloseImportOldOrdrMdl={handleCloseImportOldOrdrMdl}
        fetchData={fetchData}
      />
      <ImportQtnModal
        importQtnMdl={importQtnMdl}
        setImportQtnMdl={setImportQtnMdl}
        OrderData={props.OrderData}
        // table data
        OrdrDetailsData={props.OrdrDetailsData}
        setOrdrDetailsData={props.setOrdrDetailsData}
        // handleImportQtnMdl={handleImportQtnMdl}
        // handleCloseImportQtnMdl={handleCloseImportQtnMdl}
        fetchData={fetchData}
      />

      <ImportExcelModal
        setImportExcelModal={setImportExcelModal}
        importExcelModal={importExcelModal}
        OrderData={OrderData}
        mtrldata={mtrldata}
        procdata={procdata}
        OrdrDetailsData={OrdrDetailsData}
        setOrdrDetailsData={setOrdrDetailsData}
        fetchData={fetchData}
      />
      <BulkChangeModal
        bulkChnangMdl={bulkChnangMdl}
        setBulkChnangMdl={setBulkChnangMdl}
        handlebulkChnangMdl={handlebulkChnangMdl}
        handleClosesetBulkChnangMdl={handleClosesetBulkChnangMdl}
        OrderData={OrderData}
        OrderCustData={OrderCustData}
        OrdrDetailsData={OrdrDetailsData}
        importdwgshow={importdwgshow}
        setImportDwgShow={setImportDwgShow}
        handleImportDwg={handleImportDwg}
        handleCloseImportDwg={handleCloseImportDwg}
        mtrldata={mtrldata}
        selectMtrl={selectMtrl}
        strmtrlcode={strmtrlcode}
        procdata={procdata}
        selectProc={selectProc}
        selectMtrlSrc={selectMtrlSrc}
        tolerancedata={tolerancedata}
        selectTolerance={selectTolerance}
        inspdata={inspdata}
        selectInsp={selectInsp}
        packdata={packdata}
        selectPack={selectPack}
        InputField={InputField}
        quantity={quantity}
        setQuantity={setQuantity}
        jwRate={jwRate}
        setJwRate={setJwRate}
        materialRate={materialRate}
        setMaterialRate={setMaterialRate}
        unitPrice={unitPrice}
        setUnitPrice={setUnitPrice}
        DwgName={DwgName}
        handleDwgInputChange={handleDwgInputChange}
        PostSrlData={PostSrlData}
        insertnewsrldata={insertnewsrldata}
        handleMtrlCodeTypeaheadChange={handleMtrlCodeTypeaheadChange}
        PostOrderDetails={PostOrderDetails}
        BomData={BomData}
        setBomData={setBomData}
        handleSelectChange={handleSelectChange}
        selectedPartId={selectedPartId}
        setSelectedPartId={setSelectedPartId}
        options={options}
        BomArry={BomArry}
        setBomArry={setBomArry}
        HasBOM={HasBOM}
        setHasBOM={setHasBOM}
        LastSlctedRow={LastSlctedRow}
        setLastSlctedRow={setLastSlctedRow}
        selectedItems={selectedItems}
        handleblkCngCheckBox={handleblkCngCheckBox}
        blkCngCheckBox={blkCngCheckBox}
        setBlkCngCheckBox={setBlkCngCheckBox}
        //---NEW

        blkChange={blkChange}
        setBlkChange={setBlkChange}
        imprtDwgObj={imprtDwgObj}
        setImprtDwgObj={setImprtDwgObj}
        handleChange={handleChange}
        updateblkcngOrdrData={updateblkcngOrdrData}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
      />
      <div>
        <div className="row justify-content-left">
          <div className="col-md-12">
            {props.OrderData?.Type === "Profile" ? (
              <button
                className="button-style"
                onClick={() => handleImportDwgmdl()}
                disabled={
                  props.OrderData?.Order_Status === "Processing"
                  // props.OrderData?.Order_Status === "Recorded"
                }
              >
                Import Dwg
              </button>
            ) : null}
            <button
              className="button-style"
              disabled={
                props.OrderData?.Order_Status === "Processing" ||
                props.OrderData?.Order_Status === "Recorded"
              }
              onClick={(e) => {
                setButtonClicked("Import From Excel");
                handleImportFromExcelModal();
              }}
            >
              Import Excel
            </button>
            <button
              className="button-style"
              disabled={
                props.OrderData?.Order_Status === "Processing" ||
                props.OrderData?.Order_Status === "Recorded"
              }
              onClick={(e) => {
                setButtonClicked("Import Qtn");
                handleImportQtnMdl();
              }}
            >
              Import Qtn
            </button>
            <button
              className="button-style"
              disabled={
                props.OrderData?.Order_Status === "Processing" ||
                props.OrderData?.Order_Status === "Recorded"
              }
              onClick={(e) => {
                setButtonClicked("Import Old Order");
                handleImportOldOrdrMdl();
              }}
            >
              Import Old Order
            </button>
            <button
              className="button-style"
              disabled={
                props.OrderData?.Order_Status === "Processing" ||
                props.OrderData?.Order_Status === "Recorded"
              }
              onClick={deleteRowsBySrl}
            >
              Delete
            </button>

            <button
              className="button-style"
              onClick={handlebulkChnangMdl}
              disabled={
                OrderData?.Order_Status === "Processing"
                // ||
                // OrderData?.Order_Type === "Complete" ||
                // OrderData?.Order_Type === "Scheduled"
              }
            >
              Bulk Change
            </button>

            <button
              className="button-style"
              onClick={handleSelectAll}
              disabled={props.OrderData?.Order_Status === "Processing"}
            >
              Select All
            </button>
            <button
              className="button-style"
              onClick={handleReverseSelection}
              disabled={props.OrderData?.Order_Status === "Processing"}
            >
              Reverse
            </button>

            {Type === "Profile" ? (
              <button className="button-style" onClick={funcEditDXF}>
                Edit DXF
              </button>
            ) : null}
            <button className="button-style" onClick={PrintXLOrderTable}>
              To Excel
            </button>
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-md-6">
            <OrdrTable
              OrderData={OrderData}
              OrderCustData={OrderCustData}
              OrdrDetailsData={OrdrDetailsData}
              selectedItems={selectedItems}
              selectItem={selectItem}
              setDetailsColour={setDetailsColour}
              calculateMinSrlStatus={calculateMinSrlStatus}
              updateOrderStatus={updateOrderStatus}
              getStatusText={getStatusText}
              scheduleType={scheduleType}
              scheduleOption={scheduleOption}
              handleSelectAll={handleSelectAll}
              handleReverseSelection={handleReverseSelection}
              filteredData={filteredData}
              setFilteredData={setFilteredData}
              imprtDwgObj={imprtDwgObj}
              newSerial={newSerial}
              setNewSerial={setNewSerial}
              ordrDetailsChange={ordrDetailsChange}
              setordrDetailsChange={setordrDetailsChange}
              handleJWMR={handleJWMR}
              handleRowClick={handleRowClick}
              handleCheckboxChange={handleCheckboxChange}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              setSelectedRowItems={setSelectedRowItems}
              selectedRowItems={selectedRowItems}
              Operation={Operation}
              setOperation={setOperation}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              sortedData={sortedData}
              LastSlctedRow={LastSlctedRow}
              // handle arrow keys
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              goToFirst={goToFirst}
              goToPrevious={goToPrevious}
              goToNext={goToNext}
              goToLast={goToLast}
            />
          </div>
          <div className="col-md-6">
            <Tabs className="nav-tabs tab_font">
              {props.OrderData?.Type === "Profile" ? (
                <Tab eventKey="drawing" title="Drawing">
                  <div style={{}}>
                    {LastSlctedRow !== null && LastSlctedRow !== undefined ? (
                      <table
                        style={{
                          backgroundColor: "#f0f0f7", //#5aa8e0",
                          width: "100%",
                          padding: "10px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        <tr>
                          <td colspan="2">
                            <label>
                              <h6>
                                Drawing :{" "}
                                {LastSlctedRow.DwgName ?? "No Drawing"}
                              </h6>
                            </label>
                          </td>
                          <td colspan="2Combined Schedule Creator">
                            <label>
                              <h6>Process: {LastSlctedRow.Operation}</h6>
                            </label>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "40%" }}>
                            <label>
                              <h6>Mtrl Grade : {LastSlctedRow.Mtrl_Code}</h6>
                            </label>
                          </td>
                          <td style={{ width: "25%" }}>
                            <label>
                              <h6>Mtrl Source : {LastSlctedRow.Mtrl_Source}</h6>
                            </label>
                          </td>
                          <td style={{ width: "20%" }}>
                            <label>
                              <h6>Quantity : {LastSlctedRow.Qty_Ordered}</h6>
                            </label>
                          </td>
                          <td style={{ width: "24%" }}>
                            <button
                              className="button-style"
                              onClick={ShowDfxForm}
                            >
                              Go to DxfView
                            </button>
                          </td>
                        </tr>
                      </table>
                    ) : (
                      ""
                    )}
                    <div
                      id="dxf-content-container"
                      className="dxf-content-container"
                    ></div>
                    {/* </iframe> */}
                  </div>
                  {/* <button className="button-style" onClick={ShowDfxForm}>
                    Go to DxfView
                  </button> */}
                  {/* <div
                    id="dxf-content-container"
                    className="dxf-content-container"
                  > */}
                  {/* <iframe
                      src="http://localhost:5000" // URL of the VB.NET app
                      title="VBScript Frame"
                      style={{ width: '50%', height: '300px' }}
                    /> */}

                  {/* {svgContent ? (
                      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
                    ) : (
                      <p>No file loaded yet.</p>
                    )} */}
                  {/* </div> */}
                  {/* <Drawings /> */}
                </Tab>
              ) : null}
              <Tab eventKey="orderDetailsForm" title="Order Details">
                <OrdrDtls
                  key={refreshKey}
                  OrderData={OrderData}
                  OrderCustData={OrderCustData}
                  OrdrDetailsData={OrdrDetailsData}
                  mtrldata={mtrldata}
                  selectMtrl={selectMtrl}
                  strmtrlcode={strmtrlcode}
                  procdata={procdata}
                  selectProc={selectProc}
                  selectMtrlSrc={selectMtrlSrc}
                  tolerancedata={tolerancedata}
                  selectTolerance={selectTolerance}
                  inspdata={inspdata}
                  selectInsp={selectInsp}
                  packdata={packdata}
                  selectPack={selectPack}
                  InputField={InputField}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  jwRate={jwRate}
                  setJwRate={setJwRate}
                  materialRate={materialRate}
                  setMaterialRate={setMaterialRate}
                  unitPrice={unitPrice}
                  setUnitPrice={setUnitPrice}
                  DwgName={DwgName}
                  handleDwgInputChange={handleDwgInputChange}
                  PostSrlData={PostSrlData}
                  selectedRowItem={selectedRowItem}
                  selectedItems={selectedItems}
                  selectItem={selectItem}
                  insertnewsrldata={insertnewsrldata}
                  importdwgshow={importdwgshow}
                  setImportDwgShow={setImportDwgShow}
                  handleImportDwg={handleImportDwg}
                  handleCloseImportDwg={handleCloseImportDwg}
                  handleMtrlCodeTypeaheadChange={handleMtrlCodeTypeaheadChange}
                  BomData={BomData}
                  setBomData={setBomData}
                  PostOrderDetails={PostOrderDetails}
                  handleSelectChange={handleSelectChange}
                  selectedPartId={selectedPartId}
                  setSelectedPartId={setSelectedPartId}
                  options={options}
                  BomArry={BomArry}
                  setBomArry={setBomArry}
                  HasBOM={HasBOM}
                  setHasBOM={setHasBOM}
                  LastSlctedRow={LastSlctedRow}
                  setLastSlctedRow={setLastSlctedRow}
                  //----
                  newSerial={newSerial}
                  setNewSerial={setNewSerial}
                  ordrDetailsChange={ordrDetailsChange}
                  setordrDetailsChange={setordrDetailsChange}
                  handleChange={handleChange}
                  isLoading={isLoading}
                  handleInputChange={handleInputChange}
                  handleMtrlCodeTypeaheadChangeeee={
                    handleMtrlCodeTypeaheadChangeeee
                  }
                  magodCode={magodCode}
                  NewSrlFormData={NewSrlFormData}
                  // key={refresh}
                  deleteRowsBySrl={deleteRowsBySrl}
                  selectedRow={selectedRow}
                  OdrDtlMtrlSrc={OdrDtlMtrlSrc}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
