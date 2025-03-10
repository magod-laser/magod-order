import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Link, useLocation } from "react-router-dom";
import SolidStateModal from "../../SolidStatepdf/SolidStateModal";
import moment from "moment";
import { apipoints } from "../../../../../../../../../api/isoForms/solidState";
import { toast } from "react-toastify";

export default function Solidstatelaser() {
  const location = useLocation();
  const NcId = location.state?.selectedNcid || "";
  const response = location?.state.response || [];
  const MachineList = location?.state.responsedata || [];
  const navigate = useNavigate();

  const [solidStateFormOpen, setSolidStateFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    ncid: NcId,
    taskNo: "",
    taskDate: moment().format("DD/MM/YYYY"),
    operator: "",
    filler: "",
    gasType: "",
    jointType: "",
    jointTypeData: [],
    machine: "",
    material: "",
    thickness: 0,
    materialTableData: [],
    selectedRow1: null,
    selectedRowData1: {},
    selectedRow2: null,
    selectedRowData2: {},
    beadDia: 0,
    power: 0,
    energy: 0,
    pulseWidth: 0,
    frequency: 0,
    pulseShape: 0,
    speed: 0,
    gasFlow: 0,
    focusPosition: 0,
    stepOver: 0,
    standOff: 0,
    layerThk: 0,
    comments: "",
    parametersTableData: [],
  });

  const openPdf = () => {
    setSolidStateFormOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(apipoints.getData, {
          // ncid: formData.ncid,
          params: {
            ncid: formData.ncid,
          },
        });

        if (response.data && response.data.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            ncid: response.data[0].Ncid,
            taskNo: response.data[0].TaskNo,
            machine: response.data[0].Machine,
          }));
        } else {
          console.error("Response data is empty.");
        }
      } catch (error) {
        console.error("Error fetching", error);
      }
    };

    fetchData();
  }, [formData.ncid]);

  useEffect(() => {
    Axios.get(apipoints.getJointType)
      .then((response) => {
        setFormData((prevData) => ({
          ...prevData,
          jointTypeData: response.data,
        }));
      })
      .catch((error) => {});
  }, []);

  const formattedDate = (date) => {
    return moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const solidStateParameters = {
        ncid: formData.ncid,
        taskDate: formattedDate(formData.taskDate),
        operator: formData.operator,
        filler: formData.filler,
        gasType: formData.gasType,
        jointType: formData.jointType,
      };

      await Axios.post(
        apipoints.saveSolidStateParameters,
        solidStateParameters
      );
      toast.success("Data Saved");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRowSelect = (index) => {
    const selectedRowData1 = formData.materialTableData[index];
    const selectedRowData2 = formData.materialTableData[index];

    setFormData((prevData) => ({
      ...prevData,
      selectedRow1: prevData.selectedRow1 === index ? null : index,
      selectedRow2: prevData.selectedRow1 === index ? null : index,

      selectedRowData1: selectedRowData1 || {},
      selectedRowData2: selectedRowData2 || {},
    }));
  };

  const handleAddMaterial = async () => {
    try {
      if (formData.material === "") {
        toast.error("Enter Material");
        return;
      }
      const newMtrl = {
        ncid: formData.ncid,
        material: formData.material,
        thickness: formData.thickness,
      };

      const response = await Axios.post(
        apipoints.insertMaterialDetails,
        newMtrl
      );

      setFormData((prevFormData) => ({
        ...prevFormData,

        materialTableData: response.data,
        material: "",
        thickness: 0,
      }));
    } catch (error) {
      console.error("Error Adding Material", error);
      // toast.error("Error Adding Material");
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      if (!formData.selectedRow1) {
        toast.error("Select a row before deleting");
        return;
      }
      await Axios.post(apipoints.deleteMaterialDetails, { id });

      setFormData((prevData) => ({
        ...prevData,
        materialTableData: prevData.materialTableData.filter(
          (item) => item.ID !== id
        ),
        selectedRow1: null,
      }));

      toast.success("Material deleted successfully");
    } catch (error) {
      console.error("Error Deleting Material", error);
      // toast.error("Error Deleting Material");
    }
  };

  const handleAddParameter = async () => {
    try {
      const newMtrl = {
        ncid: formData.ncid,
        beadDia: formData.beadDia,
        power: formData.power,
        energy: formData.energy,
        pulseWidth: formData.pulseWidth,
        frequency: formData.frequency,
        pulseShape: formData.pulseShape,
        speed: formData.speed,
        gasFlow: formData.gasFlow,
        focusPosition: formData.focusPosition,
        stepOver: formData.stepOver,
        standOff: formData.standOff,
        layerThk: formData.layerThk,
        comments: formData.comments,
      };

      const response = await Axios.post(apipoints.insertParaDetails, newMtrl);

      setFormData((prevFormData) => ({
        ...prevFormData,

        parametersTableData: response.data,
        beadDia: 0,
        power: 0,
        energy: 0,
        pulseWidth: 0,
        frequency: 0,
        pulseShape: 0,
        speed: 0,
        gasFlow: 0,
        focusPosition: 0,
        stepOver: 0,
        standOff: 0,
        layerThk: 0,
        comments: "",
      }));
    } catch (error) {
      console.error("Error Adding Parameter", error);
    }
  };

  const handleDeleteParameter = async (id) => {
    try {
      if (!formData.selectedRow1) {
        toast.error("Select a row before deleting");
        return;
      }
      await Axios.post(apipoints.deleteParaDetails, { id });

      setFormData((prevData) => ({
        ...prevData,
        parametersTableData: prevData.parametersTableData.filter(
          (item) => item.ID !== id
        ),
        selectedRow2: null,
      }));

      toast.success("Parameter deleted successfully");
    } catch (error) {
      console.error("Error Deleting Parameter", error);
    }
  };

  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = formData.materialTableData.map((item, idx) => {
      if (idx === index) {
        return { ...item, [name]: value };
      }
      return item;
    });

    setFormData((prevData) => ({
      ...prevData,
      materialTableData: updatedItems,
    }));
  };

  const handleBlur = async (index, ID, material, thickness) => {
    try {
      const updateData = {
        ncid: formData.ncid,
        id: ID,
        material,
        thickness,
      };

      await Axios.post(apipoints.updateMaterialDetails, updateData);

      const updateMtrlDetails = [...formData.materialTableData];
      updateMtrlDetails[index] = {
        ...updateMtrlDetails[index],
        material,
        thickness,
      };

      setFormData((prevFormData) => ({
        ...prevFormData,
        materialTableData: updateMtrlDetails,
      }));
    } catch (error) {
      console.error("Error updating material details", error);
    }
  };

  const handleParaChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = formData.parametersTableData.map((item, idx) => {
      if (idx === index) {
        return { ...item, [name]: value };
      }
      return item;
    });

    setFormData((prevData) => ({
      ...prevData,
      parametersTableData: updatedItems,
    }));
  };

  const handleParaBlur = async (index, item) => {
    try {
      const updateData = {
        ncid: formData.ncid,
        id: item.ID,
        ...item,
      };

      const response = await Axios.post(
        apipoints.updateParaDetails,
        updateData
      );

      if (response.status === 200) {
        const updateParaDetails = [...formData.parametersTableData];
        updateParaDetails[index] = { ...item };

        setFormData((prevFormData) => ({
          ...prevFormData,
          parametersTableData: updateParaDetails,
        }));
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating Parameter details", error);
    }
  };

  useEffect(() => {
    const fetchQtnData = async () => {
      try {
        const response = await Axios.post(apipoints.allSolidStateData, {
          ncid: formData.ncid,
        });

        const {
          solid_state_job_parameter,
          solid_state_material_details,
          solid_state_parameters,
        } = response.data;

        setFormData((prevData) => ({
          ...prevData,

          operator: solid_state_job_parameter.length
            ? solid_state_job_parameter[0].Operator
            : "",

          filler: solid_state_job_parameter.length
            ? solid_state_job_parameter[0].Filler
            : "",

          gasType: solid_state_job_parameter.length
            ? solid_state_job_parameter[0].Gas_Type
            : "",

          jointType: solid_state_job_parameter.length
            ? solid_state_job_parameter[0].Joint_Type
            : "",

          materialTableData: solid_state_material_details.length
            ? solid_state_material_details
            : [],

          parametersTableData: solid_state_parameters.length
            ? solid_state_parameters
            : [],
        }));
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
    };
    fetchQtnData();
  }, []);

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  console.log("formData", formData);

  const handleClose = () => {
    navigate("/Orders/Service/NCProgram",{
      state: {response:response,responsedata:MachineList},
    });
  };


  return (
    <div>
      <div className="row">
        <h4 className="title">
          Laser Welding Job Parameter Sheet - Solid State Laser
        </h4>
      </div>

      <div className="row mt-1">
        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Schedule No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="taskNo"
                value={formData.taskNo}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Date</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="taskDate"
                value={formData.taskDate}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Operator</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="operator"
                value={formData.operator}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="d-flex col-md-3 col-sm-6" style={{ gap: "25px" }}>
          <div className="col-md-2" style={{ marginLeft: "40px" }}>
            <button
              type="submit"
              className="button-style"
              variant="primary"
              onClick={handleSave}
            >
              Save
            </button>
          </div>

          <div className="col-md-2">
            <SolidStateModal
              solidStateFormOpen={solidStateFormOpen}
              setSolidStateFormOpen={setSolidStateFormOpen}
              formData={formData}
            />
            <button
              className="button-style"
              variant="primary"
              onClick={openPdf}
            >
              Print
            </button>
          </div>

          <div className="col-md-2">
            <button type="submit" className="button-style" variant="primary" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-1">
        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Filler</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="filler"
                value={formData.filler}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Gas Type</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="gasType"
                value={formData.gasType}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Joint Type</label>
            </div>
            <div className="col-8">
              {/* <input
                className="input-field"
                type="text"
                name="jointType"
                value={formData.jointType}
                onChange={handleInputChange}
              /> */}
              <select
                className="ip-select"
                name="jointType"
                value={formData.jointType}
                onChange={handleInputChange}
                style={{ marginTop: "12px" }}
              >
                <option value="" selected disabled hidden>
                  Select Joint Type
                </option>

                {formData.jointTypeData?.map((joint, index) => (
                  <option key={index} value={joint.Joint_Type}>
                    {joint.Joint_Type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Machine</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="machine"
                value={formData.machine}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mt-3">
          <div
            style={{
              height: "140px",
              overflowY: "scroll",
              overflowX: "scroll",
            }}
          >
            <Table className="table-data border" striped>
              <thead
                className="tableHeaderBGColor"
                style={{
                  textAlign: "center",
                  position: "sticky",
                  top: "-1px",
                }}
              >
                <tr className="table-header">
                  <th>SL No</th>
                  <th>Material</th>
                  <th>Thickness</th>
                </tr>
              </thead>

              <tbody style={{ textAlign: "center" }}>
                {formData.materialTableData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowSelect(item.ID)}
                    className={
                      formData.selectedRow1 === item.ID ? "selectedRowClr" : ""
                    }
                  >
                    <td>{index + 1}</td>
                    {/* <td>{item.Material}</td> */}
                    <td>
                      <input
                        type="text"
                        className="input-style"
                        value={item.Material}
                        name="Material"
                        onChange={(e) => handleMaterialChange(e, index)}
                        onBlur={() =>
                          handleBlur(
                            index,
                            item.ID,
                            item.Material,
                            item.Thickness
                          )
                        }
                      />
                    </td>
                    {/* <td>{item.Thickness}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Thickness}
                        name="Thickness"
                        min={0}
                        onChange={(e) => handleMaterialChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() =>
                          handleBlur(
                            index,
                            item.ID,
                            item.Material,
                            item.Thickness
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <div
          className="col-md-4 col-sm-12 mt-2"
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
          }}
        >
          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Material</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="text"
                name="material"
                className="in-field"
                value={formData.material}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Thickness</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="thickness"
                className="in-field"
                value={formData.thickness}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex mt-2">
            <div className="col-4">
              <label className="form-label"></label>
            </div>
            <div className="col-auto">
              <button
                className="button-style"
                variant="primary"
                onClick={handleAddMaterial}
              >
                Add
              </button>
            </div>
            <div className="col-auto">
              <button
                className="button-style"
                variant="primary"
                onClick={() => handleDeleteMaterial(formData.selectedRow1)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mt-3">
          <div
            style={{
              height: "490px",
              overflowY: "scroll",
              overflowX: "scroll",
            }}
          >
            <Table className="table-data border" striped>
              <thead
                className="tableHeaderBGColor"
                style={{
                  textAlign: "center",
                  position: "sticky",
                  top: "-1px",
                  whiteSpace: "nowrap",
                }}
              >
                <tr className="table-header">
                  <th>SL No</th>
                  <th>Bead Dia(mm)</th>
                  <th>Power(W)</th>
                  <th>Energy(J)</th>
                  <th>Pulse Width(ms)</th>
                  <th>Frequency(Hz)</th>
                  <th>pulse Shape</th>
                  <th>Speed(mm/min)</th>
                  <th>Gas Flow(LPM)</th>
                  <th>Focus Position</th>
                  <th>Step Over(mm)</th>
                  <th>Stand Off(mm)</th>
                  <th>Layer Thk(mm)</th>
                  <th>Comments</th>
                </tr>
              </thead>

              <tbody style={{ textAlign: "center" }}>
                {formData.parametersTableData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowSelect(item.ID)}
                    className={
                      formData.selectedRow2 === item.ID ? "selectedRowClr" : ""
                    }
                  >
                    <td>{index + 1}</td>
                    {/* <td>{item.Bead_Dia}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Bead_Dia}
                        name="Bead_Dia"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>
                    {/* <td>{item.Power}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Power}
                        name="Power"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>
                    {/* <td>{item.Energy}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Energy}
                        name="Energy"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>

                    {/* <td>{item.Pulse_Width}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Pulse_Width}
                        name="Pulse_Width"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>

                    {/* <td>{item.Frequency}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Frequency}
                        name="Frequency"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>

                    {/* <td>{item.Pulse_Shape}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Pulse_Shape}
                        name="Pulse_Shape"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>
                    {/* <td>{item.Speed}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Speed}
                        name="Speed"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>

                    {/* <td>{item.Gas_Flow}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Gas_Flow}
                        name="Gas_Flow"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>
                    {/* <td>{item.Focus_Position}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Focus_Position}
                        name="Focus_Position"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Step_Over}
                        name="Step_Over"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>
                    {/* <td>{item.Stand_Off}</td> */}
                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.Stand_Off}
                        name="Stand_Off"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="input-style"
                        value={item.LayerThk}
                        name="LayerThk"
                        min={0}
                        onChange={(e) => handleParaChange(e, index)}
                        onKeyDown={blockInvalidChar}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>
                    {/* <td>{item.Comments}</td> */}
                    <td>
                      <input
                        type="text"
                        className="input-style"
                        value={item.Comments}
                        name="Comments"
                        onChange={(e) => handleParaChange(e, index)}
                        onBlur={() => handleParaBlur(index, item)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <div
          className="col-md-4 col-sm-12 mt-2"
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
          }}
        >
          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Bead Dia(mm)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="beadDia"
                className="in-field"
                value={formData.beadDia}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Power(W)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="power"
                className="in-field"
                value={formData.power}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Energy(e)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="energy"
                className="in-field"
                value={formData.energy}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Pulse Width(Ms)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="pulseWidth"
                className="in-field"
                value={formData.pulseWidth}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Frequency(Hz)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="frequency"
                className="in-field"
                value={formData.frequency}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Pulse Shape </label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="pulseShape"
                className="in-field"
                value={formData.pulseShape}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Speed(Mm/Min)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="speed"
                className="in-field"
                value={formData.speed}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Gas Flow(LPM)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="gasFlow"
                className="in-field"
                value={formData.gasFlow}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Focus Position</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="focusPosition"
                className="in-field"
                value={formData.focusPosition}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Step Over(Mm)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="stepOver"
                className="in-field"
                value={formData.stepOver}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Stand Off(Mm)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="standOff"
                className="in-field"
                value={formData.standOff}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className="col-3">
              <label className="form-label">Layer Thk(Mm)</label>
            </div>
            <div className="col-8 mt-2">
              <input
                type="number"
                name="layerThk"
                className="in-field"
                value={formData.layerThk}
                onChange={handleInputChange}
                min={0}
                onKeyDown={blockInvalidChar}
              />
            </div>
          </div>

          <div className="d-flex mt-1">
            <div className="col-3">
              <label className="form-label">Comments</label>
            </div>
            <div className="col-8 mt-2">
              <textarea
                className="form-control sticky-top mt-1"
                style={{ fontSize: "12px", resize: "none" }}
                rows="2"
                id=""
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
              ></textarea>
              {/* <input type="text" name="thickness" className="in-field" /> */}
            </div>
          </div>

          <div className="d-flex mt-2">
            <div className="col-4">
              <label className="form-label"></label>
            </div>
            <div className="col-auto">
              <button
                className="button-style"
                variant="primary"
                onClick={handleAddParameter}
              >
                Add
              </button>
            </div>
            <div className="col-auto">
              <button
                className="button-style"
                variant="primary"
                onClick={() => handleDeleteParameter(formData.selectedRow2)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
