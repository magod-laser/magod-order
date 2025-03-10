import React, { useState } from "react";
import { Link } from "react-router-dom";
import AlertModal from "../../../Components/Alert";
function ServiceNewOrderSerial() {
  const [alertModal, setAlertModal] = useState(false);
  const openModal = (e) => {
    e.preventDefault();
    setAlertModal(true);
  };

  const closeModal = () => {
    setAlertModal(false);
  };

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
          <input type="text" />
        </div>
        <div className="col-md-4 sm-12 mt-1">
          <label className="form-label">Material</label>
          <select className="ip-select">
            <option></option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        <div className="col-md-4 sm-12 mt-1">
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
        <div className="col-md-4 sm-12 mt-1">
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
          <input type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Job Work Rate</label>
          <input type="text" />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-4 sm-12 ">
          <label className="form-label">Material Rate</label>
          <input type="text" />
        </div>
        <div className="col-md-4 sm-12">
          <label className="form-label">Unit Price</label>
          <input type="text" />
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
          <button className="button-style" onClick={openModal}>
            Save
          </button>

          <Link to="/Orders/Service/ScheduleCreationForm">
            <button className="button-style">Close</button>
          </Link>
        </div>
      </div>

      <AlertModal
        show={alertModal}
        onHide={(e) => setAlertModal(e)}
        firstbutton={closeModal}
        title="magod_Order"
        message="Positive Number Required"
        firstbuttontext="Ok"
      />
    </div>
  );
}

export default ServiceNewOrderSerial;
