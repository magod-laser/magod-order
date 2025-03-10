/** @format */

import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { apipoints } from "../../../../../../../api/isoForms/taskSheet";
import SolidStateLaserTable from "./SolidStateLaserTable";
import CoTable from "./CoTable";
import moment from "moment";
import TaskSheetModal from "./PrintTaskSheet/TaskSheetModal";

export default function TaskSheet() {
  const location = useLocation();
  const NcId = location.state?.selectedNcid || 0;
  const response = location?.state.response || [];
  const MachineList = location?.state.responsedata || [];
  const navigate = useNavigate();

  console.log("MachineList", MachineList, "response", response);

  const [formData, setFormData] = useState({
    ncid: NcId,
    taskNo: 0,
    // taskDate: 0,
    hasBom: 0,
    qty: 0,
    ncTaskId: 0,
    taskDate: moment().format("DD/MM/YYYY"),
    assemblyNo: 0, // DwgName
    anyDeffects: null,
    machineNo: 0,
    programNo: 0,
    fixtureRequirement: null,
    lensDistance: 0.0,
    mtrlThickness: 0.0,
    withFiller: null,
    fillerMaterial: "",
    batchNo: "",
    machinePeakPower: 0,
    laserEquipment: 0,
    reweldPermitted: null,
    fixtureNo: 0,
    controlPlanNo: 0,
    wpsNo: 0,
    pfdNo: 0,
    wiNo: 0,
    pqrNo: 0,
    standardOfRef: 0,
    partInspectionQC: 0,
    partInspectionWeldEngineer: 0,
    partInspectionIncharge: 0,
    partInspectionProjectManager: 0,
    weldSettingQC: 0,
    weldSettingWeldEngineer: 0,
    weldSettingIncharge: 0,

    // Table
    subAssy: "",
    qtyReceived: 0,
    subAssyTableData: [],
    partsTable: [],
    selectedRow1: null,
    selectedRowData1: {},

    preFlowGas: 0.0,
    postFlowGas: 0.0,
    designType: "",
    designTypeData: [],

    weldSide: "",
    weldSideData: [],
    gasType: "",
    backing: null,
    tackWeld: null,
    note: 0,

    // Welding Parameters - solid state
    sspoweratfocus: 0,
    ssfocusDia: 0,
    sspulseDuration: 0,
    sspulseFrequency: 0,
    sspulseShapeNo: 0,
    ssgasPressure: 0,
    ssfeedRate: 0,
    ssrpm: 0,
    ssgasPurity: 0,
    ssgapRange: 0,
    ssgasFlowOrientation: 0,

    // Welding Parameters - co2

    copowerTransmissionEfficiency: 0,
    copower: 0,
    cofrequency: 0,
    cobeamDia: 0,
    cofocus: 0,
    cogasPressure: 0,
    cofeedRate: 0,
    corpm: 0,
    cogasPurity: 0,
    cogapRange: 0,
    cogasFlowOrientation: 0,
  });

  const [openPrintModal, setOpenPrintModal] = useState(false);

  const formattedDate = (date) => {
    return moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
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

        const responseData = response.data;

        if (
          responseData &&
          responseData.data1 &&
          responseData.data2 &&
          responseData.data3
        ) {
          const { data1, data2, data3 } = responseData;

          const {
            Ncid,
            TaskNo,
            Machine,
            NCProgramNo,
            HasBOM,
            QtyAllotted,
            NcTaskId,
          } = data1[0];
          const { Dwg_Code } = data2[0];

          console.log("data3", data3);

          setFormData((prevData) => ({
            ...prevData,
            ncid: Ncid,
            taskNo: TaskNo,
            machineNo: Machine,
            programNo: NCProgramNo,
            assemblyNo: Dwg_Code,
            hasBom: HasBOM,
            qty: QtyAllotted,
            ncTaskId: NcTaskId,
            partsTable: data3,
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
          designTypeData: response.data,
        }));
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    Axios.get(apipoints.getWeldSide)
      .then((response) => {
        setFormData((prevData) => ({
          ...prevData,
          weldSideData: response.data,
        }));
      })
      .catch((error) => {});
  }, []);

  const openPdf = () => {
    setOpenPrintModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeCheckbox = (e, name) => {
    const isChecked = e.target.checked;
    const value = isChecked ? 1 : 0;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRowSelect = (index) => {
    const selectedRowData1 = formData.subAssyTableData[index];

    setFormData((prevData) => ({
      ...prevData,
      selectedRow1: prevData.selectedRow1 === index ? null : index,
      selectedRowData1: selectedRowData1 || {},
    }));
  };

  const handleSave = async () => {
    try {
      const taskSheetRegister = {
        ncid: formData.ncid,
        anyDeffects: formData.anyDeffects,
        taskDate: formattedDate(formData.taskDate),
        machineNo: formData.machineNo,
        programNo: formData.programNo,
        fixtureRequirement: formData.fixtureRequirement,
        lensDistance: formData.lensDistance,
        mtrlThickness: formData.mtrlThickness,
        withFiller: formData.withFiller,
        fillerMaterial: formData.fillerMaterial,
        batchNo: formData.batchNo,
        machinePeakPower: formData.machinePeakPower,
        laserEquipment: formData.laserEquipment,
        reweldPermitted: formData.reweldPermitted,
        fixtureNo: formData.fixtureNo,
        controlPlanNo: formData.controlPlanNo,
        wpsNo: formData.wpsNo,
        pfdNo: formData.pfdNo,
        wiNo: formData.wiNo,
        pqrNo: formData.pqrNo,
        standardOfRef: formData.standardOfRef,
        partInspectionQC: formData.partInspectionQC,
        partInspectionWeldEngineer: formData.partInspectionWeldEngineer,
        partInspectionIncharge: formData.partInspectionIncharge,
        partInspectionProjectManager: formData.partInspectionProjectManager,
        weldSettingQC: formData.weldSettingQC,
        weldSettingWeldEngineer: formData.weldSettingWeldEngineer,
        weldSettingIncharge: formData.weldSettingIncharge,

        preFlowGas: formData.preFlowGas,
        postFlowGas: formData.postFlowGas,
        designType: formData.designType,
        weldSide: formData.weldSide,
        gasType: formData.gasType,
        backing: formData.backing,
        tackWeld: formData.tackWeld,
        note: formData.note,
      };

      const solidStateParameters = {
        ncid: formData.ncid,
        sspoweratfocus: formData.sspoweratfocus,
        ssfocusDia: formData.ssfocusDia,
        sspulseDuration: formData.sspulseDuration,
        sspulseFrequency: formData.sspulseFrequency,
        sspulseShapeNo: formData.sspulseShapeNo,
        ssgasPressure: formData.ssgasPressure,
        ssfeedRate: formData.ssfeedRate,
        ssrpm: formData.ssrpm,
        ssgasPurity: formData.ssgasPurity,
        ssgapRange: formData.ssgapRange,
        ssgasFlowOrientation: formData.ssgasFlowOrientation,
      };

      const co2Parameters = {
        ncid: formData.ncid,
        copowerTransmissionEfficiency: formData.copowerTransmissionEfficiency,
        copower: formData.copower,
        cofrequency: formData.cofrequency,
        cobeamDia: formData.cobeamDia,
        cofocus: formData.cofocus,
        cogasPressure: formData.cogasPressure,
        cofeedRate: formData.cofeedRate,
        corpm: formData.corpm,
        cogasPurity: formData.cogasPurity,
        cogapRange: formData.cogapRange,
        cogasFlowOrientation: formData.cogasFlowOrientation,
      };

      await Axios.post(apipoints.saveTaskSheetRegister, taskSheetRegister);

      await Axios.post(
        apipoints.saveSolidStateParameters,
        solidStateParameters
      );
      await Axios.post(apipoints.saveCo2Parameters, co2Parameters);

      toast.success("Data Saved");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddSubAssy = async () => {
    try {
      if (formData.subAssy === 0) {
        toast.error("Enter Sub Assy");
        return;
      }
      const newSubAssy = {
        ncid: formData.ncid,
        subAssy: formData.subAssy,
        qtyReceived: formData.qtyReceived,
      };

      const response = await Axios.post(
        apipoints.insertSubAssyDetails,
        newSubAssy
      );

      setFormData((prevFormData) => ({
        ...prevFormData,

        subAssyTableData: response.data,
        subAssy: "",
        qtyReceived: 0,
      }));
    } catch (error) {
      console.error("Error Adding Sub Assmbely", error);
      // toast.error("Error Adding Material");
    }
  };

  const handleDeleteSubAssy = async (id) => {
    try {
      if (!formData.selectedRow1) {
        toast.error("Select a row before deleting");
        return;
      }
      await Axios.post(apipoints.deleteSubAssyDetails, { id });

      setFormData((prevData) => ({
        ...prevData,
        subAssyTableData: prevData.subAssyTableData.filter(
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

  const handlePartChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = formData.subAssyTableData.map((item, idx) => {
      if (idx === index) {
        return { ...item, [name]: value };
      }
      return item;
    });

    setFormData((prevData) => ({
      ...prevData,
      subAssyTableData: updatedItems,
    }));
  };

  const handleBlur = async (index, ID, subAssy, qtyReceived) => {
    try {
      const updateData = {
        ncid: formData.ncid,
        id: ID,
        subAssy,
        qtyReceived,
      };

      await Axios.post(apipoints.updateSubAssyDetails, updateData);

      const updateSubAssy = [...formData.subAssyTableData];
      updateSubAssy[index] = {
        ...updateSubAssy[index],
        subAssy,
        qtyReceived,
      };

      setFormData((prevFormData) => ({
        ...prevFormData,
        subAssyTableData: updateSubAssy,
      }));
    } catch (error) {
      console.error("Error updating material details", error);
    }
  };

  useEffect(() => {
    const fetchQtnData = async () => {
      try {
        const response = await Axios.post(apipoints.allTaskData, {
          ncid: formData.ncid,
        });

        const {
          taskSheet_register,
          solidState_Parameters,
          co2_laser_parameters,
          taskSheet_details,
        } = response.data;

        setFormData((prevData) => ({
          ...prevData,

          anyDeffects: taskSheet_register.length
            ? taskSheet_register[0].Defects
            : "",

          fixtureRequirement: taskSheet_register.length
            ? taskSheet_register[0].Fixture_Requirement
            : "",

          lensDistance: taskSheet_register.length
            ? taskSheet_register[0].Lens_Distance
            : 0,

          mtrlThickness: taskSheet_register.length
            ? taskSheet_register[0].Material_Thickness
            : 0,

          withFiller: taskSheet_register.length
            ? taskSheet_register[0].With_Filler
            : "",

          fillerMaterial: taskSheet_register.length
            ? taskSheet_register[0].Filler
            : "",

          batchNo: taskSheet_register.length
            ? taskSheet_register[0].Batch_No
            : "",

          machinePeakPower: taskSheet_register.length
            ? taskSheet_register[0].Machine_Peak_Power
            : 0,

          laserEquipment: taskSheet_register.length
            ? taskSheet_register[0].Laser_Type
            : "",

          reweldPermitted: taskSheet_register.length
            ? taskSheet_register[0].Reweld_Permitted
            : "",

          fixtureNo: taskSheet_register.length
            ? taskSheet_register[0].Fixture_No
            : "",

          controlPlanNo: taskSheet_register.length
            ? taskSheet_register[0].Control_Plan_No
            : "",

          wpsNo: taskSheet_register.length ? taskSheet_register[0].WPS_No : "",

          pfdNo: taskSheet_register.length ? taskSheet_register[0].PFD_No : "",

          wiNo: taskSheet_register.length ? taskSheet_register[0].WI_No : "",

          pqrNo: taskSheet_register.length ? taskSheet_register[0].PQR_No : "",

          standardOfRef: taskSheet_register.length
            ? taskSheet_register[0].Standard_Parameter_Ref
            : "",

          partInspectionQC: taskSheet_register.length
            ? taskSheet_register[0].PartInspection_QC
            : 0,

          partInspectionWeldEngineer: taskSheet_register.length
            ? taskSheet_register[0].PartInspection_WeldEngineer
            : 0,

          partInspectionIncharge: taskSheet_register.length
            ? taskSheet_register[0].PartInspection_Incharge
            : 0,

          partInspectionProjectManager: taskSheet_register.length
            ? taskSheet_register[0].PartInspection_Project_Manager
            : 0,

          weldSettingQC: taskSheet_register.length
            ? taskSheet_register[0].WeldSetting_QC
            : 0,

          weldSettingWeldEngineer: taskSheet_register.length
            ? taskSheet_register[0].WeldSetting_WeldEngineer
            : 0,

          weldSettingIncharge: taskSheet_register.length
            ? taskSheet_register[0].WeldSetting_Incharge
            : 0,

          preFlowGas: taskSheet_register.length
            ? taskSheet_register[0].Pre_Flow_Gas
            : 0,

          postFlowGas: taskSheet_register.length
            ? taskSheet_register[0].Post_Flow_Gas
            : 0,

          designType: taskSheet_register.length
            ? taskSheet_register[0].Design_Type
            : "",

          weldSide: taskSheet_register.length
            ? taskSheet_register[0].Weld_Side
            : "",

          gasType: taskSheet_register.length
            ? taskSheet_register[0].Gas_Type
            : "",

          backing: taskSheet_register.length
            ? taskSheet_register[0].Backing
            : "",

          tackWeld: taskSheet_register.length
            ? taskSheet_register[0].Tack_Weld
            : "",

          note: taskSheet_register.length ? taskSheet_register[0].Note : "",

          subAssyTableData: taskSheet_details.length ? taskSheet_details : [],

          sspoweratfocus: solidState_Parameters.length
            ? solidState_Parameters[0].Power_at_focus
            : 0,
          ssfocusDia: solidState_Parameters.length
            ? solidState_Parameters[0].Focus_Dia
            : 0,
          sspulseDuration: solidState_Parameters.length
            ? solidState_Parameters[0].Pulse_Duration
            : 0,
          sspulseFrequency: solidState_Parameters.length
            ? solidState_Parameters[0].Pulse_Frequency
            : 0,
          sspulseShapeNo: solidState_Parameters.length
            ? solidState_Parameters[0].Pulse_Shape_No
            : 0,
          ssgasPressure: solidState_Parameters.length
            ? solidState_Parameters[0].Gas_Pressure
            : 0,
          ssfeedRate: solidState_Parameters.length
            ? solidState_Parameters[0].Feed_Rate
            : 0,
          ssrpm: solidState_Parameters.length
            ? solidState_Parameters[0].RPM
            : 0,
          ssgasPurity: solidState_Parameters.length
            ? solidState_Parameters[0].Gas_Purity
            : 0,
          ssgapRange: solidState_Parameters.length
            ? solidState_Parameters[0].Gap_Range
            : 0,
          ssgasFlowOrientation: solidState_Parameters.length
            ? solidState_Parameters[0].Gas_Flow_Orientation
            : 0,

          copowerTransmissionEfficiency: co2_laser_parameters.length
            ? co2_laser_parameters[0].Power_Transmission_Efficiency
            : 0,
          copower: co2_laser_parameters.length
            ? co2_laser_parameters[0].Power
            : 0,
          cofrequency: co2_laser_parameters.length
            ? co2_laser_parameters[0].Frequency
            : 0,
          cobeamDia: co2_laser_parameters.length
            ? co2_laser_parameters[0].Beam_Dia
            : 0,
          cofocus: co2_laser_parameters.length
            ? co2_laser_parameters[0].Focus
            : 0,
          cogasPressure: co2_laser_parameters.length
            ? co2_laser_parameters[0].Gas_Pressure
            : 0,
          cofeedRate: co2_laser_parameters.length
            ? co2_laser_parameters[0].Feed_Rate
            : 0,
          corpm: co2_laser_parameters.length ? co2_laser_parameters[0].RPM : 0,
          cogasPurity: co2_laser_parameters.length
            ? co2_laser_parameters[0].Gas_Purity
            : 0,
          cogapRange: co2_laser_parameters.length
            ? co2_laser_parameters[0].Gap_Range
            : 0,
          cogasFlowOrientation: co2_laser_parameters.length
            ? co2_laser_parameters[0].Gas_Flow_Orientation
            : 0,
        }));
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
    };
    fetchQtnData();
  }, []);

  const handleClose = () => {
    navigate("/Orders/Service/NCProgram", {
      state: { response: response, responsedata: MachineList },
    });
  };

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  console.log("data3", formData.partsTable);

  return (
    <>
      <div>
        <h4 className="title ">Task Sheet For-Laser Welding</h4>
      </div>

      <div className="row">
        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Schedule No/Task No</label>
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
              <label className="form-label">Assembly Name/No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="assemblyNo"
                value={formData.assemblyNo}
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
            <TaskSheetModal
              openPrintModal={openPrintModal}
              formData={formData}
              setOpenPrintModal={setOpenPrintModal}
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
            <button
              type="submit"
              className="button-style"
              variant="primary"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Any Defects</label>
            </div>
            <div className="col-8">
              {/* <input className="input-field" type="text" /> */}
              <select
                className="ip-select"
                name="anyDeffects"
                value={formData.anyDeffects}
                onChange={handleInputChange}
                style={{ marginTop: "8px" }}
              >
                <option value="" selected disabled hidden>
                  Select Defects
                </option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
                <option value={2}>NA</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Machine/Model No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="machineNo"
                value={formData.machineNo}
                // onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Program No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="programNo"
                value={formData.programNo}
                // onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Fixture Requirement</label>
            </div>
            <div className="col-8">
              {/* <input className="input-field" type="text" /> */}
              <select
                className="ip-select"
                name="fixtureRequirement"
                value={formData.fixtureRequirement}
                onChange={handleInputChange}
                style={{ marginTop: "8px" }}
              >
                <option value="" selected disabled hidden>
                  Select Fixture Requirement
                </option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
                <option value={2}>NA</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Lens Distance(mm)</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="number"
                onKeyDown={blockInvalidChar}
                name="lensDistance"
                value={formData.lensDistance}
                min={0}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Material Thickness</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="number"
                onKeyDown={blockInvalidChar}
                name="mtrlThickness"
                value={formData.mtrlThickness}
                min={0}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">With Filler</label>
            </div>
            <div className="col-8">
              {/* <input className="input-field" type="text" /> */}
              <select
                className="ip-select"
                name="withFiller"
                value={formData.withFiller}
                onChange={handleInputChange}
                style={{ marginTop: "8px" }}
              >
                <option value="" selected disabled hidden>
                  Select Filler
                </option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
                <option value={2}>NA</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Filler Material</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="fillerMaterial"
                value={formData.fillerMaterial}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Batch No/Charge No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Machine Peak Power</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="number"
                onKeyDown={blockInvalidChar}
                min={0}
                name="machinePeakPower"
                value={formData.machinePeakPower}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Type Of Laser Equipment</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="laserEquipment"
                value={formData.laserEquipment}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Reweld Permitted</label>
            </div>
            <div className="col-8">
              {/* <input className="input-field" type="text" /> */}
              <select
                className="ip-select"
                name="reweldPermitted"
                value={formData.reweldPermitted}
                onChange={handleInputChange}
                style={{ marginTop: "8px" }}
              >
                <option value="" selected disabled hidden>
                  Select Reweld Permitted
                </option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
                <option value={2}>NA</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Fixture No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="fixtureNo"
                value={formData.fixtureNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Control Plan No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="controlPlanNo"
                value={formData.controlPlanNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">WPS No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="wpsNo"
                value={formData.wpsNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">PFD No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="pfdNo"
                value={formData.pfdNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">WI No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="wiNo"
                value={formData.wiNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">PQR No</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="pqrNo"
                value={formData.pqrNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label">Standard Parameter Ref</label>
            </div>
            <div className="col-8">
              <input
                className="input-field"
                type="text"
                name="standardOfRef"
                value={formData.standardOfRef}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-1">
        <div className="col-md-6 col-sm-6">
          <div
            style={{
              border: "1px solid black",
              padding: "4px",
              borderRadius: "5px",
            }}
          >
            <label className="form-label">First Part Inspection</label>
            <div className="row">
              <div className="col-md-2 col-sm-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    name="partInspectionQC"
                    checked={formData.partInspectionQC === 1}
                    onChange={(e) =>
                      handleInputChangeCheckbox(e, "partInspectionQC")
                    }
                  />
                  <label
                    className="form-check-label checkBoxStyle"
                    htmlFor="flexCheckDefault"
                  >
                    QC
                  </label>
                </div>
              </div>

              <div className="col-md-3 col-sm-6">
                <div className="form-check ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    name="partInspectionWeldEngineer"
                    checked={formData.partInspectionWeldEngineer === 1}
                    onChange={(e) =>
                      handleInputChangeCheckbox(e, "partInspectionWeldEngineer")
                    }
                  />
                  <label
                    className="form-check-label checkBoxStyle"
                    htmlFor="flexCheckDefault"
                  >
                    Weld Engineer
                  </label>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="form-check ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    name="partInspectionIncharge"
                    checked={formData.partInspectionIncharge === 1}
                    onChange={(e) =>
                      handleInputChangeCheckbox(e, "partInspectionIncharge")
                    }
                  />
                  <label
                    className="form-check-label checkBoxStyle"
                    htmlFor="flexCheckDefault"
                  >
                    Incharge
                  </label>
                </div>
              </div>

              <div className="col-md-4 col-sm-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    name="partInspectionProjectManager"
                    checked={formData.partInspectionProjectManager === 1}
                    onChange={(e) =>
                      handleInputChangeCheckbox(
                        e,
                        "partInspectionProjectManager"
                      )
                    }
                  />
                  <label
                    className="form-check-label checkBoxStyle"
                    htmlFor="flexCheckDefault"
                  >
                    Project Manager
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-sm-6">
          <div
            style={{
              border: "1px solid black",
              padding: "4px",
              borderRadius: "5px",
            }}
          >
            <label className="form-label">Weld Settings Verified by</label>
            <div className="row">
              <div className="col-md-3 col-sm-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    name="weldSettingQC"
                    checked={formData.weldSettingQC === 1}
                    onChange={(e) =>
                      handleInputChangeCheckbox(e, "weldSettingQC")
                    }
                  />
                  <label
                    className="form-check-label checkBoxStyle"
                    htmlFor="flexCheckDefault"
                  >
                    {/* Shift incharge */}
                    QC
                  </label>
                </div>
              </div>

              <div className="col-md-3 col-sm-6">
                <div className="form-check ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    name="weldSettingWeldEngineer"
                    checked={formData.weldSettingWeldEngineer === 1}
                    onChange={(e) =>
                      handleInputChangeCheckbox(e, "weldSettingWeldEngineer")
                    }
                  />
                  <label
                    className="form-check-label checkBoxStyle"
                    htmlFor="flexCheckDefault"
                  >
                    Weld Engineer
                  </label>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="form-check ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    name="weldSettingIncharge"
                    checked={formData.weldSettingIncharge === 1}
                    onChange={(e) =>
                      handleInputChangeCheckbox(e, "weldSettingIncharge")
                    }
                  />
                  <label
                    className="form-check-label checkBoxStyle"
                    htmlFor="flexCheckDefault"
                  >
                    Incharge
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-1">
        <div className="col-md-8 mt-2">
          <div
            style={{
              height: "150px",
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
                  <th>Sub-assy Part Name/No</th>
                  <th>Qty Received</th>
                </tr>
              </thead>

              <tbody style={{ textAlign: "center" }}>
                {formData.partsTable && formData.partsTable.length > 0
                  ? formData.partsTable.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.PartId}</td>
                        {/* <td>{item.QtyPerAssy * formData.qty}</td>  */}
                        <td>{item.QtyRequired}</td>
                      </tr>
                    ))
                  : formData.subAssyTableData.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => handleRowSelect(item.ID)}
                        className={
                          formData.selectedRow1 === item.ID
                            ? "selectedRowClr"
                            : ""
                        }
                      >
                        <td>{index + 1}</td>
                        {/* <td>{item.Sub_Assy_Part_Name}</td> */}
                        <td>
                          <input
                            type="text"
                            className="input-style"
                            value={item.Sub_Assy_Part_Name}
                            name="Sub_Assy_Part_Name"
                            onChange={(e) => handlePartChange(e, index)}
                            onBlur={() =>
                              handleBlur(
                                index,
                                item.ID,
                                item.Sub_Assy_Part_Name,
                                item.Qty_Received
                              )
                            }
                          />
                        </td>
                        {/* <td>{item.Qty_Received}</td> */}
                        <td>
                          <input
                            type="number"
                            className="input-style"
                            value={item.Qty_Received}
                            name="Qty_Received"
                            min={0}
                            onChange={(e) => handlePartChange(e, index)}
                            onKeyDown={blockInvalidChar}
                            onBlur={() =>
                              handleBlur(
                                index,
                                item.ID,
                                item.Sub_Assy_Part_Name,
                                item.Qty_Received
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
          className="col-md-4"
          style={{ backgroundColor: "#f0f0f0", borderRadius: "10px" }}
        >
          <div>
            <label className="form-label">Sub-assy Part Name/No</label>
            <input
              type="text"
              className="input-field mt-1"
              name="subAssy"
              value={formData.subAssy}
              onChange={handleInputChange}
              style={{ margin: "0px", borderRadius: "5px" }}
              disabled={formData.partsTable.length > 0}
            />
          </div>

          <div classNam>
            <label className="form-label">Qty Received</label>
            <input
              type="number"
              className="input-field mt-1"
              name="qtyReceived"
              value={formData.qtyReceived}
              min={0}
              onKeyDown={blockInvalidChar}
              onChange={handleInputChange}
              style={{ margin: "0px", borderRadius: "5px" }}
              disabled={formData.partsTable.length > 0}
            />
          </div>

          <div className="d-flex justify-content-center mt-1">
            <div className="mx-2">
              <button
                // className="button-style"
                className={
                  formData.partsTable.length > 0
                    ? "button-disabled"
                    : "button-style"
                }
                variant="primary"
                onClick={handleAddSubAssy}
                disabled={formData.partsTable.length > 0}
              >
                Add
              </button>
            </div>

            <div className="mx-2">
              <button
                // className="button-style"
                className={
                  formData.partsTable.length > 0
                    ? "button-disabled"
                    : "button-style"
                }
                variant="primary"
                onClick={() => handleDeleteSubAssy(formData.selectedRow1)}
                disabled={formData.partsTable.length > 0}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <h3 className="form-title  mt-3" style={{ marginLeft: "325px" }}>
        <b>Welding Parameters</b>
      </h3>

      <div className="row col-md-12">
        <div className="col-md-4 border bg-light" style={{ height: "415px" }}>
          <SolidStateLaserTable formData={formData} setFormData={setFormData} />
        </div>

        <div className="col-md-4 border bg-light" style={{ height: "415px" }}>
          <CoTable formData={formData} setFormData={setFormData} />
        </div>

        <div className="col-md-4">
          <div className="col-md-12 col-sm-6">
            <label className="form-label">Pre flow Gas in lpm</label>
            <input
              type="text"
              className="input-field"
              name="preFlowGas"
              value={formData.preFlowGas}
              onChange={handleInputChange}
              min={0}
              style={{ margin: "0px" }}
            />
          </div>

          <div className="col-md-12 col-sm-6">
            <label className="form-label">Post flow Gas in lpm</label>
            <input
              type="text"
              className="input-field"
              name="postFlowGas"
              value={formData.postFlowGas}
              onChange={handleInputChange}
              min={0}
              style={{ margin: "0px" }}
            />
          </div>

          <div className="col-md-12 col-sm-6">
            <label className="form-label">Design Type</label>
            <select
              className="ip-select"
              name="designType"
              value={formData.designType}
              onChange={handleInputChange}
              style={{ marginTop: "1px" }}
            >
              <option value="" selected disabled hidden>
                Select Design Type
              </option>

              {formData.designTypeData?.map((joint, index) => (
                <option key={index} value={joint.Joint_Type}>
                  {joint.Joint_Type}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12 col-sm-6">
            <label className="form-label">Weld Side</label>
            <select
              className="ip-select"
              name="weldSide"
              value={formData.weldSide}
              onChange={handleInputChange}
              style={{ marginTop: "1px" }}
            >
              <option value="" selected disabled hidden>
                Select Welding Side
              </option>
              {/* <option value="Single">Single</option>
              <option value="Double">Double</option> */}
              {formData.weldSideData?.map((weld, index) => (
                <option key={index} value={weld.Weld_Side}>
                  {weld.Weld_Side}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12 col-sm-6">
            <label className="form-label">Gas Type</label>
            <input
              type="text"
              className="input-field"
              name="gasType"
              value={formData.gasType}
              onChange={handleInputChange}
              style={{ margin: "0px" }}
            />
          </div>

          <div className="col-md-12 col-sm-6">
            <label className="form-label">Backing</label>
            <select
              className="ip-select"
              name="backing"
              value={formData.backing}
              onChange={handleInputChange}
              style={{ marginTop: "1px" }}
            >
              <option value="" selected disabled hidden>
                Select Backing
              </option>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
              <option value={2}>NA</option>
            </select>
          </div>

          <div className="col-md-12 col-sm-6">
            <label className="form-label">Tack Weld</label>
            <select
              className="ip-select"
              name="tackWeld"
              value={formData.tackWeld}
              onChange={handleInputChange}
              style={{ marginTop: "1px" }}
            >
              <option value="" selected disabled hidden>
                Select Tack Weld
              </option>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
              <option value={2}>NA</option>
            </select>
          </div>

          <div className="col-md-12 col-sm-6">
            <label className="form-label">Note</label>
            <input
              type="text"
              className="input-field"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              style={{ margin: "0px" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
