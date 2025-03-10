import React, { useEffect, useState } from "react";
import { useOrderContext } from "../../../../../../../context/OrderContext";
import OrdrTable from "./Table/OrdrTable";
import Drawings from "./Tabs/Drawings";
import OrdrDtls from "./Tabs/OrdrDtls";
import { Tab, Tabs } from "react-bootstrap";
import ImportDwgModal from "./Modals/ImportDwgModal";
import ImportOldOrderModal from "./Modals/ImportOldOrderModal";
import ImportQtnModal from "./Modals/ImportQtnModal/ImportQtnModal";
import { toast } from "react-toastify";
import ImportExcelModal from "./Modals/ImportExcelModal/ImportExcelModal";
import BulkChangeModal from "./Modals/BulkChangeModal";
import ConfirmationModal from "../../../../Modal/ConfirmationModal";
// import { propTypes } from "react-bootstrap/esm/Image";
// import { Link, useNavigate } from "react-router-dom";
const {
  getRequest,
  postRequest,
} = require("../../../../../../api/apiinstance");
const { endpoints } = require("../../../../../../api/constants");

const InputField = ({
  label,
  id,
  value,
  onChangeCallback,
  required,
  disabled,
  style,
  className,
  onCheckboxChange,
  isChecked,
  checkboxIndex,
}) => {
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const isValidNumber =
      /^\d*\.?\d+$/.test(inputValue) && parseFloat(inputValue) >= 0;

    setIsValid(isValidNumber);
    onChangeCallback(inputValue);
  };

  return (
    <div className="md-col-4">
      <div className="row">
        <div className="col-md-9">
          <label className="form-label">{label}</label>
        </div>
        <div className="col-md-3 mt-3">
          {" "}
          <input
            type="checkbox"
            onChange={() => onCheckboxChange(checkboxIndex)}
            checked={isChecked}
          />
        </div>
      </div>

      <input
        type="text"
        id={id}
        value={value}
        onChange={handleInputChange}
        style={{ borderColor: isValid ? "initial" : "red" }}
        disabled={disabled}
        className={className}
      />
      {!isValid && (
        <p style={{ color: "red" }}>
          Please enter a valid positive number for {label}.
        </p>
      )}
    </div>
  );
};

export default function OrderDetails(props) {
  const {
    OrderData,
    OrderCustData,
    OrdrDetailsData,
    setOrdrDetailsData,
    selectItem,
    selectedItems,
    fetchData,
    BomData,
    setBomData,
    handleSelectAll,
    handleReverseSelection,
    LastSlctedRow,
    setLastSlctedRow,
    handleBulkCngBtn,
    selectedSrl,
  } = props;

  const [ConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  // import from excel
  const [importExcelModal, setImportExcelModal] = useState(false);
  // import qoutation
  const [importQtnMdl, setImportQtnMdl] = useState(false);

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

  let { orders, setOrderState } = useOrderContext() || {};
  let [custCode, setCustCode] = useState("");
  let [customername, setCustomer] = useState("");
  let [Orderno, setOrderno] = useState("");
  let [ordDwgtskDetsData, setOrdDwgTskDetsData] = useState([]);
  let [mtrldata, setMtrldata] = useState([]);
  let [procdata, setProcdata] = useState([]);
  let [inspdata, setInspdata] = useState([]);
  let [packdata, setPackdata] = useState([]);
  let [tolerancedata, setTolerancedata] = useState([]);
  let [salesExecdata, setSalesExecdata] = useState([]);

  // For Import Dwg
  let [strprocess, setStrProcess] = useState("");
  let [strmtrlcode, setStrMtrlCode] = useState("");
  let [strtolerance, setStrTolerance] = useState("");
  let [mtrlcode, setMtrlCode] = useState("");
  let [strMaterial, setStrMaterial] = useState("");
  let [strGrade, setStrGrade] = useState("");
  let [decThick, setDecThick] = useState(0);
  let [dblSpWt, setDblSpWt] = useState(0);
  let [dblCuttingRate, setDblCuttingRate] = useState(0);
  let [dblPierceRate, setDblPierceRate] = useState(0);
  let [strInsp, setStrInsp] = useState("");
  let [strPkng, setStrPkng] = useState("");
  let [strSource, setStrSource] = useState("");
  let [strMtrlGrade, setStrMtrlGrade] = useState("");
  let [Qty, setQty] = useState(0);
  let [FormOk, setFormOk] = useState(false);
  let [valOK, setValOK] = useState(false);
  let [TMd, setTMd] = useState([]);
  let [mtrl, setMtrl] = useState([]);
  let [bolMtrl, setBolMtrl] = useState(false);
  let [bolOperation, setBolOperation] = useState(false);
  let [bolSource, setBolSource] = useState(false);
  let [bolInsp, setBolInsp] = useState(false);
  let [bolPkng, setBolPkng] = useState(false);
  let [bolTolerance, setBolTolerance] = useState(false);
  let [bolQty, setBolQty] = useState(false);
  //-----
  let [thickness, setThickness] = useState("");
  let [specificwt, setSpecificWt] = useState(0);
  let [grade, setGrade] = useState("");
  let [material, setMaterial] = useState("");
  let [orderdetailsdata, setOrderDetailsData] = useState([]);

  let [recordedby, setRecordedby] = useState("");
  let [deliveryDate, setDeliveryDate] = useState("");
  let [gradeid, setGradeID] = useState("");

  const [DwgName, setDwgName] = useState("");
  // const [Material, setMaterial] = useState("");
  const [MtrlSrc, setMtrlSrc] = useState("");
  const [Operation, setOperation] = useState("");
  const [InspLvl, setInspLvl] = useState("");
  const [PkngLvl, setPkngLvl] = useState("");
  const [quantity, setQuantity] = useState("");
  const [jwRate, setJwRate] = useState("");
  const [materialRate, setMaterialRate] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [SerialData, setSerialData] = useState("");
  //////console.log("quantity", quantity);
  //////console.log("jwRate", jwRate);
  //////console.log("materialRate", materialRate);
  //////console.log("unitPrice", unitPrice);
  const [NewSrlFormData, setNewSrlFormData] = useState({
    DrawingName: "",
    Material: "",
    MtrlSrc: "",
    Operation: "",
    Quantity: quantity,
    JW_Rate: jwRate,
    Mtrl_Rate: materialRate,
    UnitPrice: unitPrice,
    // Quantity: 0,
    // JW_Rate: 0,
    // Mtrl_Rate: 0,
    // UnitPrice: 0,
    InspLvl: 0,
    PkngLvl: 0,
  });
  // setNewSrlFormData({
  //   ...NewSrlFormData,
  //   Quantity: quantity,
  //   JW_Rate: jwRate,
  //   Mtrl_Rate: materialRate,
  //   UnitPrice: unitPrice,
  // });

  const [SerailData, setSerailData] = useState([]);

  ////////console.log("SerailData", SerailData);
  // const [BomData, setBomData] = useState();
  const handleDwgInputChange = (event) => {
    // This function will be called whenever the input value changes
    const newValue = event.target.value;
    // Set the input value to the state
    setDwgName(newValue);
    // Add your logic here to handle the changed value
    //////console.log("dwg name:", newValue);

    setNewSrlFormData({
      ...NewSrlFormData,
      DrawingName: newValue,
    });
  };

  //////console.log("DrawingName", NewSrlFormData.DrawingName);

  // const selectMtrl = (selectedOptions) => {
  //   // This function will be called whenever the selection changes
  //   setMaterial(selectedOptions[0]?.Mtrl_Code);
  //   // Add your logic here to handle the changed selection
  //   ////////console.log("Selected Material:", selectedOptions[0]?.Mtrl_Code);
  // };
  // let selectMtrlSrc = async (e) => {
  //   e.preventDefault();
  //   ////////console.log("mtrl src", e.target.value);
  //   setMtrlSrc(e.target.value);
  // };
  let PostSrlData = () => {};

  useEffect(() => {
    fetchData();
  }, []);

  const [HasBOM, setHasBOM] = useState(0);
  const [Dwg, setDwg] = useState(0);
  //-------------------------------------------------------
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

  const handleblkCngCheckBox = (index) => {
    // Toggle the value when the checkbox changes
    const newCheckboxValues = [...blkCngCheckBox];
    newCheckboxValues[index] = !newCheckboxValues[index];
    setBlkCngCheckBox(newCheckboxValues);
    // Log the updated value to the //console
    //console.log("Checkbox is now:", newCheckboxValues);
  };
  // //console.log("blkCngCheckBox", blkCngCheckBox);

  let insertnewsrldata = () => {
    //////console.log("entering into insertnewsrldata");
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
        material: material,
        Operation: Operation,

        NewSrlFormData: NewSrlFormData,
      },
      (InsertedNewSrlData) => {
        ////console.log(" InsertedNewSrlDataRes", InsertedNewSrlData);
        if (InsertedNewSrlData.affectedRows != 0) {
          fetchData();
          toast.success("Added serial successfully");
          handleCloseImportDwg();
        } else {
          toast.warning("Serial not added check once");
          handleCloseImportDwg();
        }
      }
    );
  };

  let updateOrdrData = () => {
    postRequest(
      endpoints.bulkChangeUpdate,
      {
        OrderNo: OrderNo,
        custcode: Cust_Code,
        quantity: quantity,
        OrderSrl: selectedSrl,
        DwgName: blkChange.DwgName,
        quantity: blkChange.quantity,
        JwCost: blkChange.jwRate,
        mtrlcost: blkChange.materialRate,
        unitPrice: blkChange.unitPrice,
        Operation: blkChange.Operation,
        InspLvl: blkChange.InspLvl,
        PkngLvl: blkChange.PkngLvl,
        blkChange: blkChange,
        // blkCngCheckBox: blkCngCheckBox,
      },
      (blkChngData) => {
        console.log(" blkChngData", blkChngData);
        if (blkChngData.affectedRows != 0) {
          toast.success("Updated successfully");
          fetchData();
          handleClosesetBulkChnangMdl();
        } else {
          toast.warning("Serial not updated check once");
        }
      }
    );
  };
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
        //console.log(" blkChngData", blkChngData);
        if (singleChngData.affectedRows != 0) {
          toast.success("Updated successfully");
          fetchData();
        } else {
          toast.warning("Serial not updated check once");
        }
      }
    );
  };

  //////console.log("mtrldata", mtrldata);

  useEffect(() => {
    async function fetchData() {
      ////console.log("Cust_Code....", Cust_Code);
      postRequest(
        endpoints.getCustomerDets,
        { custcode: Cust_Code },
        (custdata) => {
          // setCustomer(custdata[0]["Cust_name"]);
          // setCustdata(custdata);
        }
      );
      // await postRequest(
      //   endpoints.PostNewSrlData,
      //   { custcode: Cust_Code, OrderNo: OrderNo },
      //   (srldata) => {
      //     ////////console.log("srl data", srldata);
      //     setSerailData(srldata);
      //   }
      // );

      await postRequest(endpoints.getSalesExecLists, {}, (sdata) => {
        //////////console.log(sdata);
        setSalesExecdata(sdata);
      });
      await postRequest(
        endpoints.getSalesIndiExecLists,
        { salesContact: SalesContact },
        (sdata) => {
          //////////console.log(sdata[0]["Name"]);
          // setSalesExecContact(sdata[0]["Name"]);
        }
      );
      // await postRequest(endpoints.getSalesIndiExecLists, { salesContact: order.DealingEngineer }, (ddata) => {
      //     setDealingEngineer(ddata[0]["Name"]);
      // });
      // await postRequest(
      //   endpoints.getSalesIndiExecLists,
      //   { salesContact: RecordedBy },
      //   (recdata) => {
      //     setRecordedby(recdata[0]["Name"]);
      //   }
      // );
      await postRequest(
        endpoints.getSalesIndiExecLists,
        { salesContact: Order_Received_By },
        (rcvddata) => {
          // setReceivedBy(rcvddata[0]["Name"]);
        }
      );
      getRequest(endpoints.getMaterials, (mtrldata) => {
        //////console.log(mtrldata);
        setMtrldata(mtrldata);
      });
      getRequest(endpoints.getProcessLists, (pdata) => {
        setProcdata(pdata);
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

      ////console.log("custcode:", Cust_Code);
      // postRequest(endpoints.GetBomData, { custcode: Cust_Code }, (bomdata) => {
      //   ////console.log("bomdata......", bomdata);
      //   setBomData(bomdata);
      // });
    }
    fetchData();
  }, []);

  const handleMtrlCodeTypeaheadChange = (selectedOptions) => {
    // Assuming you are using a single-select Typeahead
    const selectedValue =
      selectedOptions.length > 0 ? selectedOptions[0] : null;
    setStrMtrlCode(selectedValue?.Mtrl_Code);

    // You can also ////console log the selected value
    //console.log("Selected Value:", selectedValue?.Mtrl_Code);
  };

  let selectMtrl = async (e) => {
    ////////console.log("entering into select Mtrl");
    ////console.log(".........mtrl code", e.target.value);
    e.preventDefault();

    const value = e.target.value;
    ////console.log("Select Material" + e.target.value);
    setStrMtrlCode(e.target.value);

    setNewSrlFormData({
      ...NewSrlFormData,
      Material: e.target.value,
    });

    postRequest(
      endpoints.getmtrldetsbymtrlcode,
      { mtrlcode: e.target.value },
      (mtrldata) => {
        if (mtrldata.length > 0) {
          setThickness(mtrldata[0]["Thickness"]);
          setGradeID(mtrldata[0]["MtrlGradeID"]);
          setMaterial(mtrldata[0]["Mtrl_Type"]);
          setGrade(mtrldata[0]["Grade"]);
          setSpecificWt(mtrldata[0]["Specific_Wt"]);

          locCalc(
            window.dxffile,
            mtrldata[0]["Mtrl_Type"],
            mtrldata[0]["Grade"],
            mtrldata[0]["Thickness"],
            (output) => {}
          );
        }
      }
    );
  };

  let selectProc = async (e) => {
    e.preventDefault();
    setOperation(e.target.value);
    setNewSrlFormData({
      ...NewSrlFormData,
      Operation: e.target.value,
    });
    ////////console.log(e.target.value);
  };
  let selectInsp = async (e) => {
    e.preventDefault();
    ////////console.log(e.target.value);
    setNewSrlFormData({
      ...NewSrlFormData,
      InspLvl: e.target.value,
    });
  };

  let selectPack = async (e) => {
    e.preventDefault();
    ////////console.log(e.target.value);
    setNewSrlFormData({
      ...NewSrlFormData,
      PkngLvl: e.target.value,
    });
  };

  let selectTolerance = (e) => {
    e.preventDefault();
    // ////console.log(e.target.value);
    let toltype;
    for (let i = 0; i < tolerancedata.length; i++) {
      if (tolerancedata[i]["ToleranceType"] === e.target.value) {
        toltype = tolerancedata[i];
        break;
      }
    }
    setStrTolerance(e.target.value);
    ////////console.log(e.target.value);
  };
  let selectMtrlSrc = async (e) => {
    e.preventDefault();
    // ////console.log(e.target.value);
    setNewSrlFormData({
      ...NewSrlFormData,
      MtrlSrc: e.target.value,
    });
  };

  let locCalc = () => {};
  // let locCalc = async (drwfile, material, grade, thickness, cb) => {
  //   const formData = new FormData();
  //   //  window.dxffiles.forEach(async (dfile) => {
  //   formData.append("file", drwfile); //files[i]);
  //   formData.append("thickness", thickness);
  //   formData.append("specficWeight", specificwt); // resp[0].Specific_Wt);
  //   //  setSpecificWt(resp[0].Specific_Wt);
  //   //////////console.log("Sending to Service");
  //   // const getCalcReq = await fetch('http://127.0.0.1:21341/getCalc', {
  //   const getCalcReq = await fetch("http://localhost:21341/getCalc", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //     },
  //     body: formData,
  //   });
  //   const res = await getCalcReq.json();
  //   //   const data = await res.json();
  //   //    //////////console.log("Get Calc Response");
  //   //////////console.log(res.data);
  //   //////////console.log(res.data.partOutArea);

  //   setLengthOfCut(res.data.lengthOfCut);
  //   setNoofPierces(res.data.noOfPierces);
  //   setPartNetArea(res.data.partNetArea);
  //   setOutOpen(res.data.outOpen);
  //   setComplexity(res.data.complexity);
  //   setHasOpenContour(res.data.hasOpenContour);
  //   setPartNetWeight(res.data.partNetWeight);
  //   setPartOutArea(res.data.partOutArea);
  //   setPartOutWeight(res.data.partOutWeight);
  //   setRectArea(res.data.rectArea);
  //   setRectWeight(res.data.rectWeight);
  //   //  setSpecificWt(res.Specific_Wt)
  //   cb({
  //     lengthOfCut: res.data.lengthOfCut,
  //     noOfPierces: res.data.noOfPierces,
  //     partNetArea: res.data.partNetArea,
  //     complexity: res.data.complexity,
  //     hasOpenContour: res.data.hasOpenContour,
  //     outOpen: res.data.outOpen,
  //     partNetWeight: res.data.partNetWeight,
  //     partOutArea: res.data.partOutArea,
  //     partOutWeight: res.data.partOutWeight,
  //     rectArea: res.data.rectArea,
  //     rectWeight: res.data.rectWeight,
  //   });
  //   //, spWeight: res.data.Specific_Wt
  //   // setQtnProfileData((olddata) => [...olddata, { file: files[i], operation: process, material, grade, thickness, quantity, materialcode,loc }]);
  //   //});
  // };

  // const [selectedItems, setSelectedItems] = useState([]);

  // const selectItem = (OrdrDetailsItem) => {
  //   const isSelected = selectedItems.includes(OrdrDetailsItem);

  //   // Use the callback function to log the updated state after the update
  //   setSelectedItems((prevSelectedItems) => {
  //     const updatedSelectedItems = isSelected
  //       ? prevSelectedItems.filter((item) => item !== OrdrDetailsItem)
  //       : [...prevSelectedItems, OrdrDetailsItem];

  //     // Log the updated state
  //     //////console.log("Selected Order details Rows:", updatedSelectedItems);

  //     return updatedSelectedItems;
  //   });
  // };
  const [importdwgshow, setImportDwgShow] = useState(false);

  const handleImportDwg = () => {
    //////console.log("modal opend ");
    setImportDwgShow(true);
  };
  const handleCloseImportDwg = () => {
    setImportDwgShow(false);
  };

  const [importdwgmdlshow, setImportDwgmdlShow] = useState(false);

  const handleImportDwgmdl = () => {
    ////////console.log("modal opend ");
    setImportDwgmdlShow(true);
  };
  const handleCloseImportDwgmdl = () => {
    setImportDwgmdlShow(false);
  };

  const [importOldOrdrMdl, setImportOldOrdrMdl] = useState(false);

  const handleImportOldOrdrMdl = () => {
    // //////console.log("modal opend ");
    setImportOldOrdrMdl(true);
  };
  const handleCloseImportOldOrdrMdl = () => {
    setImportOldOrdrMdl(false);
  };

  function deleteRowsByOrderNoFunc() {
    // //console.log("delete rows by order functions");
    postRequest(
      endpoints.postDeleteDetailsByOrderNo,
      { Order_No: props.OrderData.Order_No },
      (deleteData) => {
        if (deleteData.affectedRows > 0) {
          setOrdrDetailsData([]);
          toast.success("Delete the serials sucessfully");
          setConfirmationModalOpen(false);
          setImportQtnMdl(true);
        } else {
          toast.warning(deleteData);
        }
      }
    );
  }

  const handleImportQtnMdl = () => {
    // //////console.log("modal opend ");
    // //console.log("sddfsd");
    if (props.OrdrDetailsData.length > 0) {
      setConfirmationModalOpen(true);
    } else {
      setImportQtnMdl(true);
    }
  };
  // const handleCloseImportQtnMdl = () => {
  //   setImportQtnMdl(false);
  // };

  // partid dropdown
  const [selectedPartId, setSelectedPartId] = useState([]);
  const [BomArry, setBomArry] = useState([]);

  const handleSelectChange = (selected) => {
    // setHasBOM(1);
    // Handle the selected item
    ////  //console.log("Selected PartId", selected[0]?.label);
    ////  //console.log("Selected...", selected);

    // const arr = BomData.filter((obj) => obj.PartId === selected[0]?.label);
    const arr = BomData.filter(
      (obj) => obj.UniqueColumn === selected[0]?.label
    );
    ////  //console.log("arr", arr);
    setBomArry(arr);

    // If you need to store the selected PartId in the component's state
    setSelectedPartId(selected);
    // setSelectedPartId(selected[0]?.label);
  };

  const options = BomData?.map((item) => ({
    // label: item.PartId,
    // label: item.AssyCust_PartId,
    label: item.UniqueColumn,
    // Add other properties from your BomData item that you want to display
    // For example, you might have:
    // value: item.SomeValue,
    // description: item.Description,
  }));

  const PostOrderDetails = (flag) => {
    let requestData = {};
    if (flag === 1) {
      requestData = {
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
        material: material,
        Operation: Operation,

        NewSrlFormData: NewSrlFormData,
      };
      ////  //console.log("clicked on Add new serial button");
    } else if (flag === 2) {
      if (props.OrderData?.Order_Status === "Recorded") {
        toast.warning("Cannot import after the Order is recorded");
      } else {
        handleImportDwgmdl();
      }

      ////  //console.log(" ImportDwg button...", props.OrderData?.Order_Status);
      ////  //console.log("clicked on ImportDwg button");
    } else if (flag === 3) {
      setHasBOM(1);
      requestData = {
        OrderNo: OrderNo,
        newOrderSrl: newOrderSrl,
        custcode: Cust_Code,
        DwgName: selectedPartId[0].label,

        Dwg_Code: "",
        dwg: Dwg,
        tolerance: "",
        HasBOM: 1,
        Qty_Ordered: 0,
        JwCost: BomArry[0]?.JobWorkCost,
        mtrlcost: BomArry[0]?.MtrlCost,
        strmtrlcode: strmtrlcode,
        material: material,
        Operation: Operation,
        insplevel: "",
        packinglevel: "",
        delivery_date: "",
        NewSrlFormData: NewSrlFormData,
      };

      ////  //console.log("clicked on add dwg to order button");
    } else {
      ////console.error("Invalid flag value");
    }
    // Make the API request
    ////  //console.log("calling InsertNewSrlData api ");
    // //console.log("req data  ", requestData);

    postRequest(
      endpoints.InsertNewSrlData,

      { requestData: requestData },
      (InsertedNewSrlData) => {
        ////  //console.log(" InsertedNewSrlDataRes", InsertedNewSrlData);
        if (InsertedNewSrlData.affectedRows != 0) {
          toast.success("Added serial successfully");
          fetchData();
          handleCloseImportDwg();
        } else {
          toast.warning("Serial not adde");
          handleCloseImportDwg();
        }
      }
    );
  };
  // const setBomArry = (arr) => {
  //   // Implement setBomArray logic if needed
  // //  //console.log("Setting BomArray:", arr);
  // };

  const [bulkChnangMdl, setBulkChnangMdl] = useState(false);

  const handlebulkChnangMdl = () => {
    setBulkChnangMdl(true);
  };

  const handleClosesetBulkChnangMdl = () => {
    setBulkChnangMdl(false);
  };

  return (
    <>
      {/* <ConfirmationModa/> */}
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
      />
      <ImportOldOrderModal
        importOldOrdrMdl={importOldOrdrMdl}
        setImportOldOrdrMdl={setImportOldOrdrMdl}
        handleImportOldOrdrMdl={handleImportOldOrdrMdl}
        handleCloseImportOldOrdrMdl={handleCloseImportOldOrdrMdl}
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
      />

      <ImportExcelModal
        setImportExcelModal={setImportExcelModal}
        importExcelModal={importExcelModal}
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
        updateOrdrData={updateOrdrData}
        handleblkCngCheckBox={handleblkCngCheckBox}
        blkCngCheckBox={blkCngCheckBox}
        setBlkCngCheckBox={setBlkCngCheckBox}
      />
      <div>
        {/* {//console.log(".....", props)} */}
        <div className="row justify-content-left m-3">
          {props.OrderData?.Type === "Profile" ? (
            <button
              className="button-style"
              style={{ width: "130px", marginLeft: "4px" }}
              // onClick={handleImportDwgmdl}
              onClick={() => PostOrderDetails(2)}
            >
              Import Dwg
            </button>
          ) : null}

          <button
            className="button-style"
            style={{ width: "140px", marginLeft: "4px" }}
            onClick={importExcelFunc}
          >
            Import EXCEL
          </button>
          <button
            className="button-style"
            style={{ width: "130px", marginLeft: "4px" }}
            onClick={handleImportQtnMdl}
          >
            Import Qtn
          </button>
          <button
            className="button-style"
            style={{ width: "170px", marginLeft: "4px" }}
            onClick={handleImportOldOrdrMdl}
          >
            Import Old Order
          </button>
          <button
            className="button-style"
            style={{ width: "100px", marginLeft: "4px" }}
          >
            Delete
          </button>
          <button
            className="button-style"
            style={{ width: "130px", marginLeft: "4px" }}
            onClick={handlebulkChnangMdl}
          >
            Bulk Change
          </button>
          <button
            className="button-style"
            onClick={handleSelectAll}
            style={{ width: "120px", marginLeft: "4px" }}
          >
            Select All
          </button>
          <button
            className="button-style"
            onClick={handleReverseSelection}
            style={{ width: "100px", marginLeft: "4px" }}
          >
            Reverse
          </button>
          {Type === "Profile" ? (
            <button
              className="button-style"
              style={{ width: "100px", marginLeft: "4px" }}
            >
              Edit DXF
            </button>
          ) : null}
          {/* <button
            className="button-style"
            style={{ width: "100px", marginLeft: "4px" }}
            onClick={singleupdateOrdrData}
          >
            Update
          </button> */}
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <OrdrTable
              OrderData={OrderData}
              OrderCustData={OrderCustData}
              OrdrDetailsData={OrdrDetailsData}
              selectedItems={selectedItems}
              selectItem={selectItem}
            />
          </div>
          <div className="col-md-6">
            <Tabs>
              {props.OrderData?.Type === "Profile" ? (
                <Tab eventKey="drawing" title="Drawing">
                  <Drawings />
                </Tab>
              ) : null}
              <Tab eventKey="orderDetailsForm" title="Order Details">
                <OrdrDtls
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
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
