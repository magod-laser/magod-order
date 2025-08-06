/** @format */


import React, { useState } from "react";
import Cookies from "js-cookie";

function Header() {
  const getUser = () => {
    const cookieData = JSON.parse(Cookies.get("userData"));
    if (cookieData) {
      const data = cookieData;
      return data.data;
    }
    return null;
  };
  const userData = JSON.parse(Cookies.get("userData"));
  const logoutUrl = process.env.REACT_APP_LOGOUT_URL;

  const logout = () => {
    Cookies.remove("userData");
    window.location.replace(logoutUrl);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const userDropDown = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <nav className="header">
        <div style={{ marginLeft: "10px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: "600" }}>Magod ERP</h4>
        </div>

        <div
          style={{ marginRight: "30px", fontSize: "12px", fontWeight: "600" }}
        >
          
          {userData.Name} - {userData.UnitName} | {""}
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "black",
              fontSize: "12px",
              fontWeight: "600",
            }}
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ height: "10px" }}>&nbsp;</div>
    </>
  );
}

export default Header;
