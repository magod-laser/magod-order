import React from "react";
import { Link } from "react-router-dom";

function NewOrderSerial() {
  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <h4 className="title">New Order Serial</h4>
        </div>
      </div>

      <div className="row mt-2">
        <h5>Order No</h5>
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Drawing/ Part Name</label>
          <input className="mt-2" type="text" />
        </div>
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Material</label>
          <select className="ip-select">
            <option></option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Material Source</label>
          <select className="ip-select">
            <option></option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-4 sm-12">
          <label className="form-label">Operation</label>
          <select className="ip-select">
            <option></option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Quantity</label>
          <input className="mt-2" type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Job Work Rate</label>
          <input className="mt-2"  type="text" />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Material Rate</label>
          <input className="mt-2"  type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Unit Price</label>
          <input className="mt-2"  type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Inspection Level</label>
          <select className="ip-select">
            <option></option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Packing Level</label>
          <select className="ip-select">
            <option></option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        <div className="col-md-4 sm-12 mt-3">
          <button className="button-style">Save</button>
          <Link to={"/Orders/Profile/FindOrder/ScheduleCreationForm"}><button className="button-style">Close</button></Link>
        </div>
      </div>
    </div>
  );
}

export default NewOrderSerial;
