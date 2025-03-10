import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { MdOutlineRequestQuote } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Home() {
  let navigate = useNavigate();
  let [lazerUser, setLazerUser] = useState(
    JSON.parse(localStorage.getItem("LazerUser"))
  );
  return (
    <>
      <Header user={false} />
      <button
        className="button-style "
        style={{
          backgroundColor: "#283E81",
          borderRadius: "10px",
          marginLeft: "42px",
        }}
        onClick={() => navigate("../home")}
      >
        Previous Menu
      </button>
      <div className="card-container">
        {/* {lazerUser.data.access.includes("/customer") ? (
          <Link
            to="/Customer"
            // onClick={customerMenu}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="dashboard-card">
              <div className="card-item">
                <BsGraphUp size={60} color="#283E81" />
                <span className="dashboard-link"> Customer Info</span>
              </div>
            </div>
          </Link>
        ) : null} */}

        {/* {lazerUser.data.access.includes("/sales") ? ( */}
        <Link to="/Orders" style={{ textDecoration: "none", color: "black" }}>
          <div className="dashboard-card">
            <div className="card-item">
              <MdOutlineRequestQuote size={60} color="#283E81" />
              <span className="dashboard-link">Orders</span>
            </div>
          </div>
        </Link>
        {/* ) : null} */}
      </div>
    </>
  );
}

export default Home;
