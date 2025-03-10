import React from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function OrderDetailsFormTab() {
  return (
    <div>
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <Form className="mt-2">
            <div className="ip-box form-bg">
              <div className="row mt-3">
                <div className="col-md-6 col-sm-12">
                  <h5>
                    <b>Order Details</b>
                  </h5>
                  <div className="row">
                    <div>
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Srl No
                      </label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mt-4 col-sm-12">
                  <Link to={"/Orders/Profile/FindOrder/NewOrderSerial"}>
                    <button
                      className="button-style "
                      style={{ width: "135px", marginTop: "50px" }}
                    >
                      Add New Serial
                    </button>
                  </Link>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Drawing Name
                      </label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Job Work Rate
                      </label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label className="form-label">Material</label>
                      <select id="" className="ip-select dropdown-field ">
                        <option value="option1">option 1</option>
                        <option value="option2">option 2</option>
                        <option value="option3">option 3</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Material Rate
                      </label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Material Source
                      </label>
                      <select id="" className="ip-select dropdown-field ">
                        <option value="option1">option 1</option>
                        <option value="option2">option 2</option>
                        <option value="option3">option 3</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Unit Price
                      </label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label className="form-label">Operation</label>
                      <select id="" className="ip-select dropdown-field ">
                        <option value="option1">option 1</option>
                        <option value="option2">option 2</option>
                        <option value="option3">option 3</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Inspection Level
                      </label>
                      <select id="" className="ip-select dropdown-field ">
                        <option value="option1">option 1</option>
                        <option value="option2">option 2</option>
                        <option value="option3">option 3</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label className="form-label">Quantity</label>
                      <input className="in-fields" type="text" />
                      <div className="row">
                        <div className="col-md-8  col-sm-12 mt-1">
                          <label
                            className="form-label"
                            style={{
                              whiteSpace: "nowrap",
                              marginLeft: "-10px",
                            }}
                          >
                            Has BOM
                          </label>
                        </div>
                        <div className="col-md-4 col-sm-12 mt-3 mb-4">
                          <input type="checkbox" className="checkBoxStyle" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Packing Level
                      </label>
                      <select id="" className="ip-select dropdown-field ">
                        <option value="option1">option 1</option>
                        <option value="option2">option 2</option>
                        <option value="option3">option 3</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>

        <div className="col-md-4 col-sm-12">
          <Form className="mt-2">
            <div
              className="ip-box form-bg"
              style={{ height: "587px", width: "190px" }}
            >
              <h5 className="mt-3">
                <b>Process details</b>
              </h5>
              <div className="row">
                <div>
                  <label className="form-label">Ordered</label>
                  <input className="in-fields" type="text" />
                </div>
              </div>
              <div className="row">
                <div>
                  <label className="form-label">Scheduled</label>
                  <input className="in-fields" type="text" />
                </div>
              </div>
              <div className="row">
                <div>
                  <label className="form-label">Produced</label>
                  <input className="in-fields" type="text" />
                </div>
              </div>
              <div className="row">
                <div>
                  <label className="form-label">Packed</label>
                  <input className="in-fields" type="text" />
                </div>
              </div>
              <div className="row">
                <div>
                  <label className="form-label">Delivered</label>
                  <input className="in-fields" type="text" />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <Form className="mt-4" style={{ marginLeft: "10px", width: "575px" }}>
        <div className="ip-box form-bg">
          <h5 className="mt-3">
            <b>Load Drawing</b>
          </h5>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="row">
                <div className="col-md-6 com-sm-12">
                  <select
                    id=""
                    className="ip-select dropdown-field "
                    style={{ width: "230px" }}
                  >
                    <option value="option1">option 1</option>
                    <option value="option2">option 2</option>
                    <option value="option3">option 3</option>
                  </select>
                </div>
                <div className="col-md-6 com-sm-12">
                  <input className="in-fields" type="text" />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mt-3 com-sm-12">
                  <button className="button-style " style={{ width: "230px" }}>
                    Add Drawing to Order
                  </button>
                </div>
                <div className="col-md-6 mt-3 com-sm-12">
                  <button className="button-style " style={{ width: "230px" }}>
                    Save to Customer Drawings
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 com-sm-12">
                  <div className="row">
                    <div>
                      <label className="form-label">LOC</label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <label className="form-label">Process</label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <label className="form-label">Part Weight</label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 com-sm-12">
                  <div className="row">
                    <div>
                      <label className="form-label">Process</label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <label className="form-label">Job Work Cost</label>
                      <input className="in-fields" type="text" />
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <label className="form-label">Material Cost</label>
                      <input className="in-fields mb-4" type="text" />
                    </div>
                  </div>
                  {/* <div className="row">
                        <div className="col-md-2  col-sm-12 mt-1">
                          <label
                            className="form-label"
                            style={{ whiteSpace: "nowrap"}}
                          >
                            Has BOM
                          </label>
                        </div>
                        <div
                          className="col-md-8 col-sm-12 mt-3 mb-4"
                        >
                          <input  type="checkbox" className="checkBoxStyle" />
                        </div>
                      </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
