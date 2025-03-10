// import React, { useState } from "react";
// import { Tab, Tabs } from "react-bootstrap";
// import ServiceOrderInfo from "./HeaderTabs/ServiceOrderInfo";
// import ServiceProductionScheduleCreation from "./HeaderTabs/ServiceProductionScheduleCreation";
// import ServiceFindOldPart from "./HeaderTabs/ServiceFindOldPart";
// import ServiceMaterialInfo from "./HeaderTabs/ServiceMaterialInfo";
// import ServiceScheduleList from "./BodyTabs/ScheduleList/ServiceScheduleList";
// import ServiceProfamaInvoiceList from "./BodyTabs/ProfamaInvoiceList/ServiceProfamaInvoiceList";
// import ServiceMaterialPlanner from "./BodyTabs/MaterialPlanner/ServiceMaterialPlanner";
// import ServiceOrderDetails from "./BodyTabs/ServiceOrderDetails";
// import AlertModal from "../Components/Alert";
// import { Link } from "react-router-dom";

// function ServiceScheduleCreationForm() {
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
//           <h5 className="mt-3">Order No: Service</h5>
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
//             <Link to="/Orders/Service/FindOrder">
//               <button className="button-style ">Close</button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4">
//         <Tabs>
//           <Tab eventKey="orderInfo" title="Order Info">
//             <ServiceOrderInfo />
//           </Tab>
//           <Tab
//             eventKey="productionScheduleCreation"
//             title="Production Schedule Creation"
//           >
//             <ServiceProductionScheduleCreation />
//           </Tab>
//           <Tab eventKey="findOldPart" title="Find Old Part">
//             <ServiceFindOldPart />
//           </Tab>
//           <Tab eventKey="materialInfo" title="Material Info">
//             <ServiceMaterialInfo />
//           </Tab>
//         </Tabs>
//       </div>
//       <div className="mt-5">
//         <div className="mt-4">
//           <Tabs>
//             <Tab eventKey="orderdetails" title="Order Details">
//               <ServiceOrderDetails />
//             </Tab>
//             <Tab eventKey="scheduleList" title="Schedule List">
//               <ServiceScheduleList />
//             </Tab>
//             <Tab eventKey="profarmaInvoiceList" title="Profarma Invoice List">
//               <ServiceProfamaInvoiceList />
//             </Tab>
//             <Tab eventKey="materialPlanner" title="Material Planner">
//               <ServiceMaterialPlanner />
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

// export default ServiceScheduleCreationForm;

import React, { useState } from "react";
import ScheduleCreationForm from "../../../Components/ScheduleCreationForm/ScheduleCreationForm";
import { Link, useLocation, useNavigate } from "react-router-dom";


function ServiceScheduleCreationForm(props) {
  const location = useLocation(); // Access location object using useLocation hook
  const OrersData = location?.state || []; // Get DwgNameList from location state

  console.log("OrersData",OrersData);

  const [ServiceType, setServiceType] = useState("Service");
  return (
    <div>
      <ScheduleCreationForm Type={ServiceType}
      OrersData={OrersData}
       />
    </div>
  );
}

export default ServiceScheduleCreationForm;
