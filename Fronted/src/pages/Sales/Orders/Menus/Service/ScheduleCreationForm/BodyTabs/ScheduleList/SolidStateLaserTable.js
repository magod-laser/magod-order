import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";

export default function SolidStateLaserTable({ formData, setFormData }) {
  const [rows, setRows] = useState([
    { desc: "Power at focus Watts/Volts", details: "" },
    { desc: "Focus dia in mm", details: "" },
    { desc: "Pulse duration in ms", details: "" },
    { desc: "Pulse frequency in Hz", details: "" },
    { desc: "Pulse shape No", details: "" },
    { desc: "Gas pressure in lpm(Avg)", details: "" },
    { desc: "Feed rate in mm/min", details: "" },
    { desc: "RPM", details: "" },
    { desc: "Gas purity in %", details: "" },
    { desc: "Gap range in mm", details: "" },
    { desc: "Gas flow Orientation in deg", details: "" },
  ]);

  const formDataKeysMapping = {
    "Power at focus Watts/Volts": "sspoweratfocus",
    "Focus dia in mm": "ssfocusDia",
    "Pulse duration in ms": "sspulseDuration",
    "Pulse frequency in Hz": "sspulseFrequency",
    "Pulse shape No": "sspulseShapeNo",
    "Gas pressure in lpm(Avg)": "ssgasPressure",
    "Feed rate in mm/min": "ssfeedRate",
    RPM: "ssrpm",
    "Gas purity in %": "ssgasPurity",
    "Gap range in mm": "ssgapRange",
    "Gas flow Orientation in deg": "ssgasFlowOrientation",
  };

  const handleInputChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].details = value;
    setRows(updatedRows);

    // Get the corresponding key from the mapping
    const formDataKey = formDataKeysMapping[updatedRows[index].desc];

    // Update formData in the parent component if formDataKey exists
    if (formDataKey) {
      const updatedFormData = { ...formData };
      updatedFormData[formDataKey] = value;
      setFormData(updatedFormData);
    }
  };

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  // console.log("formData", formData);

  return (
    <div className="mt-3">
      <h5 className="form-title">
        <b>Solid State Laser - Parameters(PW)</b>
      </h5>
      <Table striped size="sm">
        <thead>
          <tr>
            <th>Description</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <td>{row.desc}</td>
              </td>
              <td>
                <input
                  className="mb-1"
                  type="number"
                  min={0}
                  onKeyDown={blockInvalidChar}
                  style={{ borderRadius: "4px", border: "none" }}
                  // value={row.details}
                  value={formData[formDataKeysMapping[row.desc]]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
