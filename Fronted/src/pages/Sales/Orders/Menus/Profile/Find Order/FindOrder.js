// import React from "react";
// import { Link } from "react-router-dom";

// export default function FindOrder() {
//   return (
//     <div>
//       <div className="row">
//         <div className="col-md-12">
//           <h4 className="title">Find Order</h4>
//         </div>

//         <div className="row mt-2">
//           <div className="col-md-4 sm-12">
//             <label className="form-label">Order No</label>
//             <input type="text" />
//           </div>
//           <div className="col-md-2 sm-12 mt-3">
//             <Link to={"/Orders/Profile/FindOrder/ScheduleCreationForm"}>
//               <button className="button-style">Open</button>
//             </Link>
//           </div>
//           <div className="col-md-1 sm-12 mt-3">
//             <Link to={"/Orders"}>
//               <button className="button-style">Close</button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import NewOrder from "../../../Components/NewOrder";
import FindOrder from "../../../Components/Find Order/FindOrder";

function FindProOrder(props) {
  const [ProType, setProType] = useState("Profile");
  return (
    <div>
      <FindOrder Type={ProType} />
    </div>
  );
}

export default FindProOrder;
