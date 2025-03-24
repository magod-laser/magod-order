import React, { useEffect, useState } from "react";
//import FindOrderHeaderTabs from "./Header Tabs/FindOrderHeaderTabs";
//import FindOrderBodyTabs from "./Body Tabs/FindOrderBodyTabs";
import { Link, useNavigate } from "react-router-dom";
import AlertModal from "./Components/Alert";
import { Modal } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

import { Tab, Table, Tabs, Form } from "react-bootstrap";
import { useOrderContext } from "../../../../context/OrderContext";

import moment from "moment";
//import { Helper } from 'dxf';

const { dxfupload } = require("../../../api/apiconn");

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

export default function ScheduleCreationForm(props) {
  console.log("propssss", props.Type);
  const [alertModal, setAlertModal] = useState(false);
  const [registerOrder, setRegisterOrder] = useState(false);
  let navigate = useNavigate();

  let { orders, setOrderState } = useOrderContext() || {};

  const [orderStatus, setOrderStatus] = useState("Created");
  const [orderSrl, setOrderSrl] = useState(0);
  //let [dxfFolderShow, setDxfFolderShow] = useState(false);

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
  //0-----
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
      // getRequest(endpoints.getProcessLists, (pdata) => {
      //   setProcdata(pdata);
      // });
      //20012025
      getRequest(endpoints.getProcessLists, (pdata) => {
        let filteredprocess = pdata.filter(
          // eslint-disable-next-line no-undef
          (p) => p["type"] === Lower(ordertype)
        );
        // setProcdata(pdata);
        setProcdata(filteredprocess);
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
            (output) => { }
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

  const fnOpenFolder = () => {
alert("Scchedule Creation Form.jsx - Open Folder");

    // let docNo = Orderno;
    // let Doctype = "Order";
    // let mspath = process.env.REACT_APP_SERVER_FILES;
    // let mpath = `${mspath}\\${docNo}\\DXF\\`;

    // //***************************************************** */
    // // Popup to open the folder 
    // //***************************************************** */
    // setDxfFolderShow(true);

    // let destPath = `\\Wo\\` + docNo + "\\DXF\\";

    // postRequest(endpoints.getDwgFiles, { Doctype, docNo, destPath }, (fileslist) => {
    //   setBS_DxfFilesList(fileslist);
    // });

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

  console.log("ordDwgtskDetsData is", ordDwgtskDetsData);

  return (
    <div>
      <div className="col-md-12">
        <h4 className="title">Schedule List Creation Form</h4>
      </div>
      <h5 className="mt-1">
        <b>
          Order No: {props.Type} - {orders?.orderno}
        </b>
        <> </>
        <b>
          {customername} - ({custCode})
        </b>
      </h5>
      <div className="row">
        <div className="col-md-6 "></div>
        <div className="col-md-6">
          <button
            className="button-style"
            onClick={() => {
              openRegisterOrder();
            }}
          >
            Register Order
          </button>
          <button className="button-style" onClick={openModal}>
            Save
          </button>
          <Link to={"/Orders/FindOrder"}>
            <button className="button-style " onClick={() => navigate(-1)}>
              Close
            </button>
          </Link>
        </div>
      </div>
      <hr />
      {/* <FindOrderHeaderTabs /> */}

      <Tabs defaultActiveKey="orderinfo" id="uncontrolled-tab-example">
        <Tab eventKey="orderinfo" title="Order Info">
          <div>
            <div className="row mt-2">
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Order Type</label>
                <input type="text" id="orderType" value={orders?.ordertype} />
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Delivery Date</label>
                <input
                  type="date"
                  className="mt-1"
                  id="deliveryDate"
                  value={deliveryDate}
                />
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Sales Contact</label>
                <input type="text" id="salesContact" value={salesExecContact} />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Order Status</label>
                <input type="text" id="orderStatus" value={"Created"} />
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Received By</label>
                <input type="text" value={receivedby} />
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Quotation No</label>
                {/* <input type="text" value={orders.qtnno} /> */}
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Payment Terms</label>
                {/* <input type="text" value={orders.paymentterms} /> */}
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Magod Delivery</label>
                <input
                  type="checkbox"
                  className="checkBoxStyle mt-3"
                  style={{ width: "20px" }}
                />
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Recorded By</label>
                <input type="text" value={recordedby} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 sm-12 ">
                <label className="form-label">PO No</label>
                {/* <input type="text" className="" value={orders.purchaseorder} /> */}
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Delivery Mode</label>
                <select id="formDeliveryMode" className="ip-select">
                  <option value="">Select Delivery Mode</option>
                  <option value="By Lorry">By Lorry</option>
                  <option value="By Courier">By Courier</option>
                  <option value="By Air Cargo">By Air Cargo</option>
                  <option value="By Ship">By Ship</option>
                </select>
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Dealing Engineer</label>
                <select className="ip-select" id="formDealingEngineer">
                  <option>*** Select ***</option>
                  {salesExecdata.map((sdata) => {
                    return <option value={sdata["ID"]}>{sdata["Name"]}</option>;
                  })}
                </select>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Contact Name</label>
                <input
                  type="text"
                  className="mt-2"
                // value={orders.CustomerContact}
                />
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Transport Charges</label>
                <select id="" className="ip-select">
                  <option value=""> Select </option>
                  <option value="Customer Account">Customer Account</option>
                  <option value="Magod Account">Magod Account</option>
                </select>
              </div>
              <div className="col-md-4 sm-12 ">
                <label className="form-label">Order Value</label>
                <input type="text" className="mt-2" />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12 sm-12 ">
                <label className="form-label">Delivery</label>
                {/* <textarea
                                    class="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows="3"
                                ></textarea> */}
                <input type="text" className="mt-1" id="delivery" />
              </div>
            </div>
          </div>
        </Tab>

        <Tab
          eventKey="productionschedulecreation"
          title="Production Schedule Creation"
        >
          <div className="">
            <div className="row mt-2">
              <div className="col-md-2 col-sm-12">
                <button className="button-style  ">Suspended Order</button>
                <button className="button-style mt-2 ">Cancel Order</button>
                <button
                  className="button-style mt-2 "
                  onClick={onClickShortClose}
                >
                  Short Close
                </button>
              </div>
              <div className="col-md-4 col-sm-12">
                <h5 className="mt-2">
                  <b>Schedule Type</b>
                </h5>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="row">
                      <div className="col-md-2 mt-2 col-sm-12">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefaultA"
                          id="flexRadioDefaultA1"
                        />
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <label className="form-label">Sales</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="row">
                      <div className="col-md-2 mt-2 col-sm-12">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefaultA"
                          id="flexRadioDefaultA2"
                        />
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <label
                          className="form-label"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Job Work
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <h5 className="mt-2">
                  <b>Schedule Option</b>
                </h5>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="row">
                      <div className="col-md-2 mt-2 col-sm-12">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefaultB"
                          id="flexRadioDefaultB1"
                        />
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <label
                          className="form-label"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Full Order
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="row">
                      <div className="col-md-2 mt-2 col-sm-12">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefaultB"
                          id="flexRadioDefaultB2"
                        />
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <label
                          className="form-label"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Partial Order
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-sm-12">
                <button className="button-style ">Refresh Status</button>
                <button className="button-style mt-3 ">Clear Filter</button>
                <button className="button-style mt-3 ">Create Schedule</button>
              </div>
            </div>
            <div className="col-md-12 row">
              {/* <div className="col-md-1"></div> */}

              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-4 mt-3 col-sm-12">
                    <button className="button-style" onClick={fnOpenFolder}>Open Folder</button>
                  </div>

                  <div className="col-md-4 mt-3 col-sm-12">
                    <button className="button-style">Check DXF</button>
                  </div>

                  <div className="col-md-4 mt-3 col-sm-12">
                    <button className="button-style">Copy DXF</button>
                  </div>
                </div>
              </div>

              <div className="col-md-5"></div>
            </div>
          </div>
        </Tab>

        <Tab eventKey="findoldpart" title="Find OldPart">
          <div>
            <div className="row mt-3 mb-3">
              <div className="col-md-4 col-sm-12">
                <div className="row">
                  <div className="col-md-5 mb-2 col-sm-12">
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Search Part Name
                    </label>
                  </div>
                  <div className="col-md-7  mb-2 col-sm-12">
                    <input class="" type="text" />
                  </div>
                </div>
              </div>
            </div>
            <Table
              striped
              className="table-data border mt-2"
              style={{ border: "1px", height: "200px", overflowY: "scroll" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th>DWG Name</th>
                  <th>Material</th>
                  <th>Operation</th>
                  <th>Source</th>
                  <th>Order No</th>
                </tr>
              </thead>
              <tbody className="tablebody">
                {ordDwgDetsData.length > 0 ? (
                  ordDwgDetsData.map((orddwgdets, index) => {
                    return (
                      <tr
                        key={orddwgdets.index}
                        onClick={() => selectItem(orddwgdets)}
                      >
                        <td>{orddwgdets["DwgName"]}</td>
                        <td>{orddwgdets["Mtrl_Code"]}</td>
                        <td>{orddwgdets["Operation"]}</td>
                        <td>{orddwgdets["Mtrl_Source"]}</td>
                        <td>{orddwgdets["Order_No"]}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colspan={5}>No Items Added</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Tab>
        <Tab eventKey="materialinfo" title="Material Info">
          <div>
            <div className="row mt-3">
              <div className="col-md-4 col-sm-12">
                <h5>
                  {" "}
                  <b style={{ whiteSpace: "nowrap" }}>Stock Position</b>
                </h5>
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <button className="button-style" style={{ width: "100px" }}>
                      Load
                    </button>
                  </div>
                  <div className="col-md-4 col-sm-12">
                    <div className="row">
                      <div className="col-md-5 mt-3 col-sm-12">
                        <input
                          style={{ width: "50px" }}
                          type="checkbox"
                          className="checkBoxStyle"
                        />
                      </div>
                      <div className="col-md-7 mt-1 col-sm-12">
                        <label
                          className="form-label"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Magod Laser
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-3"
                  style={{
                    overflowY: "scroll",
                    overflowX: "scroll",
                  }}
                >
                  <Table
                    striped
                    className="table-data border"
                    style={{
                      border: "1px",
                      height: "200px",
                    }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>Material</th>
                        <th>Width</th>
                        <th>Length</th>
                        <th style={{ whiteSpace: "nowrap" }}>In Stock</th>
                        <th>Locked</th>
                        <th>Scrap</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody"></tbody>
                  </Table>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <h5>
                  <b>Arrival</b>
                </h5>
                <div>
                  <button className="button-style" style={{ width: "100px" }}>
                    Load
                  </button>
                </div>
                <div
                  className="mt-3"
                  style={{
                    overflowY: "scroll",
                    overflowX: "scroll",
                  }}
                >
                  <Table
                    striped
                    className="table-data border"
                    style={{
                      border: "1px",
                      height: "200px",
                    }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th style={{ whiteSpace: "nowrap" }}>Cust Docu No</th>
                        <th style={{ whiteSpace: "nowrap" }}>RV No</th>
                        <th>Date</th>
                        <th style={{ whiteSpace: "nowrap" }}>Up Dated</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody"></tbody>
                  </Table>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <br></br>
                <br></br>
                <div
                  className="mt-5"
                  style={{
                    overflowX: "scroll",
                    overflowY: "scroll",
                  }}
                >
                  <Table
                    striped
                    className="table-data border"
                    style={{ border: "1px", height: "200px" }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>Length</th>
                        <th>Width</th>
                        <th>Quantity</th>
                        <th style={{ whiteSpace: "nowrap" }}>Up Dated</th>
                        <th style={{ whiteSpace: "nowrap" }}>Order No</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody"></tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
      <div className="mt-5">
        <Tabs>
          <Tab eventKey="orderdetails" title="Order Details">
            {/* <OrderDetails /> */}
            <div>
              <div className="row mt-4">
                <div className="col-md-2 mt-2 col-sm-12">
                  <button
                    className="button-style"
                    onClick={(e) => handleImportDwg()}
                  >
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

                {props.Type === "Profile" ? (
                  <div className="col-md-2 mt-2 col-sm-12">
                    <Link to={"/Orders/EditDXF"}>
                      <button className="button-style ">Edit Dxf</button>
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="row mt-5">
                <div className="col-md-6 col-sm-12">
                  {/* <OrderDetailsTableTab /> */}

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
                              <th style={{ whiteSpace: "nowrap" }}>
                                Dwg Exists
                              </th>
                              <th>Material</th>
                              <th>Operation</th>
                              <th>Source</th>
                              <th style={{ whiteSpace: "nowrap" }}>
                                Insp Level
                              </th>
                              <th>Tolerance</th>
                              <th style={{ whiteSpace: "nowrap" }}>
                                Packing Level
                              </th>
                              <th>LOC</th>
                              <th>Pierces</th>
                              <th style={{ whiteSpace: "nowrap" }}>JW Cost</th>
                              <th style={{ whiteSpace: "nowrap" }}>
                                Mtrl Cost
                              </th>
                              <th style={{ whiteSpace: "nowrap" }}>
                                Unit Rate
                              </th>
                              <th style={{ whiteSpace: "nowrap" }}>
                                Qty Ordered
                              </th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody className="tablebody">
                            {ordDwgtskDetsData.length > 0 ? (
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
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Tabs>
                    <Tab eventKey="drawing" title="Drawing">
                      {/* <DrawingTab /> */}

                      <div
                        id="dxf-content-container"
                        className="dxf-content-container"
                      />
                    </Tab>
                    <Tab eventKey="orderDetailsForm" title="Order Details">
                      {/* <OrderDetailsFormTab /> */}
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
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-4 col-sm-12">
                                    <Link to={"/Orders/Service/NewOrderSerial"}>
                                      <button
                                        className="button-style "
                                        style={{ width: "135px" }}
                                      >
                                        Add New Serial
                                      </button>
                                    </Link>
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
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
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
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-6 col-sm-12">
                                    <div className="row">
                                      <div>
                                        <label className="form-label">
                                          Material
                                        </label>
                                        <select
                                          id=""
                                          className="ip-select dropdown-field "
                                        >
                                          <option value="option1">
                                            option 1
                                          </option>
                                          <option value="option2">
                                            option 2
                                          </option>
                                          <option value="option3">
                                            option 3
                                          </option>
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
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
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
                                          <option value="option1">
                                            option 1
                                          </option>
                                          <option value="option2">
                                            option 2
                                          </option>
                                          <option value="option3">
                                            option 3
                                          </option>
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
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
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
                                          <option value="option1">
                                            option 1
                                          </option>
                                          <option value="option2">
                                            option 2
                                          </option>
                                          <option value="option3">
                                            option 3
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-sm-12">
                                    <div className="row">
                                      <div>
                                        <label
                                          className="form-label"
                                          ordDwgtskDetsData
                                          style={{ whiteSpace: "nowrap" }}
                                        >
                                          Inspection Level
                                        </label>
                                        <select
                                          id=""
                                          className="ip-select dropdown-field "
                                        >
                                          <option value="option1">
                                            option 1
                                          </option>
                                          <option value="option2">
                                            option 2
                                          </option>
                                          <option value="option3">
                                            option 3
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-6 col-sm-12">
                                    <div className="row">
                                      <div>
                                        <label className="form-label">
                                          Quantity
                                        </label>
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
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
                                          <option value="option1">
                                            option 1
                                          </option>
                                          <option value="option2">
                                            option 2
                                          </option>
                                          <option value="option3">
                                            option 3
                                          </option>
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
                                    <label className="form-label">
                                      Ordered
                                    </label>
                                    <input className="in-fields" type="text" />
                                  </div>
                                </div>
                                <div className="row">
                                  <div>
                                    <label className="form-label">
                                      Scheduled
                                    </label>
                                    <input className="in-fields" type="text" />
                                  </div>
                                </div>
                                <div className="row">
                                  <div>
                                    <label className="form-label">
                                      Produced
                                    </label>
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
                                    <label className="form-label">
                                      Delivered
                                    </label>
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
                                        <label className="form-label">
                                          LOC
                                        </label>
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div>
                                        <label className="form-label">
                                          Process
                                        </label>
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div>
                                        <label className="form-label">
                                          Pat Weight
                                        </label>
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 com-sm-12">
                                    <div className="row">
                                      <div>
                                        <label className="form-label">
                                          Process
                                        </label>
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div>
                                        <label className="form-label">
                                          Job Work Cost
                                        </label>
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div>
                                        <label className="form-label">
                                          Material Cost
                                        </label>
                                        <input
                                          className="in-fields"
                                          type="text"
                                        />
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

              {/* <ImportParameters
                                importParameters={importParameters}
                                setImportParameters={setImportParameters}
                                // onHide={(e) => setImportParameters(e)}
                                firstbutton={closeModal1}
                            // title="magod_findOrder"
                            //  firstbuttontext="Ok"
                            />

                            <ImportOldOrder
                                importOldOrder={importOldOrder}
                                setImportOldOrder={setImportOldOrder}
                                firstbutton={closeModal2} />*/}
            </div>
          </Tab>
          <Tab eventKey="scheduleList" title="Schedule List">
            {/* <ScheduleList /> */}
            <div>
              <div className="row mt-3">
                <div className="col-md-2 col-sm-12">
                  <button className="button-style " onClick={openModal}>
                    Delete Schedule
                  </button>
                </div>
                <div className="col-md-2 col-sm-12">
                  <Link to={"/Orders/Service/ServiceOpenSchedule"}>
                    <button className="button-style ">Open Schedule</button>
                  </Link>
                </div>
              </div>

              <div className="row  mt-3">
                <div
                  className="col-md-3 col-md-12"
                  style={{ overflowY: "scroll" }}
                >
                  <Table
                    striped
                    className="table-data border "
                    style={{ border: "1px", height: "400px" }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>Type</th>
                        <th>No</th>
                        <th>Status</th>
                        <th>Delivered</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {ordDetsData.length > 0 ? (
                        ordDetsData.map((orddets, index) => {
                          return (
                            <tr
                              key={orddets.index}
                              onClick={() => selectItem(orddets)}
                            >
                              <td>{orddets["ScheduleType"]}</td>
                              <td>{orddets["ScheduleNo"]}</td>
                              <td>{orddets["Schedule_Status"]}</td>
                              <td>{orddets["Delivery_Date"]}</td>
                              <td>{orddets["ScheduleId"]}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colspan={5}>No Items Added</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                <div
                  className="col-md-9 col-md-12"
                  style={{ overflowY: "scroll" }}
                >
                  <Table
                    striped
                    className="table-data border mt-2"
                    style={{
                      border: "1px",
                      height: "400px",
                      overflowY: "scroll",
                    }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>Dwg Name</th>
                        <th>Mtrl Code</th>
                        <th>Operation</th>
                        <th>Scheduled</th>
                        <th>Produced</th>
                        <th>Packed</th>
                        <th>Delivered</th>
                        <th>JW Cost</th>
                        <th>Mtrl Cost</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {ordDetsDwgData.length > 0 ? (
                        ordDetsDwgData.map((orddetsdwg, index) => {
                          return (
                            <tr
                              key={orddetsdwg.index}
                              onClick={() => selectItem(orddetsdwg)}
                            >
                              <td>{orddetsdwg["DwgName"]}</td>
                              <td>{orddetsdwg["Mtrl_Code"]}</td>
                              <td>{orddetsdwg["Operation"]}</td>
                              <td>{orddetsdwg["QtyScheduleId"]}</td>
                              <td>{orddetsdwg["QtyProduced"]}</td>
                              <td>{orddetsdwg["QtyPacked"]}</td>
                              <td>{orddetsdwg["QtyDelivered"]}</td>
                              <td>{orddetsdwg["JWCost"]}</td>
                              <td>{orddetsdwg["MtrlCost"]}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colspan={9}>No Items Added</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
              <AlertModal
                show={alertModal}
                onHide={(e) => setAlertModal(e)}
                firstbutton={closeModal}
                title="magod_Order"
                message="Select Draft Schedules to Delete"
                firstbuttontext="Ok"
              />
            </div>
          </Tab>
          <Tab eventKey="profarmaInvoiceList" title="Profama Invoice List">
            {/* <ProfarmaInvoiceList /> */}
            <div>
              <div className="row justify-content-center mt-3">
                <div className="col-md-2 col-sm-12">
                  <button className="button-style ">Create Invoice</button>
                </div>
                <div className="col-md-2 col-sm-12">
                  <button className="button-style ">Delete</button>
                </div>
                <div className="col-md-2 col-sm-12">
                  <Link to={"/Orders/Service/ProfamaInvoiceForm"}>
                    <button className="button-style ">Open Invoice</button>
                  </Link>
                </div>
              </div>

              <div className="row mt-3">
                <div
                  className="col-md-3 col-md-12"
                  style={{ overflowY: "scroll" }}
                >
                  <Table
                    striped
                    className="table-data border"
                    style={{ border: "1px", height: "400px" }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>Inv Type</th>
                        <th>Proforma Inv No</th>
                        <th>Grand Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {ordProformaData.length > 0 ? (
                        ordProformaData.map((ordproforma, index) => {
                          return (
                            <tr
                              key={ordproforma.index}
                              onClick={() => selectItem(ordproforma)}
                            >
                              <td>{ordproforma["InvType"]}</td>
                              <td>{ordproforma["ProformaInvNo"]}</td>
                              <td>{ordproforma["GrandTotal"]}</td>
                              <td>{ordproforma["Status"]}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colspan={4}>No Items Added</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                <div
                  className="col-md-9 col-md-12"
                  style={{ overflowY: "scroll", overflowX: "scroll" }}
                >
                  <Table
                    striped
                    className="table-data border mt-2"
                    style={{ border: "1px", height: "400px" }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>Srl</th>
                        <th style={{ whiteSpace: "nowrap" }}>Drawing Name</th>
                        <th style={{ whiteSpace: "nowrap" }}>Material Code</th>
                        <th>Quantity</th>
                        <th style={{ whiteSpace: "nowrap" }}>Unit Rate</th>
                        <th style={{ whiteSpace: "nowrap" }}>
                          Profarma Deatil Id
                        </th>
                        <th style={{ whiteSpace: "nowrap" }}>Profarma Id</th>
                        <th style={{ whiteSpace: "nowrap" }}>Profarma Srl</th>
                        <th>Dwg_No</th>
                        <th>Mtrl</th>
                        <th>Qty</th>
                        <th style={{ whiteSpace: "nowrap" }}>Unit Rate</th>
                        <th style={{ whiteSpace: "nowrap" }}>Srl Amount</th>
                        <th>Excise_CL_No</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {ordProformaMatData.length > 0 ? (
                        ordProformaMatData.map((ordproformamat, index) => {
                          return (
                            <tr
                              key={ordproformamat.index}
                              onClick={() => selectItem(ordproformamat)}
                            >
                              <td>{ordproformamat["ProFarmaSrl"]}</td>
                              <td>{ordproformamat["Dwg_No"]}</td>
                              <td>{ordproformamat["Mtrl"]}</td>
                              <td>{ordproformamat["Qty"]}</td>
                              <td>{ordproformamat["Unit_Rate"]}</td>
                              <td>{ordproformamat["ProfarmaDetailID"]}</td>
                              <td>{ordproformamat["ProfarmaID"]}</td>
                              <td>{ordproformamat["ProfarmaSrl"]}</td>
                              <td>{ordproformamat["Dwg_No"]}</td>
                              <td>{ordproformamat["Mtrl"]}</td>
                              <td>{ordproformamat["Qty"]}</td>
                              <td>{ordproformamat["Unit_Rate"]}</td>
                              <td>{ordproformamat["SrlAmount"]}</td>
                              <td>{ordproformamat["Excise_CL_no"]}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colspan={14}>No Items Added</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </Tab>
          {props.Type === "Profile" ? (
            <Tab eventKey="materialPlanner" title="Material Planner">
              {/* <MaterialPlanner /> */}
              <div>
                <div className="row justify-content-center mt-3">
                  <div className="col-md-2 col-sm-12">
                    <button className="button-style "> Create DXF WS</button>
                  </div>
                  <div className="col-md-2 col-sm-12">
                    <button className="button-style ">Create Parts WS</button>
                  </div>
                  <div className="col-md-2 col-sm-12">
                    <button className="button-style ">Read WS</button>
                  </div>
                  <div className="col-md-2 col-sm-12">
                    <button className="button-style ">Print Estimate</button>
                  </div>
                  <div className="mt-3" style={{ overflowY: "scroll" }}>
                    <Table
                      striped
                      className="table-data border"
                      style={{ border: "1px", height: "400px" }}
                    >
                      <thead className="tableHeaderBGColor">
                        <tr>
                          <th>Task No</th>
                          <th>Material</th>
                          <th>Source</th>
                          <th>Operation</th>
                          <th>Dwgs</th>
                          <th>Total Parts</th>
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        {ordCustTaskData.length > 0 ? (
                          ordCustTaskData.map((ordcusttask, index) => {
                            return (
                              <tr
                                key={ordcusttask.index}
                                onClick={() => selectItem(ordcusttask)}
                              >
                                <td>{ordcusttask["TaskNo"]}</td>
                                <td>{ordcusttask["Mtrl_Code"]}</td>
                                <td>{ordcusttask["CustMtrl"]}</td>
                                <td>{ordcusttask["Operation"]}</td>
                                <td>{ordcusttask["NoOfDwgs"]}</td>
                                <td>{ordcusttask["TotalParts"]}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colspan={6}>No Items Added</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-4 col-sm-12">
                      <Table
                        striped
                        className="table-data border"
                        style={{
                          border: "1px",
                          height: "200px",
                          overflowY: "scroll",
                        }}
                      >
                        <thead className="tableHeaderBGColor">
                          <tr>
                            <th>Length(mm)</th>
                            <th>Width(mm)</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="tablebody">
                          {ordDimensData.length > 0 ? (
                            ordDimensData.map((orddimens, index) => {
                              return (
                                <tr
                                  key={orddimens.index}
                                  onClick={() => selectItem(orddimens)}
                                >
                                  <td>{orddimens["Length"]}</td>
                                  <td>{orddimens["Width"]}</td>
                                  <td>{orddimens["Quantity"]}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colspan={3}>No Items Added</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <div className="col-md-4 col-sm-12">
                      <Form>
                        <div className="ip-box form-bg">
                          <h4>
                            <b>Task No</b>
                          </h4>
                          <div className="row">
                            <div className="col-md-4 col-sm-12">
                              <label className=" form-label mt-2">Length</label>
                              <label className="form-label mt-2">Width</label>
                              <label className=" form-label mt-2">
                                Quantity
                              </label>
                            </div>
                            <div className="col-md-8 col-sm-12">
                              <input className="mt-2" type="text" />
                              <input className="mt-3" type="text" />
                              <input className="mt-3 mb-4" type="text" />
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
          ) : null}
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
        firstbutton={closeRegisterOrder}
        secondbutton={closeRegisterOrder}
        title="magod_Order"
        message="You can add New Serials, Change Quantity and Rates once you register an Open Order. Continue ?"
        firstbuttontext="Yes"
        secondbuttontext="No"
      />

      {/* Import Drawings */}

      <div className="row mt-1" style={{ maxHeight: "600px" }}>
        <Modal show={importdwgshow}>
          <Modal.Header
            className="justify-content-md-center"
            style={{
              paddingTop: "10px",
              backgroundColor: "#283E81",
              color: "#ffffff",
            }}
          >
            <Modal.Title>Enter Default Parameters for Import</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-style">
              <Form onSubmit={importdrawings} style={{ overflowY: "scroll" }}>
                <div className="row mb-1">
                  <div className="col">
                    <div className="row">
                      <Form.Group controlId="strmtrlcode">
                        <div className="md-col-2">
                          <Form.Label className="form-label">
                            Material Code
                          </Form.Label>
                          {mtrldata.length > 0 || mtrldata != null ? (
                            <Typeahead
                              id="basic-example"
                              labelKey="Mtrl_Code"
                              onChange={selectMtrl}
                              selected={strmtrlcode}
                              options={mtrldata}
                              placeholder="Choose a Material..."
                            ></Typeahead>
                          ) : (
                            ""
                          )}
                        </div>
                      </Form.Group>
                    </div>
                    <div className="row mt-1">
                      <Form.Group controlId="strprocess">
                        <div className="md-col-4">
                          <label className="form-label">Process</label>
                          {procdata.length > 0 ? (
                            <select
                              className="ip-select"
                              id="strprocess"
                              onChange={selectProc}
                            >
                              <option value="" disabled selected>
                                ** Select **
                              </option>
                              {procdata.map((proc) => {
                                return (
                                  <option value={proc["ProcessDescription"]}>
                                    {proc["ProcessDescription"]}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            ""
                          )}
                        </div>
                      </Form.Group>
                    </div>
                    <div className="row mt-1">
                      <Form.Group controlId="source">
                        <div className="md-col-4">
                          <label className="form-label">Source</label>
                          <select
                            className="ip-select"
                            id="strsource"
                            onChange={selectMtrlSrc}
                          >
                            <option value="" disabled selected>
                              ** Select **
                            </option>
                            <option value={"Customer"}>Customer</option>
                            <option value={"Magod"}>Magod</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>

                    <div className="row mt-1">
                      <div className="md-col-4">
                        <label className="form-label">Tolerance</label>
                        {tolerancedata.length > 0 ? (
                          <select
                            className="ip-select"
                            id="strtolerance"
                            onChange={selectTolerance}
                          >
                            <option value="" disabled selected>
                              ** Select **
                            </option>
                            {tolerancedata.map((toltype) => {
                              return (
                                <option value={toltype["ToleranceType"]}>
                                  {toltype["ToleranceType"]}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="row mt-1">
                      <div className="md-col-4">
                        <label className="form-label">Insp Level</label>
                        {inspdata.length > 0 ? (
                          <select
                            id="strinsp"
                            className="ip-select"
                            onChange={selectInsp}
                          >
                            <option value="" disabled selected>
                              ** Select **
                            </option>
                            {inspdata.map((insplvl) => {
                              return (
                                <option value={insplvl["InspLevel"]}>
                                  {insplvl["InspLevel"]}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="md-col-4">
                        <label className="form-label">Packing Level</label>
                        {packdata.length > 0 ? (
                          <select
                            id="strpkng"
                            className="ip-select"
                            onChange={selectPack}
                          >
                            <option value="" disabled selected>
                              ** Select **
                            </option>
                            {packdata.map((packlvl) => {
                              return (
                                <option value={packlvl["PkngLevel"]}>
                                  {packlvl["PkngLevel"]}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="row mt-1">
                      <div className="md-col-4">
                        <label className="form-label">Quantity </label>
                        <input type="text" autoComplete="off" id="Qty" />
                      </div>
                    </div>
                    <div className="row">
                      <Form.Group controlId="rates">
                        <div className="md-col-4">
                          <Form.Label className="form-label">Rate </Form.Label>
                        </div>
                        <div className="md-col-4">
                          <div className="row">
                            <Form.Label className="form-label">
                              Cutting{" "}
                            </Form.Label>
                            <input type="text" autoComplete="off" id="dblCuttingRate" />
                            {/* </div>
                                                    <div className="row"> */}
                            <Form.Label className="form-label">
                              Piercing{" "}
                            </Form.Label>
                            <input type="text" autoComplete="off" id="dblPierceRate" />
                          </div>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="row mt-1">
                      <Form.Group controlId="files">
                        <div className="md-col-4">
                          <Form.Label className="form-label">
                            Select Files{" "}
                          </Form.Label>
                          <Form.Control
                            type="file"
                            multiple="multiple"
                            accept=".dxf"
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="row mt-2">
                      <div className="col">
                        <button
                          className="button-style"
                          type="submit"
                          style={{ width: "120px" }}
                        >
                          Ok
                        </button>
                      </div>
                      <div className="col">
                        <button
                          className="button-style"
                          style={{ width: "120px" }}
                          variant="secondary"
                          onClick={() => handleCloseImportDwg()}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
      </div>


    </div>
  );
}
