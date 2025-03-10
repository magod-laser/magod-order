import React, { useState } from "react";
import FindOrderHeaderTabs from "./Header Tabs/FindOrderHeaderTabs";
import FindOrderBodyTabs from "./Body Tabs/FindOrderBodyTabs";
import { Link } from "react-router-dom";
import AlertModal from "../Components/Alert";

export default function ScheduleCreationForm() {
  const [alertModal, setAlertModal] = useState(false);
  const [registerOrder, setRegisterOrder] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setAlertModal(true);
  };

  const closeModal = () => {
    setAlertModal(false);
  };

  const openRegisterOrder = (e) => {
    e.preventDefault();
    setRegisterOrder(true);
  };

  const closeRegisterOrder = () => {
    setRegisterOrder(false);
  };
  return (
    <div>
      <div className="col-md-12">
        <h4 className="title">Schedule List Creation Form</h4>
      </div>
      <h5 className="mt-3">
        <b>Order No: Profile</b>
      </h5>
      <div className="row">
        <div className="col-md-6 "></div>
        <div className="col-md-6">
          <button className="button-style" onClick={openRegisterOrder}>
            Register Order
          </button>
          <button className="button-style" onClick={openModal}>
            Save
          </button>
          <Link to={"/Orders/Profile/FindOrder"}>
            <button className="button-style ">Close</button>
          </Link>
        </div>
      </div>

      <FindOrderHeaderTabs />
      <div className="mt-5">
        <FindOrderBodyTabs />
      </div>

      <AlertModal
        show={alertModal}
        onHide={(e) => setAlertModal(e)}
        firstbutton={closeModal}
        title="magod_Order"
        message="Record Saved"
        firstbuttontext="Ok"
      />

      <AlertModal
        show={registerOrder}
        onHide={(e) => setRegisterOrder(e)}
        firstbutton={closeRegisterOrder}
        secondbutton={closeRegisterOrder}
        title="magod_Order"
        message="No Changes or Quantity or Rate will be permitted once you register. Proceed?"
        firstbuttontext="Yes"
        secondbuttontext="No"
      />
    </div>
  );
}
