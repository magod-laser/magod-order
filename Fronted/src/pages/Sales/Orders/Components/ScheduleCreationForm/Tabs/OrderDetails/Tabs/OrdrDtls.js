/** @format */

import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddNewSrlModal from "../Modals/AddNewSrlModal";
import { Typeahead } from "react-bootstrap-typeahead";
import { Login } from "@mui/icons-material";
import { Last } from "react-bootstrap/esm/PageItem";
import LoadingPage from "../../../Loading";

function OrdrDtls(props) {
  const {
    OrderData,
    OrderCustData,
    OrdrDetailsData,
    mtrldata,
    selectMtrl,
    strmtrlcode,
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
    selectItem,
    selectedItems,
    insertnewsrldata,
    importdwgshow,
    setImportDwgShow,
    handleImportDwg,
    handleCloseImportDwg,
    handleMtrlCodeTypeaheadChange,
    BomData,
    setBomData,
    PostOrderDetails,
    selectedPartId,
    setSelectedPartId,
    BomArry,
    setBomArry,
    handleSelectChange,
    options,
    HasBOM,
    setHasBOM,
    LastSlctedRow,
    setLastSlctedRow,
    //-------NEW
    newSerial,
    setNewSerial,
    ordrDetailsChange,
    setordrDetailsChange,
    handleChange,
    isLoading,
    handleInputChange,
    handleMtrlCodeTypeaheadChangeeee,
    magodCode,
    NewSrlFormData,
    Operation,
    setOperation,
    deleteRowsBySrl,
    selectedRow,
  } = props;

  console.log("selectedRow", selectedRow);
  

  const [materialCode, setMaterialCode] = useState(
    selectedItems[0]?.Mtrl_Code || ""
  );
  const handleMaterialCodeChange = (event) => {
    // Update the state when the dropdown value changes
    setMaterialCode(event.target.value);
  };

  useEffect(() => {
    setQuantity(LastSlctedRow?.Qty_Ordered || "");
  }, [LastSlctedRow]);
  useEffect(() => {
    // Set the default value from the array
    if (LastSlctedRow && LastSlctedRow.length > 0) {
      setQuantity(LastSlctedRow?.Qty_Ordered);
    }
  }, [LastSlctedRow]);

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    // Your other logic if needed
  };

  useEffect (()=>{
    deleteRowsBySrl();
  },[])
  return (
    <div>
      <AddNewSrlModal
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
        //-----NEW ---
        newSerial={newSerial}
        setNewSerial={setNewSerial}
        handleChange={handleChange}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleMtrlCodeTypeaheadChangeeee={handleMtrlCodeTypeaheadChangeeee}
        NewSrlFormData={NewSrlFormData}
        Operation={Operation}
        setOperation={setOperation}
      />
      {isLoading && <LoadingPage />}

      <div className="d-flex form-bg">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-7 mt-2">
              <div className="d-flex" style={{ gap: "42px" }}>
                <label className="form-label label-space">Srl No</label>
                <input
                  className="in-field"
                  type="text"
                  value={LastSlctedRow?.Order_Srl || " "}
                />
              </div>
              <div className="d-flex" style={{ gap: "13px" }}>
                <label className="form-label label-space">Dwg Name</label>
                <input
                  className="in-field"
                  type="text"
                  name="odrDtlDwgName"
                  // value={
                  //   // selectedItems[0]?.DwgName || " "
                  //   LastSlctedRow?.DwgName || " "
                  // }
                  value={ordrDetailsChange.DwgName}
                  onChange={handleChange}
                  disabled={
                    // props.OrderData?.Order_Status === "Created" ||
                    // props.OrderData?.Order_Type === "Complete" ||
                    // props.OrderData?.Order_Type === "Scheduled"
                    // (props.OrderData?.Order_Type === "Scheduled" &&
                    //   OrderData?.Order_Status === "Recorded") ||
                    // (props.OrderData?.Order_Type === "Complete" &&
                    //   OrderData?.Order_Status === "Recorded")
                    props.selectedRow?.QtyScheduled !== 0 &&
                    props.selectedRow?.QtyScheduled !== "0"
                  }
                />
              </div>
              <div className="d-flex" style={{ gap: "29px" }}>
                <label className="form-label">Material</label>
                {/* <input
                      className="in-fields"
                      type="text"
                      value={selectedItems[0]?.Mtrl_Code || " "}
                    /> */}
                {mtrldata.length > 0 || mtrldata != null ? (
                  <Typeahead
                    className="ip-select in-field"
                    id="basic-exampleunique"
                    labelKey="Mtrl_Code"
                    onChange={handleMtrlCodeTypeaheadChange}
                    onInputChange={handleInputChange}
                    // selected={selectedItems}
                    selected={LastSlctedRow ? [LastSlctedRow] : []}
                    options={mtrldata}
                    // onChange={(selected) =>
                    //   changeMtrl("mtrlCode", selected[0]?.Mtrl_Code)
                    // }
                    placeholder="Choose a Material..."
                    required
                    disabled={
                      //   (props.OrderData?.Order_Type === "Scheduled" &&
                      //     OrderData?.Order_Status === "Recorded") ||
                      //   (props.OrderData?.Order_Type === "Complete" &&
                      //     OrderData?.Order_Status === "Recorded") ||
                      //   (props.OrderData?.Order_Type === "Open" &&
                      //     OrderData?.Order_Status === "Recorded")
                      props.selectedRow?.QtyScheduled !== 0 &&
                      props.selectedRow?.QtyScheduled !== "0"
                    }
                  ></Typeahead>
                ) : (
                  ""
                )}
                {/* {mtrldata.length > 0 || mtrldata != null ? ( */}
                {/* <Typeahead
                      id="basic-example"
                      labelKey="Mtrl_Code"
                      name="newSrlMaterial"
                      onChange={handleMtrlCodeTypeaheadChange}
                      options={mtrldata}
                      // placeholder="Choose a Material..."
                      required
                      value={selectedItems[0]?.Mtrl_Code}
                    /> */}
                {/* ) : (
                      "" */}
                {/* )} */}
              </div>
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label label-space">Mtrl Source</label>
                {/* {console.log(
                  "ordrDetailsChange.MtrlSrc",
                  ordrDetailsChange.MtrlSrc
                )} */}
                <select
                  className="ip-select in-field"
                  id="strsource"
                  name="odrDtlMtrlSrc"
                  value={ordrDetailsChange.MtrlSrc}
                  onChange={handleChange}
                  disabled={
                    // (props.OrderData?.Order_Type === "Scheduled" &&
                    //   OrderData?.Order_Status === "Recorded") ||
                    // (props.OrderData?.Order_Type === "Complete" &&
                    //   OrderData?.Order_Status === "Recorded") ||
                    // (props.OrderData?.Order_Type === "Open" &&
                    //   OrderData?.Order_Status === "Recorded")
                    props.selectedRow?.QtyScheduled !== 0 &&
                    props.selectedRow?.QtyScheduled !== "0"
                  }
                >
                  <option value="" selected>
                    ** Select **
                  </option>
                  <option value={"Customer"}>Customer</option>
                  <option value={"Magod"}>Magod</option>
                </select>
              </div>
              <div className="d-flex" style={{ gap: "19px" }}>
                <label className="form-label">Operation</label>
                {/* <input
                      className="in-fields"
                      type="text"
                      value={LastSlctedRow?.Operation || " "}
                    /> */}
                {/* {procdata.length > 0 ? ( */}
                <select
                  className="ip-select in-field"
                  id="strprocess"
                  name="odrDtlOperation"
                  value={ordrDetailsChange.Operation}
                  // onChange={selectProc}
                  disabled={
                    props.selectedRow?.QtyScheduled !== 0 &&
                    props.selectedRow?.QtyScheduled !== "0"
                  }
                  onChange={handleChange}
                >
                  <option value="" disabled selected>
                    ** Select **
                  </option>
                  {/* {procdata.map((proc) => {
										// Check if "Service" column has non-zero values
										if (props.OrderData?.Type === "Service") {
											if (proc["Service"] !== 0) {
												return (
													<option
														key={proc["ProcessDescription"]}
														value={proc["ProcessDescription"]}>
														{proc["ProcessDescription"]}
													</option>
												);
											}
										} else if (props.OrderData?.Type === "Fabrication") {
											if (proc["MultiOperation"] !== 0) {
												return (
													<option
														key={proc["ProcessDescription"]}
														value={proc["ProcessDescription"]}
														required>
														{proc["ProcessDescription"]}
													</option>
												);
											}
										} else {
											if (proc["Profile"] !== 0) {
												return (
													<option
														key={proc["ProcessDescription"]}
														value={proc["ProcessDescription"]}>
														{proc["ProcessDescription"]}
													</option>
												);
											}
										}

										return null; // Exclude options with zero values in "Service" column
									})} */}
                  {procdata.map((proc) => {
                    // Check for the Type and map options based on that
                    if (props.OrderData?.Type === "Service") {
                      // Check if the proc type is 'service'
                      if (proc.type === "service" && proc["Service"] !== 0) {
                        return (
                          <option
                            key={proc["OperationID"]}
                            value={proc["Operation"]}
                          >
                            {proc["Operation"]}
                          </option>
                        );
                      }
                    } else if (props.OrderData?.Type === "Fabrication") {
                      // Fabrication logic (assuming this logic for 'MultiOperation' is valid)
                      if (proc["MultiOperation"] !== 0) {
                        return (
                          <option
                            key={proc["OperationID"]}
                            value={proc["Operation"]}
                            required
                          >
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
                            value={proc["Operation"]}
                          >
                            {proc["Operation"]}
                          </option>
                        );
                      }
                    }

                    return null; // Exclude options with zero values or mismatched type
                  })}
                </select>
                {/* ) : (
                      ""
                    )} */}
              </div>
              <div className="d-flex" style={{ gap: "27px" }}>
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="ip-select in-field"
                  id="Qty"
                  name="odrDtlQuantity"
                  onChange={handleChange}
                  value={ordrDetailsChange.quantity}
                  required
                  // disabled={
                  // props.OrderData?.Order_Type === "Complete"
                  // &&
                  // props.OrderData?.Order_Status === "Recorded"
                  // }
                />
                {/* <InputField
                      className="ip-select in-fields"
                      label="Quantity"
                      id="Qty"
                      name="odrDtlQuantity"
                      value={quantity}
                      onChangeCallback={setQuantity}
                      required
                    /> */}
              </div>
            </div>
            <div className="col-md-5">
              <div>
                <button
                  className="button-style"
                  onClick={handleImportDwg}
                  // onClick={() => PostOrderDetails(1)}
                  disabled={
                    props.OrderData?.Order_Status === "Processing" ||
                    // props.OrderData?.Order_Type === "Complete" ||
                    props.OrderData?.Order_Type === "Schedule"
                  }
                >
                  Add New Serial
                </button>
              </div>
              <div className="d-flex mt-2" style={{ gap: "10px" }}>
                <label className="form-label label-space">Job Wrk Rate</label>
                <input
                  className="ip-select in-field"
                  label="JW Rate"
                  autoComplete="off"
                  id="jwrate"
                  name="odrDtljwrate"
                  required
                  onChange={handleChange}
                  value={ordrDetailsChange.jwRate}
                  // disabled={
                  // props.OrderData?.Order_Type === "Complete" ||
                  // props.OrderData?.Order_Type === "Scheduled" ||
                  // OrderData?.Order_Status === "Recorded"
                  // (props.OrderData?.Order_Type === "Scheduled" &&
                  //   props.OrderData?.Order_Status === "Recorded") ||
                  // (props.OrderData?.Order_Type === "Complete" &&
                  //   props.OrderData?.Order_Status === "Recorded")
                  // }
                  // value={LastSlctedRow?.JWCost || " "}
                />
                {/* <InputField
                      label="JW Rate"
                      id="jwrate"
                      value={jwRate}
                      onChangeCallback={setJwRate}
                      required
                    /> */}
                {/* <InputField
                      className="ip-select in-fields"
                      label="JW Rate"
                      id="jwrate"
                      name="odrDtljwrate"
                      value={ordrDetailsChange.jwRate}
                      // value={jwRate}
                      // onChangeCallback={setJwRate}
                      onChange={handleChange}
                      required
                    /> */}
              </div>
              <div className="d-flex" style={{ gap: "17px" }}>
                <label className="form-label label-space">Mtrl Rate</label>
                <input
                  className="ip-select in-field"
                  label="Mtrl Rate"
                  autoComplete="off"
                  name="odrDtlMtrlRate"
                  id="mtrlRate"
                  onChange={handleChange}
                  value={ordrDetailsChange.materialRate}
                  required
                  disabled={
                    // props.OrderData?.Order_Type === "Complete" ||
                    // props.OrderData?.Order_Type === "Scheduled" ||
                    // LastSlctedRow?.Mtrl_Source === "Customer" ||
                    // OrderData?.Order_Status === "Recorded"
                    LastSlctedRow?.Mtrl_Source === "Customer" ||
                    (props.OrderData?.Order_Type === "Scheduled" &&
                      props.OrderData?.Order_Status === "Recorded") ||
                    (props.OrderData?.Order_Type === "Complete" &&
                      props.OrderData?.Order_Status === "Recorded")
                  }
                />

                {/* <InputField
                      className="ip-select in-fields"
                      label="Mtrl Rate"
                      name="odrDtlMtrlRate"
                      id="mtrlRate"
                      required
                      value={materialRate}
                      onChangeCallback={setMaterialRate}
                    /> */}
              </div>
              <div className="d-flex" style={{ gap: "17px" }}>
                <label className="form-label label-space">Unit Price</label>
                <input
                  className="ip-select in-field"
                  label="UnitPrice"
                  autoComplete="off"
                  name="odrDtlUnitPrice"
                  id="Qty"
                  // value={unitPrice}
                  // onChangeCallback={setUnitPrice}
                  // onChange={handleChange}
                  // value={ordrDetailsChange.unitPrice}
                  value={
                    parseFloat(ordrDetailsChange.jwRate) +
                    parseFloat(ordrDetailsChange.materialRate)
                  }
                  disabled
                />
                {/* <InputField
                      className="ip-select in-fields"
                      label="UnitPrice"
                      name="odrDtlUnitPrice"
                      id="Qty"
                      value={unitPrice}
                      onChangeCallback={setUnitPrice}
                      required
                    /> */}
              </div>
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label label-space">Inptn Level</label>
                {/* <input
                      className="in-fields"
                      name="odrDtlInspLvl"
                      type="text"
                      value={LastSlctedRow?.InspLevel || " "}
                    /> */}
                {/* {inspdata.length > 0 ? ( */}
                <select
                  id="strinsp"
                  className="ip-select in-field"
                  name="odrDtlInspLvl"
                  value={ordrDetailsChange.InspLvl}
                  onChange={handleChange}
                  disabled={
                    // (props.OrderData?.Order_Type === "Scheduled" &&
                    //   OrderData?.Order_Status === "Recorded") ||
                    // (props.OrderData?.Order_Type === "Complete" &&
                    //   OrderData?.Order_Status === "Recorded") ||
                    // (props.OrderData?.Order_Type === "Open" &&
                    //   OrderData?.Order_Status === "Recorded")
                    props.selectedRow?.QtyScheduled !== 0 &&
                    props.selectedRow?.QtyScheduled !== "0"
                  }
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
                {/* ) : (
                      ""
                    )} */}
              </div>
              <div className="d-flex" style={{ gap: "20px" }}>
                <label className="form-label label-space">Pkg Level</label>
                {/* <input
                      className="in-fields"
                      name="odrDtlPkngLvl"
                      type="text"
                      value={LastSlctedRow?.PackingLevel || " "}
                    /> */}
                {/* {packdata.length > 0 ? ( */}
                <select
                  id="strpkng"
                  className="ip-select in-field"
                  name="odrDtlPkngLvl"
                  value={ordrDetailsChange.PkngLvl}
                  onChange={handleChange}
                  // disabled={
                  //   (props.OrderData?.Order_Type === "Scheduled" &&
                  //     OrderData?.Order_Status === "Recorded") ||
                  //   (props.OrderData?.Order_Type === "Complete" &&
                  //     OrderData?.Order_Status === "Recorded") ||
                  //   (props.OrderData?.Order_Type === "Open" &&
                  //     OrderData?.Order_Status === "Recorded")
                  // }
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
                {/* ) : (
                      ""
                    )} */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="" style={{ textAlign: "center" }}>
            <label className="form-label">Process details</label>
          </div>
          <div className="d-flex" style={{ gap: "22px" }}>
            <label className="form-label">Ordered</label>
            <input
              className="in-field"
              type="text"
              // value={LastSlctedRow?.Qty_Ordered || " "}
              value={ordrDetailsChange.quantity}
            />
          </div>
          <div className="d-flex" style={{ gap: "10px" }}>
            <label className="form-label">Scheduled</label>
            <input
              className="in-field"
              type="text"
              value={LastSlctedRow?.QtyScheduled || " "}
            />
          </div>
          <div className="d-flex" style={{ gap: "15px" }}>
            <label className="form-label">Produced</label>
            <input
              className="in-field"
              type="text"
              value={LastSlctedRow?.QtyProduced || " "}
            />
          </div>
          <div className="d-flex" style={{ gap: "28px" }}>
            <label className="form-label">Packed</label>
            <input
              className="in-field"
              type="text"
              value={LastSlctedRow?.QtyPacked || " "}
            />
          </div>
          <div className="d-flex" style={{ gap: "14px" }}>
            <label className="form-label">Delivered</label>
            <input
              className="in-field"
              type="text"
              value={LastSlctedRow?.QtyDelivered || " "}
            />
          </div>
          <div className="d-flex">
            <div>
              <label className="form-label label-space">Has BOM</label>
            </div>
            <div>
              <input
                style={{ marginTop: "13px" }}
                type="checkbox"
                className="checkBoxStyle ms-2"
                checked={LastSlctedRow?.HasBOM === 1 || HasBOM}
                // onChange={(e) => setHasBOM(e.target.checked ? 1 : 0)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <Form className="mt-2" style={{ marginLeft: "0px" }}> */}

      <div className="mt-1">
        {props.OrderData?.Type === "Profile" ? (
          <div className="form-bg mb-3">
            <div className="row mb-2">
              <div className="col-md-4">
                <label className="form-label">BOM Material Availability</label>
              </div>
              <div className="col-md-4">
                <button
                  className="button-style"
                  onClick={() => PostOrderDetails(3)}
                  disabled={
                    props.OrderData?.Order_Status === "Processing"
                    // props.OrderData?.Order_Type === "Complete" ||
                    // props.OrderData?.Order_Type === "Scheduled"
                  }
                >
                  Add Drawing to Order
                </button>
              </div>
              <div className="col-md-4">
                <button className="button-style ">Save to Customer Dwg</button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="d-flex" style={{ gap: "26px" }}>
                  {" "}
                  {/* <label className="form-label label-space">Part id</label> */}
                  <label className="form-label label-space">Assembly</label>
                  {BomData?.length != 0 ? (
                    <Typeahead
                      className="in-field"
                      selected={selectedPartId}
                      // id="basic-example"
                      options={options}
                      labelKey="label"
                      placeholder="Select ..."
                      onChange={handleSelectChange}
                    />
                  ) : (
                    <Typeahead
                      className="in-field"
                      labelKey="label"
                      placeholder="No PartId for this Customer"
                      disabled
                    />
                  )}
                </div>
              </div>
              <div className="col-md-8">
                {/* <select
                  id=""
                  className="ip-select dropdown-field "
                  style={{ width: "230px" }}
                >
                  <option value="option1">option 1</option>
                  <option value="option2">option 2</option>
                  <option value="option3">option 3</option>
                </select> */}
                <input className="in-field" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="d-flex" style={{ gap: "15px" }}>
                  <label className="form-label label-space">J W Cost</label>
                  <input
                    className="in-field"
                    type="text"
                    value={BomArry[0]?.JobWorkCost}
                    // value={BomArry.length > 0 ? BomArry[0].JobWorkCost :null}
                    // value={
                    //   selectedPartId.length === 0
                    //     ? 0.0
                    //     : BomArry[0]?.JobWorkCost
                    // }
                  />
                </div>
                <div className="d-flex field-gap">
                  <label className="form-label label-space">Mtrl Cost</label>
                  <input
                    className="in-field"
                    type="text"
                    value={BomArry[0]?.MtrlCost}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex field-gap" style={{ gap: "27px" }}>
                  <label className="form-label">LOC</label>
                  <input className="in-field" type="text" />
                </div>
                <div className="d-flex field-gap">
                  <label className="form-label">Pierces</label>
                  <input className="in-field" type="text" />
                </div>
                {/* <label className="form-label">Part Weight</label>
                  <input
                    className="in-fields"
                    type="text"
                    value={BomArry[0]?.Weight}
                  /> */}
              </div>
              <div className="col-md-4">
                <div className="d-flex" style={{ gap: "30px" }}>
                  <label className="form-label">Process</label>
                  <input className="in-field" type="text" />
                </div>
                <div className="d-flex field-gap">
                  <label className="form-label label-space"> Prt Weight</label>{" "}
                  <input
                    className="in-field"
                    type="text"
                    // value={BomArry[0]?.Weight}
                  />
                </div>
                {/* <label className="form-label">Material Cost</label>
                  <input
                    className="in-fields"
                    type="text"
                    value={BomArry?.MtrlCost}
                  /> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="form-bg mb-3">
            <div className="row">
              <div className="col-md-8">
                <label className="form-label">BOM Material Availability</label>
              </div>
              <div className="col-md-4">
                <button
                  className="button-style"
                  onClick={() => PostOrderDetails(3)}
                  disabled={
                    props.OrderData?.Order_Status === "Processing"
                    // props.OrderData?.Order_Type === "Complete" ||
                    // props.OrderData?.Order_Type === "Scheduled"
                  }
                >
                  Add Drawing to Order
                </button>
              </div>
            </div>

            <div className="row" style={{ gap: "20px" }}>
              <div className="col-md-1">
                {/* <label className="form-label label-space">Part id</label> */}
                <label className="form-label label-space">Assembly</label>
              </div>
              <div className="col-md-4">
                {" "}
                {BomData?.length != 0 ? (
                  <Typeahead
                    className="ip-slecet input-field"
                    selected={selectedPartId}
                    // id="basic-example"
                    options={options}
                    placeholder="Select ..."
                    onChange={handleSelectChange}
                  />
                ) : (
                  <Typeahead
                    className="ip-slecet input-field"
                    labelKey="label"
                    placeholder="No PartId's"
                    disabled
                  />
                )}
              </div>
              <div className="col-md-6">
                <input
                  className="in-field mt-1"
                  type="text"
                  //   value={BomArry[0]?.Material}
                  value={
                    selectedPartId.length === 0 ? "" : BomArry[0]?.Material
                  }
                  disabled={BomData.length === 0}
                />
              </div>
            </div>
            <div className="row mt-1 mb-2">
              <div className="col-md-5 d-flex" style={{ gap: "10px" }}>
                <label className="form-label">Operation</label>

                <input
                  className="in-field mt-1"
                  type="text"
                  // value={BomArry[0]?.Operation}
                  value={
                    selectedPartId.length === 0 ? "" : BomArry[0]?.Operation
                  }
                  disabled={BomData.length === 0}
                />
              </div>
              <div className="col-md-4 d-flex" style={{ gap: "10px" }}>
                <label className="form-label label-space">J W Cost</label>
                <input
                  className="in-field mt-1"
                  type="text"
                  // value={BomArry[0]?.JobWorkCost}
                  value={
                    selectedPartId.length === 0 ? 0.0 : BomArry[0]?.JobWorkCost
                  }
                  disabled={BomData.length === 0}
                />
              </div>
              <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                <label className="form-label label-space">Mtrl Cost</label>
                <input
                  className="in-field mt-1"
                  type="text"
                  // value={BomArry[0]?.MtrlCost}
                  value={
                    selectedPartId.length === 0 ? 0.0 : BomArry[0]?.MtrlCost
                  }
                  disabled={BomData.length === 0}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* </Form> */}
    </div>
  );
}

export default OrdrDtls;
