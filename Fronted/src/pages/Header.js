/** @format */


import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { BiDownArrow } from "react-icons/bi";
import { AiFillCaretDown } from "react-icons/ai";
import { CgLogIn, CgProfile } from "react-icons/cg";

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
    // window.location.replace("http://172.16.20.61:3000/");
    window.location.replace(logoutUrl);
    // window.location.replace("http://192.168.1.25:9000/");
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
            Sign Out(200125181208)
          </button>
        </div>
      </nav>

      <div style={{ height: "10px" }}>&nbsp;</div>
    </>
  );
}

export default Header;
