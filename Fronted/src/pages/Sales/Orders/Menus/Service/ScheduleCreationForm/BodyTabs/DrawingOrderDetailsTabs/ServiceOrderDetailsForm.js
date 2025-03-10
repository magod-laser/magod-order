import React from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

function ServiceOrderDetailsForm() {
  return (
    <div>
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <Form>
            <div className="ip-box form-bg mt-3">
              <div className="row mt-2">
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
                      <input type="text" className="in-fields" />
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-6 col-sm-12"
                  style={{ marginTop: "65px" }}
                >
                  <Link to="/Orders/Service/NewOrderSerial">
                    <button
                      className="button-style "
                      style={{ width: "135px" }}
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
                      <select id="" className="ip-select dropdown-field">
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
                      <input type="text" className="in-fields" />
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
                      <select id="" className="ip-select dropdown-field">
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
                      <input type="text" className="in-fields" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div>
                      <label className="form-label">Operation</label>
                      <select id="" className="ip-select dropdown-field">
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
                      <select id="" className="ip-select dropdown-field">
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
                      <input type="text" className="in-fields" />
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
                      <select id="" className="ip-select dropdown-field">
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
          <Form>
            <div
              className="ip-box form-bg mt-3"
              style={{ height: "470px", width: "190px" }}
            >
              <h5 className="mt-2">
                <b>Process details</b>
              </h5>
              <div className="row">
                <div>
                  <label className="form-label">Ordered</label>
                  <input type="text" className="in-fields " />
                </div>
              </div>
              <div className="row">
                <div>
                  <label className="form-label">Scheduled</label>
                  <input type="text" className="in-fields" />
                </div>
              </div>
              <div className="row">
                <div>
                  <label className="form-label">Produced</label>
                  <input type="text" className="in-fields" />
                </div>
              </div>
              <div className="row">
                <div>
                  <label className="form-label">Packed</label>
                  <input type="text" className="in-fields" />
                </div>
              </div>
              <div className="row">
                <div>
                  <label className="form-label">Delivered</label>
                  <input type="text" className="in-fields" />
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
                    className="ip-select dropdown-field"
                    style={{ width: "230px" }}
                  >
                    <option value="option1">option 1</option>
                    <option value="option2">option 2</option>
                    <option value="option3">option 3</option>
                  </select>
                </div>
                <div className="col-md-6 com-sm-12">
                  <input type="text" className="in-fields" />
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
                  <div className="row mt-2">
                    <div>
                      <label className="form-label">LOC</label>
                      <input type="text" className="in-fields" />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div>
                      <label className="form-label">Process</label>
                      <input type="text" className="in-fields " />
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <label className="form-label">Part Weight</label>
                      <input type="text" className="in-fields" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 com-sm-12">
                  <div className="row">
                    <div>
                      <label className="form-label mt-2">Process</label>
                      <input type="text" className="in-fields" />
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <label className="form-label mt-2">Job Work Cost</label>
                      <input type="text" className="in-fields" />
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <label className="form-label ">Material Cost</label>
                      <input type="text" className="in-fields" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2  col-sm-12 mt-1">
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Has BOM
                      </label>
                    </div>
                    <div className="col-md-10 col-sm-12 mt-3 mb-4">
                      <input type="checkbox" className="checkBoxStyle" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default ServiceOrderDetailsForm;
