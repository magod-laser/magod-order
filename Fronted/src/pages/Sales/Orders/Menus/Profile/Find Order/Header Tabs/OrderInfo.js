import React from "react";
import { Form } from "react-bootstrap";

function OrderInfo() {
  return (
    <div>
      <div className="row mt-2">
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Order Type</label>
          <input type="text" />
          <label className="form-label">Order Status</label>
          <input type="text" />
          <label className="form-label">Payment Terms</label>
          <input type="text" />
          <label className="form-label">PO No</label>
          <input type="text"/>
          <label className="form-label">Contact Name</label>
          <input type="text" />
          <label className="form-label">Quotation No</label>
          <input type="text" />
        </div>
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Delivery Date</label>
          <input type="date" className="mt-1" />
          <label className="form-label">Magod Delivery</label>
          <input
            type="checkbox"
            className="checkBoxStyle mt-3"
            style={{ width: "20px" }}
          />  
          <label className="form-label">Delivery</label>
          <textarea
                    id="exampleFormControlTextarea1"
                    rows="3"
                    style={{ width: "360px" }}
                  ></textarea>
          
          <label className="form-label">Delivery Mode</label>
          <select id="" className="ip-select mt-2">
            <option value="option1"></option>
            <option value="option1">option 1</option>
            <option value="option2">option 2</option>
            <option value="option3">option 3</option>
          </select> 
          <label className="form-label">Transport Charges</label>
          <select id="" className="ip-select mt-1">
            <option value="option1"></option>
            <option value="option1">option 1</option>
            <option value="option2">option 2</option>
            <option value="option3">option 3</option>
          </select>     
        </div>
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Sales Contact</label>
          <input type="text" />
          <label className="form-label">Received By</label>
          <input type="text" />
          <label className="form-label">Recorded By</label>
          <input type="text" />
          <label className="form-label">Dealing Engineer</label>
          <select id="" className="ip-select mt-2">
            <option value="option1"></option>
            <option value="option1">option 1</option>
            <option value="option2">option 2</option>
            <option value="option3">option 3</option>
          </select>
          <label className="form-label">Order Value</label>
          <input type="text" />
        </div>
      </div>
    </div>
  );
}

export default OrderInfo;
