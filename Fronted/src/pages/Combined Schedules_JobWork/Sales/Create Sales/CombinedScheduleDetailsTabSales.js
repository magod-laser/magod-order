import React from "react";
import { Form, Table } from "react-bootstrap";

export default function CombinedScheduleDetailsTab({
  beforecombine,
  preapreScheduleData,
  salesContactList,
}) {
  return (
    <div>
      <Form className="form mt-2">
        <div className="ip-box">
          <div className="row">
            <div className="col-md-4 mb-2 col-sm-12">
              <label className="form-label">No</label>
              <input
                class=""
                type="text"
                style={{ borderRadius: "0" }}
                value={beforecombine[0]?.OrdSchNo}
              />
            </div>
            <div className="col-md-4  mb-2 col-sm-12">
              <label className="form-label">Customer</label>
              <input class="" type="text" style={{ borderRadius: "0" }} />
            </div>
            <div className="col-md-4  mb-2 col-sm-12">
              <label className="form-label"> Sales Contact</label>
              <input
                class=""
                type="text"
                style={{ borderRadius: "0" }}
                value={beforecombine[0]?.SalesContact}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-2 col-sm-12">
              <label className="form-label">Type</label>
              <input
                class=""
                type="text"
                style={{ borderRadius: "0" }}
                value={beforecombine[0]?.ScheduleType}
              />
            </div>
            <div className="col-md-4  mb-2 col-sm-12">
              <label className="form-label">PO No</label>
              <input
                class=""
                type="text"
                style={{ borderRadius: "0" }}
                value={beforecombine[0]?.PO}
              />
            </div>
            <div className="col-md-4  mb-2 col-sm-12">
              <label className="form-label"> Target Date</label>
              <input
                class=""
                type="text"
                style={{ borderRadius: "0" }}
                value={beforecombine[0]?.schTgtDate}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-2 col-sm-12">
              <label className="form-label">Status</label>
              <input
                class=""
                type="text"
                style={{ borderRadius: "0" }}
                value={beforecombine[0]?.Schedule_Status}
              />
            </div>

            <div className="col-md-4  mb-2 col-sm-12">
              <label className="form-label">Instruction</label>
              <input
                class=""
                type="text"
                style={{ borderRadius: "0" }}
                value={beforecombine[0]?.Special_Instructions || null}
              />
            </div>
            <div className="col-md-4  mb-2 col-sm-12">
              <label className="form-label"> Delivery Date</label>
              <input
                className="mt-1"
                type="text"
                value={beforecombine[0]?.Delivery_Date}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-2 col-sm-12">
              <label className="form-label"> Dealing Engineer</label>
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
      <div className="mt-3" style={{ height: "350px", overflowY: "scroll" }}>
        <Table striped className="table-data border" style={{ border: "1px" }}>
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
  );
}
