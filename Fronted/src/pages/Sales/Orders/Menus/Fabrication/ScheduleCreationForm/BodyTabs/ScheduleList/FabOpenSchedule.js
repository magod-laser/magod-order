import React, { useState } from "react";
import { Tabs, Tab, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import AlertModal from "../../../Components/Alert";

function FabOpenSchedule() {
  let [schedule, setSchedule] = useState(false);
  let [profileOrder1, setProfileOrder1] = useState(false);
  let [profileOrder2, setProfileOrder2] = useState(false);
  let [fixtureOrder1, setFixtureOrder1] = useState(false);
  let [fixtureOrder2, setFixtureOrder2] = useState(false);

  const openSchedule = (e) => {
    e.preventDefault();
    setSchedule(true);
  };

  const closeSchedule = () => {
    setSchedule(false);
  };

  let profileOrderOpen1 = (e) => {
    e.preventDefault();
    setProfileOrder1(true);
  };

  let profileOrderClose1 = () => {
    setProfileOrder1(false);
  };

  let profileOrderOpen2 = () => {
    setProfileOrder1(false);
    setProfileOrder2(true);
  };

  let profileOrderClose2 = () => {
    setProfileOrder2(false);
  };

  let fixtureOrderOpen1 = () => {
    setFixtureOrder1(true);
  };

  let fixtureOrderClose1 = () => {
    setFixtureOrder1(false);
  };

  let fixtureOrderOpen2 = () => {
    setFixtureOrder1(false);
    setFixtureOrder2(true);
  };

  let fixtureOrderClose2 = () => {
    setFixtureOrder2(false);
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <h4 className="title">Order Schedule Details</h4>
        </div>
      </div>
      <div className="row">
        <h4>Service</h4>
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Customer</label>
          <input type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Sales Contact</label>
          <input type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Schedule No</label>
          <input type="text" />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Schedule Type</label>
          <input type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Schedule Status</label>
          <input type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">PO</label>
          <input type="text" />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Program Engineer</label>
          <input type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Target Date</label>
          <input type="date" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Delivery Date</label>
          <input type="date" />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-4 sm-12">
          <label className="form-label">Special Instruction</label>
          <textarea
            id="exampleFormControlTextarea1"
            rows="3"
            style={{ width: "360px" }}
          ></textarea>
        </div>
        <div className="col-md-8 sm-12 mt-5">
          <button className="button-style">Suspend</button>
          <button className="button-style">ShortClose</button>
          <button className="button-style">Cancel</button>
          <Link to="/Orders/Fabrication/ScheduleCreationForm">
            <button className="button-style">Close</button>
          </Link>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-2 col-sm-3">
          <button className="button-style" onClick={openSchedule}>
            Schedule
          </button>
        </div>
        <div className="col-md-2 col-sm-3">
          <button className="button-style">Task</button>
        </div>
        <div className="col-md-2 col-sm-3">
          <button className="button-style">Save</button>
        </div>
        <div className="col-md-2 col-sm-3">
          <button className="button-style">Check Status</button>
        </div>
        <div className="col-md-2 col-sm-3">
          <button className="button-style ">Print Schedule</button>
        </div>
        <div className="col-md-2 col-sm-3">
          <Link to="/Orders/Fabrication/NCProgram">
            <button className="button-style ">NC Program</button>
          </Link>
        </div>
        <div className="col-md-2 col-sm-3">
          <button className="button-style" onClick={profileOrderOpen1}>
            Profile Order
          </button>
        </div>
        <div className="col-md-2 col-sm-3">
          <button className="button-style" onClick={fixtureOrderOpen1}>
            Fixture Order
          </button>
        </div>
        <div className="col-md-2 col-sm-3">
          <button className="button-style ">Service Order</button>
        </div>
      </div>

      <div className="row">
        <Tabs className=" tab_font mt-4">
          <Tab eventKey="Schedule Details" title="Schedule Details">
            <div className="mt-3" style={{ overflowY: "scroll" }}>
              <Table
                striped
                className="table-data border"
                style={{ border: "1px", height: "350px" }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>Srl</th>
                    <th style={{ whiteSpace: "nowrap" }}>DwgName</th>
                    <th style={{ whiteSpace: "nowrap" }}>Material</th>
                    <th style={{ whiteSpace: "nowrap" }}>Source</th>
                    <th style={{ whiteSpace: "nowrap" }}>Process</th>
                    <th style={{ whiteSpace: "nowrap" }}>To Schedule</th>
                    <th style={{ whiteSpace: "nowrap" }}>Programme</th>
                    <th style={{ whiteSpace: "nowrap" }}>Produced</th>
                    <th style={{ whiteSpace: "nowrap" }}>Cleared</th>
                    <th style={{ whiteSpace: "nowrap" }}>Packed</th>
                    <th style={{ whiteSpace: "nowrap" }}>Delvered</th>
                    <th style={{ whiteSpace: "nowrap" }}>JWCost</th>
                    <th style={{ whiteSpace: "nowrap" }}>MtrlCost</th>
                  </tr>
                </thead>

                <tbody className="tablebody"></tbody>
              </Table>
            </div>
          </Tab>
          <Tab eventKey="Task and Material List" title="Task and Material List">
            <div className="row mt-3">
              <div style={{ display: "flex", gap: "170px" }}>
                <h5 className="mt-3">Task List</h5>
                <button className="button-style mb-2">Performance</button>
              </div>
              <div className="col-md-6">
                <div style={{ overflowY: "scroll" }}>
                  <Table
                    striped
                    className="table-data border mt-2"
                    style={{
                      border: "1px",
                      height: "300px",
                      overflowY: "scroll",
                    }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th style={{ whiteSpace: "nowrap" }}>Task No</th>
                        <th style={{ whiteSpace: "nowrap" }}>Material</th>
                        <th style={{ whiteSpace: "nowrap" }}>Sourse</th>
                        <th style={{ whiteSpace: "nowrap" }}>Operation</th>
                        <th style={{ whiteSpace: "nowrap" }}>Dwgs</th>
                        <th style={{ whiteSpace: "nowrap" }}>Total Parts</th>
                        <th style={{ whiteSpace: "nowrap" }}>Priority</th>
                        <th style={{ whiteSpace: "nowrap" }}>Status</th>
                        <th style={{ whiteSpace: "nowrap" }}>Machine</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody"></tbody>
                  </Table>
                </div>
              </div>
              <div className="col-md-6">
                <div style={{ overflowY: "scroll" }}>
                  <Table
                    striped
                    className="table-data border mt-2"
                    style={{
                      border: "1px",
                      height: "300px",
                      overflowY: "scroll",
                    }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th style={{ whiteSpace: "nowrap" }}>Dwg Part Name</th>
                        <th>Quantity</th>
                        <th>Nested</th>
                        <th>Produced</th>
                        <th>Cleared</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody"></tbody>
                  </Table>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div
                className="col-md-6"
                style={{
                  overflowY: "scroll",
                }}
              >
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "300px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>Length(mm)</th>
                      <th style={{ whiteSpace: "nowrap" }}>Width(mm)</th>
                      <th style={{ whiteSpace: "nowrap" }}>Quantity</th>
                      <th style={{ whiteSpace: "nowrap" }}>ID</th>
                      <th style={{ whiteSpace: "nowrap" }}>Nc TaskId</th>
                      <th style={{ whiteSpace: "nowrap" }}>TaskNo</th>
                      <th style={{ whiteSpace: "nowrap" }}>Length</th>
                      <th style={{ whiteSpace: "nowrap" }}>Width</th>
                      <th style={{ whiteSpace: "nowrap" }}>Quantity</th>
                      <th style={{ whiteSpace: "nowrap" }}>LimitToQty</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody"></tbody>
                </Table>
              </div>
              <div
                className="col-md-2"
                style={{ width: "260px", marginLeft: "30px" }}
              >
                <div className="ip-box form-bg">
                  <h5>
                    <b>Task Material</b>
                  </h5>

                  <label className="form-label">Task No</label>

                  <input
                    style={{ width: "200px" }}
                    type="number"
                    className="in-fields"
                  />

                  <label className="form-label">Length</label>

                  <input style={{ width: "200px" }} className="in-fields" />

                  <label className="form-label">Width</label>

                  <input style={{ width: "200px" }} className="in-fields" />

                  <label className="form-label">Quantity</label>

                  <input style={{ width: "200px" }} className="in-fields" />

                  <div className="row justify-content-center mt-3 mb-3">
                    <button className="button-style" style={{ width: "120px" }}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tab>

          <Tab eventKey="Material Planner" title="Material Planner">
            <div className="row mt-3">
              <div className="col-md-2 col-sm-12">
                <button className="button-style ">Create DXF WS</button>
              </div>

              <div className="col-md-2 col-sm-12">
                <button className="button-style ">Create Parts WS</button>
              </div>

              <div className="col-md-2 col-sm-12">
                <button className="button-style ">Read WS</button>
              </div>

              <div className="col-md-2 col-sm-12">
                <button className="button-style ">Print Estimate</button>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-md-7 col-sm-12">
                <div
                  className=""
                  style={{ overflowX: "scroll", overflowY: "scroll" }}
                >
                  <Table
                    striped
                    className="table-data border"
                    style={{ border: "1px", height: "200px" }}
                  >
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th style={{ whiteSpace: "nowrap" }}>Task No</th>
                        <th>Material</th>
                        <th>Source</th>
                        <th>Operation</th>
                        <th>Dwgs</th>
                        <th style={{ whiteSpace: "nowrap" }}>Total Parts</th>
                        <th style={{ whiteSpace: "nowrap" }}>Nc Task Id</th>
                        <th style={{ whiteSpace: "nowrap" }}>Task No</th>
                        <th style={{ whiteSpace: "nowrap" }}>Schedule ID</th>
                      </tr>
                    </thead>

                    <tbody className="tablebody"></tbody>
                  </Table>
                </div>

                <div className="row mt-2">
                  <div
                    className="col-md-8 col-sm-12"
                    style={{ overflowX: "scroll", overflowY: "scroll" }}
                  >
                    <Table
                      striped
                      className="table-data border"
                      style={{ border: "1px", height: "190px" }}
                    >
                      <thead className="tableHeaderBGColor">
                        <tr>
                          <th>Length(mm)</th>
                          <th>Width(mm)</th>
                          <th>Quantity</th>
                          <th>Id</th>
                          <th style={{ whiteSpace: "nowrap" }}>Nc Task Id</th>
                          <th style={{ whiteSpace: "nowrap" }}>Task No</th>
                          <th>Length</th>
                          <th>Width</th>
                          <th>Quantity</th>
                          <th style={{ whiteSpace: "nowrap" }}>Limit To Qty</th>
                        </tr>
                      </thead>

                      <tbody className="tablebody"></tbody>
                    </Table>
                  </div>

                  <div className="col-md-4 col-sm-12">
                    <Form style={{ width: "214px" }}>
                      <div className="ip-box form-bg">
                        <h4>
                          <b>Task No</b>
                        </h4>

                        <div className="row">
                          <div className="col-md-5 col-sm-12">
                            <label className=" form-label mt-2">Length</label>

                            <label className="form-label mt-3">Width</label>

                            <label
                              className=" form-label mt-3"
                              // style={{ marginLeft: "-12px" }}
                            >
                              Quantity
                            </label>
                          </div>

                          <div className="col-md-7 col-sm-12">
                            <input className="mt-2 in-fields" type="text" />
                            <input className="mt-3 in-fields" type="text" />
                            <input
                              className="mt-3 mb-5 in-fields"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>

              <div
                className="col-md-5 col-sm-12"
                style={{ overflowX: "scroll" }}
              >
                <Table
                  striped
                  className="table-data border"
                  style={{ border: "1px" }}
                >
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th>Dwg Part Name</th>

                      <th>Quantity</th>

                      <th>Nested</th>

                      <th>Produced</th>

                      <th>Cleared</th>
                    </tr>
                  </thead>

                  <tbody className="tablebody"></tbody>
                </Table>
              </div>
            </div>
          </Tab>

          <Tab eventKey="Packing Notes/Invoices" title="Packing Notes/Invoices">
            <button className="button-style mt-3">Show Invoice</button>
            <div className="row mt-2">
              <div className="col-md-5 mt-2" style={{ overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>PN No</th>
                      <th style={{ whiteSpace: "nowrap" }}>PN Date</th>
                      <th style={{ whiteSpace: "nowrap" }}>Inv No</th>
                      <th style={{ whiteSpace: "nowrap" }}>Inv Date</th>
                      <th style={{ whiteSpace: "nowrap" }}>Grand Total</th>
                      <th style={{ whiteSpace: "nowrap" }}>Received</th>
                      <th style={{ whiteSpace: "nowrap" }}>Total_Wt</th>
                      <th style={{ whiteSpace: "nowrap" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody"></tbody>
                </Table>
              </div>

              <div className="col-md-7 mt-2" style={{ overflowY: "scroll" }}>
                <Table
                  striped
                  className="table-data border mt-2"
                  style={{
                    border: "1px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                >
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>Drawing Name</th>
                      <th style={{ whiteSpace: "nowrap" }}>Material</th>
                      <th style={{ whiteSpace: "nowrap" }}>Quantity</th>
                      <th style={{ whiteSpace: "nowrap" }}>Mtrl Value</th>
                      <th style={{ whiteSpace: "nowrap" }}>JW Value</th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        Draft_dc_inv_Details
                      </th>
                      <th style={{ whiteSpace: "nowrap" }}>DC_Inv_No</th>
                      <th style={{ whiteSpace: "nowrap" }}>DC_Inv_Srl</th>
                      <th style={{ whiteSpace: "nowrap" }}>ScheduleID</th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        OrderSchDetailsID
                      </th>
                      <th style={{ whiteSpace: "nowrap" }}>Cust_Code</th>
                      <th style={{ whiteSpace: "nowrap" }}>Dwg_Code</th>
                      <th style={{ whiteSpace: "nowrap" }}>Dwg_No</th>
                      <th style={{ whiteSpace: "nowrap" }}>Mtrl</th>
                      <th style={{ whiteSpace: "nowrap" }}>Material</th>
                      <th style={{ whiteSpace: "nowrap" }}>Qty</th>
                      <th style={{ whiteSpace: "nowrap" }}>QtyReturned</th>
                      <th style={{ whiteSpace: "nowrap" }}>UOM</th>
                      <th style={{ whiteSpace: "nowrap" }}>Unit_Wt</th>
                      <th style={{ whiteSpace: "nowrap" }}>DC_Srl_Wt</th>
                      <th style={{ whiteSpace: "nowrap" }}>WtReturned</th>
                      <th style={{ whiteSpace: "nowrap" }}>Unit Rate</th>
                      <th style={{ whiteSpace: "nowrap" }}>DC_Srl_Amt</th>
                      <th style={{ whiteSpace: "nowrap" }}>Excise_CL_no</th>
                      <th style={{ whiteSpace: "nowrap" }}>SrlType</th>
                      <th style={{ whiteSpace: "nowrap" }}>Mtrl_rate</th>
                      <th style={{ whiteSpace: "nowrap" }}>JW_Rate</th>
                      <th style={{ whiteSpace: "nowrap" }}>PackingLevel</th>
                      <th style={{ whiteSpace: "nowrap" }}>InspLevel</th>
                      <th style={{ whiteSpace: "nowrap" }}>Mprocess</th>
                      <th style={{ whiteSpace: "nowrap" }}>Operation</th>
                      <th style={{ whiteSpace: "nowrap" }}>TotalWeight</th>
                      <th style={{ whiteSpace: "nowrap" }}>Desp Status</th>
                      <th style={{ whiteSpace: "nowrap" }}>Total Amount</th>
                      <th style={{ whiteSpace: "nowrap" }}>Selected</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody"></tbody>
                </Table>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <AlertModal
        show={profileOrder1}
        onHide={(e) => setProfileOrder1(e)}
        firstbutton={profileOrderOpen2}
        secondbutton={profileOrderClose1}
        title="magod_Order"
        message="Do you wish to create or use internal order for this schedule."
        firstbuttontext="Yes"
        secondbuttontext="No"
      />

      <AlertModal
        show={profileOrder2}
        onHide={(e) => setProfileOrder2(e)}
        firstbutton={profileOrderClose2}
        title="magod_Order"
        message="Order Created"
        firstbuttontext="Ok"
      />

      <AlertModal
        show={fixtureOrder1}
        onHide={(e) => setFixtureOrder1(e)}
        firstbutton={fixtureOrderOpen2}
        secondbutton={fixtureOrderClose1}
        title="magod_Order"
        message="Do you wish to create or use internal order for this schedule"
        firstbuttontext="Yes"
        secondbuttontext="No"
      />

      <AlertModal
        show={fixtureOrder2}
        onHide={(e) => setFixtureOrder2(e)}
        firstbutton={fixtureOrderClose2}
        title="magod_Order"
        message="Order Created"
        firstbuttontext="Ok"
      />

      <AlertModal
        show={schedule}
        onHide={(e) => setSchedule(e)}
        firstbutton={closeSchedule}
        title="magod_Order"
        message="Scheduled"
        firstbuttontext="Ok"
      />
    </div>
  );
}

export default FabOpenSchedule;
