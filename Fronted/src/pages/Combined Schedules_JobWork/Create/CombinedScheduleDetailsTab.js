import React from "react";
import { Form, Table } from "react-bootstrap";

export default function CombinedScheduleDetailsTab({
  beforecombine,
  preapreScheduleData,
  salesContactList,
  custName,
  type,
}) {
  //date format
  const formatDate = (dateString) => {
    if (!dateString) return "";
  
    try {
      // Parse the date string
      const date = new Date(dateString);
      if (isNaN(date)) throw new Error("");
  
      // Extract the day, month, and year
      const day = date.getUTCDate().toString().padStart(2, "0");
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = date.getUTCFullYear();
  
      // Format the date to dd/mm/yyyy
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    } catch (error) {
      // console.error("Error formatting date:", error);
      return " ";
    }
  };

  console.log('beforecombine Jobwork', beforecombine);
  

  return (
    <>
      {type === "Sales" ? (
        <div>
          <Form className="form mt-2">
            <div className="ip-box">
              <div className="row">
                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "92px" }}
                >
                  <label className="form-label">No</label>
                  <input
                    class="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.OrdSchNo}
                  />
                </div>

                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "18px" }}
                >
                  <label className="form-label">Customer</label>
                  <input
                    className="in-field"
                    type="text"
                    value="MAGOD LASER MACHINING PVT LTD"
                    style={{ borderRadius: "0" }}
                  />
                </div>

                <div className="d-flex field-gap col-md-4 col-sm-12">
                  <label className="form-label label-space">
                    {" "}
                    Sales Contact
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.SalesContact}
                  />
                </div>
              </div>
              <div className="row">
                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "82px" }}
                >
                  <label className="form-label">Type</label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.ScheduleType}
                  />
                </div>
                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "35px" }}
                >
                  <label className="form-label label-space">PO No</label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.PO}
                  />
                </div>
                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "21px" }}
                >
                  <label className="form-label label-space">Target Date</label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={formatDate(beforecombine[0]?.schTgtDate)}
                  />
                </div>
              </div>
            </div>
          </Form>
          <div
            className="mt-1"
            style={{ height: "250px", overflowY: "scroll" }}
          >
            <Table
              striped
              className="table-data border"
              style={{ border: "1px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th>Dwg Name</th>
                  <th>Mtrl_Code</th>
                  <th>MProcess</th>
                  <th>Operation</th>
                  <th>Mtrl_Source</th>
                  <th>Insp Level</th>
                  <th>Quantity Scheduled</th>
                </tr>
              </thead>
              <tbody className="tablebody">
                {preapreScheduleData.map((item, key) => {
                  return (
                    <>
                      <tr>
                        <td>{item.DwgName}</td>
                        <td>{item.Mtrl_Code}</td>
                        <td>{item.MProcess}</td>
                        <td>{item.Operation}</td>
                        <td>{item.Mtrl_Source}</td>
                        <td>{item.InspLevel}</td>
                        <td>{item.QtyScheduled}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (
        <div>
          <Form className="form mt-2">
            <div className="ip-box">
              <div className="row">
                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "92px" }}
                >
                  <label className="form-label">No</label>
                  <input
                    class="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.OrdSchNo}
                  />
                </div>

                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "18px" }}
                >
                  <label className="form-label">Customer</label>
                  <input
                    className="in-field"
                    type="text"
                    value={custName}
                    style={{ borderRadius: "0" }}
                  />
                </div>

                <div className="d-flex field-gap col-md-4 col-sm-12">
                  <label className="form-label label-space">
                    {" "}
                    Sales Contact
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.SalesContact}
                  />
                </div>
              </div>
              <div className="row">
                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "82px" }}
                >
                  <label className="form-label">Type</label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.ScheduleType}
                  />
                </div>
                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "35px" }}
                >
                  <label className="form-label label-space">PO No</label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.PO}
                  />
                </div>
                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "21px" }}
                >
                  <label className="form-label label-space">Target Date</label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={formatDate(beforecombine[0]?.schTgtDate)}
                  />
                </div>
              </div>
              <div className="row">
                <div
                  className="d-flex field-gap col-md-4 col-sm-12"
                  style={{ gap: "73px" }}
                >
                  <label className="form-label">Status</label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.Schedule_Status}
                  />
                </div>

                <div className="d-flex field-gap col-md-4 col-sm-12">
                  <label className="form-label">Instruction</label>
                  <input
                    className="in-field"
                    type="text"
                    style={{ borderRadius: "0" }}
                    value={beforecombine[0]?.Special_Instructions || null}
                  />
                </div>
                <div className="d-flex field-gap col-md-4 col-sm-12">
                  <label className="form-label label-space">
                    {" "}
                    Delivery Date
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    value={formatDate(beforecombine[0]?.Delivery_Date)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="d-flex field-gap col-md-4 col-sm-12">
                  <label className="form-label label-space">
                    {" "}
                    Dealing Engineer
                  </label>
                  <select
                    id="gstpan"
                    className="ip-select"
                    value={beforecombine[0]?.Dealing_Engineer}
                  >
                    {salesContactList.map((item, key) => (
                      <option key={key} value={item.Name}>
                        {item.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Form>
          <div
            className="mt-1"
            style={{ height: "250px", overflowY: "scroll" }}
          >
            <Table
              striped
              className="table-data border"
              style={{ border: "1px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th>Dwg Name</th>
                  <th>Mtrl_Code</th>
                  <th>MProcess</th>
                  <th>Operation</th>
                  <th>Mtrl_Source</th>
                  <th>Insp Level</th>
                  <th>Quantity Scheduled</th>
                </tr>
              </thead>
              <tbody className="tablebody">
                {preapreScheduleData.map((item, key) => {
                  return (
                    <>
                      <tr>
                        <td>{item.DwgName}</td>
                        <td>{item.Mtrl_Code}</td>
                        <td>{item.MProcess}</td>
                        <td>{item.Operation}</td>
                        <td>{item.Mtrl_Source}</td>
                        <td>{item.InspLevel}</td>
                        <td>{item.QtyScheduled}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
