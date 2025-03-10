import React from "react";
import { useState } from "react";
import AlertModal from "../../Components/Alert";

export default function ProductionScheduleCreationTab() {
  let [alertModal1, setAlertModal1] = useState(false);

  let openModal1 = (e) => {
    e.preventDefault();
    setAlertModal1(true);
  };
  let closeModal1 = () => {
    setAlertModal1(false);
  };
  return (
    <div className="">
      <div className="row mt-3">
        <div className="col-md-2 col-sm-12">
          <button className="button-style  ">Suspended Order</button>
          <button className="button-style mt-3 ">Cancel Order</button>
          <button className="button-style mt-3 ">Short Close</button>
        </div>
        <div className="col-md-4 col-sm-12">
          <h5 className="mt-2">
            <b>Schedule Type</b>
          </h5>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-2 mt-2 col-sm-12">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefaultA"
                    id="flexRadioDefaultA1"
                  />
                </div>
                <div className="col-md-2 col-sm-12">
                  <label className="form-label">Sales</label>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-2 mt-2 col-sm-12">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefaultA"
                    id="flexRadioDefaultA2"
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
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-2 mt-2 col-sm-12">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefaultB"
                    id="flexRadioDefaultB1"
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
                    name="flexRadioDefaultB"
                    id="flexRadioDefaultB2"
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
          <button className="button-style mt-3 " onClick={openModal1}>Create Schedule</button>
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
        show={alertModal1}
        onHide={(e) => setAlertModal1(e)}
        firstbutton={closeModal1}
        title="magod_Order"
        message="Draft Schedule Created."
        firstbuttontext="Ok"
        
      />
    </div>
  );
}
