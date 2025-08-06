/* eslint-disable react-hooks/exhaustive-deps */
/** @format */

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tab, Tabs, } from "react-bootstrap";
import FindOldPart from "./Tabs/FindOldPart/FindOldPart";
import MaterialInfo from "./Tabs/MaterialInfo/MaterialInfo";
// import MaterialPlanner from "./Tabs/MaterialPlanner/MaterialPlanner";
import OrderDetails from "./Tabs/OrderDetails/OrderDetails";
import OrderInfo from "./Tabs/OrderInfo/OrderInfo";
import ProductionScheduleCreation from "./Tabs/ProductionScheduleCreation/ProductionScheduleCreation";
import ProfarmaInvoiceList from "./Tabs/ProfarmaInvoiceList/ProfarmaInvoiceList";
import ScheduleList from "./Tabs/ScheduleList/ScheduleList";
import FormHeader from "./FormHeader";
import { endpoints } from "../../../../api/constants";
import { toast } from "react-toastify";
import AlertModal from "../Components/Alert";
import { Helper } from "dxf";
import { Buffer } from "buffer";
import axios from "axios";
const {
  
  postRequest,
  getFileRequest,
} = require("../../../../api/apiinstance");
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
  showCheckbox,
  Type,
}) => {
  // const [isValid, setIsValid] = useState(true);
  const handleInputChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, "");

    onChangeCallback(inputValue);
  };

  return (
    <div className="md-col-4">
      <div className="row">
        <div className="col-md-3">
          <div className="col-md-3">
            {showCheckbox && (
              <input
                type="checkbox"
                className="custom-checkbox in-field"
                onChange={() => onCheckboxChange(checkboxIndex)}
                checked={isChecked}
                required
              />
            )}
          </div>
        </div>
      </div>

      <input
        type="text"
        id={id}
        autoComplete="off"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className={className}
        required
      />
    </div>
  );
};
export default function ScheduleCreationForm(props) {
  // console.log("props", props);
  let REACT_APP_GETCALCREQ_URL = process.env.REACT_APP_GETCALCREQ_URL;
  let API = process.env.REACT_APP_API_KEY;

  console.log("REACT_APP_GETCALCREQ_URL", REACT_APP_GETCALCREQ_URL);
  console.log("REACT_APP_API", API);
  const location = useLocation();

  // console.log("location.state---", location.state);
  const FabOrderNo = location?.state?.FabOrderNo;
  console.log("FabOrderNo", FabOrderNo);

  const fromPath = location?.state?.from;

  console.log("Came from:", fromPath);

  const orderNUmber =
    location.state?.Order_No || props.OrersData || location?.state;
  const orderType = location.state?.Type || props.Type;
  const Cust_Code = location.state?.Cust_Code;

  console.log("0", orderNUmber);
  console.log("0", orderType);
  console.log("0", Cust_Code);

  const [intSchStatus, setIntSchStatus] = useState(0);
  // const [mtrldata, setMtrldata] = useState([]);
  // const [procdata, setProcdata] = useState([]);
  // const [inspdata, setInspdata] = useState([]);
  // const [packdata, setPackdata] = useState([]);
  // const [tolerancedata, setTolerancedata] = useState([]);
  const [salesExecdata, setSalesExecdata] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [gradeid, setGradeID] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [material, setMaterial] = useState("");
  // const [DwgName, setDwgName] = useState("");
  // const [quantity, setQuantity] = useState("");
  // const [jwRate, setJwRate] = useState("");
  // const [materialRate, setMaterialRate] = useState("");
  // const [unitPrice, setUnitPrice] = useState("");
  // const [Operation, setOperation] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [thickness, setThickness] = useState("");
  const [specificwt, setSpecificWt] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [grade, setGrade] = useState("");
  // const [HasBOM, setHasBOM] = useState(0);
  // const [Dwg, setDwg] = useState(0);
  const [newSerial, setNewSerial] = useState({
    DwgName: "",
    material: "",
    strmtrlcode: "",
    Operation: "",
    StrTolerance: "", // NOT USED
    InspLvl: "",
    PkngLvl: "",
    MtrlSrc: "",
    custcode: props.OrderCustData?.Cust_Code,
    OrderNo: 0,
    newOrderSrl: 0,
    quantity: 1.0,
    jwRate: 0.0,
    materialRate: 0.0,
    unitPrice: 0.0,
    Dwg_Code: "",
    dwg: "",
  });
  const [ordrDetailsChange, setordrDetailsChange] = useState({
    custcode: props.OrderCustData?.Cust_Code,
    DwgName: "",
    material: "",
    strmtrlcode: "",
    Operation: "",
    StrTolerance: "", // NOT USED
    InspLvl: "",
    PkngLvl: "",
    MtrlSrc: "",
    quantity: 1.0,
    jwRate: 0.0,
    materialRate: 0.0,
    unitPrice: 0.0,
  });
  const [blkChange, setBlkChange] = useState({
    custcode: props.OrderCustData?.Cust_Code,
    DwgName: "",
    material: "",
    strmtrlcode: "",
    Operation: "",
    StrTolerance: "", // NOT USED
    InspLvl: "",
    PkngLvl: "",
    MtrlSrc: "",
    quantity: 1.0,
    jwRate: 0.0,
    materialRate: 0.0,
    unitPrice: 0.0,
    blkCngCheckBox: false,
  });
  const [imprtDwgObj, setImprtDwgObj] = useState({
    custcode: props.OrderCustData?.Cust_Code,
    material: "",
    strmtrlcode: "",
    Operation: "",
    MtrlSrc: "",
    StrTolerance: "",
    InspLvl: "",
    PkngLvl: "",
    quantity: 0.0,
  });
  // let [orderdetailsdata, setOrderDetailsData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  let [Orderno, setOrderno] = useState(location.state);

  //IMPORT DWG
  // let [strprocess, setStrProcess] = useState("");
  // let [strmtrlcode, setStrMtrlCode] = useState("");
  // let [strtolerance, setStrTolerance] = useState("");
  // let [mtrlcode, setMtrlCode] = useState("");
  // let [strMaterial, setStrMaterial] = useState("");
  // let [strGrade, setStrGrade] = useState("");
  // let [decThick, setDecThick] = useState(0);
  // let [dblSpWt, setDblSpWt] = useState(0);
  // let [dblCuttingRate, setDblCuttingRate] = useState(0);
  // let [dblPierceRate, setDblPierceRate] = useState(0);
  // let [strInsp, setStrInsp] = useState("");
  // let [strPkng, setStrPkng] = useState("");
  // let [strSource, setStrSource] = useState("");
  // let [strMtrlGrade, setStrMtrlGrade] = useState("");
  // let [Qty, setQty] = useState(0);
  // let [FormOk, setFormOk] = useState(false);
  // let [valOK, setValOK] = useState(false);
  // let [TMd, setTMd] = useState([]);
  // let [mtrl, setMtrl] = useState([]);
  // let [bolMtrl, setBolMtrl] = useState(false);
  // let [bolOperation, setBolOperation] = useState(false);
  // let [bolSource, setBolSource] = useState(false);
  // let [bolInsp, setBolInsp] = useState(false);
  // let [bolPkng, setBolPkng] = useState(false);
  // let [bolTolerance, setBolTolerance] = useState(false);
  // let [bolQty, setBolQty] = useState(false);

  const [OdrDtlMtrlSrc, setOdrDtlMtrlSrc] = useState("");

  // const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // LOC CACLULATION AND DXF FILE
  let locCalc = async (drwfile, material, grade, thickness, cb) => {
    const formData = new FormData();
    //  window.dxffiles.forEach(async (dfile) => {
    formData.append("file", drwfile); //files[i]);
    formData.append("thickness", thickness);
    formData.append("specficWeight", specificwt); // resp[0].Specific_Wt);
   
    const getCalcReq = await fetch(`${REACT_APP_GETCALCREQ_URL}/getCalc`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
    const res = await getCalcReq.json();

    setLengthOfCut(res.data.lengthOfCut);
    setNoofPierces(res.data.noOfPierces);
    setPartNetArea(res.data.partNetArea);
    setOutOpen(res.data.outOpen);
    setComplexity(res.data.complexity);
    setHasOpenContour(res.data.hasOpenContour);
    setPartNetWeight(res.data.partNetWeight);
    setPartOutArea(res.data.partOutArea);
    setPartOutWeight(res.data.partOutWeight);
    setRectArea(res.data.rectArea);
    setRectWeight(res.data.rectWeight);
    cb({
      lengthOfCut: res.data.lengthOfCut,
      noOfPierces: res.data.noOfPierces,
      partNetArea: res.data.partNetArea,
      complexity: res.data.complexity,
      hasOpenContour: res.data.hasOpenContour,
      outOpen: res.data.outOpen,
      partNetWeight: res.data.partNetWeight,
      partOutArea: res.data.partOutArea,
      partOutWeight: res.data.partOutWeight,
      rectArea: res.data.rectArea,
      rectWeight: res.data.rectWeight,
    });
  };

  // async function dxfupload(files, destPath, response) {
  //   const data = new FormData();
  //   for (let i = 0; i < files.length; i++) {
  //     data.append("files", files[i]);
  //   }
  //   // let API = API;
  //   const rawResponse = await fetch(`${API}/file/uploaddxf`, {
  //     method: "POST",
  //     headers: {
  //       Accept: "multipart/form-data",
  //       destinationPath: destPath,
  //     },
  //     body: data,
  //   });
  //   const content = await rawResponse.json();
  //   response(content);
  // }

  // let importdrawings = async (e) => {
  //   e.preventDefault();

  //   // if (!(orderStatus === "Created" || orderStatus === "Recorded")) {
  //   //   alert("Cannot import after the Order is recorded");
  //   //   return;import FindOldPart from './../../Menus/Profile/Find Order/Header Tabs/FindOldPart';

  //   // }

  //   let materialcode = strmtrlcode;
  //   let process = strprocess; //e.target.elements.processdescription.value;
  //   let quantity = quantity; // e.target.elements.quantity.value;
  //   let materialsource = strSource; // e.target.elements.materialsource.value;
  //   let tolerance = strtolerance; // e.target.elements.tolerance.value;
  //   let insplevel = strInsp; // e.target.elements.insplevel.value;
  //   let packinglevel = strPkng; // e.target.elements.packinglevel.value;
  //   let files = e.target.elements.files.files;
  //   setDblCuttingRate(dblCuttingRate);
  //   setDblPierceRate(dblPierceRate);

  //   for (let i = 0; i < files.length; i++) {
  //     let drwfname = files[i];

  //     locCalc(drwfname, material, grade, thickness, (output) => {
  //       let olddata = Object.entries(orderdetailsdata).map(([key, value]) => ({
  //         key,
  //         value,
  //       }));

  //       if (olddata === null || olddata === undefined) {
  //         return;
  //       } else {
  //         setOrderDetailsData((olddata) => {
  //           return [
  //             ...olddata,
  //             {
  //               file: files[i],
  //               operation: process,
  //               material,
  //               grade,
  //               thickness,
  //               quantity,
  //               mtrlcode,
  //               lengthOfCut: output.lengthOfCut,
  //               noOfPierces: output.noOfPierces,
  //               partNetArea: output.partNetArea,
  //               complexity: output.complexity,
  //               hasOpenContour: output.hasOpenContour,
  //               outOpen: output.outOpen,
  //               partNetWeight: output.partNetWeight,
  //               partOutArea: output.partOutArea,
  //               partOutWeight: output.partOutWeight,
  //               rectArea: output.rectArea,
  //               rectWeight: output.rectWeight,
  //             },
  //           ];
  //         });
  //       }
  //     });
  //   }

  //   let destPath = `\\Wo\\` + Orderno + "\\DXF\\";
  //   dxfupload(files, destPath, (res) => {});
  //   window.dxffiles = files;
  //   setShow(false);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // DWG NAME
    if (name === "newSrlDwgname") {
      setNewSerial((prevState) => ({
        ...prevState,
        DwgName: value,
      }));
    } else if (name === "blkCngDwgname") {
      setBlkChange((prevState) => ({
        ...prevState,
        DwgName: value,
        blkCngCheckBox: true,
      }));
    } else if (name === "odrDtlDwgName") {
      setordrDetailsChange((prevState) => ({
        ...prevState,
        DwgName: value,
      }));
    }
    // MATERIAL
    if (name === "newSrlMaterial") {
      setNewSerial((prevState) => ({
        ...prevState,
        material: value,
      }));
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
    } else if (name === "odrDtlMaterial") {
      setordrDetailsChange((prevState) => ({
        ...prevState,
        material: value,
      }));
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
    } else if (name === "blkCngMaterial") {
      setBlkChange((prevState) => ({
        ...prevState,
        material: value,
      }));
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
    } else if (name === "impDwgMaterial") {
      setImprtDwgObj((prevState) => ({
        ...prevState,
        material: value,
      }));
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
    }

    // const handleMtrlCodeTypeaheadChange = (selectedOptions) => {
    //   setSelectedItems(selectedOptions);
    //   const selectedValue =
    //     selectedOptions.length > 0 ? selectedOptions[0] : null;
    //   if (selectedValue) {
    //     setStrMtrlCode(selectedValue.Mtrl_Code);
    //   }
    // };

    if (name === "newSrlMaterial") {
      setNewSerial((prevState) => ({
        ...prevState,
        strmtrlcode: value,
      }));
    } else if (name === "odrDtlMaterial") {
      setordrDetailsChange((prevState) => ({
        ...prevState,
        strmtrlcode: value,
      }));
    } else if (name === "blkCngMaterial") {
      setBlkChange((prevState) => ({
        ...prevState,
        strmtrlcode: value,
      }));
    } else if (name === "impDwgMaterial") {
      setImprtDwgObj((prevState) => ({
        ...prevState,
        strmtrlcode: value,
      }));
    }

    // PROCESS OR OPERATION
    if (name === "newSrlOperation") {
      setNewSerial((prevState) => ({
        ...prevState,
        Operation: value,
      }));
    } else if (name === "odrDtlOperation") {
      setordrDetailsChange((prevState) => ({
        ...prevState,
        Operation: value,
      }));
    } else if (name === "blkCngOperation") {
      setBlkChange((prevState) => ({
        ...prevState,
        Operation: value,
      }));
    } else if (name === "impDwgProcess") {
      setImprtDwgObj((prevState) => ({
        ...prevState,
        Operation: value,
      }));
    }
    // TOLERENCE
    if (name === "impDwgTolerance") {
      setImprtDwgObj((prevState) => ({
        ...prevState,
        StrTolerance: value,
      }));
    }
    // INSP LVL
    if (name === "newSrlInspLvl") {
      setNewSerial((prevState) => ({
        ...prevState,
        InspLvl: value,
      }));
    } else if (name === "odrDtlInspLvl") {
      setordrDetailsChange((prevState) => ({
        ...prevState,
        InspLvl: value,
      }));
    } else if (name === "blkCngInspLvl") {
      setBlkChange((prevState) => ({
        ...prevState,
        InspLvl: value,
      }));
    } else if (name === "impDwgInspLvl") {
      setImprtDwgObj((prevState) => ({
        ...prevState,
        InspLvl: value,
      }));
    }
    // PKNG LVL
    if (name === "newSrlPkngLvl") {
      setNewSerial((prevState) => ({
        ...prevState,
        PkngLvl: value,
      }));
    } else if (name === "odrDtlPkngLvl") {
      setordrDetailsChange((prevState) => ({
        ...prevState,
        PkngLvl: value,
      }));
    } else if (name === "blkCngPkngLvl") {
      setBlkChange((prevState) => ({
        ...prevState,
        PkngLvl: value,
      }));
    } else if (name === "impDwgPkngLvl") {
      setImprtDwgObj((prevState) => ({
        ...prevState,
        PkngLvl: value,
      }));
    }
    // MATERIAL SOURSE
    if (name === "newSrlMtrlSrc") {
      setNewSerial((prevState) => ({
        ...prevState,
        MtrlSrc: value,
      }));
    } else if (name === "odrDtlMtrlSrc") {
      console.log("odrDtlMtrlSrc e.target.value---", e.target.value);

      setOdrDtlMtrlSrc(e.target.value);

      setordrDetailsChange((prevState) => ({
        ...prevState,
        MtrlSrc: value,
      }));
    } else if (name === "blkCngMtrlSrc") {
      setBlkChange((prevState) => ({
        ...prevState,
        MtrlSrc: value,
      }));
    }
    // QUANTITY
    if (name === "newSrlQty") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setNewSerial((prevState) => ({
        ...prevState,
        quantity: mvalue,
      }));
    } else if (name === "odrDtlQuantity") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setordrDetailsChange((prevState) => ({
        ...prevState,
        quantity: mvalue,
      }));
    } else if (name === "blkCngQty") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setBlkChange((prevState) => ({
        ...prevState,
        quantity: mvalue,
      }));
    } else if (name === "impDwgQty") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setImprtDwgObj((prevState) => ({
        ...prevState,
        quantity: mvalue,
      }));
    }
    // JW RATE
    if (name === "newSrlJWRate") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setNewSerial((prevState) => ({
        ...prevState,
        jwRate: mvalue,
      }));
    } else if (name === "odrDtljwrate") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setordrDetailsChange((prevState) => ({
        ...prevState,
        jwRate: mvalue,
      }));
    } else if (name === "blkCngJWRate") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setBlkChange((prevState) => ({
        ...prevState,
        jwRate: mvalue,
      }));
    }
    // MTRL RATE
    if (name === "newSrlMaterialRate") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setNewSerial((prevState) => ({
        ...prevState,
        materialRate: mvalue,
      }));
    } else if (name === "odrDtlMtrlRate") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setordrDetailsChange((prevState) => ({
        ...prevState,
        materialRate: mvalue,
      }));
    } else if (name === "blkCngMrate") {
      const mvalue = e.target.value.replace(/[^0-9.]/g, "");
      setBlkChange((prevState) => ({
        ...prevState,
        materialRate: mvalue,
      }));
    }
    // UNIT PRICE
    if (name === "newSrlUnitPrice") {
      setNewSerial((prevState) => ({
        ...prevState,
        unitPrice: value,
      }));
    } else if (name === "odrDtlUnitPrice") {
      setordrDetailsChange((prevState) => ({
        ...prevState,
        unitPrice: value,
      }));
    } else if (name === "blkCngUnitPrice") {
      setBlkChange((prevState) => ({
        ...prevState,
        unitPrice: value,
      }));
    }
  };

  const [editedData, setEditedData] = useState({}); // Store changed values

  const handleJWMR = (index, field, value) => {
    if (field === "Qty_Ordered") {
      // Allow only whole numbers (no decimals, no text)
      if (!/^\d*$/.test(value)) {
        return;
      }
    } else {
      // Allow only positive numbers (including decimals)
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }
    if (value < 0) {
      toast.error("Please Enter a Positive Number", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (!LastSlctedRow) {
      return;
    }

    // Clone row and update field
    const updatedRow = {
      ...filteredData[index], // Ensure we update from the latest row
      [field]: value,
    };

    // Save last edited row
    setLastSlctedRow(updatedRow);

    // Update filteredData (create a new array reference for React state update detection)
    const updatedData = filteredData.map((row, i) =>
      i === index ? updatedRow : row
    );

    setFilteredData(updatedData);

    // Store edited fields to track changes before saving
    setEditedData((prev) => ({
      ...prev,
      [updatedRow.OrderDetailId]: { ...updatedRow },
    }));
  };

  const saveJWMRChanges = async () => {
    if (!Object.keys(editedData).length) {
      toast.warning("No changes to update!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const updateOrderDetailsData = {
      orderNo: OrderData.Order_No,
      updatedRows: Object.values(editedData),
    };

    const orderDetailsResponse = await postRequest(
      endpoints.ordertablevaluesupdate,
      updateOrderDetailsData
    );

    if (orderDetailsResponse.success) {
      // toast.success("Order details updated successfully", {
      //   position: toast.POSITION.TOP_CENTER,
      // });
      alert("Order details updated successfully");
      fetchData();
      setEditedData({}); // Clear stored changes
    } else {
      toast.error("Order update failed. Try again!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  let updateOrdrData = async () => {
    const unitPrice =
      ordrDetailsChange.MtrlSrc === "Customer"
        ? parseFloat(ordrDetailsChange.jwRate)
        : parseFloat(ordrDetailsChange.jwRate) +
          parseFloat(ordrDetailsChange.materialRate);

    postRequest(
      endpoints.singleChangeUpdate,
      {
        OrderNo: Orderno,
        custcode: props.OrderCustData?.Cust_Code,
        // custcode: Cust_Code || CustCode,
        DwgName: ordrDetailsChange.DwgName,
        MtrlSrc: ordrDetailsChange.MtrlSrc,
        quantity: ordrDetailsChange.quantity,
        OrderSrl: selectedSrl,
        JwCost: ordrDetailsChange.jwRate,
        mtrlcost: ordrDetailsChange.materialRate,

        //unitPrice: parseFloat(ordrDetailsChange.jwRate) +   parseFloat(ordrDetailsChange.materialRate),
        unitPrice: unitPrice,

        Operation: ordrDetailsChange.Operation,
        InspLvl: ordrDetailsChange.InspLvl,
        PkngLvl: ordrDetailsChange.PkngLvl,
        strmtrlcode: LastSlctedRow?.Mtrl_Code,
      },
      async (singleChngData) => {
        if (singleChngData.affectedRows !== 0) {
          alert("Updated successfully");
          fetchData();
        } else {
          toast.warning("Serial not updated check once");
        }
      }
    );
  };

  // eslint-disable-next-line no-unused-vars
  const [orderNo, setorderNo] = useState(location?.state);
  const [OrderData, setOrderData] = useState({});
  const [OrderCustData, setOrderCustData] = useState({});
  const [OrdrDetailsData, setOrdrDetailsData] = useState([]);
  const [BomData, setBomData] = useState([]);
  const [findOldpart, setfindOldpart] = useState();
  //profarmaInvDetail data
  const [profarmaInvMain, setProfarmaInvMain] = useState([]);
  const [profarmaInvDetails, setProfarmaInvDetails] = useState([]);
  // row selection data
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSrl, setSelectedSrl] = useState([]);
  const [LastSlctedRow, setLastSlctedRow] = useState(null);
  //getScheduleList Table Data
  const [scheduleListData, setScheduleListData] = useState([]);
  const [oldOrderListData, setOldOrderListData] = useState([]);
  const [oldOrderDetailsData, setOldOrderDetailsData] = useState([]);

  // const [createInvoicetrigger, SetCreateInvoicetrigger] = useState(false);

  // Register button
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  // Alert Modals
  const [alertModal, setAlertModal] = useState(false);
  const [registerOrder, setRegisterOrder] = useState(false);

  const [CustCode, SetCustCode] = useState();

  // const fetchData = async () => {
  //   try {
  //     const orderData = await postRequest(
  //       endpoints.getOrderDetailsByOrdrNoAndType,
  //       {
  //         orderNo: orderNUmber,
  //         orderType: orderType,
  //       }
  //     );
  //     if (orderData?.orderData?.length > 0 && orderData?.custData?.length > 0) {
  //       const custCode = orderData.custData[0].Cust_Code;
  //       SetCustCode(orderData.custData[0].Cust_Code);
  //       setOrderData(orderData.orderData[0]);
  //       setOrderCustData(orderData.custData[0]);

  //       // Fetch BOM Data
  //       const bomData = await postRequest(endpoints.GetBomData, {
  //         // custcode: custCode,
  //         custcode: Cust_Code || custCode,
  //       });
  //       setBomData(bomData);

  //       // Fetch FindOldPart Data
  //       const findOldPartData = await postRequest(
  //         endpoints.GetFindOldpartData,
  //         {
  //           // custcode: custCode,
  //           custcode: Cust_Code || custCode,
  //         }
  //       );
  //       setfindOldpart(findOldPartData);

  //       // Fetch New Serial Data
  //       const ordrDetailsData = await postRequest(endpoints.PostNewSrlData, {
  //         custcode: Cust_Code || custCode,
  //         OrderNo: orderNUmber,

  //         //   custcode:  custCode,
  //         // OrderNo: orderNo,
  //       });
  //       setOrdrDetailsData(ordrDetailsData);

  //       // Fetch Old Order Data
  //       const oldOrderData = await postRequest(
  //         endpoints.getOldOrderByCustCodeAndOrderNo,
  //         {
  //           Cust_Code: Cust_Code || orderData.orderData[0].Cust_Code,
  //           Order_No: orderNUmber || orderData.orderData[0].Order_No,
  //           // Cust_Code:  orderData.orderData[0].Cust_Code,
  //           // Order_No:  orderData.orderData[0].Order_No,
  //         }
  //       );
  //       console.log("oldOrderData", oldOrderData);

  //       setOldOrderListData(oldOrderData?.orderListData);
  //       setOldOrderDetailsData(oldOrderData?.orderDetailsData);
  //     } else {
  //       // console.error("Invalid orderData or custData");
  //     }

  //     // Fetch Profarma Main Data
  //     const profarmaMainData = await postRequest(endpoints.getProfarmaMain, {
  //       OrderNo: orderNUmber,
  //       // OrderNo: orderNo,
  //     });
  //     setProfarmaInvMain(profarmaMainData);

  //     // Fetch Profarma Details Data
  //     const profarmaDetailsData = await postRequest(
  //       endpoints.getProfarmaDetails,
  //       {
  //         // OrderNo: orderNUmber,
  //         OrderNo: orderNo,
  //       }
  //     );
  //     setProfarmaInvDetails(profarmaDetailsData);

  //     // Reset Selected Items
  //     setSelectedItems([]);
  //   } catch (error) {
  //     // console.error("Error fetching data:", error);
  //   }
  // };

  const fetchData = async () => {
    try {
      await LoadInitialData();
      await PerformaTabData();
      await FindOldPartData();
      // await FindOldOrderButtonData();
    } catch (error) {}
  };

  //------------------
  useEffect(() => {
    FindOldOrderButtonData();
    PerformaTabData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CustCode]);

  const LoadInitialData = async () => {
    try {
      const orderData = await postRequest(
        endpoints.getOrderDetailsByOrdrNoAndType,
        {
          orderNo: orderNUmber,
          orderType: orderType,
        }
      );

      if (orderData?.orderData?.length > 0 && orderData?.custData?.length > 0) {
        const custCode = orderData.custData[0].Cust_Code;
        SetCustCode(orderData.custData[0].Cust_Code);
        setOrderData(orderData.orderData[0]);
        setOrderCustData(orderData.custData[0]);

        // Fetch BOM Data
        const bomData = await postRequest(endpoints.GetBomData, {
          custcode: Cust_Code || custCode,
        });
        setBomData(bomData);

        const ordrDetailsData = await postRequest(endpoints.PostNewSrlData, {
          custcode: Cust_Code || custCode,
          OrderNo: orderNUmber,
        });

        setOrdrDetailsData(ordrDetailsData);
      }
    } catch (error) {}
  };

  const FindOldPartData = async () => {
    try {
      const findOldPartData = await postRequest(endpoints.GetFindOldpartData, {
        custcode: Cust_Code || CustCode,
      });
      setfindOldpart(findOldPartData);
    } catch (error) {}
  };

  const FindOldOrderButtonData = async () => {
    try {
      const oldOrderData = await postRequest(
        endpoints.getOldOrderByCustCodeAndOrderNo,
        {
          Cust_Code: Cust_Code || CustCode,
          Order_No: orderNUmber,
          orderType: orderType,
        }
      );
      console.log("oldOrderData?.orderListData", oldOrderData?.orderListData);
      console.log(
        "oldOrderData?.orderDetailsData",
        oldOrderData?.orderDetailsData
      );

      setOldOrderListData(oldOrderData?.orderListData);
      setOldOrderDetailsData(oldOrderData?.orderDetailsData);
      setOldOrderDetailsData(oldOrderData?.orderDetailsData);
    } catch (error) {}
  };
  // Called alrady in child page no need to pass this
  const PerformaTabData = async () => {
    try {
      // Fetch Profarma Main Data
      const profarmaMainData = await postRequest(endpoints.getProfarmaMain, {
        OrderNo: orderNUmber,
      });
      setProfarmaInvMain(profarmaMainData);

      // Fetch Profarma Details Data
      const profarmaDetailsData = await postRequest(
        endpoints.getProfarmaDetails,
        {
          OrderNo: orderNUmber,
        }
      );
      setProfarmaInvDetails(profarmaDetailsData);
    } catch (error) {}
  };

  const fetchSalesExecLists = async () => {
    try {
      const response = await axios.post(endpoints.getSalesExecLists);
      setSalesExecdata(response.data);
    } catch (error) {}
  };

  const calculateMinSrlStatus = () => {
    if (OrdrDetailsData.length === 0) return 0;

    return Math.min(
      ...OrdrDetailsData.map((order) => {
        if (order.Qty_Ordered === 0) return 0;
        else if (order.QtyDelivered >= order.Qty_Ordered) return 8;
        else if (order.QtyDelivered > 0 && order.QtyPacked >= order.Qty_Ordered)
          return 7;
        else if (order.QtyPacked >= order.Qty_Ordered) return 6;
        else if (order.QtyPacked > 0 && order.QtyProduced >= order.Qty_Ordered)
          return 5;
        else if (order.QtyProduced >= order.Qty_Ordered) return 4;
        else if (
          order.QtyProduced > 0 &&
          order.QtyScheduled >= order.Qty_Ordered
        )
          return 5;
        else if (order.QtyScheduled >= order.Qty_Ordered) {
          return 3;
        } else if (order.QtyScheduled > 0) return 2;
        else return 1;
      })
    );
  };

  const updateOrderStatus = () => {
    // eslint-disable-next-line no-unused-vars
    const status = getStatusText(intSchStatus);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 8:
        return "Dispatched";
      case 7:
        return "Packed";
      case 6:
        return "Packed";
      case 5:
        return "Produced";
      case 4:
        return "Produced";
      case 3:
        return "Processing";
      case 2:
        return "Recorded";
      case 1:
        return "Recorded";
      case 0:
        return "Recorded";
      default:
        return "Confused";
    }
  };

  const setDetailsColour = () => {
    const rows = document.querySelectorAll(".order-details-row");
    rows.forEach((row) => {
      const srlStatus = parseInt(row.getAttribute("data-srlstatus"));
      let backgroundColor = "";
      switch (srlStatus) {
        case 0:
          backgroundColor = "lavender";
          break;
        case 1:
          backgroundColor = "lightblue";
          break;
        case 2:
          backgroundColor = "lightcoral";
          break;
        case 3:
          backgroundColor = "lightyellow";
          break;
        case 4:
          backgroundColor = "yellow";
          break;
        case 5:
          backgroundColor = "greenyellow";
          break;
        case 6:
          backgroundColor = "lightgreen";
          break;
        case 7:
          backgroundColor = "orange";
          break;
        case 8:
          backgroundColor = "lightgreen";
          break;
        case 9:
          backgroundColor = "olivedrab";
          break;
        case 10:
          backgroundColor = "green";
          break;
        default:
          backgroundColor = "";
      }
      row.style.backgroundColor = backgroundColor;
    });
  };

  // Assuming you have state variables and setters for the conditions below
  // const [messagee, setMessagee] = useState("");
  // const [orderDetailsEnabled, setOrderDetailsEnabled] = useState(false);
  // const [bulkChangeEnabled, setBulkChangeEnabled] = useState(false);
  // const [addSrlVisible, setAddSrlVisible] = useState(false);
  // const [bulkChangeVisible, setBulkChangeVisible] = useState(false);
  // const [columnsReadOnly, setColumnsReadOnly] = useState({
  //   Dwg: true,
  //   Operation: false,
  //   QtyOrdered: false,
  //   JWCost: false,
  //   MtrlCost: false,
  // });
  useEffect(() => {
    fetchData();
    setIntSchStatus(calculateMinSrlStatus());
    updateOrderStatus();
    fetchSalesExecLists();
    // setOrderDetails();
  }, []);

  const openModal = (e) => {
    e.preventDefault();
    setAlertModal(true);
  };
  const closeModal = () => {
    setAlertModal(false);
  };
  const openRegisterOrder = (e) => {
    e.preventDefault();
    setRegisterOrder(true);
  };
  const closeRegisterOrder = () => {
    setRegisterOrder(false);
  };

  // message for Register Button
  let message = "";
  // eslint-disable-next-line default-case
  switch (OrderData?.Order_Type) {
    case "Complete":
      message =
        "No changes for Quantity, PartName or Rate will be permitted once you register. Proceed?";

      break;
    case "Scheduled":
      message =
        "You can change only Quantity once you Register a Scheduled Order, Continue?";

      break;
    case "Open":
      message =
        "You can add new serials, change Quantity and rates once you Register an Open Order, Continue?";
  }
  // Register Button
  const handleRegisterBtn = () => {
    postRequest(
      endpoints.registerOrder,
      { Order_No: orderNo, Order_Status: "Recorded" },
      (registerOrderData) => {
        setOrderData({ ...OrderData, Order_Status: "Recorded" });
        alert("Order Registered Successfully");
        closeRegisterOrder();
      }
    );
    setButtonDisabled(true);
  };

  const handleSaveBtn = () => {
    alert("Order Saved Successfully");
  };

  //ROW SEECTION FOR PROFILE
  const [orderDrawings, setOrderDrawings] = useState({});
  // eslint-disable-next-line no-unused-vars
  let [dxfFileData, setDxfFileData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  let [lengthOfCut, setLengthOfCut] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [noOfPierces, setNoofPierces] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [partNetArea, setPartNetArea] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [outOpen, setOutOpen] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [complexity, setComplexity] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [hasOpenContour, setHasOpenContour] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [partNetWeight, setPartNetWeight] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [partOutArea, setPartOutArea] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [partOutWeight, setPartOutWeight] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [rectArea, setRectArea] = useState(0);
  // eslint-disable-next-line no-unused-vars
  let [rectWeight, setRectWeight] = useState(0);
  // const [orderStatus, setOrderStatus] = useState("Created");
  let [Dwglist, setDwgList] = useState([]);

  const drawSvg = (text) => {
    setDxfFileData(text);
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
    // reader.readAsText(file.asInstanceOf[Blob]);
    reader.readAsText(file);
  };
  const selectedRowItem = (OrdrDetailsItem, imprtDwgObj) => {
    selectItem(OrdrDetailsItem);

    let srcpath = `\\Wo\\` + (orderNUmber || Orderno) + "\\DXF\\";
    console.log("srcpath", srcpath);

    let filename = OrdrDetailsItem.DwgName;
    if (orderDrawings[window.Buffer.from(filename, "base64")]) {
      const drawingFile = new File(
        [orderDrawings[window.Buffer.from(filename, "base64")]],
        filename,
        { type: "plain/text" }
      );
      displaydrawing(drawingFile);
      window.dxffile = drawingFile;
      return;
    }
    getFileRequest(
      `${endpoints.getOrdDxf}?dxfName=${filename}&srcPath=${srcpath}`,
      async (res) => {
        if (res.status !== 200) {
          // alert(" Try again Error fetching DXF file");
          return;
        }
        const content = await res.text();
        setOrderDrawings((prevState) => {
          return {
            ...prevState,
            [window.Buffer.from(filename, "base64")]: content,
          };
        });
        const drawingFile = new File([content], filename, {
          type: "plain/text",
        });
        displaydrawing(drawingFile);
        window.dxffile = drawingFile;
        return;
      }
    );
  };

  window.Buffer = Buffer;

  // function arrayBufferToString(buffer, encoding, callback) {
  //   var blob = new Blob([buffer], { type: "text/plain" });
  //   var reader = new FileReader();
  //   reader.onload = function (evt) {
  //     callback(evt.target.result);
  //   };
  //   reader.readAsText(blob, encoding);
  // }

  // Row selection in orderDetails (OLD)
  const selectItem = async (OrdrDetailsItem) => {
    const isSelected = selectedItems.includes(OrdrDetailsItem);
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = isSelected
        ? prevSelectedItems?.filter((item) => item !== OrdrDetailsItem)
        : [...prevSelectedItems, OrdrDetailsItem];
      const selectedOrderSrl = updatedSelectedItems.map(
        (item) => item.OrderDetailId
      );

      setDwgList(updatedSelectedItems);
      // setSelectedSrl(selectedOrderSrl);
      const lastSelectedRow =
        updatedSelectedItems[updatedSelectedItems.length - 1];

      setLastSlctedRow(lastSelectedRow);
      setordrDetailsChange((prevState) => ({
        ...prevState,
        DwgName: lastSelectedRow?.DwgName || "",
        MtrlSrc: lastSelectedRow?.Mtrl_Source || "",
        jwRate: lastSelectedRow?.JWCost || "",
        quantity: lastSelectedRow?.Qty_Ordered || "",
        materialRate: lastSelectedRow?.MtrlCost || "",
        unitPrice: lastSelectedRow?.UnitPrice || "",
        Operation: lastSelectedRow?.Operation || "",
        InspLvl: lastSelectedRow?.InspLevel || "",
        PkngLvl: lastSelectedRow?.PackingLevel || "",
        strmtrlcode: lastSelectedRow?.Mtrl_Code || "",
      }));
      setSelectedSrl(selectedOrderSrl);
      return updatedSelectedItems;
    });

    if (props.Type === "Profile") {
      let srcpath = `\\Wo\\` + (orderNUmber || Orderno) + "\\DXF\\";

      let filename = OrdrDetailsItem.DwgName;

      if (orderDrawings[window.Buffer.from(filename, "base64")]) {
        const drawingFile = new File(
          [orderDrawings[window.Buffer.from(filename, "base64")]],
          filename,
          { type: "plain/text" }
        );

        displaydrawing(drawingFile);
        window.dxffile = drawingFile;
        return;
      }

      await getFileRequest(
        `${endpoints.getOrdDxf}?dxfName=${filename}&srcPath=${srcpath}`,
        async (res) => {
          if (res.status !== 200) {
            // toast.error(" Try again Error fetching DXF file");
            return;
          }
          const content = await res.text();
          setOrderDrawings((prevState) => {
            return {
              ...prevState,
              [window.Buffer.from(filename, "base64")]: content,
            };
          });
          const drawingFile = new File([content], filename, {
            type: "plain/text",
          });
          displaydrawing(drawingFile);
          window.dxffile = drawingFile;
          return;
        }
      );
    }
  };

  // Row selection in orderDetails
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowItems, setSelectedRowItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortedData = () => {
    const dataCopy = [...filteredData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        if (
          sortConfig.key === "LOC" ||
          sortConfig.key === "Holes" ||
          sortConfig.key === "JWCost" ||
          sortConfig.key === "MtrlCost" ||
          sortConfig.key === "UnitPrice" ||
          sortConfig.key === "Qty_Ordered" ||
          sortConfig.key === "Total"
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

  // In ParentComponent
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToFirst = () => setCurrentIndex(0);
  const goToPrevious = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goToNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, filteredData.length - 1));
  const goToLast = () => setCurrentIndex(filteredData.length - 1);

  //Single row selection with whole row selection
  const handleRowClick = async (rowData) => {
    setSelectedItems([]);
    setSelectedSrl([]);

    if (!rowData || !rowData.OrderDetailId) {
      // alert("Invalid rowData, Please check");
      return;
    }

    const isSameRowSelected =
      selectedRow && selectedRow.OrderDetailId === rowData.OrderDetailId;
    setSelectedRow(isSameRowSelected ? null : rowData);
    setLastSlctedRow(isSameRowSelected ? null : rowData);

    if (!isSameRowSelected) {
      setSelectedItems([rowData]);
      setSelectedSrl([rowData.OrderDetailId]);
    } else {
      setSelectedItems([]);
      setSelectedSrl([]);
    }

    setordrDetailsChange((prevState) => ({
      ...prevState,
      DwgName: rowData?.DwgName || "",
      MtrlSrc: rowData?.Mtrl_Source || "",
      jwRate: rowData?.JWCost || "",
      quantity: rowData?.Qty_Ordered || "",
      materialRate: rowData?.MtrlCost || "",
      unitPrice: rowData?.UnitPrice || "",
      Operation: rowData?.Operation || "",
      InspLvl: rowData?.InspLevel || "",
      PkngLvl: rowData?.PackingLevel || "",
      strmtrlcode: rowData?.Mtrl_Code || "",
    }));

    // DXF File Handling (if applicable)
    if (props.Type === "Profile") {
      let srcpath = `\\Wo\\` + (orderNUmber || Orderno) + "\\DXF\\";
      // const WOPath = process.env.REACT_APP_SERVER_FILES;
      // let srcpath = WOPath + "\\" + (orderNUmber || Orderno) + "\\DXF\\";

      console.log("DXFsrcpath", srcpath);

      let filename = rowData.DwgName;

      // fetchData();
      if (orderDrawings[window.Buffer.from(filename, "base64")]) {
        const drawingFile = new File(
          [orderDrawings[window.Buffer.from(filename, "base64")]],
          filename,
          { type: "plain/text" }
        );
        displaydrawing(drawingFile);
        window.dxffile = drawingFile;
        return;
      }

      getFileRequest(
        `${endpoints.getOrdDxf}?dxfName=${filename}&srcPath=${srcpath}`,
        async (res) => {
          if (res.status !== 200) {
            return;
          }
          const content = await res.text();
          setOrderDrawings((prevState) => ({
            ...prevState,
            [window.Buffer.from(filename, "base64")]: content,
          }));
          const drawingFile = new File([content], filename, {
            type: "plain/text",
          });
          displaydrawing(drawingFile);
          window.dxffile = drawingFile;
        }
      );
    }
  };

  useEffect(() => {
    if (filteredData.length > 0 && currentIndex >= 0) {
      handleRowClick(filteredData[currentIndex]);
    }
  }, [currentIndex]);

  const handleKeyDown = (e) => {
    if (!LastSlctedRow || !LastSlctedRow.OrderDetailId) return;

    const currentIndex = filteredData.findIndex(
      (r) => r.OrderDetailId === LastSlctedRow.OrderDetailId
    );

    let newRow = null;
    if (e.key === "ArrowUp" && currentIndex > 0) {
      newRow = filteredData[currentIndex - 1];
    } else if (
      e.key === "ArrowDown" &&
      currentIndex < filteredData.length - 1
    ) {
      newRow = filteredData[currentIndex + 1];
    }

    if (newRow) {
      handleRowClick(newRow);
    }
  };

  // Handle multi row selection with checkbox
  const handleCheckboxChange = async (rowData) => {
    console.log("rowData", rowData);

    setSelectedRows((prevSelectedRows) => {
      const updatedRows = prevSelectedRows.some(
        (selectedRow) => selectedRow.OrderDetailId === rowData.OrderDetailId
      )
        ? prevSelectedRows.filter(
            (row) => row.OrderDetailId !== rowData.OrderDetailId
          )
        : [...prevSelectedRows, rowData];
      return updatedRows;
    });

    setSelectedRowItems((prevSelectedItems = []) => {
      if (!rowData || !rowData.OrderDetailId) {
        // alert("Invalid rowData, Please check");
        return prevSelectedItems;
      }

      const isSelected = prevSelectedItems.some(
        (item) => item.OrderDetailId === rowData.OrderDetailId
      );

      const updatedSelectedItems = isSelected
        ? prevSelectedItems.filter(
            (item) => item.OrderDetailId !== rowData.OrderDetailId
          )
        : [...prevSelectedItems, rowData];

      console.log("updatedSelectedItems-checkbox", updatedSelectedItems);

      setSelectedItems(updatedSelectedItems);

      const selectedOrderSrl = updatedSelectedItems.map(
        // (item) => item.Order_Srl
        (item) => item.OrderDetailId
      );

      const lastSelectedRow =
        updatedSelectedItems[updatedSelectedItems.length - 1] || null;

      // eslint-disable-next-line no-unused-vars
      const lastUncheckedRow =
        updatedSelectedItems[updatedSelectedItems.length] || null;
      // setSelectedRow(lastSelectedRow);
      setLastSlctedRow(lastSelectedRow);
      setordrDetailsChange((prevState) => ({
        ...prevState,
        DwgName: lastSelectedRow?.DwgName || "",
        MtrlSrc: lastSelectedRow?.Mtrl_Source || "",
        jwRate: lastSelectedRow?.JWCost || "",
        quantity: lastSelectedRow?.Qty_Ordered || "",
        materialRate: lastSelectedRow?.MtrlCost || "",
        unitPrice: lastSelectedRow?.UnitPrice || "",
        Operation: lastSelectedRow?.Operation || "",
        InspLvl: lastSelectedRow?.InspLevel || "",
        PkngLvl: lastSelectedRow?.PackingLevel || "",
        strmtrlcode: lastSelectedRow?.Mtrl_Code || "",
      }));

      setSelectedSrl(selectedOrderSrl);

      if (props.Type === "Profile") {
        let srcpath = `\\Wo\\` + (orderNUmber || Orderno) + "\\DXF\\";

        let filename = rowData.DwgName;
        if (orderDrawings[window.Buffer.from(filename, "base64")]) {
          const drawingFile = new File(
            [orderDrawings[window.Buffer.from(filename, "base64")]],
            filename,
            { type: "plain/text" }
          );
          displaydrawing(drawingFile);
          window.dxffile = drawingFile;
          return updatedSelectedItems;
        }

        getFileRequest(
          `${endpoints.getOrdDxf}?dxfName=${filename}&srcPath=${srcpath}`,
          async (res) => {
            if (res.status !== 200) {
              // toast.error(" Try again Error fetching DXF file");
              return;
            }
            const content = await res.text();
            setOrderDrawings((prevState) => ({
              ...prevState,
              [window.Buffer.from(filename, "base64")]: content,
            }));
            const drawingFile = new File([content], filename, {
              type: "plain/text",
            });
            displaydrawing(drawingFile);
            window.dxffile = drawingFile;
          }
        );
      }

      return updatedSelectedItems;
    });

    setSelectedRow(null);
  };

  console.log("After Update", selectedItems);

  // selectAll button
  const handleSelectAll = () => {
    setSelectedRows(OrdrDetailsData);
    setSelectedItems(OrdrDetailsData);
    const selectedOrderSrl = OrdrDetailsData.map((item) => item.OrderDetailId);
    setSelectedSrl(selectedOrderSrl);
  };

  // console.log("selectedItems", selectedItems);
  // console.log("selectedSrl", selectedSrl);
  console.log("selectedRow", selectedRow);
  console.log("selectedCheckbox", selectedRows.length);

  // console.log("updatedSelectedItems-slctAll", selectedSrl);

  // reverse Button
  const handleReverseSelection = () => {
    if (selectedRows.length === 0) {
      handleSelectAll();
    } else {
      const newArray = [];

      for (let i = 0; i < OrdrDetailsData.length; i++) {
        const element = OrdrDetailsData[i];
        if (selectedRows.includes(element)) {
        } else {
          newArray.push(element);
        }
      }
      setSelectedRows(newArray);
      setSelectedItems(newArray);
    }
  };

  // console.log("1405Selected rowss---", selectedRows);
  console.log("list--3", selectedItems);

  //Sales Job Work
  const [scheduleType, setScheduleType] = useState("Job Work");
  const [scheduleOption, setScheduleOption] = useState("Full Order");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(OrdrDetailsData);
  }, [OrdrDetailsData]);

  console.log("filteredData", filteredData);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredData, LastSlctedRow]);

  useEffect(() => {
    postRequest(
      endpoints.getScheduleListData,
      { Order_No: OrderData.Order_No },
      (response) => {
        setScheduleListData(response);
        // console.log("==Updated scheduleListData:", scheduleListData);
      }
    );
  }, [filteredData]);

  const handleScheduleTypeChange = (event) => {
    const { value } = event.target;
    setScheduleType(value);

    // console.log("=Radio Button Changed:", value);

    if (value === "Job Work") {
      const JWData = OrdrDetailsData.filter(
        (item) => item.Mtrl_Source.toLowerCase() === "customer"
      );
      setFilteredData(JWData);
    } else if (value === "Sales") {
      const SalesData = OrdrDetailsData.filter(
        (item) => item.Mtrl_Source.toLowerCase() === "magod"
      );

      setFilteredData(SalesData);
    } else {
      setFilteredData(OrdrDetailsData);
    }
  };

  const handleClearFilters = () => {
    setScheduleType(""); // Reset schedule type selection
    setFilteredData(OrdrDetailsData); // Reset data to original unfiltered state
  };

  // Handle change for schedule option radio buttons
  const handleScheduleOptionChange = (event) => {
    const { value } = event.target;
    setScheduleOption(value);
    if (value === "Partial Order") {
      toast.warning("Only Selected Serials will be included in the Schedule", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.warning("All Serials will be included in the Schedule", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <>
      <div>
        {/* <button onClick={saveJWMRChanges}>update</button> */}
        <FormHeader
          OrderData={OrderData}
          OrderCustData={OrderCustData}
          handleRegisterBtn={handleRegisterBtn}
          handleSaveBtn={handleSaveBtn}
          isButtonDisabled={isButtonDisabled}
          openRegisterOrder={openRegisterOrder}
          closeRegisterOrder={closeRegisterOrder}
          openModal={openModal}
          closeModal={closeModal}
          updateOrdrData={updateOrdrData}
          fromPath={fromPath}
          orderNUmber={orderNUmber}
          orderType={orderType}
          Cust_Code={Cust_Code}
          FabOrderNo={FabOrderNo}
          // saveJWMRChanges={saveJWMRChanges}
          saveJWMRChanges={
            editedData && Object.keys(editedData).length > 0
              ? saveJWMRChanges
              : null
          }
        />

        <Tabs className="nav-tabs tab_font">
          <Tab eventKey="orderinfo" title="Order Info">
            <OrderInfo
              OrderData={OrderData}
              salesExecdata={salesExecdata}

              // handleChangeOrderInfo={handleChangeOrderInfo}
              // deliveryDate={deliveryDate}
            />
          </Tab>
          <Tab
            eventKey="productionschedulecreation"
            title="Production Schedule Creation"
          >
            <ProductionScheduleCreation
              OrderData={OrderData}
              selectedItems={selectedItems}
              setScheduleListData={setScheduleListData}
              scheduleType={scheduleType}
              scheduleOption={scheduleOption}
              handleScheduleTypeChange={handleScheduleTypeChange}
              handleClearFilters={handleClearFilters}
              handleScheduleOptionChange={handleScheduleOptionChange}
              OrdrDetailsData={OrdrDetailsData}
              selectedRows={selectedRows}
              selectedSrl={selectedSrl}
              setSelectedSrl={setSelectedSrl}
              setSelectedRows={setSelectedRows}
              setSelectedItems={setSelectedItems}
              setSelectedRowItems={setSelectedRowItems}
              setLastSlctedRow={setLastSlctedRow}
              setSelectedRow={setSelectedRow}
              fetchData={fetchData}
            />
          </Tab>
          <Tab eventKey="findoldpart" title="Find Old Part">
            <FindOldPart
              OrderData={OrderData}
              findOldpart={findOldpart}
              setfindOldpart={setfindOldpart}
              FindOldPartData={FindOldPartData}
            />
          </Tab>
          <Tab eventKey="materialinfo" title="Material Info">
            <MaterialInfo OrderData={OrderData} />
          </Tab>
        </Tabs>
        <div className="mt-1">
          <Tabs className="nav-tabs tab_font">
            <Tab eventKey="orderdetails" title="Order Details">
              <OrderDetails
                OrderData={OrderData}
                OrderCustData={OrderCustData}
                OrdrDetailsData={OrdrDetailsData}
                setOrdrDetailsData={setOrdrDetailsData}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                selectItem={selectItem}
                selectedRowItem={selectedRowItem}
                LastSlctedRow={LastSlctedRow}
                setLastSlctedRow={setLastSlctedRow}
                // handleBulkCngBtn={handleBulkCngBtn}
                fetchData={fetchData}
                BomData={BomData}
                setBomData={setBomData}
                findOldpart={findOldpart}
                setfindOldpart={setfindOldpart}
                handleSelectAll={handleSelectAll}
                handleReverseSelection={handleReverseSelection}
                selectedSrl={selectedSrl}
                // insertnewsrldata={insertnewsrldata}
                oldOrderListData={oldOrderListData}
                oldOrderDetailsData={oldOrderDetailsData}
                //---------new
                newSerial={newSerial}
                setNewSerial={setNewSerial}
                ordrDetailsChange={ordrDetailsChange}
                setordrDetailsChange={setordrDetailsChange}
                blkChange={blkChange}
                setBlkChange={setBlkChange}
                imprtDwgObj={imprtDwgObj}
                setImprtDwgObj={setImprtDwgObj}
                handleChange={handleChange}
                InputField={InputField}
                setDetailsColour={setDetailsColour}
                calculateMinSrlStatus={calculateMinSrlStatus}
                updateOrderStatus={updateOrderStatus}
                getStatusText={getStatusText}
                scheduleType={scheduleType}
                scheduleOption={scheduleOption}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                Dwglist={Dwglist}
                // newSerial={newSerial}
                // setNewSerial={setNewSerial}
                handleJWMR={handleJWMR}
                handleRowClick={handleRowClick}
                handleCheckboxChange={handleCheckboxChange}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                setSelectedRowItems={setSelectedRowItems}
                selectedRowItems={selectedRowItems}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                sortedData={sortedData}
                // OrdrDetailsItem={OrdrDetailsItem}

                //Handle arrow keys
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                goToFirst={goToFirst}
                goToPrevious={goToPrevious}
                goToNext={goToNext}
                goToLast={goToLast}
                FindOldOrderButtonData={FindOldOrderButtonData}
                OdrDtlMtrlSrc={OdrDtlMtrlSrc}
                REACT_APP_GETCALCREQ_URL={REACT_APP_GETCALCREQ_URL}
                API={API}
              />
            </Tab>
            <Tab eventKey="scheduleList" title="Schedule List">
              <ScheduleList
                OrderData={OrderData}
                OrderCustData={OrderCustData}
                scheduleListData={scheduleListData}
                setScheduleListData={setScheduleListData}
                type={props.Type}
                scheduleType={scheduleType}
                OrdrDetailsData={OrdrDetailsData}
                orderNUmber={orderNUmber}
                orderType={orderType}
                Cust_Code={Cust_Code}
              />
            </Tab>
            <Tab eventKey="profarmaInvoiceList" title="Profarma Invoice List">
              <ProfarmaInvoiceList
                OrderData={OrderData}
                OrderCustData={OrderCustData}
                selectedItems={selectedItems}
                profarmaInvMain={profarmaInvMain}
                profarmaInvDetails={profarmaInvDetails}
                fetchData={fetchData}
              />
            </Tab>
            {/* {props.Type === "Profile" ? (
							<Tab
								eventKey="materialPlanner"
								title="Material Planner">
								<MaterialPlanner OrderData={OrderData} />
							</Tab>
						) : null} */}
          </Tabs>
        </div>

        <AlertModal
          show={alertModal}
          onHide={(e) => setAlertModal(e)}
          firstbutton={closeModal}
          title="magod_Order"
          message="Record Saved"
          firstbuttontext="Ok"
        />

        <AlertModal
          show={registerOrder}
          onHide={(e) => setRegisterOrder(e)}
          firstbutton={handleRegisterBtn}
          secondbutton={closeRegisterOrder}
          title="magod_Order"
          message={message}
          firstbuttontext="Yes"
          secondbuttontext="No"
        />
      </div>
    </>
  );
}
