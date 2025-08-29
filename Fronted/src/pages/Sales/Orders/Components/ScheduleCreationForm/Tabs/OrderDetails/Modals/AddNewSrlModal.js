/** @format */

import { React } from "react";
import { Form, Modal } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
// import LoadingPage from "../../../Loading";
import { HashLoader } from "react-spinners";

// const {
//   getRequest,
//   postRequest,
// } = require("../../../../../../../api/apiinstance");
// const { endpoints } = require("../../../../../../../api/constants");

function AddNewSrlModal(props) {
  const {
    // OrderData,
    // OrderCustData,
    // OrdrDetailsData,
    importdwgshow,
    // setImportDwgShow,
    // handleImportDwg,
    handleCloseImportDwg,
    // importdrawings,
    mtrldata,
    // selectMtrl,
    // strmtrlcode,
    procdata,
    selectProc,
    selectMtrlSrc,
    // tolerancedata,
    // selectTolerance,
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
    // unitPrice,
    setUnitPrice,
    // DwgName,
    // handleDwgInputChange,
    // PostSrlData,
    // insertnewsrldata,
    // handleMtrlCodeTypeaheadChange,
    PostOrderDetails,
    //---NEW ---------
    newSerial,
    // setNewSerial,
    handleChange,
    isLoading,
    // handleInputChange,
    handleMtrlCodeTypeaheadChangeeee,
    NewSrlFormData,
    // Operation
    // setOperation,
  } = props;

  return (
    <div className="row mt-1">
      {/* {isLoading && <LoadingPage />} */}
       <>
                  {isLoading && (
                    <div className="full-page-loader">
                      <HashLoader color="#2b3a55" />
                      <p className="mt-2">Loading, please wait...</p>
                    </div>
                  )}
                </>
      <Modal
        name="SrlModal"
        show={importdwgshow}
        onHide={handleCloseImportDwg}
        backdrop="static"
      >
        <Modal.Header
          className="justify-content-md-center"
          style={{
            paddingTop: "10px",
            backgroundColor: "#283E81",
            color: "#ffffff",
          }}
        >
          <Modal.Title style={{ fontSize: "14px" }}>
            MagodLaser : New Order Serial
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-style">
            {/* <Form onSubmit={importdrawings} style={{ overflowY: "scroll" }}> */}
            <div className="row mb-1">
              <div className="col">
                <div className="row">
                  <Form.Group controlId="strmtrlcode">
                    <div className="d-flex field-gap md-col-2">
                      <label className="form-label label-space">
                        Dwg / Part Name
                      </label>
                      <input
                        className="in-field"
                        name="newSrlDwgname"
                        autoComplete="off"
                        // value={DwgName}
                        // value={newSerial.DwgName}
                        value={newSerial.DwgName}
                        // onChange={handleDwgInputChange}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Form.Group>
                </div>
                <div className="row">
                  <Form.Group controlId="strmtrlcode">
                    <div
                      className="d-flex field-gap md-col-2"
                      style={{ gap: "60px" }}
                    >
                      <label className="form-label">Material</label>
                      {mtrldata.length > 0 || mtrldata != null ? (
                        <Typeahead
                          className="ip-select"
                          id="basic-example"
                          labelKey="Mtrl_Code"
                          name="newSrlMaterial"
                          onChange={handleMtrlCodeTypeaheadChangeeee}
                          // onInputChange={handleInputChange}
                          // onChange={handleChange}
                          // selected={Material}
                          options={mtrldata}
                          placeholder="Choose a Material..."
                          required
                        ></Typeahead>
                      ) : (
                        ""
                      )}
                    </div>
                  </Form.Group>
                </div>

                <div className="row mt-1">
                  <Form.Group controlId="source">
                    <div
                      className="d-flex field-gap md-col-4"
                      style={{ gap: "17px" }}
                    >
                      <label className="form-label label-space">
                        Material Source
                      </label>
                      <select
                        className="ip-select"
                        id="strsource"
                        name="newSrlMtrlSrc"
                        onChange={selectMtrlSrc}
                        defaultValue={"Customer"}
                      >
                        {/* <option
                          value=""
                          disabled
                          selected
                          defaultValue={"Customer"}
                        >
                          ** Select **
                        </option> */}
                        <option value={"Customer"}>Customer</option>
                        <option value={"Magod"}>Magod</option>
                      </select>
                    </div>
                  </Form.Group>
                </div>

                <div className="row mt-1">
                  <Form.Group controlId="strprocess">
                    {/* <div className="md-col-4">
                      <label className="form-label">Operation</label>
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
                    </div> */}
                    <div
                      className="d-flex field-gap md-col-4"
                      style={{ gap: "47px" }}
                    >
                      <label className="form-label">Operation</label>
                      {/* {procdata.length > 0 ? ( */}
                      <select
                        className="ip-select"
                        id="strprocess"
                        name="newSrlOperation"
                        // defaultValue={procdata[0]?.Operation}
                        onChange={selectProc}
                        // value={Operation || procdata[0]?.Operation || ""}
                        // onChange={(e) => setOperation(e.target.value)}
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
                            if (
                              proc.type === "service" &&
                              proc["Service"] !== 0
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
                          } else if (props.OrderData?.Type === "Fabrication") {
                            // Fabrication logic (assuming this logic for 'MultiOperation' is valid)
                            if (proc["MultiOperation"] === -1) {
                              return (
                                <option
                                key={proc["OperationID"]}
                                value={proc["Operation"]}
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
                  </Form.Group>
                </div>

                {/* <div className="row mt-1">
                  <div className="md-col-4">
                    <label className="form-label">Operation</label>
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
                </div> */}
                <div className="row mt-1">
                  <div
                    className="d-flex field-gap col-md-6"
                    style={{ gap: "19px" }}
                  >
                    {/* <label className="form-label">Quantity</label> */}

                    {/* <input
                  type="text"
                  className="ip-select in-field"
                  id="Qty"
                  name="newSrlQuantity"
                  onChange={handleChange}
                  value={newSerial.quantity}
                  required
                /> */}
                    <label className="form-label">Quantity</label>
                    <InputField
                      className="in-field"
                      name="newSrlQty"
                      autoComplete="off"
                      id="Qty"
                      value={quantity}
                      defaultValue={1}
                      onChangeCallback={setQuantity}
                      required
                    />
                  </div>
                  <div
                    className="d-flex field-gap col-md-6"
                    style={{ gap: "42px" }}
                  >
                    {/* <Form.Group controlId="rates">
                      <InputField
                        label="JW Rate"
                        name="newSrlJWRate"
                        id="Qty"
                        value={jwRate}
                        onChangeCallback={setJwRate}
                        required
                      />
                    </Form.Group> */}
                    <label className="form-label label-space">JW Rate</label>
                    <InputField
                      className="in-field"
                      name="newSrlJWRate"
                      autoComplete="off"
                      id="JWrate"
                      // value={jwRate}
                      value={jwRate === "0" || jwRate === 0 ? "" : jwRate}
                      onChangeCallback={setJwRate}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div
                    className="d-flex field-gap col-md-6"
                    style={{ gap: "15px" }}
                  >
                    {/* <Form.Group controlId="rates">
                      <InputField
                        label="UnitPrice"
                        name="newSrlUnitPrice"
                        id="Qty"
                        // value={unitPrice}
                        // value={jwRate + materialRate}

                        value={parseFloat(jwRate) + parseFloat(materialRate)}
                        // onChangeCallback={setUnitPrice}
                        disabled
                        defaultvalue={0.0}
                      />
                    </Form.Group> */}
                    <label className="form-label">UnitPrice</label>
                    <InputField
                      className="in-field"
                      name="newSrlUnitPrice"
                      autoComplete="off"
                      id="UnitPrice"
                      value={parseFloat(jwRate) + parseFloat(materialRate)}
                      disabled
                      onChangeCallback={setUnitPrice}
                      required
                    />
                  </div>
                  <div
                    className="d-flex field-gap col-md-6"
                    style={{ gap: "15px" }}
                  >
                    {" "}
                    {/* <Form.Group controlId="rates">
                      <InputField
                        label="MaterialRate"
                        id="Qty"
                        name="newSrlMaterialRate"
                        value={materialRate}
                        onChangeCallback={setMaterialRate}
                        required
                      />
                    </Form.Group> */}
                    <label className="form-label">MaterialRate</label>
                    <InputField
                      className="in-field"
                      id="MaterialRate"
                      name="newSrlMaterialRate"
                      autoComplete="off"
                      // value={materialRate}
                      value={
                        materialRate === "0" || materialRate === 0
                          ? ""
                          : materialRate
                      }
                      onChangeCallback={setMaterialRate}
                      required
                      disabled={NewSrlFormData?.MtrlSrc === "Customer"}
                    />
                  </div>
                </div>

                <div className="row mt-1">
                  <div className="d-flex col-md-6 field-gap">
                    <label className="form-label label-space">Insp Level</label>
                    {inspdata.length > 0 ? (
                      <select
                        id="strinsp"
                        className="ip-select"
                        name="newSrlInspLvl"
                        onChange={selectInsp}
                      >
                        {/* <option value="" disabled selected>
                          ** Select **
                        </option> */}
                        {inspdata.map((insplvl) => {
                          return (
                            <option value={insplvl["InspLevel"] || "Insp1"}>
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
                    {packdata.length > 0 ? (
                      <select
                        id="strpkng"
                        className="ip-select"
                        name="newSrlPkngLvl"
                        onChange={selectPack}
                      >
                        {/* <option value="" disabled selected>
                          ** Select **
                        </option> */}
                        {packdata.map((packlvl) => {
                          return (
                            <option value={packlvl["PkngLevel"] || "Pkng1"}>
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
              </div>
            </div>
            {/* </Form> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {" "}
          <div className="">
            <button
              className="button-style"
              type="submit"
              // onClick={insertnewsrldata}
              onClick={() => PostOrderDetails(1)}
            >
              Save
            </button>
            <button
              className="button-style"
              // style={{ backgroundColor: "gray" }}
              variant="secondary"
              onClick={() => handleCloseImportDwg()}
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddNewSrlModal;
