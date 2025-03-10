// import React, { useState } from "react";
// import { Tab, Tabs } from "react-bootstrap";
// import FabOrderInfo from "./HeaderTabs/FabOrderInfo";
// import FabProductionScheduleCreation from "./HeaderTabs/FabProductionScheduleCreation";
// import FabFindOldPart from "./HeaderTabs/FabFindOldPart";
// import FabMaterialInfo from "./HeaderTabs/FabMaterialInfo";
// import FabScheduleList from "./BodyTabs/ScheduleList/FabScheduleList";
// import FabProfamaInvoiceList from "./BodyTabs/ProfamaInvoiceList/FabProfamaInvoiceList";
// import FabMaterialPlanner from "./BodyTabs/MaterialPlanner/FabMaterialPlanner";
// import AlertModal from "../Components/Alert";
// import FabOrderDetails from "./BodyTabs/FabOrderDetails";
// import { Link } from "react-router-dom";

// function FabScheduleCreationForm() {
//   const [alertModal, setAlertModal] = useState(false);
//   const [registerOrder, setRegisterOrder] = useState(false);

//   const openModal = (e) => {
//     e.preventDefault();
//     setAlertModal(true);
//   };

//   const closeModal = () => {
//     setAlertModal(false);
//   };

//   const openRegisterOrder = (e) => {
//     e.preventDefault();
//     setRegisterOrder(true);
//   };

//   const closeRegisterOrder = () => {
//     setRegisterOrder(false);
//   };

//   return (
//     <div>
//       <div className="col-md-12">
//         <h4 className="title">ScheduleList Creation Form</h4>
//       </div>
//       <div className="col-md-12">
//         <div className="row">
//           <h5 className="mt-3">Order No: Fabrication</h5>
//         </div>
//         <div className="row">
//           <div className="col-md-6"></div>
//           <div className="col-md-6">
//             <button className="button-style " onClick={openRegisterOrder}>
//               Register Order
//             </button>
//             <button className="button-style " onClick={openModal}>
//               Save
//             </button>
//             <Link to="/Orders/Fabrication/FindOrder">
//               <button className="button-style">Close</button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4">
//         <Tabs>
//           <Tab eventKey="orderInfo" title="Order Info">
//             <FabOrderInfo />
//           </Tab>
//           <Tab
//             eventKey="productionScheduleCreation"
//             title="Production Schedule Creation"
//           >
//             <FabProductionScheduleCreation />
//           </Tab>
//           <Tab eventKey="findOldPart" title="Find Old Part">
//             <FabFindOldPart />
//           </Tab>
//           <Tab eventKey="materialInfo" title="Material Info">
//             <FabMaterialInfo />
//           </Tab>
//         </Tabs>
//       </div>
//       <div className="mt-5">
//         <div className="mt-4">
//           <Tabs>
//             <Tab eventKey="orderdetails" title="Order Details">
//               <FabOrderDetails />
//             </Tab>
//             <Tab eventKey="scheduleList" title="Schedule List">
//               <FabScheduleList />
//             </Tab>
//             <Tab eventKey="profamaInvoiceList" title="Profarma Invoice List">
//               <FabProfamaInvoiceList />
//             </Tab>
//             <Tab eventKey="materialPlanner" title="Material Planner">
//               <FabMaterialPlanner />
//             </Tab>
//           </Tabs>
//         </div>
//       </div>

//       <AlertModal
//         show={alertModal}
//         onHide={(e) => setAlertModal(e)}
//         firstbutton={closeModal}
//         title="magod_Order"
//         message="Record Saved"
//         firstbuttontext="Ok"
//       />

//       <AlertModal
//         show={registerOrder}
//         onHide={(e) => setRegisterOrder(e)}
//         firstbutton={closeRegisterOrder}
//         secondbutton={closeRegisterOrder}
//         title="magod_Order"
//         message="You can change only Quantity once you Register a Scheduled Order, Continue?"
//         firstbuttontext="Yes"
//         secondbuttontext="No"
//       />
//     </div>
//   );
// }

// export default FabScheduleCreationForm;

import React, { useState } from "react";
import ScheduleCreationForm from "../../../Components/ScheduleCreationForm/ScheduleCreationForm";
function FabScheduleCreationForm() {
  const [FabType, setFabType] = useState("Fabrication");
  return (
    <div>
      <ScheduleCreationForm Type={FabType} />
    </div>
  );
}

export default FabScheduleCreationForm;
