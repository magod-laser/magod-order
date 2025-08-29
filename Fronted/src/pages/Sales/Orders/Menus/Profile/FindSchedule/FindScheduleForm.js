// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { postRequest } from '../../../../../api/apiinstance';
// import { endpoints } from '../../../../../api/constants';
// import { useOrderDetails } from '../../../../../../context/OrderDetailsContext';

// export default function FindScheduleForm() {


//     const { ConordrDetailsData } = useOrderDetails();
//     console.log("ConordrDetailsData", ConordrDetailsData);
    
//     const [ProType, setProType] = useState("Profile");

//      const [DwgNameList, setDwgNameList] = useState([]);
//       const [rowScheduleList, setRowScheduleList] = useState({});
//       const onRowClickScheduleList = (item, index) => {
//         let list = { ...item, index: index };
//         setRowScheduleList(list);
//         postRequest(
//           endpoints.getScheduleListDwgData,
//           { ScheduleId: list.ScheduleId },
//           (response) => {
//             setDwgNameList(response);
//           }
//         );
//       };
//   return (
//     <div>
//       <div className="row">
//         <div className="col-md-12">
//           <h4 className="title">Find Schedule</h4>
//         </div>

//         <div className="row mt-2">
//           <div className="col-md-2 sm-12 mt-4">
//             <label className="form-label">Schedule No</label>
//           </div>
//           <div className="col-md-2 sm-12 mt-3">
//             <input type="text" />
//           </div>
        
//           <div className="col-md-2 ml-3">
//             <Link
//               to={
//                 ProType === "Profile"
//                   ? `/Orders/Profile/ProfileOpenSchedule`
//                   : null
//               }
//               state={{
//                 DwgNameList,
//                 Type: ProType,
//                 OrdrDetailsData: ConordrDetailsData,
//               }}
//             >
//               <button
//                 className="button-style mt-4"
//                 // disabled={Object.keys(DwgNameList).length === 0 || scheduleListData.length=== 0 }
//               >
//                 Open Schedule
//               </button>
//             </Link>

//             {/* {Object.keys(DwgNameList).length === 0 && (
//                         <style>
//                           {`
//                       .button-style[disabled] {
//                           background-color: grey;
//                           cursor: not-allowed;
//                       }
//                       `}
//                         </style>
//                       )} */}
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


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../../../../../api/apiinstance";
import { endpoints } from "../../../../../api/constants";
import { useOrderDetails } from "../../../../../../context/OrderDetailsContext";

export default function FindScheduleForm() {
  const navigate = useNavigate();
  const { ConordrDetailsData } = useOrderDetails();

  const [ProType, setProType] = useState("Profile");
  const [ScheduleNo, setScheduleNo] = useState(""); // 🆕 Schedule No input
  const [DwgNameList, setDwgNameList] = useState([]);
  const [scheduleListData, setScheduleListData] = useState([]);
 useEffect(() => {
    postRequest(
      endpoints.getScheduleListData,
      { Order_No: ConordrDetailsData.Order_No },
      (response) => {
        setScheduleListData(response);
        console.log("==Updated scheduleListData:", scheduleListData);
      }
    );
  }, []);

  const handleOpenSchedule = async () => {
    if (!ScheduleNo) {
      alert("Please enter a Schedule No.");
      return;
    }

    try {
      // Assuming ScheduleNo is same as ScheduleId
      const response = await postRequest(endpoints.getScheduleListDwgData, {
        ScheduleId: ScheduleNo,
      });

      setDwgNameList(response); // optional, if needed locally

      // Navigate with state
      navigate("/Orders/Profile/ProfileOpenSchedule", {
        state: {
          DwgNameList: response,
          Type: ProType,
          OrdrDetailsData: ConordrDetailsData,
        },
      });
    } catch (error) {
      console.error("Failed to fetch schedule data", error);
      alert("Error fetching schedule data. Check console.");
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <h4 className="title">Find Schedule</h4>
        </div>

        <div className="row mt-2">
          <div className="col-md-2 sm-12 mt-4">
            <label className="form-label">Schedule No</label>
          </div>
          <div className="col-md-2 sm-12 mt-3">
            <input
              type="text"
              value={ScheduleNo}
              onChange={(e) => setScheduleNo(e.target.value)}
            />
          </div>

          <div className="col-md-2 ml-3">
            <button className="button-style mt-4" onClick={handleOpenSchedule}>
              Open Schedule
            </button>
          </div>

          <div className="col-md-1 sm-12 mt-3">
            <button
              className="button-style"
              onClick={() => navigate("/Orders")}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
