import React, { useState } from "react";
import AlertModal from "../../Components/Alert";

function ServiceProductionScheduleCreation() {
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
      <div className="row mt-3">
        <div className="col-md-2 col-sm-12">
          <button className="button-style" disabled>
            Suspended Order
          </button>
          <button className="button-style mt-3">Cancel Order</button>
          <button className="button-style mt-3" disabled>
            Short Close
          </button>
        </div>
        <div className="col-md-4 col-sm-12">
          <h5 className="mt-2">
            <b>Schedule Type</b>
          </h5>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="row">
                <div className="col-md-2 mt-2 col-sm-12">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="scheduleType"
                    id="scheduleType1"
                    // checked
                  />
                </div>
                <div className="col-md-2 col-sm-12">
                  <label className="form-label">Sales</label>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="row">
                <div className="col-md-2 mt-2 col-sm-12">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="scheduleType"
                    id="scheduleType2"
                    // checked
                  />
                </div>
                <div className="col-md-2 col-sm-12">
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Job Work
                  </label>
                </div>
              </div>
            </div>
          </div>

          <h5 className="mt-2">
            <b>Schedule Option</b>
          </h5>

          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="row">
                <div className="col-md-2 mt-2 col-sm-12">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="scheduleOption"
                    id="scheduleOption1"
                    // checked
                  />
                </div>
                <div className="col-md-2 col-sm-12">
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Full Order
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-2 mt-2 col-sm-12">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="scheduleOption"
                    id="scheduleOption2"
                    // checked
                  />
                </div>
                <div className="col-md-2 col-sm-12">
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Partial Order
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-sm-12">
          <button className="button-style ">Refresh Status</button>
          <button className="button-style mt-3 ">Clear Filter</button>
          <button className="button-style mt-3 " onClick={openModal}>
            Create Schedule
          </button>
        </div>
      </div>

      <div className="col-md-12 row">
        <div className="col-md-1"></div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-4 mt-3 col-sm-12">
              <button className="button-style">Open Folder</button>
            </div>
            <div className="col-md-4 mt-3 col-sm-12">
              <button className="button-style">Check DXF</button>
            </div>
            <div className="col-md-4 mt-3 col-sm-12">
              <button className="button-style">Copy DXF</button>
            </div>
          </div>
        </div>
        <div className="col-md-5"></div>
      </div>

      <AlertModal
        show={alertModal}
        onHide={(e) => setAlertModal(e)}
        firstbutton={closeModal}
        title="magod_Order"
        message="Draft Schedule Created"
        firstbuttontext="Ok"
      />
    </div>
  );
}

export default ServiceProductionScheduleCreation;
