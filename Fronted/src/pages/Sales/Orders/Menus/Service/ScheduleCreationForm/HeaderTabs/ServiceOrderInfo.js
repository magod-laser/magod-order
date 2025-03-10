import React from "react";
import { Form } from "react-bootstrap";

function ServiceOrderInfo() {
  return (
    <div>
      <div className="row">
        <div className="col-md-4 sm-12">
          <div className="row mt-2">
            <label className="form-label">Order Type</label>
            <input type="text" />
          </div>

          <div className="row mt-2">
            <label className="form-label">Order Status</label>
            <input type="text" />
          </div>

          <div className="row mt-2">
            <label className="form-label">Payment Terms</label>
            <input type="text" />
          </div>

          <div className="row mt-2">
            <label className="form-label">PO No</label>
            <input type="text" />
          </div>

          <div className="row mt-2">
            <label className="form-label">Contact Name</label>
            <input type="text" />
          </div>

          <div className="row mt-2">
            <label className="form-label">Order Value</label>
            <input type="text" />
          </div>
        </div>

        <div className="col-md-4 sm-12">
          <div className="row mt-2">
            <label className="form-label">Delivery Date</label>
            <input type="text" />
          </div>

          <div className="row mt-2">
            <label className="form-label mt-2">Magod Delivery</label>
            <input
              type="checkbox"
              className="checkBoxStyle mt-3"
              style={{ width: "40px" }}
            />
          </div>
          <div className="row mt-2">
            <label className="form-label">Delivery</label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </div>

          <div className="row mt-2">
            <label className="form-label">Delivery Mode</label>
            <select id="" className="ip-select mt-1">
              <option value="option1"></option>
              <option value="option1">option 1</option>
              <option value="option2">option 2</option>
              <option value="option3">option 3</option>
            </select>
          </div>

          <div className="row mt-2">
            <label className="form-label">Transport Charges</label>
            <select id="" className="ip-select mt-1">
              <option value="option1"></option>
              <option value="option1">option 1</option>
              <option value="option2">option 2</option>
              <option value="option3">option 3</option>
            </select>
          </div>
        </div>

        <div className="col-md-4 sm-12">
          <div className="row mt-2">
            <label className="form-label">Quotation No</label>
            <input type="text" />
          </div>
          <div className="row mt-2">
            <label className="form-label">Sales Contact</label>
            <input type="text" />
          </div>

          <div className="row mt-2">
            <label className="form-label">Received By</label>
            <input type="text" />
          </div>

          <div className="row mt-2">
            <label className="form-label">Recorded By</label>
            <input type="text" />
          </div>

          <div className="row mt-2">
            <label className="form-label">Dealing Engineer</label>
            <select className="ip-select mt-1">
              <option value="option1"></option>
              <option value="option1">option 1</option>
              <option value="option2">option 2</option>
              <option value="option3">option 3</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceOrderInfo;
