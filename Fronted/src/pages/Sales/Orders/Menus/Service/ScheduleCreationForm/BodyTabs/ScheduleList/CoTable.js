import React, { useState } from "react";
import { Table } from "react-bootstrap";

export default function CoTable({ formData, setFormData }) {
  const [rows, setRows] = useState([
    { desc: "Power transmission efficiency in Watts", details: "" },
    { desc: "Power in Watts", details: "" },
    { desc: "Frequency in Hz", details: "" },
    { desc: "Beam dia in mm", details: "" },
    { desc: "Focus in mm", details: "" },
    { desc: "Gas Pressure in lpm(Avg)", details: "" },
    { desc: "Feed rate in mm/min", details: "" },
    { desc: "RPM", details: "" },
    { desc: "Gas purity in %", details: "" },
    { desc: "Gap range in mm", details: "" },
    { desc: "Gas flow Orientation in deg", details: "" },
  ]);

  const formDataKeysMapping = {
    "Power transmission efficiency in Watts": "copowerTransmissionEfficiency",
    "Power in Watts": "copower",
    "Frequency in Hz": "cofrequency",
    "Beam dia in mm": "cobeamDia",
    "Focus in mm": "cofocus",
    "Gas Pressure in lpm(Avg)": "cogasPressure",
    "Feed rate in mm/min": "cofeedRate",
    RPM: "corpm",
    "Gas purity in %": "cogasPurity",
    "Gap range in mm": "cogapRange",
    "Gas flow Orientation in deg": "cogasFlowOrientation",
  };

  const handleInputChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].details = value;
    setRows(updatedRows);

    const formDataKey = formDataKeysMapping[updatedRows[index].desc];

    if (formDataKey) {
      const updatedFormData = { ...formData };
      updatedFormData[formDataKey] = value;
      setFormData(updatedFormData);
    }
  };

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  return (
    <div className="mt-3">
      <h5 className="form-title">
        <b>CO2 Laser - Parameters</b>
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
              <td>{row.desc}</td>
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
