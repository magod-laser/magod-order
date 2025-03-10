import { React, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import LoadingPage from "../../../Loading";
function BulkChangeModal(props) {
  const {
    bulkChnangMdl,
    setBulkChnangMdl,
    handlebulkChnangMdl,
    handleClosesetBulkChnangMdl,
    // ------------------------------------
    OrderData,
    OrderCustData,
    OrdrDetailsData,
    importdwgshow,
    setImportDwgShow,
    handleImportDwg,
    handleCloseImportDwg,
    importdrawings,
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
    insertnewsrldata,
    handleMtrlCodeTypeaheadChange,
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
    selectedItems,
    updateblkcngOrdrData,
    handleblkCngCheckBox,
    blkCngCheckBox,
    setBlkCngCheckBox,
    //---new -----
    blkChange,
    handleChange,
    handleInputChange,
    isLoading,
  } = props;

  const [isChecked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    const newCheckedValue = !isChecked;
    setChecked(newCheckedValue);
  };
  return (
    <div className="row">
      {/* {isLoading && <LoadingPage />} */}
      <Modal
        show={bulkChnangMdl}
        size="lg"
        onHide={handleClosesetBulkChnangMdl}
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
            Bulk Change Parameters
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-style">
            {/* <Form onSubmit={importdrawings} style={{ overflowY: "scroll" }}> */}
            <div className="row mb-1">
              <div className="col">
                {/* <div className="col-md-3"></div>
                  <div className="col-md-3"></div> */}
                {/* <Form.Group controlId="strmtrlcode"> */}
                {/* <div className="md-col-2"> */}
                {/* <div className="row">
                    <div className="col-md-2">
                      <label className="form-label">Dwg / Part Name</label>
                    </div>
                    <div className="col-md-8 mt-2">
                      <input
                        className="in-field"
                        name="blkCngDwgname"
                        // value={DwgName}
                        value={blkChange.DwgName}
                        // onChange={handleDwgInputChange}
                        onChange={handleChange}
                        required
                        disabled={!blkCngCheckBox[0]}
                      />
                    </div>
                    <div className="col-md-2 mt-3">
                      <input
                        name="blkCngDwgname"
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(0)}
                        checked={blkCngCheckBox[0]}
                      />
                    </div>
                  </div> */}

                {/* </div> */}
                {/* </Form.Group> */}

                <Form.Group controlId="strmtrlcode">
                  <div className="row">
                    <div className="col-md-2">
                      <label className="form-label">Material Code</label>
                    </div>
                    <div className="col-md-8">
                      {mtrldata.length > 0 || mtrldata != null ? (
                        <Typeahead
                          className="ip-select mt-2"
                          id="ip-select mt-22"
                          labelKey="Mtrl_Code"
                          name="blkCngMaterial"
                          onChange={handleMtrlCodeTypeaheadChange}
                          // onChange={handleChange}
                          onInputChange={handleInputChange}
                          // selected={selectedItems}
                          selected={LastSlctedRow ? [LastSlctedRow] : []}
                          // selected={selectedItems}
                          options={mtrldata}
                          placeholder="Choose a Material..."
                          required
                          disabled={!blkCngCheckBox[1]}
                        ></Typeahead>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-2 mt-3">
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(1)}
                        checked={blkCngCheckBox[1]}
                      />
                    </div>
                  </div>
                </Form.Group>

                <Form.Group controlId="source">
                  <div className="row">
                    <div className="col-md-2">
                      <label className="form-label">Material Source</label>
                    </div>
                    <div className="col-md-8">
                      <select
                        className="ip-select in-fields"
                        id="strsource"
                        name="blkCngMtrlSrc"
                        // onChange={selectMtrlSrc}
                        disabled={!blkCngCheckBox[2]}
                        value={blkChange.MtrlSrc || "Customer"}
                        onChange={handleChange}
                      >
                        {/* <option value="" disabled selected>
                          ** Select **
                        </option> */}
                        <option value={"Customer"}>Customer</option>
                        <option value={"Magod"}>Magod</option>
                      </select>
                    </div>
                    <div className="col-md-2 mt-3">
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(2)}
                        checked={blkCngCheckBox[2]}
                      />
                    </div>
                  </div>
                </Form.Group>

                <Form.Group controlId="strprocess">
                  <div className="row">
                    <div className="col-md-2">
                      <label className="form-label">Operation</label>
                    </div>
                    <div className="col-md-8">
                      {/* {procdata?.length > 0 ? ( */}
                      <select
                        className="ip-select in-fields"
                        id="strprocess"
                        name="blkCngOperation"
                        // onChange={selectProc}
                        disabled={!blkCngCheckBox[3]}
                        value={blkChange.Operation}
                        onChange={handleChange}
                      >
                        <option
                          value=""
                          // disabled={!blkCngCheckBox[3]}
                          selected
                        >
                          ** Select **
                        </option>
                        {/* {procdata.map((proc) => {
                          // Check if "Service" column has non-zero values
                          if (props.OrderData?.Type === "Service") {
                            if (proc["Service"] !== 0) {
                              return (
                                <option
                                  key={proc["ProcessDescription"]}
                                  value={proc["ProcessDescription"]}
                                >
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
                                >
                                  {proc["ProcessDescription"]}
                                </option>
                              );
                            }
                          } else {
                            if (proc["Profile"] !== 0) {
                              return (
                                <option
                                  key={proc["ProcessDescription"]}
                                  value={proc["ProcessDescription"]}
                                >
                                  {proc["ProcessDescription"]}
                                </option>
                              );
                            }
                          }
                          return null;
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
                    <div className="col-md-2 mt-3">
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(3)}
                        checked={blkCngCheckBox[3]}
                      />
                    </div>
                  </div>
                </Form.Group>

                <div className="row">
                  <div className="d-flex col-md-6" style={{ gap: "8px" }}>
                    {/* <InputField
                      className="ip-select in-fields" 
                      label="Quantity"
                      id="Qty"
                      name="blkCngQty"
                      value={quantity}
                      onChangeCallback={setQuantity}
                      value={blkChange.quantity}
                      onChange={handleChange}
                      required
                      disabled={!blkCngCheckBox[4]}
                      onCheckboxChange={() => handleblkCngCheckBox(4)}
                      isChecked={blkCngCheckBox[4]}
                      checkboxIndex={4}
                      showCheckbox={true}
                    /> */}
                    <div className="col-md-4">
                      <label className="form-label">Quantity</label>
                    </div>
                    <div className="col-md-4">
                      <input
                        className="ip-select input-field"
                        id="Qty"
                        name="blkCngQty"
                        value={blkChange.quantity}
                        onChange={handleChange}
                        required
                        disabled={!blkCngCheckBox[4]}
                      />
                    </div>
                    <div className="col-md-4 mt-3">
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(4)}
                        checked={blkCngCheckBox[4]}
                      />
                    </div>

                    {/* <div className="col-md-2 mt-3">
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(4)}
                        checked={blkCngCheckBox[4]}
                      />
                    </div> */}
                    {/* <input
                      className="ip-select in-fields"
                      id="Qty"
                      name="blkCngQty"
                      value={blkChange.quantity}
                      onChange={handleChange}
                      required
                      disabled={!blkCngCheckBox[4]}
                    /> */}
                  </div>
                  <div className="d-flex col-md-6">
                    {/* <Form.Group controlId="rates">
                      <InputField
                        className="ip-select in-fields"
                        label="JW Rate"
                        id="JWRate"
                        name="blkCngJWRate"
                        // value={jwRate}
                        // onChangeCallback={setJwRate}
                        value={blkChange.jwRate}
                        onChange={handleChange}
                        disabled={!blkCngCheckBox[5]}
                        onCheckboxChange={() => handleblkCngCheckBox(5)}
                        isChecked={blkCngCheckBox[5]}
                        checkboxIndex={5}
                        showCheckbox={true}
                      /> */}
                    {/* </Form.Group> */}
                    <div className="col-md-4">
                      <label className="form-label">JW Rate</label>
                    </div>
                    <div className="col-md-4">
                      <input
                        className="ip-select input-field"
                        id="Qty"
                        name="blkCngJWRate"
                        value={blkChange.jwRate}
                        onChange={handleChange}
                        required
                        disabled={!blkCngCheckBox[5]}
                      />
                    </div>
                    <div
                      className="col-md-4 mt-3"
                      style={{ marginLeft: "8px" }}
                    >
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(5)}
                        checked={blkCngCheckBox[5]}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="d-flex col-md-6" style={{ gap: "8px" }}>
                    {/* <Form.Group controlId="rates">
                      <InputField
                        className="ip-select in-fields"
                        label="UnitPrice"
                        id="UnitPrice"
                        name="blkCngUnitPrice"
                        // value={unitPrice}
                        // onChangeCallback={setUnitPrice}
                        value={blkChange.unitPrice}
                        onChange={handleChange}
                        disabled={!blkCngCheckBox[6]}
                        onCheckboxChange={() => handleblkCngCheckBox(6)}
                        isChecked={blkCngCheckBox[6]}
                        checkboxIndex={6}
                        showCheckbox={true}
                      />
                    </Form.Group> */}
                    <div className="col-md-4">
                      <label className="form-label">UnitPrice</label>
                    </div>
                    <div className="col-md-4">
                      <input
                        className="ip-select input-field"
                        id="Qty"
                        name="blkCngUnitPrice"
                        value={
                          parseFloat(blkChange.jwRate) +
                          parseFloat(blkChange.materialRate)
                        }
                        onChange={handleChange}
                        required
                        // disabled={!blkCngCheckBox[6]}
                        disabled
                      />
                    </div>
                    <div className="col-md-4 mt-3">
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(6)}
                        checked={blkCngCheckBox[6]}
                      />
                    </div>
                  </div>
                  <div className="d-flex col-md-6">
                    {" "}
                    {/* <Form.Group controlId="rates">
                      <InputField
                        className="ip-select in-fields"
                        label="Material Rate"
                        id="Mrate"
                        name="blkCngMrate"
                        // value={materialRate}
                        // onChangeCallback={setMaterialRate}
                        value={blkChange.materialRate}
                        onChange={handleChange}
                        disabled={!blkCngCheckBox[7]}
                        onCheckboxChange={() => handleblkCngCheckBox(7)}
                        isChecked={blkCngCheckBox[7]}
                        checkboxIndex={7}
                        showCheckbox={true}
                      />
                    </Form.Group> */}
                    <div className="col-md-4">
                      <label className="form-label">Material Rate</label>
                    </div>
                    <div className="col-md-4">
                      <input
                        className="ip-select in-fields"
                        id="Qty"
                        name="blkCngMrate"
                        value={blkChange.materialRate}
                        onChange={handleChange}
                        required
                        disabled={
                          !blkCngCheckBox[7] ||
                          LastSlctedRow?.Mtrl_Source === "Customer"
                        }
                      />
                    </div>
                    <div
                      className="col-md-4 mt-3"
                      style={{ marginLeft: "8px" }}
                    >
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(7)}
                        checked={blkCngCheckBox[7]}
                      />
                    </div>
                    <div className="col-md-2 mt-3"></div>
                  </div>
                </div>

                <div className="row">
                  <div className="d-flex col-md-6" style={{ gap: "8px" }}>
                    <div className="col-md-4">
                      <label className="form-label">Insp Level</label>
                    </div>
                    <div className="col-md-4">
                      {inspdata.length > 0 ? (
                        <select
                          id="strinsp"
                          className="ip-select in-fields"
                          // onChange={selectInsp}
                          name="blkCngInspLvl"
                          disabled={!blkCngCheckBox[8]}
                          value={blkChange.InspLvl}
                          onChange={handleChange}
                        >
                          {/* <option value="" selected>
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
                    <div className="col-md-4 mt-3">
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(8)}
                        checked={blkCngCheckBox[8]}
                      />
                    </div>
                  </div>
                  <div className="d-flex col-md-6">
                    <div className="col-md-4">
                      <label className="form-label">Packing Level</label>
                    </div>
                    <div className="col-md-4">
                      {packdata.length > 0 ? (
                        <select
                          id="strpkng"
                          className="ip-select in-fields"
                          name="blkCngPkngLvl"
                          // onChange={selectPack}
                          disabled={!blkCngCheckBox[9]}
                          value={blkChange.PkngLvl}
                          onChange={handleChange}
                        >
                          {/* <option value="" selected>
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
                    <div
                      className="col-md-4 mt-3"
                      style={{ marginLeft: "8px" }}
                    >
                      <input
                        type="checkbox"
                        onChange={() => handleblkCngCheckBox(9)}
                        checked={blkCngCheckBox[9]}
                      />
                    </div>
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
              onClick={updateblkcngOrdrData}
            >
              Save
            </button>

            <button
              className="button-style"
              style={{ backgroundColor: "gray" }}
              variant="secondary"
              onClick={() => handleClosesetBulkChnangMdl()}
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BulkChangeModal;
