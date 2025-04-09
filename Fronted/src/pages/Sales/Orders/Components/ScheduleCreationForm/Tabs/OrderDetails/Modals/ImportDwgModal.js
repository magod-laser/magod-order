/** @format */

// /** @format */

// import { React, useState } from "react";
// import { Form, Modal } from "react-bootstrap";
// import { Typeahead } from "react-bootstrap-typeahead";

// function ImportDwgModal(props) {
// 	// const {
// 	// 	importdwgshow,
// 	// 	setImportDwgShow,
// 	// 	handleImportDwg,
// 	// 	handleCloseImportDwg,
// 	// 	importdrawings,
// 	// 	mtrldata,
// 	// 	selectMtrl,
// 	// 	strmtrlcode,
// 	// 	stroperation,
// 	// 	strsource,
// 	// 	strtolerance,
// 	// 	strinsp,
// 	// 	strpkng,
// 	// 	dblCuttingRate,
// 	// 	dblPierceRate,
// 	// 	imprtDwgfiles,
// 	// 	procdata,
// 	// 	selectProc,
// 	// 	selectMtrlSrc,
// 	// 	tolerancedata,
// 	// 	selectTolerance,
// 	// 	inspdata,
// 	// 	selectInsp,
// 	// 	packdata,
// 	// 	selectPack,
// 	// 	InputField,
// 	// 	quantity,
// 	// 	setQuantity,
// 	// 	jwRate,
// 	// 	setJwRate,
// 	// 	materialRate,
// 	// 	setMaterialRate,
// 	// 	unitPrice,
// 	// 	setUnitPrice,
// 	// 	DwgName,
// 	// 	handleDwgInputChange,
// 	// 	PostSrlData,
// 	// 	insertnewsrldata,
// 	// 	importdwgmdlshow,
// 	// 	setImportDwgmdlShow,
// 	// 	handleImportDwgmdl,
// 	// 	handleCloseImportDwgmdl,
// 	// 	handleMtrlCodeTypeaheadChange,
// 	// 	PostOrderDetails,
// 	// 	// NEW
// 	// 	imprtDwgObj,
// 	// 	setImprtDwgObj,
// 	// 	handleChange,
// 	// } = props;

// 	// SURSH SIR

// 	let {
// 		importdwgshow,
// 		setImportDwgShow,
// 		handleImportDwg,
// 		handleCloseImportDwg,
// 		importdrawings,
// 		mtrldata,
// 		selectMtrl,
// 		strmtrlcode,
// 		stroperation,
// 		strsource,
// 		strtolerance,
// 		strinsp,
// 		strpkng,
// 		dblCuttingRate,
// 		dblPierceRate,
// 		imprtDwgfiles,
// 		procdata,
// 		selectProc,
// 		selectMtrlSrc,
// 		tolerancedata,
// 		selectTolerance,
// 		inspdata,
// 		selectInsp,
// 		packdata,
// 		selectPack,
// 		InputField,
// 		quantity,
// 		setQuantity,
// 		jwRate,
// 		setJwRate,
// 		materialRate,
// 		setMaterialRate,
// 		unitPrice,
// 		setUnitPrice,
// 		DwgName,
// 		handleDwgInputChange,
// 		PostSrlData,
// 		insertnewsrldata,
// 		importdwgmdlshow,
// 		setImportDwgmdlShow,
// 		handleImportDwgmdl,
// 		handleCloseImportDwgmdl,
// 		handleMtrlCodeTypeaheadChange,
// 		PostOrderDetails,
// 		// NEW
// 		imprtDwgObj,
// 		setImprtDwgObj,
// 		handleChange,
// 	} = props;

// 	const PostOrderDwgData = async (e) => {
// 		e.preventDefault();
// 		console.log("PostOrderDwgData");
// 		let dwgfiles = [];
// 		dwgfiles = e.target.elements.impDwgFiles;
// 		// alert(dwgfiles.files.length);
// 		// alert(dwgfiles.files[0].name);
// 		// alert(e.target.dblCuttingRate.value);
// 		// alert(e.target.dblPierceRate.value);
// 		imprtDwgObj = {
// 			strmtrlcode: strmtrlcode,
// 			stroperation: stroperation,
// 			strsource: strsource,
// 			strtolerance: strtolerance,
// 			strinsp: strinsp,
// 			strpkng: strpkng,
// 			quantity: quantity,
// 			dblCuttingRate: e.target.dblCuttingRate.value,
// 			dblPierceRate: e.target.dblPierceRate.value,
// 			dgfiles: dwgfiles,
// 		};
// 		setImprtDwgObj(imprtDwgObj);
// 		PostOrderDetails(2, imprtDwgObj);
// 	};
// 	return (
// 		<div
// 			className="row mt-1"
// 			style={{ maxHeight: "600px" }}>
// 			<Modal
// 				show={importdwgmdlshow}
// 				onHide={handleCloseImportDwgmdl}>
// 				<Modal.Header
// 					className="justify-content-md-center"
// 					style={{
// 						paddingTop: "10px",
// 						backgroundColor: "#283E81",
// 						color: "#ffffff",
// 					}}>
// 					<Modal.Title style={{ fontSize: "14px" }}>
// 						Enter Default Parameters for Import
// 					</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body>
// 					<div className="form-style">
// 						{/* <Form onSubmit={importdrawings} style={{ overflowY: "scroll" }}> */}
// 						<div className="row mb-1">
// 							<div className="col">
// 								<div className="row">
// 									<Form.Group controlId="strmtrlcode">
// 										<div className="d-flex md-col-2 field-gap">
// 											<label className="form-label label-space">
// 												Material Code
// 											</label>
// 											{mtrldata?.length > 0 || mtrldata != null ? (
// 												<Typeahead
// 													className="ip-select in-field"
// 													id="basic-example"
// 													labelKey="Mtrl_Code"
// 													name="impDwgMaterial"
// 													onChange={handleMtrlCodeTypeaheadChange}
// 													// onChange={handleChange}
// 													required
// 													options={mtrldata}
// 													placeholder="Choose a Material..."></Typeahead>
// 											) : (
// 												""
// 											)}
// 										</div>
// 									</Form.Group>
// 								</div>
// 								<div className="row mt-1">
// 									<Form.Group controlId="strprocess">
// 										<div
// 											className="d-flex md-col-4 field-gap"
// 											style={{ gap: "45px" }}>
// 											<label className="form-label">Process</label>
// 											{procdata?.length > 0 ? (
// 												<select
// 													className="ip-select"
// 													id="strprocess"
// 													name="impDwgProcess"
// 													onChange={selectProc}>
// 													<option
// 														value=""
// 														disabled
// 														selected>
// 														** Select **
// 													</option>
// 													{/* {procdata?.map((proc) => {
// 														return (
// 															<option value={proc["ProcessDescription"]}>
// 																{proc["ProcessDescription"]}
// 															</option>
// 														);
// 													})} */}
// 													{procdata.map((proc) => {
// 														// Check for the Type and map options based on that
// 														if (props.OrderData?.Type === "Service") {
// 															// Check if the proc type is 'service'
// 															if (
// 																proc.type === "service" &&
// 																proc["Service"] !== 0
// 															) {
// 																return (
// 																	<option
// 																		key={proc["OperationID"]}
// 																		value={proc["Operation"]}>
// 																		{proc["Operation"]}
// 																	</option>
// 																);
// 															}
// 														} else if (
// 															props.OrderData?.Type === "Fabrication"
// 														) {
// 															// Fabrication logic (assuming this logic for 'MultiOperation' is valid)
// 															if (proc["MultiOperation"] !== 0) {
// 																return (
// 																	<option
// 																		key={proc["OperationID"]}
// 																		value={proc["Operation"]}
// 																		required>
// 																		{proc["Operation"]}
// 																	</option>
// 																);
// 															}
// 														} else {
// 															// Check if the proc type is 'profile_cutting'
// 															if (
// 																proc.type === "profile_cutting" &&
// 																proc["Profile"] !== 0
// 															) {
// 																return (
// 																	<option
// 																		key={proc["OperationID"]}
// 																		value={proc["Operation"]}>
// 																		{proc["Operation"]}
// 																	</option>
// 																);
// 															}
// 														}

// 														return null; // Exclude options with zero values or mismatched type
// 													})}
// 												</select>
// 											) : (
// 												""
// 											)}
// 										</div>
// 									</Form.Group>
// 								</div>
// 								<div className="row mt-1">
// 									<Form.Group controlId="source">
// 										<div
// 											className="d-flex md-col-4 field-gap"
// 											style={{ gap: "50px" }}>
// 											<label className="form-label">Source</label>
// 											<select
// 												className="ip-select"
// 												id="strsource"
// 												name="impDwgSource"
// 												onChange={selectMtrlSrc}>
// 												<option
// 													value=""
// 													disabled
// 													selected>
// 													** Select **
// 												</option>
// 												<option value={"Customer"}>Customer</option>
// 												<option value={"Magod"}>Magod</option>
// 											</select>
// 										</div>
// 									</Form.Group>
// 								</div>

// 								<div className="row mt-1">
// 									<div
// 										className="d-flex md-col-4 field-gap"
// 										style={{ gap: "35px" }}>
// 										<label className="form-label">Tolerance</label>
// 										{tolerancedata?.length > 0 ? (
// 											<select
// 												className="ip-select"
// 												id="strtolerance"
// 												name="impDwgTolerance"
// 												onChange={selectTolerance}>
// 												<option
// 													value=""
// 													disabled
// 													selected>
// 													** Select **
// 												</option>
// 												{tolerancedata?.map((toltype) => {
// 													return (
// 														<option value={toltype["ToleranceType"]}>
// 															{toltype["ToleranceType"]}
// 														</option>
// 													);
// 												})}
// 											</select>
// 										) : (
// 											""
// 										)}
// 									</div>
// 								</div>

// 								<div className="row mt-1">
// 									<div
// 										className="d-flex col-md-6 field-gap"
// 										style={{ gap: "33px" }}>
// 										<label className="form-label label-space">Insp Level</label>
// 										{inspdata?.length > 0 ? (
// 											<select
// 												id="strinsp"
// 												className="ip-select"
// 												name="impDwgInspLvl"
// 												onChange={selectInsp}>
// 												<option
// 													value=""
// 													disabled
// 													selected>
// 													** Select **
// 												</option>
// 												{inspdata?.map((insplvl) => {
// 													return (
// 														<option value={insplvl["InspLevel"]}>
// 															{insplvl["InspLevel"]}
// 														</option>
// 													);
// 												})}
// 											</select>
// 										) : (
// 											""
// 										)}
// 									</div>
// 									<div className="d-flex col-md-6 field-gap">
// 										<label className="form-label label-space">
// 											Packing Level
// 										</label>
// 										{packdata?.length > 0 ? (
// 											<select
// 												id="strpkng"
// 												className="ip-select"
// 												name="impDwgPkngLvl"
// 												onChange={selectPack}>
// 												<option
// 													value=""
// 													disabled
// 													selected>
// 													** Select **
// 												</option>
// 												{packdata.map((packlvl) => {
// 													return (
// 														<option value={packlvl["PkngLevel"]}>
// 															{packlvl["PkngLevel"]}
// 														</option>
// 													);
// 												})}
// 											</select>
// 										) : (
// 											""
// 										)}
// 									</div>
// 								</div>
// 								<div className="row mt-1"></div>

// 								<div className="row mt-1">
// 									<div
// 										className="d-flex col-md-12 field-gap"
// 										style={{ gap: "40px" }}>
// 										<label className="form-label">Quantity</label>
// 										<input
// 											className="in-field"
// 											id="Qty"
// 											name="impDwgQty"
// 											value={quantity}
// 											onChangeCallback={setQuantity}
// 											required
// 										/>
// 									</div>
// 								</div>
// 								<label className=" ms-3 form-label">Rate </label>
// 								<div className="d-flex">
// 									<div className="row">
// 										<div
// 											className="d-flex field-gap col-md-6"
// 											style={{ gap: "45px" }}>
// 											<label className="form-label">Cutting </label>
// 											<input
// 												className="in-field"
// 												type="text"
// 												id="dblCuttingRate"
// 												name="Cutting"
// 											/>
// 										</div>
// 										<div className="d-flex field-gap col-md-6">
// 											<label className="form-label">Piercing </label>
// 											<input
// 												className="in-field"
// 												type="text"
// 												id="dblPierceRate"
// 												name="Piercing"
// 											/>
// 										</div>
// 									</div>
// 								</div>
// 								<div className="row mt-1">
// 									<div
// 										className="d-flex field-gap md-col-4"
// 										style={{ gap: "25px" }}>
// 										<label className="form-label label-space">
// 											Select Files{" "}
// 										</label>
// 										<input
// 											className="in-field"
// 											type="file"
// 											multiple="multiple"
// 											accept=".dxf"
// 										/>
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 						{/* </Form> */}
// 					</div>
// 				</Modal.Body>
// 				<Modal.Footer>
// 					{" "}
// 					<div className="row ">
// 						<div>
// 							<button
// 								className="button-style"
// 								type="submit"
// 								// onClick={insertnewsrldata}
// 								onClick={() => PostOrderDetails(2)}>
// 								Save
// 							</button>
// 							<button
// 								className="button-style"
// 								variant="secondary"
// 								style={{ backgroundColor: "gray" }}
// 								onClick={() => handleCloseImportDwgmdl()}>
// 								Close
// 							</button>
// 						</div>
// 					</div>
// 				</Modal.Footer>
// 			</Modal>
// 		</div>
// 	);
// }

// export default ImportDwgModal;

// new

import { React, useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { postRequest } from "../../../../../../../api/apiinstance";
import { endpoints } from "../../../../../../../api/constants";

function ImportDwgModal(props) {
  let {
    importdwgshow,
    setImportDwgShow,
    handleImportDwg,
    handleCloseImportDwg,
    importdrawings,
    mtrldata,
    selectMtrl,
    strmtrlcode,
    stroperation,
    strsource,
    strtolerance,
    strinsp,
    strpkng,
    dblCuttingRate,
    dblPierceRate,
    imprtDwgfiles,
    procdata,
    selectProc,
    selectMtrlSrc,
    tolerancedata,
    selectTolerance,
    inspdata,
    selectInsp,
    packdata,
    selectPack,
    InputField,
    quantity,
    setQuantity,
    jwRate,
    setJwRate,
    materialRate,
    setMaterialRate,
    unitPrice,
    setUnitPrice,
    DwgName,
    handleDwgInputChange,
    PostSrlData,
    insertnewsrldata,
    importdwgmdlshow,
    setImportDwgmdlShow,
    handleImportDwgmdl,
    handleCloseImportDwgmdl,
    handleMtrlCodeTypeaheadChange,
    PostOrderDetails,
		// NEW
    imprtDwgObj,
    setImprtDwgObj,
    handleChange,
  } = props;

  // Add state to track form values
  const [formValues, setFormValues] = useState({
    strmtrlcode: '',
    stroperation: '',
    strsource: '',
    strtolerance: '',
    strinsp: '',
    strpkng: '',
    quantity: '',
    dblCuttingRate: '',
    dblPierceRate: ''
  });

  const [strprocess, setProcess] = useState("");
  const [mtrsrc, setMtrSrc] = useState("");
  const [torler, setToler] = useState("");

  // Update handlers to track values
  const handleMtrlChange = (selected) => {
	console.log("selected",selected);
	
    if (selected && selected.length > 0) {
      const selectedMtrl = selected[0].Mtrl_Code;
      setFormValues(prev => ({ ...prev, strmtrlcode: selectedMtrl }));
     //  selectMtrl(selectedMtrl); // Call the parent handler with the material code
    } else {
      setFormValues(prev => ({ ...prev, strmtrlcode: '' }));
      selectMtrl(''); // Clear the material code in parent component
    }
  };

  const handleProcChange = (e) => {
    console.log(e.target.value);
    setProcess(e.target.value);
    setFormValues(prev => ({ ...prev, stroperation: e.target.value }));
    selectProc(e);
  };

  const handleSourceChange = (e) => {
    setMtrSrc(e.target.value);
    setFormValues(prev => ({ ...prev, strsource: e.target.value }));
    selectMtrlSrc(e);
  };

  const handleToleranceChange = (e) => {
    setToler(e.target.value);
    setFormValues(prev => ({ ...prev, strtolerance: e.target.value }));
    selectTolerance(e);
  };

  const handleInspChange = (e) => {
    setFormValues(prev => ({ ...prev, strinsp: e.target.value }));
    selectInsp(e);
  };

  const handlePkngChange = (e) => {
    setFormValues(prev => ({ ...prev, strpkng: e.target.value }));
    selectPack(e);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value.trim();
  
    // Check if the input is a positive integer (no decimals, no negatives, not zero)
    if (/^\d+$/.test(value) && parseInt(value, 10) > 0) {
      setFormValues((prev) => ({ ...prev, quantity: value }));
      setQuantity(value);
    } else {
      // Optionally clear the value or keep previous valid value
      setFormValues((prev) => ({ ...prev, quantity: "" }));
      setQuantity("");
    }
  };
  

  const handleCuttingRateChange = (e) => {
    setFormValues(prev => ({ ...prev, dblCuttingRate: e.target.value }));
  };

  const handlePierceRateChange = (e) => {
    setFormValues(prev => ({ ...prev, dblPierceRate: e.target.value }));
  };

  // Load saved values when modal opens
  useEffect(() => {
    if (importdwgmdlshow) {
      const savedValues = JSON.parse(sessionStorage.getItem('importDwgModalValues') || '{}');
      console.log("Loading saved values:", savedValues);
      
      if (savedValues) {
        setFormValues(savedValues);
        if (savedValues.strmtrlcode) selectMtrl(savedValues.strmtrlcode);
        if (savedValues.stroperation) selectProc({ target: { value: savedValues.stroperation } });
        if (savedValues.strsource) selectMtrlSrc({ target: { value: savedValues.strsource } });
        if (savedValues.strtolerance) selectTolerance({ target: { value: savedValues.strtolerance } });
        if (savedValues.strinsp) selectInsp({ target: { value: savedValues.strinsp } });
        if (savedValues.strpkng) selectPack({ target: { value: savedValues.strpkng } });
        if (savedValues.quantity) setQuantity(savedValues.quantity);
      }
    }
  }, [importdwgmdlshow]);

  // Save values when modal closes
  const handleModalClose = () => {
   
    // console.log("Saving values:", formValues);
    sessionStorage.setItem('importDwgModalValues', JSON.stringify(formValues));
    handleCloseImportDwgmdl();
  };

  //20012025
  const PostOrderDwgData = async (e) => {

    e.preventDefault();
	console.log("enetring the save function");
    // console.log("PostOrderDwgData");
    let dwgfiles = [];
    dwgfiles = e.target.elements.impDwgFiles;
    let strInsplvl = e.target.elements.strinspLvl.value;
    let strPknglvl = e.target.elements.strpkngLvl.value;

    // console.log("strInsplvl", strInsplvl);
    // console.log("strPknglvl", strPknglvl);

    let imprtdwgobjtemp = {
      ...imprtDwgObj,
      strmtrlcode: formValues.strmtrlcode,
      stroperation: e.target.elements.stroperation.value,
      strsource: e.target.elements.strsource.value,
      strtolerance: e.target.elements.strtolerance.value,
      strinsp: e.target.elements.strinspLvl.value,
      strpkng: e.target.elements.strpkngLvl.value,
      quantity: formValues.quantity,
      dblCuttingRate: e.target.dblCuttingRate.value,
      dblPierceRate: e.target.dblPierceRate.value,
      dgfiles: dwgfiles,
    };

  

    setImprtDwgObj(imprtdwgobjtemp);
	console.log("imprtdwgobjtemp", imprtdwgobjtemp);
	console.log("exiting the save function");
	
    PostOrderDetails(2, imprtdwgobjtemp);
    setImportDwgmdlShow(false);
	
  };

  return (
    <div
      className="row mt-1"
      style={{ maxHeight: "600px" }}>
      <Modal
        show={importdwgmdlshow}
        // onHide={handleCloseImportDwgmdl}
        onHide={handleModalClose}>
        <Modal.Header
          className="justify-content-md-center"
          style={{
            paddingTop: "10px",
            backgroundColor: "#283E81",
            color: "#ffffff",
          }}>
          <Modal.Title style={{ fontSize: "14px" }}>
            Enter Default Parameters for Import
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-style">
            <Form
              onSubmit={PostOrderDwgData}
              style={{ overflowY: "scroll" }}>
              <div className="row mb-1">
                <div className="col">
                  <div className="row">
                    <Form.Group controlId="strmtrlcode">
                      <div className="d-flex md-col-2 field-gap">
                        <label className="form-label label-space">
                          Material Code
                        </label>
                        {mtrldata?.length > 0 || mtrldata != null ? (
                          <Typeahead
                            className="ip-select in-field"
                            id="strmtrlcode"
                            labelKey="Mtrl_Code"
                            name="impDwgMaterial"
                            onChange={handleMtrlChange}
                            // clearButton
                            backspaceRemoves={true}
                            selected={formValues.strmtrlcode ? [{ Mtrl_Code: formValues.strmtrlcode }] : []}
                            options={mtrldata}
                            placeholder="Choose a Material..."
                            required
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </Form.Group>
                  </div>
                  <div className="row col-md-12 mt-1">
                    <Form.Group controlId="strprocess">
                      <div
                        className="d-flex col-md-12 field-gap"
                        style={{ gap: "45px" }}>
                        <label className="form-label">Process</label>
                        {procdata?.length > 0 ? (
                          <select
                            className="ip-select"
                            id="stroperation"
                            name="impDwgProcess"
                            onChange={handleProcChange}>
                            {/* <option
                              value=""
                              disabled
                              selected>
                              ** Select **
                            </option> */}
                            {/* {procdata?.map((proc) => {
                              return (
                                <option value={proc["ProcessDescription"]}>
                                  {proc["ProcessDescription"]}
                                </option>
                              );
                            })} */}
                            {procdata.map((proc) => {
                              // Check for the Type and map options based on that
                              if (props.OrderData?.Type === "Service") {
                                // Check if the proc type is 'service'
                                if (
                                  proc.type === "service" &&
                                  proc["Service"] !== 0
                                ) {
                                  return (
                                    <option
                                      key={proc["OperationID"]}
                                      value={proc["Operation"]}>
                                      {proc["Operation"]}
                                    </option>
                                  );
                                }
                              } else if (
                                props.OrderData?.Type === "Fabrication"
                              ) {
                                // Fabrication logic (assuming this logic for 'MultiOperation' is valid)
                                if (proc["MultiOperation"] !== 0) {
                                  return (
                                    <option
                                      key={proc["OperationID"]}
                                      value={proc["Operation"]}
                                      required>
                                      {proc["Operation"]}
                                    </option>
                                  );
                                }
                              } else {
                                // Check if the proc type is 'profile_cutting'
                                if (
                                  proc.type === "profile_cutting" &&
                                  proc["Profile"] !== 0
                                ) {
                                  return (
                                    <option
                                      key={proc["OperationID"]}
                                      value={proc["Operation"]}>
                                      {proc["Operation"]}
                                    </option>
                                  );
                                }
                              }

                              return null; // Exclude options with zero values or mismatched type
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
                      <div
                        className="d-flex md-col-4 field-gap"
                        style={{ gap: "50px" }}>
                        <label className="form-label">Source</label>
                        <select
                          className="ip-select"
                          id="strsource"
                          name="impDwgSource"
                          onChange={handleSourceChange}>
                          {/* <option
                            value=""
                            disabled
                            selected>
                            ** Select **
                          </option> */}
                          <option value={"Customer"}>Customer</option>
                          <option value={"Magod"}>Magod</option>
                        </select>
                      </div>
                    </Form.Group>
                  </div>

                  <div className="row mt-1">
                    <div
                      className="d-flex md-col-4 field-gap"
                      style={{ gap: "35px" }}>
                      <label className="form-label">Tolerance</label>
                      {tolerancedata?.length > 0 ? (
                        <select
                          className="ip-select"
                          id="strtolerance"
                          name="impDwgTolerance"
                          onChange={handleToleranceChange}>
                          {/* <option
                            value=""
                            disabled
                            selected>
                            ** Select **
                          </option> */}
                          {tolerancedata?.map((toltype) => {
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
                    <div
                      className="d-flex col-md-6 field-gap"
                      style={{ gap: "33px" }}>
                      <label className="form-label label-space">
                        Insp Level
                      </label>
                      {inspdata?.length > 0 ? (
                        <select
                          id="strinspLvl"
                          className="ip-select"
                          name="impDwgInspLvl"
                          onChange={handleInspChange}>
                          {/* <option
                            value=""
                            disabled
                            selected>
                            ** Select **
                          </option> */}
                          {inspdata?.map((insplvl) => {
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
                    <div className="d-flex col-md-6 field-gap">
                      <label className="form-label label-space">
                        Packing Level
                      </label>
                      {packdata?.length > 0 ? (
                        <select
                          id="strpkngLvl"
                          className="ip-select"
                          name="impDwgPkngLvl"
                          onChange={handlePkngChange}>
                          {/* <option
                            value=""
                            disabled
                            selected>
                            ** Select **
                          </option> */}
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
                  <div className="row mt-1"></div>

                  <div className="row mt-1">
                    <div
                      className="d-flex col-md-12 field-gap"
                      style={{ gap: "40px" }}>
                      <label className="form-label">Quantity</label>
                      <input
                        className="in-field"
                        autoComplete="off"
                        id="quantity"
                        name="impDwgQty"
                        value={formValues.quantity}
                        onChange={handleQuantityChange}
                        required
                      />
                    </div>
                  </div>
                  {/* <label className=" ms-3 form-label">Rate </label> */}
                  <div className="d-flex">
                    <div className="row">
                      <label
                        className=" ms-1 form-label"
                        style={{ fontWeight: "bold" }}>
                        {" "}
                        Rate{" "}
                      </label>
                      <div
                        className="d-flex field-gap col-md-6"
                        style={{ gap: "45px" }}>
                        <label className="form-label">Cutting </label>
                        <input
                          className="in-field"
                          autoComplete="off"
                          type="text"
                          id="dblCuttingRate"
                          name="Cutting"
                          value={formValues.dblCuttingRate}
                          onChange={handleCuttingRateChange}
                        />
                      </div>
                      <div className="d-flex field-gap col-md-6">
                        <label className="form-label">Piercing </label>
                        <input
                          className="in-field"
                          autoComplete="off"
                          type="text"
                          id="dblPierceRate"
                          name="Piercing"
                          value={formValues.dblPierceRate}
                          onChange={handlePierceRateChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-1">
                    <div
                      className="d-flex field-gap md-col-4"
                      style={{ gap: "25px" }}>
                      <label className="form-label label-space">
                        Select Files{" "}
                      </label>
                      <input
                        className="in-field"
                        type="file"
                        id="impDwgFiles"
                        multiple="multiple"
                        accept=".dxf"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-end">
                <div className="col-auto">
                  <button
                    className="button-style"
                    type="submit"
                    // onClick={(e) => PostOrderDwgData()}
                    //onClick={() => PostOrderDetails(2, imprtDwgObj)}
                  >
                    Save
                  </button>
                  {/* <button
                    className="button-style"
                    variant="secondary"
                    style={{ backgroundColor: "gray" }}
                    onClick={() => setImportDwgmdlShow(false)} //   handleCloseImportDwgmdl()}
                  >
                    Close
                  </button> */}
                  <button
                    className="button-style"
                    variant="secondary"
                    // style={{ backgroundColor: "gray" }}
                    onClick={() => handleModalClose()}
                    // onClick={() => handleCloseImportDwgmdl()}
                    
                    >
                    Close
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {" "}
          {/* <div className="row ">
            <div>
              <button
                className="button-style"
                type="submit"
              // onClick={(e) => PostOrderDwgData()}
              //onClick={() => PostOrderDetails(2, imprtDwgObj)}
              >
                Save
              </button>
              <button
                className="button-style"
                variant="secondary"
                style={{ backgroundColor: "gray" }}
                onClick={() => handleCloseImportDwgmdl()}
              >
                Close
              </button>
            </div> 
        </div>*/}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ImportDwgModal;
