// import React, { useState } from "react";
// import { Form } from "react-bootstrap";
// import AlertModal from "../Components/Alert";
// import { Link } from "react-router-dom";
// import { Typeahead } from "react-bootstrap-typeahead";

// let dummydata = [
//   {
//     label: "Alabama",
//     population: 4780127,
//     capital: "Montgomery",
//     region: "South",
//   },

//   { label: "Alaska", population: 710249, capital: "Juneau", region: "West" },

//   {
//     label: "Arizona",
//     population: 6392307,
//     capital: "Phoenix",
//     region: "West",
//   },

//   {
//     label: "Arkansas",
//     population: 2915958,
//     capital: "Little Rock",
//     region: "South",
//   },
// ];

// function FabNewOrder() {
//   let [selected, setSelected] = useState("");
//   const [alertModal, setAlertModal] = useState(false);

//   const openModal = (e) => {
//     e.preventDefault();
//     setAlertModal(true);
//   };

//   const toScheduleCreationForm = () => {
//     window.location.href = "/Orders/Fabrication/ScheduleCreationForm";
//   };

//   return (
//     <div>
//       <div className="col-md-12">
//         <h4 className="title">New Order Entry Form : Fabrication</h4>
//       </div>

//       <h5 className="mt-3">New Order</h5>

//       <Form className="form mt-2">
//         <div className="ip-box ">
//           <div className="row">
//             <div className="col-md-6 sm-12">
//               <div className="row">
//                 <div className="col-md-4 sm-12 ">
//                   <label className="form-label">Orderno</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <input type="text" />
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Order Date</label>
//                 </div>
//                 <div className="col-md-8 sm-12  mt-2">
//                   <input type="date" />
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Order Type</label>
//                 </div>
//                 <div className="col-md-8 sm-12  mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">Complete</option>
//                     <option value="option2">Scheduled</option>
//                     <option value="option3">Open</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Payment Terms</label>
//                 </div>
//                 <div className="col-md-8 sm-12  mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">Cash on Delivery</option>
//                     <option value="option1">Check on Delivery</option>
//                     <option value="option3">7 Days Credit</option>
//                     <option value="option3">15 Days Credit</option>
//                     <option value="option3">30 Days Credit</option>
//                     <option value="option3">45 Days Credit</option>
//                     <option value="option3">60 Days Credit</option>
//                     <option value="option2">90 Days Credit</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Customer Name</label>
//                 </div>
//                 <div className="col-md-8 sm-12  mt-2">
//                   {/* <select id="" className="ip-select">
//                     <option value="option1">option 1</option>
//                     <option value="option2">option 2</option>
//                     <option value="option3">option 3</option>
//                   </select> */}
//                   <Typeahead
//                     id="basic-example"
//                     onChange={setSelected}
//                     options={dummydata}
//                     placeholder="Select Customer"
//                     selected={selected}
//                   />
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Contact Name</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <input type="text" />
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">GST No</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <input type="text" />
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Billing Address</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <textarea
//                     id="exampleFormControlTextarea1"
//                     rows="3"
//                     style={{ width: "360px" }}
//                   ></textarea>
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Billing State</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">option 1</option>
//                     <option value="option2">option 2</option>
//                     <option value="option3">option 3</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Magod Delivery</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2" style={{ width: "50px" }}>
//                   <input type="checkbox" className="checkBoxStyle" />
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Shipping Address</label>
//                 </div>
//                 <div className="col-md-8 sm-12">
//                   <textarea
//                     id="exampleFormControlTextarea1"
//                     rows="3"
//                     style={{ width: "360px" }}
//                   ></textarea>
//                 </div>
//               </div>
//             </div>

//             <div className="col-md-6 sm-12 ">
//               <div className="row">
//                 <div className="col-md-4 sm-12 ">
//                   <label className="form-label">PO No</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <input type="text" />
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12 ">
//                   <label className="form-label">Quotation No</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <input type="text" />
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Delivery date</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <input type="date" />
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Sales Contact</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">option 1</option>
//                     <option value="option2">option 2</option>
//                     <option value="option3">option 3</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Received By</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">option 1</option>
//                     <option value="option2">option 2</option>
//                     <option value="option3">option 3</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Recorded By</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">option 1</option>
//                     <option value="option2">option 2</option>
//                     <option value="option3">option 3</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Dealing Engineer</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">option 1</option>
//                     <option value="option2">option 2</option>
//                     <option value="option3">option 3</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Special Instruction</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <textarea
//                     id="exampleFormControlTextarea1"
//                     rows="3"
//                     style={{ width: "360px" }}
//                   ></textarea>
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">GST Tax State</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">option 1</option>
//                     <option value="option2">option 2</option>
//                     <option value="option3">option 3</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Delivery Mode</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">option 1</option>
//                     <option value="option2">option 2</option>
//                     <option value="option3">option 3</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="row mt-3">
//                 <div className="col-md-4 sm-12">
//                   <label className="form-label">Transport Charges</label>
//                 </div>
//                 <div className="col-md-8 sm-12 mt-2">
//                   <select id="" className="ip-select">
//                     <option value="option1">option 1</option>
//                     <option value="option2">option 2</option>
//                     <option value="option3">option 3</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="row justify-content-center mt-3 mb-2">
//             <div className="col-md-2 sm-12">
//               <button
//                 className="button-style "
//                 style={{ width: "150px" }}
//                 onClick={openModal}
//               >
//                 Save Order
//               </button>
//             </div>

//             <div className="col-md-1 sm-12">
//               <Link to="/Orders">
//                 <button
//                   className="button-style mb-2"
//                   style={{ width: "150px" }}
//                 >
//                   Close
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </Form>

//       <AlertModal
//         show={alertModal}
//         onHide={(e) => setAlertModal(e)}
//         firstbutton={toScheduleCreationForm}
//         title="magod_Order"
//         message="Order Created"
//         firstbuttontext="Ok"
//       />
//     </div>
//   );
// }

// export default FabNewOrder;

import React, { useState } from "react";
import NewOrder from "../../../Components/NewOrder";

function FabNewOrder() {
  const [FabType, setFabType] = useState("Fabrication");
  return (
    <div>
      <NewOrder Type={FabType} />
    </div>
  );
}

export default FabNewOrder;
