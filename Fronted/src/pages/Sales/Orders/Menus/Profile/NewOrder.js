import React from "react";
import { Form } from "react-bootstrap";

export default function NewOrder() {
  return (
    <div>
      <div className="col-md-12">
        <div className="row">
          <h4 className="title">Sales Department</h4>
        </div>
      </div>
      <h5 className="mt-2">
        <b>Sales Manager</b>
      </h5>
      <h8 className="mt-2">
        <b>New Order Entry Form: Profile</b>
      </h8>

      <hr
        style={{
          backgroundColor: "black",
          height: "3px",
        }}
      />
      <h5 className="mt-4">
        <b>New Order</b>
      </h5>
      <button className="button-style  group-button">Save Order</button>
      <br></br>
      
      <Form className="form mt-2">
        <div className="ip-box ">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Order No</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    
                    type="text"
                    style={{ borderRadius: "0" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">PO No</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    
                    type="text"
                    style={{ borderRadius: "0" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Order Date</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    
                    type="text"
                    style={{ borderRadius: "0" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Quotation No</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    
                    type="text"
                    style={{ borderRadius: "0" }}
                  />
                </div>
              </div>
            </div>
          </div>

         

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Order Type</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mt-1  mb-2 col-sm-12">
                  <label className="form-label">Delivery Date</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    className="in-fields mt-2"
                    name="UnistallDate"
                    type="date"
                  />{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Payment Terms</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Sales Contact</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Customer Name</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Received By</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Contact Name</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    
                    type="text"
                    style={{ borderRadius: "0" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Recorded By</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">GST No</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    
                    type="text"
                    style={{ borderRadius: "0" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Dealing Engineer</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Billing Address</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <textarea
                    style={{
                      borderRadius: "0",
                      height: "180px",
                      width: "354px",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Special Instructions</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <textarea
                    style={{
                      borderRadius: "0",
                      height: "180px",
                      width: "354px",
                    }}
                  />{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Billing State</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">GST Tax State</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Shipping Address</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <textarea
                    style={{
                      borderRadius: "0",
                      height: "180px",
                      width: "354px",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Delivery Mode</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Transport Charges</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <Form.Select id="gstpan" className="ip-select">
                    <option value="Select">option 1</option>

                    <option value="GST">option 2</option>

                    <option value="PAN">option 3</option>
                  </Form.Select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Magod Delivery</label>
                </div>
                <div className="col-md-8  mt-2 col-sm-12">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="defaultCheck1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
