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
// import { propTypes } from "react-bootstrap/esm/Image";
// import { Link, useNavigate } from "react-router-dom";
// SURESH SIR
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
		//---NEW ---------
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
	} = props;

	console.log("BomData", BomData);
	console.log("selectedItems", selectedItems);
	//console.log("schType", scheduleType);
	//console.log("scheduleOption", scheduleOption);
	// //console.log("type", OrderData.Order_Type);
	// //console.log("status", OrderData.Order_Status);

	// const [orderType, setOrderType] = useState("");
	// const [status, setStatus] = useState("");

	// useEffect(() => {
	//   if (OrderData) {
	//     setOrderType(OrderData.Order_Type);
	//     setStatus(OrderData.Order_Status);
	//   }
	// }, [OrderData]); // Run the effect whenever OrderData changes

	const [groupBoxAddSrlVisible, setGroupBoxAddSrlVisible] = useState(true);
	// //console.log("OrdrDetailsData", OrdrDetailsData);

	const [buttonClicked, setButtonClicked] = useState("");
	// confirmation modal
	const [ConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
	// import from excel
	const [importExcelModal, setImportExcelModal] = useState(false);
	// import qoutation
	const [importQtnMdl, setImportQtnMdl] = useState(false);

	const [isLoading, setisLoading] = useState(false);

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
	const [material, setMaterial] = useState("");
	const [DwgName, setDwgName] = useState("");
	const [quantity, setQuantity] = useState(0.0);
	const [jwRate, setJwRate] = useState(0.0);
	const [materialRate, setMaterialRate] = useState(0.0);
	const [unitPrice, setUnitPrice] = useState(0.0);
	const [Operation, setOperation] = useState("");
	const [thickness, setThickness] = useState("");
	const [specificwt, setSpecificWt] = useState(0);
	const [grade, setGrade] = useState("");
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
	// //// //console.log("first", quantity);
	// //// //console.log("second", jwRate);
	// //// //console.log("third", materialRate);
	// //// //console.log("fourth", unitPrice);
	//// //console.log("blkCngCheckBox", blkCngCheckBox);

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

		postRequest(endpoints.getSalesExecLists, {}, (sdata) => {
			//////////console.log(sdata);
			setSalesExecdata(sdata);
		});
		postRequest(
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
		postRequest(
			endpoints.getSalesIndiExecLists,
			{ salesContact: Order_Received_By },
			(rcvddata) => {
				// setReceivedBy(rcvddata[0]["Name"]);
			}
		);
		getRequest(endpoints.getMaterials, (mtrldata) => {
			//////console.log(mtrldata);
			let arr = [];
			for (let i = 0; i < mtrldata.length; i++) {
				mtrldata[i].label = mtrldata[i].Mtrl_Code;
				arr.push(mtrldata[i]);
			}

			setMtrldata(arr);
		});
		getRequest(endpoints.getProcessLists, (pdata) => {
			let arr = [];
			for (let i = 0; i < pdata.length; i++) {
				pdata[i].label = pdata[i].ProcessDescription;
				arr.push(pdata[i]);
			}

			setProcdata(arr);

			console.log("pdata", pdata);
		});

		console.log("Procdata", procdata);
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
		// async function fetchData() {
		//   postRequest(
		//     endpoints.getCustomerDets,
		//     { custcode: Cust_Code },
		//     (custdata) => {
		//       // setCustomer(custdata[0]["Cust_name"]);
		//       // setCustdata(custdata);
		//     }
		//   );
		//   // await postRequest(
		//   //   endpoints.PostNewSrlData,
		//   //   { custcode: Cust_Code, OrderNo: OrderNo },
		//   //   (srldata) => {
		//   //     //////////// //console.log("srl data", srldata);
		//   //     setSerailData(srldata);
		//   //   }
		//   // );

		//   await postRequest(endpoints.getSalesExecLists, {}, (sdata) => {
		//     setSalesExecdata(sdata);
		//   });
		//   await postRequest(
		//     endpoints.getSalesIndiExecLists,
		//     { salesContact: SalesContact },
		//     (sdata) => {
		//       ////// //console.log(sdata[0]["Name"]);
		//       // setSalesExecContact(sdata[0]["Name"]);
		//     }
		//   );
		//   // await postRequest(endpoints.getSalesIndiExecLists, { salesContact: order.DealingEngineer }, (ddata) => {
		//   //     setDealingEngineer(ddata[0]["Name"]);
		//   // });
		//   // await postRequest(
		//   //   endpoints.getSalesIndiExecLists,
		//   //   { salesContact: RecordedBy },
		//   //   (recdata) => {
		//   //     setRecordedby(recdata[0]["Name"]);
		//   //   }
		//   // );
		//   await postRequest(
		//     endpoints.getSalesIndiExecLists,
		//     { salesContact: Order_Received_By },
		//     (rcvddata) => {
		//       // setReceivedBy(rcvddata[0]["Name"]);
		//     }
		//   );
		//   getRequest(endpoints.getMaterials, (mtrldata) => {
		//     setMtrldata(mtrldata);
		//   });
		//   getRequest(endpoints.getProcessLists, (pdata) => {
		//     setProcdata(pdata);
		//   });

		//   getRequest(endpoints.getToleranceTypes, (ttdata) => {
		//     setTolerancedata(ttdata);
		//   });
		//   getRequest(endpoints.getInspectionLevels, (ildata) => {
		//     setInspdata(ildata);
		//   });
		//   getRequest(endpoints.getPackingLevels, (pckdata) => {
		//     setPackdata(pckdata);
		//   });
		// }
		// fetchData();
	}, []);

	useEffect(() => {
		fetchData();
	}, []);

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
				material: material,
				Operation: Operation,

				NewSrlFormData: NewSrlFormData,
			},
			(InsertedNewSrlData) => {
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

	let blkCngCheckBoxx = blkCngCheckBox;
	//console.log("blkCngCheckBoxx ", blkCngCheckBoxx);
	//console.log("selectedItems..... ", selectedItems);
	//console.log("selectedSrl", selectedSrl);

	let updateblkcngOrdrData = () => {
		handleClosesetBulkChnangMdl();

		for (let i = 0; i < selectedItems.length; i++) {
			const element = selectedItems[i];

			blkCngCheckBoxx[0] === true
				? (element.DwgName = blkChange.DwgName)
				: (element.DwgName = element.DwgName);
			blkCngCheckBoxx[1] === true
				? (element.Mtrl_Code = LastSlctedRow?.Mtrl_Code)
				: (element.Mtrl_Code = element.Mtrl_Code);
			blkCngCheckBoxx[2] === true
				? (element.Mtrl_Source = blkChange.material)
				: (element.Mtrl_Source = element.Mtrl_Source);
			blkCngCheckBoxx[3] === true
				? (element.Operation = blkChange.Operation)
				: (element.Operation = element.Operation);
			blkCngCheckBoxx[4] === true
				? (element.quantity = blkChange.quantity)
				: (element.quantity = element.quantity);
			blkCngCheckBoxx[5] === true
				? (element.JWCost = blkChange.jwRate)
				: (element.JWCost = element.JWCost);
			blkCngCheckBoxx[6] === true
				? (element.UnitPrice = blkChange.unitPrice)
				: (element.UnitPrice = element.UnitPrice);
			blkCngCheckBoxx[7] === true
				? (element.MtrlCost = blkChange.materialRate)
				: (element.MtrlCost = element.MtrlCost);
			blkCngCheckBoxx[8] === true
				? (element.InspLevel = blkChange.InspLvl)
				: (element.InspLevel = element.InspLevel);
			blkCngCheckBoxx[9] === true
				? (element.PackingLevel = blkChange.PkngLvl)
				: (element.PackingLevel = element.PackingLevel);
		}

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
				////// //console.log(" blkChngData", blkChngData);
				if (singleChngData.affectedRows != 0) {
					toast.success("Updated successfully");
					fetchData();
				} else {
					toast.warning("Serial not updated check once");
				}
			}
		);
	};
	const handleMtrlCodeTypeaheadChangeeee = (selectedOptions) => {
		console.log("selectedOptions....", selectedOptions);
		setSelectedItems(selectedOptions);
		// if (selectedOptions.length > 0) {
		//   setLastSlctedRow(selectedOptions[0]);
		// }
		const selectedValue =
			selectedOptions.length > 0 ? selectedOptions[0]?.Mtrl_Code : " ";
		console.log("selectedValue", selectedValue?.Mtrl_Code);
		setStrMtrlCode(selectedValue);
	};
	const handleMtrlCodeTypeaheadChange = (selectedOptions) => {
		//console.log("selectedOptions....", selectedOptions);
		// setSelectedItems(selectedOptions);
		if (selectedOptions.length > 0) {
			setLastSlctedRow(selectedOptions[0]);
		}
		const selectedValue =
			selectedOptions.length > 0 ? selectedOptions[0]?.Mtrl_Code : " ";
		console.log("selectedValue", selectedValue?.Mtrl_Code);
		setStrMtrlCode(selectedValue);
	};

	// const handleMtrlCodeTypeaheadChange = (selectedOptions) => {
	// 	//console.log("selectedOptions....", selectedOptions);
	// 	// setSelectedItems(selectedOptions);
	// 	if (selectedOptions.length > 0) {
	// 		setLastSlctedRow(selectedOptions[0]);
	// 	}
	// 	const selectedValue =
	// 		selectedOptions.length > 0 ? selectedOptions[0]?.Mtrl_Code : " ";
	// 	console.log("selectedValue", selectedValue?.Mtrl_Code);
	// 	setStrMtrlCode(selectedValue);
	// };

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

		postRequest(
			// endpoints.getmtrldetsbymtrlcode,
			endpoints.getmtrldetsbymtrlcode,
			{ MtrlCode: e.target.value },
			(mtrldata) => {
				if (mtrldata.length > 0) {
					setThickness(mtrldata[0]["Thickness"]);
					setGradeID(mtrldata[0]["MtrlGradeID"]);
					setMaterial(mtrldata[0]["Mtrl_Type"]);
					setGrade(mtrldata[0]["Grade"]);
					setSpecificWt(mtrldata[0]["Specific_Wt"]);

					// locCalc(
					//   window.dxffile,
					//   mtrldata[0]["Mtrl_Type"],
					//   mtrldata[0]["Grade"],
					//   mtrldata[0]["Thickness"],
					//   (output) => {}
					// );
				}
			}
		);
	};
	const selectProc = async (e) => {
		e.preventDefault();
		setOperation(e.target.value);
		setNewSrlFormData({
			...NewSrlFormData,
			Operation: e.target.value,
		});
		//////////// //console.log(e.target.value);
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
		//////////// //console.log(e.target.value);
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

		// setNewSrlFormData({
		//   ...NewSrlFormData,
		//   Quantity: 0.0,
		//   JW_Rate: 0.0,
		//   Mtrl_Rate: 0.0,
		//   UnitPrice: 0.0,
		// });
		// setNewSerial((prevState) => ({
		//   ...prevState,
		//   quantity: 0.0,
		//   jwRate: 0.0,
		//   materialRate: 0.0,
		//   unitPrice: 0.0,
		// }));
		//// //console.log("closeddddd");
	};

	// IMPORT DWG MODAL
	const [importdwgmdlshow, setImportDwgmdlShow] = useState(false);

	const handleImportDwgmdl = () => {
		if (props.OrderData?.Order_Status === "Recorded") {
			toast.warning("Cannot import after the Order is recorded");
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

	// const handlebulkChnangMdl = () => {
	//   {
	//     selectedItems.map((item, index) =>
	//       item.QtyScheduled !== 0
	//         ? setBulkChnangMdl(false)
	//         : setBulkChnangMdl(true)
	//     );
	//   }

	//   setBulkChnangMdl(true);
	// };
	const handlebulkChnangMdl = () => {
		// const allScheduled = selectedItems.every((item) => item.QtyScheduled !== 0);
		// // setBulkChnangMdl(!allScheduled);
		// if (!allScheduled) {
		//   setBulkChnangMdl(true);
		// } else {
		//   setBulkChnangMdl(false);
		// }

		const hasScheduled = selectedItems.some((item) => item.QtyScheduled !== 0);

		if (hasScheduled) {
			toast.warning(
				"The selected DWGs are already scheduled, do you want to get them back?"
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
	};

	//DELETE BUTTON
	function deleteRowsBySrl() {
		// const isValid = () => {
		setisLoading(true);
		// return true;
		// };

		console.log("selectedSrl", selectedSrl);
		postRequest(
			endpoints.postDeleteDetailsBySrl,
			{
				Order_No: props.OrderData.Order_No,
				selectedSrl: selectedSrl,
				selectedItems: selectedItems,
			},
			(deleteData) => {
				if (deleteData.flag > 0) {
					toast.success("Serial Deleted sucessfully");
					fetchData();
				} else {
					toast.warning("Not Deleted Please Check Once");
				}
			}
		);
		// if (!isValid()) {
		setisLoading(false);
		// return;
		// }
		console.log("entering into the deleteRowsBySrl");
	}

	function deleteRowsByOrderNoFunc() {
		postRequest(
			endpoints.postDeleteDetailsByOrderNo,
			{ Order_No: props.OrderData.Order_No },
			(deleteData) => {
				if (deleteData.flag > 0) {
					setOrdrDetailsData([]);
					toast.success("Serial Deleted sucessfully");
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
	// const handleSelectChange = (selected) => {
	//   const arr = BomData.filter(
	//     (obj) => obj.AssyCust_PartId === selected[0]?.label
	//   );
	//   //console.log("arr....", arr);
	//   setBomArry(arr);
	//   setSelectedPartId(selected);
	//   // Check if the selected part ID is in AssyCust_PartId
	//   const hasBOM = BomData.some(
	//     (obj) => obj.AssyCust_PartId === selected[0]?.label
	//   )
	//     ? 1
	//     : 0;
	//   setHasBOM(hasBOM);

	//   // Log the result based on hasBOM value
	//   if (hasBOM === 1) {
	//     //console.log("It's an assembly");
	//   } else {
	//     //console.log("It's a part");
	//   }
	// };
	//NEW CODE
	const handleSelectChange = (selected) => {
		// Find the selected part ID from BomData
		const selectedPartId = selected[0]?.label;
		const magodCodee = selected[0]?.magodCode;
		console.log("magodCodee", magodCodee);
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

		// Log the result based on hasBOM value
		if (hasBOM === 1) {
			// It's an assembly
			console.log("It's an assembly");
		} else {
			// It's a part
			console.log("It's a part");
		}

		// Get the MagodCode for the selected part ID
		const selectedMagodCode = BomData.find(
			(obj) => obj.AssyCust_PartId === selectedPartId
		)?.Magod;

		// Update the state or log the MagodCode
		console.log("magodCode", magodCode);
		// You can set the MagodCode in a state if needed
		// setSelectedMagodCode(selectedMagodCode);
	};

	//console.log("HasBOM......", HasBOM);
	// const options = BomData?.map((item) => ({
	//   // label: item.PartId,
	//   label: item.AssyCust_PartId || "",
	//   // label: item.UniqueColumn,
	// }));
	// console.log("BomData", BomData[2]?.MagodCode);
	// const options = BomData?.map((item) => ({
	//   // console.log("itemMagodCode",item.Magod)
	//   label: item.AssyCust_PartId || "", // Use AssyCust_PartId as label, with fallback to empty string
	// })).filter((option) => option.label !== "");
	// Map BomData to options with labels
	const options = BomData?.map((item) => {
		console.log("itemMagodCode", item.MagodCode);
		return {
			label: item.AssyCust_PartId || "", // Use AssyCust_PartId as label, with fallback to empty string
			magodCode: item.MagodCode || "", // Capture MagodCode for later use
		};
	}).filter((option) => option.label !== "");
	console.log("options", options);

	// // INSERT ORDER DETAILS FALG 1,2,3
	// const PostOrderDetails = (flag) => {
	// 	setImportDwgShow(false);
	// 	setisLoading(true);
	// 	let requestData = {};

	// 	if (flag === 1) {
	// 		requestData = {
	// 			OrderNo: OrderNo,
	// 			newOrderSrl: newOrderSrl,
	// 			custcode: Cust_Code,
	// 			DwgName: newSerial.DwgName,
	// 			Dwg_Code: "",
	// 			dwg: Dwg,
	// 			HasBOM: HasBOM,
	// 			Qty_Ordered: quantity,
	// 			JwCost: jwRate,
	// 			mtrlcost: materialRate,
	// 			// UnitPrice: unitPrice,
	// 			UnitPrice: parseFloat(jwRate) + parseFloat(materialRate),
	// 			strmtrlcode: strmtrlcode,
	// 			material: material,
	// 			Operation: Operation,
	// 			NewSrlFormData: NewSrlFormData,
	// 			tolerance: "Standard(+/-0.1mm)- 100 Microns",
	// 		};
	// 		// Validation for quantity and other fields
	// 		if (quantity === 0 || isNaN(quantity)) {
	// 			setisLoading(false);
	// 			toast.error("Quantity should be greater than 0");
	// 			return;
	// 		}
	// 		if (jwRate === 0 || isNaN(jwRate)) {
	// 			setisLoading(false);
	// 			toast.error("JWRate should be greater than 0");
	// 			return;
	// 		}
	// 		if (isNaN(materialRate)) {
	// 			setisLoading(false);
	// 			toast.error("MaterialRate should be greater than 0");
	// 			return;
	// 		}
	// 		// Check if any required field is empty
	// 		if (requestData.DwgName === "") {
	// 			setisLoading(false);
	// 			toast.error("DwgName is mandatory");
	// 			return;
	// 		}

	// 		// if (requestData.strmtrlcode === "") {
	// 		//   setisLoading(false);
	// 		//   toast.error("Material is mandatory");
	// 		//   return;
	// 		// }
	// 		if (LastSlctedRow?.Mtrl_Code === "") {
	// 			setisLoading(false);
	// 			toast.error("Material is mandatory");
	// 			return;
	// 		}

	// 		if (requestData.Operation === "") {
	// 			setisLoading(false);
	// 			toast.error("Operation is mandatory");
	// 			return;
	// 		}
	// 		if (requestData.NewSrlFormData.MtrlSrc === "") {
	// 			setisLoading(false);
	// 			toast.error("Material source is mandatory");
	// 			return;
	// 		}
	// 		if (requestData.NewSrlFormData.InspLvl === "") {
	// 			setisLoading(false);
	// 			toast.error("InspLvl source is mandatory");
	// 			return;
	// 		}
	// 		if (requestData.NewSrlFormData.PkngLvl === "") {
	// 			setisLoading(false);
	// 			toast.error("PkngLvl source is mandatory");
	// 			return;
	// 		}
	// 	} else if (flag === 2) {
	// 		// if (props.OrderData?.Order_Status === "Recorded") {
	// 		//   toast.warning("Cannot import after the Order is recorded");
	// 		// } else {
	// 		//   handleImportDwgmdl();
	// 		// }
	// 		requestData = {
	// 			OrderNo: OrderNo,
	// 			newOrderSrl: newOrderSrl,
	// 			custcode: Cust_Code,
	// 			dwg: imprtDwgObj.Dwg,
	// 			tolerance: imprtDwgObj.StrTolerance,
	// 			Qty_Ordered: imprtDwgObj.quantity,
	// 			JwCost: imprtDwgObj.jwRate,
	// 			mtrlcost: imprtDwgObj.materialRate,
	// 			strmtrlcode: imprtDwgObj.strmtrlcode,
	// 			material: imprtDwgObj.material,
	// 			Operation: imprtDwgObj.Operation,
	// 			NewSrlFormData: NewSrlFormData,
	// 			tolerance: imprtDwgObj.StrTolerance,
	// 		};
	// 	} else if (flag === 3) {
	// 		// setHasBOM(1);
	// 		requestData = {
	// 			OrderNo: OrderNo,
	// 			newOrderSrl: newOrderSrl,
	// 			custcode: Cust_Code,
	// 			DwgName: selectedPartId[0].label,
	// 			Dwg_Code: magodCode,
	// 			dwg: Dwg,
	// 			tolerance: "Standard(+/-0.1mm)- 100 Microns",
	// 			HasBOM: HasBOM,
	// 			Qty_Ordered: 1,
	// 			JwCost: BomArry[0]?.JobWorkCost,
	// 			mtrlcost: BomArry[0]?.MtrlCost,
	// 			UnitPrice: parseFloat(jwRate) + parseFloat(materialRate),
	// 			strmtrlcode: BomArry[0]?.Material,
	// 			material: material,
	// 			// material: BomArry[0]?.Material,
	// 			// Operation: Operation,
	// 			Operation: BomArry[0]?.Operation,
	// 			insplevel: "Insp1",
	// 			packinglevel: "Pkng1",
	// 			delivery_date: "",
	// 			NewSrlFormData: NewSrlFormData,
	// 		};
	// 	} else {
	// 	}
	// 	//console.log("requestData.strMtrlCode", requestData.strmtrlcode);
	// 	// if (requestData.DwgName === "") {
	// 	//   setisLoading(false);
	// 	//   toast.error(" DwgName is mandotory");
	// 	//   return;
	// 	// }

	// 	postRequest(
	// 		endpoints.InsertNewSrlData,

	// 		{ requestData: requestData },
	// 		(InsertedNewSrlData) => {
	// 			if (InsertedNewSrlData.affectedRows != 0) {
	// 				setisLoading(false);
	// 				toast.success("Added serial successfully");
	// 				setSelectedPartId([]);
	// 				setHasBOM(0);
	// 				// setBomArry([]);
	// 				fetchData();
	// 				handleCloseImportDwg();
	// 			} else {
	// 				// setisLoading(false);
	// 				toast.warning("Serial not added");
	// 				handleCloseImportDwg();
	// 			}
	// 		}
	// 	);
	// };
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
		console.log("DXF Upload files path : " + destPath);
		const data = new FormData();
		console.log(files.length);
		for (let i = 0; i < files.length; i++) {
			data.append("files", files[i]);
		}
		//  console.log(data);
		let API = "http://localhost:6001";
		//let API = process.env.REACT_APP_API_KEY;
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
		console.log("DXF Copy files path : " + destPath);
		const data = new FormData();
		//   console.log(files);
		for (let i = 0; i < files.length; i++) {
			data.append("files", files[i]);
		}
		//  console.log(data);
		let API = "http://localhost:6001";
		//let API = process.env.REACT_APP_API_KEY;
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
			console.error("Error:", error);
			//alert("Failed to connect to the DXF service. Please ensure the service is running.");
		}
	};

	const funcEditDXF = async () => {
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
				console.log(launchservice);
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
									console.log(newdxf);
									window.dxffile = newdxf;

									// let qno = quotationNo.replaceAll("/", "_");
									// let month = qno.split("_")[1]
									// let monthName = ["January", "Febraury", "March", "April", "May", "June",
									//   "July", "August", "September", "October", "November", "December"][parseInt(month) - 1]

									let destPath = `\\Wo\\` + OrderNo + "\\DXF";
									await dxfupload([newdxf], destPath, (res) => {
										if (res.status === "success") {
											toast.success("DXF file updated successfully");
										}
									});
								}
							);
						}
					}
				}
				console.log(launchservice);
			}
		} catch (error) {
			console.log(error);
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
		console.log(file);
		console.log(file.name);
		setSelectedFile(file);
		console.log(selectedItems);

		// console.log(dxfmaterial);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("material", selectedItems[0].material);
		formData.append("process", selectedItems[0].Operation);
		formData.append("source", "Customer");
		formData.append("qty", quantity);

		console.log(formData);

		const res = await fetch("http://127.0.0.1:21341/editdxf", {
			method: "POST",
			body: formData,
		});
		return res;
	};

	// INSERT ORDER DETAILS FALG 1,2,3
	const PostOrderDetails = async (flag, imprtDwgObj) => {
		// setImportDwgShow(false);
		// setisLoading(true);
		let requestData = {};

		// // Check if any required field is empty
		// if (requestData.DwgName === "") {
		//   setisLoading(false);
		//   // setImportDwgShow(false);
		//   toast.error("DwgName is mandatory");
		//   return;
		// }

		// if (requestData.strmtrlcode === "") {
		//   setisLoading(false);
		//   toast.error("Material is mandatory");
		//   return;
		// }
		// if (LastSlctedRow?.Mtrl_Code === "") {
		//   setisLoading(false);
		//   toast.error("Material is mandatory");
		//   return;
		// }

		// if (requestData.NewSrlFormData.MtrlSrc === "") {
		//   setisLoading(false);
		//   toast.error("Material source is mandatory");
		//   return;
		// }
		// if (requestData.Operation === "") {
		//   setisLoading(false);
		//   toast.error("Operation is mandatory");
		//   return;
		// }
		// // Validation for quantity and other fields
		// if (quantity === 0 || isNaN(quantity) || quantity === "0") {
		//   setisLoading(false);
		//   toast.error("Quantity should be greater than 0");
		//   return;
		// }

		// if (jwRate === 0 || isNaN(jwRate) || quantity === "0") {
		//   setisLoading(false);
		//   toast.error("JWRate should be greater than 0");
		//   return;
		// }
		// if (isNaN(materialRate)) {
		//   setisLoading(false);
		//   toast.error("MaterialRate should be greater than 0");
		//   return;
		// }
		// if (requestData.NewSrlFormData.InspLvl === "") {
		//   setisLoading(false);
		//   toast.error("InspLvl source is mandatory");
		//   return;
		// }
		// if (requestData.NewSrlFormData.PkngLvl === "") {
		//   setisLoading(false);
		//   toast.error("PkngLvl source is mandatory");
		//   return;
		// }
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
			// if (requestData.Operation === "") {
			// 	toast.error("Operation is mandatory");
			// 	return false;
			// }

			// if (
			// 	BomArry[0]?.JobWorkCost === 0 ||
			// 	isNaN(BomArry[0]?.JobWorkCost) ||
			// 	BomArry[0]?.JobWorkCost === "0"
			// ) {
			// 	toast.error("JWRate should be greater than 0");
			// 	return false;
			// }

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
				material: material,
				Operation: Operation,
				NewSrlFormData: NewSrlFormData,
				tolerance: "Standard(+/-0.1mm)- 100 Microns",
			};

			// Only run validation for flag 1
			if (!isValidForFlag1()) {
				setisLoading(false);
				return;
			}
		} else if (flag === 2) {
			console.log("Cutting : ", imprtDwgObj.dblCuttingRate);
			console.log("Piercing : ", imprtDwgObj.dblPierceRate);
			console.log("FileName 1 : " + imprtDwgObj.dgfiles.files[0].name);
			console.log("flag : ", flag);
			// if (props.OrderData?.Order_Status === "Recorded") {
			//   toast.warning("Cannot import after the Order is recorded");
			// } else {
			//   handleImportDwgmdl();
			// }

			//let imprtDwgData = [];
			let impDwgFileData = [];
			let dwgnamefiles = imprtDwgObj.dgfiles.files;

			await postRequest(
				endpoints.getmtrldetsbymtrlcode,
				{ MtrlCode: strmtrlcode },
				async (mtrldata1) => {
					if (mtrldata1.length > 0) {
						console.log("MtrlData : ", mtrldata1);
						setThickness(mtrldata1[0]["Thickness"]);
						setGradeID(mtrldata1[0]["MtrlGradeID"]);
						setMaterial(mtrldata1[0]["Mtrl_Type"]);
						setGrade(mtrldata1[0]["Grade"]);
						setSpecificWt(mtrldata1[0]["Specific_Wt"]);

						let thck = mtrldata1[0]["Thickness"];
						let spwt = mtrldata1[0]["Specific_Wt"];
					}
				}
			);

			for (let i = 0; i < dwgnamefiles.length; i++) {
				console.log("FileName : " + dwgnamefiles[i].name);
			}
			let destPath = ``;
			destPath = `\\Wo\\` + OrderNo + "\\DXF\\";

			await dxfupload(dwgnamefiles, destPath, (res) => {
				console.log(res);
			});
			//  postRequest(endpoints.dxfupload, { files: dwgnamefiles }, (res) => {
			//   console.log(res);
			//  });

			for (let i = 0; i < dwgnamefiles.length; i++) {
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

				// dxfupload(dwgnamefiles[i], destPath, (res) => {
				//   console.log(res);
				// });
				//  postRequest(endpoints.dxfupload, { files: dwgnamefiles }, (res) => {
				//   console.log(res);
				//  });
				window.dxffiles = dwgnamefiles[i];
				{
					console.log("vvv123", dwgnamefiles[i].name);
				}
				await postRequest(
					endpoints.dxfCopy,
					{ Dwg: dwgnamefiles[i].name, destPath: destPath },
					(res) => {
						console.log(res);
					}
				);
				//        copydxf(dwgnamefiles, destPath, (res) => { });
			}
			console.log("impDwgFileData", impDwgFileData);
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
					mtrl: gradeid,
					Delivery_Date: Delivery_Date,
					Operation: Operation,
					Thickness: thickness,
					NewSrlFormData: NewSrlFormData,
					tolerance: strtolerance,
					insplevel: imprtDwgObj.InspLvl, // .insplevel,
					packinglevel: imprtDwgObj.PkngLvl, // .packinglevel,
					impDwgFileData: impDwgFileData,
				},
			};
			//  console.log("requestData", requestData);
			//   OrderNo: OrderNo,
			//   newOrderSrl: newOrderSrl,
			//   custcode: Cust_Code,
			//   files: imprtDwgObj.files,
			//   DwgName: dwgnamefiles[i].name,
			//   dwg: imprtDwgObj.Dwg,
			//   Qty_Ordered: imprtDwgObj.quantity,
			//   JwCost: imprtDwgObj.jwRate,
			//   mtrlcost: imprtDwgObj.materialRate,
			//   strmtrlcode: imprtDwgObj.strmtrlcode,
			//   material: imprtDwgObj.material,
			//   Operation: Operation,
			//   NewSrlFormData: NewSrlFormData,
			//   tolerance: strtolerance,
			//   insplevel: imprtDwgObj.insplevel,
			//   packinglevel: imprtDwgObj.packinglevel,
			//   LOC: lengthOfCut,
			//   Holes: noOfPierces,
			// };
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
				material: material,
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
		//console.log("requestData.strMtrlCode", requestData.strmtrlcode);
		// if (requestData.DwgName === "") {
		//   setisLoading(false);
		//   toast.error(" DwgName is mandotory");
		//   return;
		// }
		console.log("Saving Order details - 2");
		console.log("requestData", requestData);
		postRequest(
			endpoints.InsertNewSrlData,

			{ requestData: requestData },
			(InsertedNewSrlData) => {
				if (InsertedNewSrlData.affectedRows != 0) {
					setisLoading(false);
					toast.success("Added serial successfully");

					setSelectedPartId([]);
					//   handleCloseImportDwg;
					setHasBOM(0);
					// setBomArry([]);
					fetchData();
					handleCloseImportDwg();
					setImportDwgShow(false);
				} else {
					// setisLoading(false);
					toast.warning("Serial not added");
					handleCloseImportDwg();
				}
			}
		);
	};

	const PostSrlData = () => {};
	//SURESH SIR CODE REALATED TO DXF
	let locCalc = async (drwfile, material, grade, thickness, cb) => {
		const formData = new FormData();
		//  window.dxffiles.forEach(async (dfile) => {
		formData.append("file", drwfile); //files[i]);
		formData.append("thickness", thickness);
		formData.append("specficWeight", specificwt); // resp[0].Specific_Wt);

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
		const res = await getCalcReq.json();
		setLengthOfCut(res.data.lengthOfCut);
		setNoofPierces(res.data.noOfPierces);

		console.log("Length of Cut 1: ", res.data.lengthOfCut);
		// console.log("No of Pierces 2 : ", res.data.noOfPierces);
		// console.log(res);
		cb({
			lengthOfCut: res.data.lengthOfCut,
			noOfPierces: res.data.noOfPierces,
		});

		// console.log("Length of Cut 3 : ", res.data.lengthOfCut);
		// console.log("No of Pierces 4: ", res.data.noOfPierces);
	};

	// const [addsrlBtn, setAddsrlBtn] = useState(false);
	// const [bulkchangeBtn, setBulkchangeBtn] = useState(false);
	// const [ImpDwgBtn, setImpDwgBtn] = useState(false);
	// const [ImtExlBtn, setImtExlBtn] = useState(false);
	// const [ImtOldOrderBtn, setImtOldOrderBtn] = useState(false);
	// const [ImtQtnBtn, setQtnBtn] = useState(false);
	// const [SelectAllBtn, setSelectAllBtn] = useState(false);
	// const [ReverseBtn, setReverseBtn] = useState(false);
	// const [AddDwgOrderBtn, setAddDwgOrderBtn] = useState(false);

	// var status = OrderData.Order_Status;
	// var orderType = OrderData.Order_Type;

	// const setOrderDetails = (status, orderType) => {
	//   //console.log(status);
	//   //console.log(orderType);
	//   switch (status) {
	//     case "Created":
	//       setBulkchangeBtn(true);
	//       setAddsrlBtn(true);
	//       break;
	//     case "Processing":
	//       setBulkchangeBtn(false);
	//       setAddsrlBtn(false);
	//       switch (orderType) {
	//         case "Complete":
	//           setAddsrlBtn(false);
	//           setBulkchangeBtn(false);
	//           break;
	//         case "Scheduled":
	//           setAddsrlBtn(false);
	//           break;
	//         case "Open":
	//           setAddsrlBtn(true);
	//           break;
	//         default:
	//           // Default case if no matching order type
	//           break;
	//       }
	//       break;
	//     case "Nochange":
	//       setBulkchangeBtn(false);
	//       break;
	//     default:
	//       // Default case if no matching status
	//       break;
	//   }
	// };
	// useEffect(() => {
	//   setOrderDetails(status, orderType);
	//   setBulkchangeBtn(false);
	// }, []);

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
			/>
			<div>
				<div className="row justify-content-left">
					<div className="col-md-12">
						{props.OrderData?.Type === "Profile" ? (
							<button
								className="button-style"
								onClick={() => handleImportDwgmdl()}
								disabled={
									props.OrderData?.Order_Status === "Processing" ||
									props.OrderData?.Order_Status === "Recorded"
								}>
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
							}}>
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
							}}>
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
							}}>
							Import Old Order
						</button>
						<button
							className="button-style"
							disabled={
								props.OrderData?.Order_Status === "Processing" ||
								props.OrderData?.Order_Status === "Recorded"
							}
							onClick={deleteRowsBySrl}>
							Delete
						</button>

						<button
							className="button-style"
							onClick={handlebulkChnangMdl}
							disabled={
								OrderData?.Order_Status === "Processing" ||
								OrderData?.Order_Type === "Complete" ||
								OrderData?.Order_Type === "Scheduled"
							}>
							Bulk Change
						</button>

						<button
							className="button-style"
							onClick={handleSelectAll}
							disabled={props.OrderData?.Order_Status === "Processing"}>
							Select All
						</button>
						<button
							className="button-style"
							onClick={handleReverseSelection}
							disabled={props.OrderData?.Order_Status === "Processing"}>
							Reverse
						</button>
						{Type === "Profile" ? (
							<button
								className="button-style"
								onClick={funcEditDXF}>
								Edit DXF
							</button>
						) : null}
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
							imprtDwgObj={imprtDwgObj}
						/>
					</div>
					<div className="col-md-6">
						<Tabs className="nav-tabs tab_font">
							{props.OrderData?.Type === "Profile" ? (
								<Tab
									eventKey="drawing"
									title="Drawing">
									<button
										className="button-style"
										onClick={ShowDfxForm}>
										Go to DxfView
									</button>
									<div
										id="dxf-content-container"
										className="dxf-content-container">
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
									</div>
									{/* <Drawings /> */}
								</Tab>
							) : null}
							<Tab
								eventKey="orderDetailsForm"
								title="Order Details">
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
								/>
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>
		</>
	);
}
