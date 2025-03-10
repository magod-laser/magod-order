import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import AlertModal from "../../../Components/Alert";
import { Modal } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

import { Tab, Table, Tabs, Form } from "react-bootstrap";
import { useOrderContext } from "../../../../../../../context/OrderContext";

import moment from "moment";
import AddNewSrlModal from "./Modals/AddNewSrlModal";
//import { Helper } from 'dxf';

const { dxfupload } = require("../../../../../../api/apiconn");
const {
  getRequest,
  postRequest,
} = require("../../../../../../api/apiinstance");
const { endpoints } = require("../../../../../../api/constants");

export default function OrderDetails(props) {
  // console.log("propssss", props.Type);
  const [alertModal, setAlertModal] = useState(false);
  const [registerOrder, setRegisterOrder] = useState(false);
  let navigate = useNavigate();

  let { orders, setOrderState } = useOrderContext() || {};

  const [orderStatus, setOrderStatus] = useState("Created");
  const [orderSrl, setOrderSrl] = useState(0);

  let [Orderno, setOrderno] = useState("");
  let [ordertype, setOrdertype] = useState("");
  let [ordDwgDetsData, setOrdDwgDetsData] = useState([]);
  let [ordMatDimensData, setOrdMatDimensData] = useState([]);
  let [ordRectDetsData, setOrdRectDetsData] = useState([]);
  let [ordMtrlDetsData, setOrdMtrlDetsData] = useState([]);
  let [ordDwgtskDetsData, setOrdDwgTskDetsData] = useState([]);
  let [ordCustTaskData, setOrdCustTaskData] = useState([]);
  let [ordDimensData, setOrdDimensData] = useState([]);
  let [ordProformaData, setOrdProformaData] = useState([]);
  let [ordProformaMatData, setOrdProformaMatData] = useState([]);
  let [ordDetsDwgData, setOrdDetsdwg] = useState([]);
  let [ordDetsData, setOrdDetsData] = useState([]);
  let [custdata, setCustdata] = useState([]);
  let [mtrldata, setMtrldata] = useState([]);
  let [procdata, setProcdata] = useState([]);
  let [mtrlsrcdata, setMtrlSrcdata] = useState([]);
  let [inspdata, setInspdata] = useState([]);
  let [packdata, setPackdata] = useState([]);
  let [salesExecdata, setSalesExecdata] = useState([]);
  let [quotationno, setQuotationNo] = useState("");

  let [selectedDwgId, setSelectedDwgId] = useState("");
  let [gradeid, setGradeID] = useState("");
  let [thickness, setThickness] = useState("");
  let [specificwt, setSpecificWt] = useState(0);
  let [grade, setGrade] = useState("");
  let [material, setMaterial] = useState("");
  let [lengthOfCut, setLengthOfCut] = useState(0);
  let [noOfPierces, setNoofPierces] = useState(0);
  let [partNetArea, setPartNetArea] = useState(0);
  let [outOpen, setOutOpen] = useState(0);
  let [complexity, setComplexity] = useState(0);
  let [hasOpenContour, setHasOpenContour] = useState(0);
  let [partNetWeight, setPartNetWeight] = useState(0);
  let [partOutArea, setPartOutArea] = useState(0);
  let [partOutWeight, setPartOutWeight] = useState(0);
  let [rectArea, setRectArea] = useState(0);
  let [rectWeight, setRectWeight] = useState(0);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [formDealingEngineer, setFormDealingEngineer] = useState("");
  let [dxffiledata, setDxfFileData] = useState("");
  let [tolerancedata, setTolerancedata] = useState([]);
  let [OrdSchData, setOrdSchData] = useState([]);
  let [orderdetailsdata, setOrderDetailsData] = useState([]);

  let [salesExecContact, setSalesExecContact] = useState("");
  let [dealingEngineer, setDealingEngineer] = useState("");
  let [receivedby, setReceivedBy] = useState("");
  let [purchaseorder, setPurchaseOrder] = useState("");
  let [custdwgfiles, setCustDwgFiles] = useState([]);
  let [Dwg, setDwg] = useState([]);
  //let [Image, setImage] = useState([]);
  let [customername, setCustomer] = useState("");
  let [recordedby, setRecordedby] = useState("");
  let [deliveryDate, setDeliveryDate] = useState("");
  let [custCode, setCustCode] = useState("");

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

  // let Oformat = searchParams.get("OrdType");

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

  let ordno = "";
  useEffect(() => {
    //Console.log(orders);
    // //Console.log(orders.orderno);
    // //Console.log(orders.ordertype);
    // //Console.log(orders.paymentterms);
    async function fetchData() {
      setOrderno(orders.orderno);
      setOrderno(orders.orderno);
      setCustCode(orders.custcode);
      setOrdertype(orders.ordertype);
      // setDeliveryDate(deliverydate);
      setDeliveryDate(orders.deliverydate);
      // let SlsContact =orders.salesContact;
      // setReceivedBy(orders.receivedby);
      // setRecordedby(orders.RecordedBy);
      setPurchaseOrder(orders.purchaseorder);
      setQuotationNo(orders.qtnno);
      //Console.log(" Quote No : " + orders.qtnno);
      setCustCode(orders.custCode);
      postRequest(
        endpoints.getCustomerDets,
        { custcode: orders.custcode },
        (custdata) => {
          setCustomer(custdata[0]["Cust_name"]);
          setCustdata(custdata);
        }
      );

      await postRequest(endpoints.getSalesExecLists, {}, (sdata) => {
        //Console.log(sdata);
        setSalesExecdata(sdata);
      });
      await postRequest(
        endpoints.getSalesIndiExecLists,
        { salesContact: orders.salesContact },
        (sdata) => {
          //Console.log(sdata[0]["Name"]);
          setSalesExecContact(sdata[0]["Name"]);
        }
      );
      // await postRequest(endpoints.getSalesIndiExecLists, { salesContact: order.DealingEngineer }, (ddata) => {
      //     setDealingEngineer(ddata[0]["Name"]);
      // });
      await postRequest(
        endpoints.getSalesIndiExecLists,
        { salesContact: orders.RecordedBy },
        (recdata) => {
          setRecordedby(recdata[0]["Name"]);
        }
      );
      await postRequest(
        endpoints.getSalesIndiExecLists,
        { salesContact: orders.receivedby },
        (rcvddata) => {
          setReceivedBy(rcvddata[0]["Name"]);
        }
      );
      getRequest(endpoints.getMaterials, (mtrdata) => {
        //Console.log(mtrdata);
        setMtrldata(mtrdata);
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
    }
    fetchData();
  }, []);

  const [importdwgshow, setImportDwgShow] = useState(false);
  const handleImportDwg = () => setImportDwgShow(true);
  const handleCloseImportDwg = () => setImportDwgShow(false);

  let selectItem = (item) => {
    setDwg(item);
  };

  let selectMtrl = async (e) => {
    console.log("entering into select Mtrl");
    e.preventDefault();
    const value = e.target.value;
    console.log("Select Material" + e.target.value);
    setStrMtrlCode(e.target.value);

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
    console.log(e.target.value);
  };
  let selectInsp = async (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

  let selectPack = async (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

  let selectTolerance = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    let toltype;
    for (let i = 0; i < tolerancedata.length; i++) {
      if (tolerancedata[i]["ToleranceType"] === e.target.value) {
        toltype = tolerancedata[i];
        break;
      }
    }
    setStrTolerance(e.target.value);
  };
  let selectMtrlSrc = async (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

  let locCalc = async (drwfile, material, grade, thickness, cb) => {
    const formData = new FormData();
    //  window.dxffiles.forEach(async (dfile) => {
    formData.append("file", drwfile); //files[i]);
    formData.append("thickness", thickness);
    formData.append("specficWeight", specificwt); // resp[0].Specific_Wt);
    //  setSpecificWt(resp[0].Specific_Wt);
    //Console.log("Sending to Service");
    // const getCalcReq = await fetch('http://127.0.0.1:21341/getCalc', {
    const getCalcReq = await fetch("http://localhost:21341/getCalc", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
    const res = await getCalcReq.json();
    //   const data = await res.json();
    //    //Console.log("Get Calc Response");
    //Console.log(res.data);
    //Console.log(res.data.partOutArea);

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
    //  setSpecificWt(res.Specific_Wt)
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
    //, spWeight: res.data.Specific_Wt
    // setQtnProfileData((olddata) => [...olddata, { file: files[i], operation: process, material, grade, thickness, quantity, materialcode,loc }]);
    //});
  };

  async function dxfupload(files, destPath, response) {
    const data = new FormData();
    //Console.log(files);
    for (let i = 0; i < files.length; i++) {
      data.append("files", files[i]);
    }
    //Console.log(data);
    let API = "http://localhost:6001";
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

  let importdrawings = async (e) => {
    e.preventDefault();
    //Console.log("Import Drawings");

    if (!(orderStatus === "Created" || orderStatus === "Recorded")) {
      alert("Cannot import after the Order is recorded");
      return;
    }

    ////Console.log(document.getElementById("mtrlcode").value);
    // let materialcode = mtrlcode; //e.target.elements.mtrlcode.value;
    let materialcode = strmtrlcode;
    //Console.log("materialcode", materialcode);
    let process = strprocess; //e.target.elements.processdescription.value;
    let quantity = quantity; // e.target.elements.quantity.value;
    let materialsource = strSource; // e.target.elements.materialsource.value;
    let tolerance = strtolerance; // e.target.elements.tolerance.value;
    let insplevel = strInsp; // e.target.elements.insplevel.value;
    let packinglevel = strPkng; // e.target.elements.packinglevel.value;
    let files = e.target.elements.files.files;
    setDblCuttingRate(dblCuttingRate);
    setDblPierceRate(dblPierceRate);

    for (let i = 0; i < files.length; i++) {
      //Console.log(files[i]);
      let drwfname = files[i];

      //Console.log(drwfname);
      locCalc(drwfname, material, grade, thickness, (output) => {
        //Console.log(output);
        //   //Console.log("Qtn Profile Data : ", typeof qtnProfileData);

        let olddata = Object.entries(orderdetailsdata).map(([key, value]) => ({
          key,
          value,
        }));
        //  let olddata = [...qtnProfileData];

        //Console.log("Old Data : " + olddata);
        if (olddata === null || olddata === undefined) {
          // Handle the case where olddata is null
          return;
        } else {
          setOrderDetailsData((olddata) => {
            // Append to existing olddata
            return [
              ...olddata,
              {
                file: files[i],
                operation: process,
                material,
                grade,
                thickness,
                quantity,
                mtrlcode,
                lengthOfCut: output.lengthOfCut,
                noOfPierces: output.noOfPierces, // ? 1 : 0,
                partNetArea: output.partNetArea,
                complexity: output.complexity,
                hasOpenContour: output.hasOpenContour,
                outOpen: output.outOpen,
                partNetWeight: output.partNetWeight,
                partOutArea: output.partOutArea,
                partOutWeight: output.partOutWeight,
                rectArea: output.rectArea,
                rectWeight: output.rectWeight,
              },
            ];
          });
        }
      });

      //  let LOC = parseFloat(CuttingLength * 0.001).tofixed(2)
      //  let Holes = PierceCount

      //  let JWCost = Math.Round(LOC * dblCuttingRate + Holes * dblPierceRate, 0)
      // .MtrlCost = 0
      // .delivery_date = DateTimePicker_DelDate.Value.ToString
    }

    // let qno = quotationNo.replaceAll("/", "_");
    // let month = qno.split("_")[1]
    // let monthName = ["January", "Febraury", "March", "April", "May", "June",
    //     "July", "August", "September", "October", "November", "December"][parseInt(month) - 1]

    let destPath = `\\Wo\\` + Orderno + "\\DXF\\"; //quotationNo;

    dxfupload(files, destPath, (res) => {
      //Console.log(res);
    });

    window.dxffiles = files;
    //Console.log(
    //   materialcode,
    //   material,
    //   grade,
    //   thickness,
    //   process,
    //   quantity,
    //   files
    // );
    setShow(false);
  };
  return (
    <>
      <div>
        <AddNewSrlModal
          importdwgshow={importdwgshow}
          setImportDwgShow={setImportDwgShow}
          handleImportDwg={handleImportDwg}
          handleCloseImportDwg={handleCloseImportDwg}
          importdrawings={importdrawings}
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
        />
        <div className="row mt-4">
          <div className="col-md-2 mt-2 col-sm-12">
            <button className="button-style">
              {/* onClick={(e) => handleImportDwg()} */}
              Import DWG
            </button>
          </div>
          <div className="col-md-2 mt-2 col-sm-12">
            <Link to="/Orders/ImportExcelForm">
              <button className="button-style ">Import EXCEL</button>
            </Link>
          </div>
          <div className="col-md-2 mt-2 col-sm-12">
            <Link to="/Orders/ImportQtn">
              {" "}
              <button className="button-style ">Import Qtn</button>
            </Link>
          </div>
          <div className="col-md-2 mt-2 col-sm-12">
            <button className="button-style ">Import Old Order</button>
          </div>
          <div className="col-md-2 mt-2 col-sm-12">
            <button className="button-style ">Delete</button>
          </div>
          <div className="col-md-2 mt-2 col-sm-12">
            <button className="button-style ">Bulk Change</button>
          </div>
          <div className="col-md-2 mt-2 col-sm-12">
            <button className="button-style ">Select All</button>
          </div>
          <div className="col-md-2 mt-2 col-sm-12">
            <button className="button-style ">Reverse</button>
          </div>

          <div className="col-md-2 mt-2 col-sm-12">
            <Link to={"/Orders/EditDXF"}>
              <button className="button-style ">Edit Dxf</button>
            </Link>
          </div>
          {/* {props.Type === "Profile" ? (
          ) : null}  */}
          {/* {props.Type === "Profile" ? (
            <div className="col-md-2 mt-2 col-sm-12">
              <Link to={"/Orders/EditDXF"}>
                <button className="button-style ">Edit Dxf</button>
              </Link>
            </div>
          ) : null} */}
        </div>
        <div className="row mt-5">
          <div className="col-md-6 col-sm-12">
            <div>
              <div className="row">
                <div style={{ overflowX: "scroll", overflowY: "scroll" }}>
                  <Table
                    striped
                    className="table-data border"
                    style={{ border: "1px", height: "860px" }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>Select</th>
                        <th style={{ whiteSpace: "nowrap" }}>
                          Drawing/Part Name
                        </th>
                        <th style={{ whiteSpace: "nowrap" }}>Dwg Exists</th>
                        <th>Material</th>
                        <th>Operation</th>
                        <th>Source</th>
                        <th style={{ whiteSpace: "nowrap" }}>Insp Level</th>
                        <th>Tolerance</th>
                        <th style={{ whiteSpace: "nowrap" }}>Packing Level</th>
                        <th>LOC</th>
                        <th>Pierces</th>
                        <th style={{ whiteSpace: "nowrap" }}>JW Cost</th>
                        <th style={{ whiteSpace: "nowrap" }}>Mtrl Cost</th>
                        <th style={{ whiteSpace: "nowrap" }}>Unit Rate</th>
                        <th style={{ whiteSpace: "nowrap" }}>Qty Ordered</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      <tr>
                        <th>Select</th>
                        <th style={{ whiteSpace: "nowrap" }}>
                          Drawing/Part Name
                        </th>
                        <th style={{ whiteSpace: "nowrap" }}>Dwg Exists</th>
                        <th>Material</th>
                        <th>Operation</th>
                        <th>Source</th>
                        <th style={{ whiteSpace: "nowrap" }}>Insp Level</th>
                        <th>Tolerance</th>
                        <th style={{ whiteSpace: "nowrap" }}>Packing Level</th>
                        <th>LOC</th>
                        <th>Pierces</th>
                        <th style={{ whiteSpace: "nowrap" }}>JW Cost</th>
                        <th style={{ whiteSpace: "nowrap" }}>Mtrl Cost</th>
                        <th style={{ whiteSpace: "nowrap" }}>Unit Rate</th>
                        <th style={{ whiteSpace: "nowrap" }}>Qty Ordered</th>
                        <th>Total</th>
                      </tr>
                      {/* {ordDwgtskDetsData.length > 0 ? (
                              ordDwgtskDetsData.map((orddwgtskdets, index) => {
                                return (
                                  <tr
                                    key={orddwgtskdets.index}
                                    onClick={() => selectItem(orddwgtskdets)}
                                  >
                                    <td>
                                      <Form.Check
                                        type="checkbox"
                                        id="selected"
                                      />
                                    </td>
                                    <td>{orddwgtskdets["DwgName"]}</td>
                                    <td>{orddwgtskdets["Dwg"]}</td>
                                    <td>{orddwgtskdets["Mtrl_Code"]}</td>
                                    <td>{orddwgtskdets["Operation"]}</td>
                                    <td>{orddwgtskdets["Mtrl_Source"]}</td>
                                    <td>{orddwgtskdets["InspLevel"]}</td>
                                    <td>{orddwgtskdets["Tolerance"]}</td>
                                    <td>{orddwgtskdets["PackingLevel"]}</td>
                                    <td>{orddwgtskdets["LOC"]}</td>
                                    <td>{orddwgtskdets["Holes"]}</td>
                                    <td>{orddwgtskdets["JWCost"]}</td>
                                    <td>{orddwgtskdets["MtrlCost"]}</td>
                                    <td>{orddwgtskdets["UnitRate"]}</td>
                                    <td>{orddwgtskdets["Qty_Ordered"]}</td>
                                    <td>{orddwgtskdets["Total"]}</td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colspan={16}>No Items Added</td>
                              </tr>
                            )} */}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <Tabs>
              <Tab eventKey="drawing" title="Drawing">
                <div
                  id="dxf-content-container"
                  className="dxf-content-container"
                />
              </Tab>
              <Tab eventKey="orderDetailsForm" title="Order Details">
                <div>
                  <div className="row">
                    <div className="col-md-8 col-sm-12">
                      <Form className="mt-2">
                        <div className="ip-box form-bg">
                          <div className="row mt-3">
                            <div className="col-md-6 col-sm-12">
                              <h5>
                                <b>Order Details</b>
                              </h5>
                              <div className="row">
                                <div>
                                  <label
                                    className="form-label"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Srl No
                                  </label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mt-4 col-sm-12">
                              {/* <Link to={"/Orders/Service/NewOrderSerial"}> */}
                              <button
                                className="button-style "
                                style={{ width: "135px" }}
                                // onClick={(e) => handleImportDwg()}
                              >
                                Add New Serial
                              </button>
                              {/* </Link> */}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label
                                    className="form-label"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Drawing Name
                                  </label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label
                                    className="form-label"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Job Work Rate
                                  </label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label className="form-label">Material</label>
                                  <select
                                    id=""
                                    className="ip-select dropdown-field "
                                  >
                                    <option value="option1">option 1</option>
                                    <option value="option2">option 2</option>
                                    <option value="option3">option 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label
                                    className="form-label"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Material Rate
                                  </label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label
                                    className="form-label"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Material Source
                                  </label>
                                  <select
                                    id=""
                                    className="ip-select dropdown-field "
                                  >
                                    <option value="option1">option 1</option>
                                    <option value="option2">option 2</option>
                                    <option value="option3">option 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label
                                    className="form-label"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Unit Price
                                  </label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label className="form-label">
                                    Operation
                                  </label>
                                  <select
                                    id=""
                                    className="ip-select dropdown-field "
                                  >
                                    <option value="option1">option 1</option>
                                    <option value="option2">option 2</option>
                                    <option value="option3">option 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label
                                    className="form-label"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Inspection Level
                                  </label>
                                  <select
                                    id=""
                                    className="ip-select dropdown-field "
                                  >
                                    <option value="option1">option 1</option>
                                    <option value="option2">option 2</option>
                                    <option value="option3">option 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label className="form-label">Quantity</label>
                                  <input className="in-fields" type="text" />
                                  <div className="row">
                                    <div className="col-md-8  col-sm-12 mt-1">
                                      <label
                                        className="form-label"
                                        style={{
                                          whiteSpace: "nowrap",
                                          marginLeft: "-10px",
                                        }}
                                      >
                                        Has BOM
                                      </label>
                                    </div>
                                    <div className="col-md-4 col-sm-12 mt-2 mb-1">
                                      <input
                                        type="checkbox"
                                        className="checkBoxStyle"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <div className="row">
                                <div>
                                  <label
                                    className="form-label"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Packing Level
                                  </label>
                                  <select
                                    id=""
                                    className="ip-select dropdown-field "
                                  >
                                    <option value="option1">option 1</option>
                                    <option value="option2">option 2</option>
                                    <option value="option3">option 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>

                    <div className="col-md-4 col-sm-12">
                      <Form className="mt-2">
                        <div
                          className="ip-box form-bg"
                          style={{ height: "570px", width: "190px" }}
                        >
                          <h5 className="mt-3">
                            <b>Process details</b>
                          </h5>
                          <div className="row">
                            <div>
                              <label className="form-label">Ordered</label>
                              <input className="in-fields" type="text" />
                            </div>
                          </div>
                          <div className="row">
                            <div>
                              <label className="form-label">Scheduled</label>
                              <input className="in-fields" type="text" />
                            </div>
                          </div>
                          <div className="row">
                            <div>
                              <label className="form-label">Produced</label>
                              <input className="in-fields" type="text" />
                            </div>
                          </div>
                          <div className="row">
                            <div>
                              <label className="form-label">Packed</label>
                              <input className="in-fields" type="text" />
                            </div>
                          </div>
                          <div className="row">
                            <div>
                              <label className="form-label">Delivered</label>
                              <input className="in-fields" type="text" />
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                  <Form
                    className="mt-2"
                    style={{ marginLeft: "10px", width: "575px" }}
                  >
                    <div className="ip-box form-bg">
                      <h5 className="mt-1">
                        <b>Load Drawing</b>
                      </h5>
                      <div className="row">
                        <div className="col-md-12 col-sm-12">
                          <div className="row">
                            <div className="col-md-6 com-sm-12">
                              <select
                                id=""
                                className="ip-select dropdown-field "
                                style={{ width: "230px" }}
                              >
                                <option value="option1">option 1</option>
                                <option value="option2">option 2</option>
                                <option value="option3">option 3</option>
                              </select>
                            </div>
                            <div className="col-md-6 com-sm-12">
                              <select
                                id=""
                                className="ip-select dropdown-field "
                                style={{ width: "230px" }}
                              >
                                <option value="option1">option 1</option>
                                <option value="option2">option 2</option>
                                <option value="option3">option 3</option>
                              </select>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mt-3 com-sm-12">
                              <button
                                className="button-style "
                                style={{ width: "230px" }}
                              >
                                Add Drawing to Order
                              </button>
                            </div>
                            <div className="col-md-6 mt-3 com-sm-12">
                              <button
                                className="button-style "
                                style={{ width: "230px" }}
                              >
                                Save to Customer Drawings
                              </button>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 com-sm-12">
                              <div className="row">
                                <div>
                                  <label className="form-label">LOC</label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                              <div className="row">
                                <div>
                                  <label className="form-label">Process</label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                              <div className="row">
                                <div>
                                  <label className="form-label">
                                    Pat Weight
                                  </label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 com-sm-12">
                              <div className="row">
                                <div>
                                  <label className="form-label">Process</label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                              <div className="row">
                                <div>
                                  <label className="form-label">
                                    Job Work Cost
                                  </label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                              <div className="row">
                                <div>
                                  <label className="form-label">
                                    Material Cost
                                  </label>
                                  <input className="in-fields" type="text" />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-2  col-sm-12 mt-1">
                                  <label
                                    className="form-label"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Has BOM
                                  </label>
                                </div>
                                <div className="col-md-10 col-sm-12 mt-3 mb-4">
                                  <input
                                    className="in-fields checkBoxStyle"
                                    type="checkbox"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
