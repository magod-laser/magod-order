// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// function ServiceFindOrder() {
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
//             <Link to={"/Orders/Service/ScheduleCreationForm"}>
//               <button className="button-style">Open</button>
//             </Link>
//           </div>

//           <div className="col-md-1 sm-12 mt-3">
//             <Link to="/Orders">
//               <button className="button-style">Close</button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ServiceFindOrder;

import React, { useState } from "react";
import NewOrder from "../../../Components/NewOrder";
import FindOrder from "../../../Components/Find Order/FindOrder";

function ServiceFindOrder(props) {
  const [ServiceType, setServiceType] = useState("Service");
  return (
    <div>
      <FindOrder Type={ServiceType} />
    </div>
  );
}

export default ServiceFindOrder;
