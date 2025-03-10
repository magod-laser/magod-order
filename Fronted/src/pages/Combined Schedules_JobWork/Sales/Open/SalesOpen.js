import React from "react";
import { useNavigate } from "react-router-dom";
function SalesOpen() {
  const navigate = useNavigate();
  return (
    <div>
      <h4 className="title">Find Production Schedule</h4>
      <div className="row">
        <div className="col-md-4">
          <label className="form-label">Enter Schedule No</label>
          <input />
        </div>
        <div className="col-md-3 mt-3">
          <button
            className="button-style"
            onClick={() =>
              navigate(
                "/Orders/CombinedSchedules/Sales/ScheduleList/ScheduleDetails"
              )
            }
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalesOpen;
