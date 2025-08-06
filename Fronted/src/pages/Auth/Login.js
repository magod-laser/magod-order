/** @format */

import React, {  useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const { endpoints } = require("../api/constants");

function Login() {
	const nav = useNavigate();
	
	// Retrieve userData from cookies
	const userData = JSON.parse(Cookies.get("userData") || "{}");
	console.log("User Data:", userData);
	// Set userData into localStorage
	localStorage.setItem("userData", JSON.stringify(userData));

	const storedData = localStorage.getItem("userData");

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    const unitName = parsedData.UnitName;
    // console.log("UnitName-----", unitName);
  } else {
    // console.log("No userData in localStorage.");
  }
	useEffect(() => {
		if (userData) {
			const fetchMenuUrls = async () => {
				try {
					const role = userData.Role;
					const username = userData.UserName;
					if (!role || !username) {
						console.error(
							"Role, username, or access token is missing in local storage"
						);
						return;
					}

					const response = await fetch(endpoints.MenuUrlsAPI, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							// Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ role, username }),
					});
					// console.log("response", response);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const responseData = await response.json();
					localStorage.setItem("LazerUser", JSON.stringify(responseData));
				} catch (error) {
					console.error("Error fetching menu URLs:", error);
				}
			};

			fetchMenuUrls();
			nav("Orders/");
		}
	}, [userData]);
	
	return (
		<>	</>
	);
}

export default Login;
