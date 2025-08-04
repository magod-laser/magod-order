import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { BsGraphUp } from "react-icons/bs";
import { RiUserSettingsFill } from "react-icons/ri";
import { MdOutlineRequestQuote } from "react-icons/md";
import { AiTwotoneContainer } from "react-icons/ai";

function Home() {
  let [lazerUser, setLazerUser] = useState(
    JSON.parse(localStorage.getItem("LazerUser"))
  );
  return (
    <>
      <Header user={false} />
      

      <div className="card-container">
        
        <Link
          to="/salesHome"
          style={{ textDecoration: "none", color: "black" }}
        >
          <div className="dashboard-card">
            <div className="card-item">
              <RiUserSettingsFill size={60} color="#283E81" />
              <span className="dashboard-link"> Sales</span>
            </div>
          </div>
        </Link>
       
      </div>
    </>
  );
}

export default Home;
