/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import SubMenuComp from "./SubNavComp";
import { customerSidebar, adminSidebar } from "../components/SidebarData";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

// const NavIcon = styled.div`
// 	margin-left: 2rem;

// 	font-size: 2rem;

// 	height: 80px;

// 	display: flex;

// 	justify-content: flex-start;

// 	align-items: center;
// `;

const SidebarWrap = styled.div`
	width: 100%;

	background-color: #263159;
`;

const SidebarComp = () => {
	const location = useLocation();

	const [sidebar, setSidebar] = useState(true);
	// eslint-disable-next-line no-unused-vars
	const [newSideBarData, setNewSideBarData] = useState(customerSidebar);
	const [accessSideBarData, setAccessSideBarData] = useState([]);

	function showSidebar() {
		setSidebar(!sidebar);
	}

	// eslint-disable-next-line no-unused-vars
	let [lazerUser, setLazerUser] = useState(
		JSON.parse(localStorage.getItem("LazerUser"))
	);

	console.log(lazerUser?.data?.access);
	useEffect(() => {
		function filterSidebarData(data, accessPaths) {
		
			const filterSidebar = [];
			let previousMenu = null;

			data.forEach((element) => {
				if (element.subNav) {
					const subNavFiltered = filterSidebarData(element.subNav, accessPaths);
					element.subNav = subNavFiltered;
					if (
						subNavFiltered.length > 0 ||
						accessPaths?.includes(element.path)
					) {
						
						filterSidebar.push(element);
					}
				} else {
					if (element.title === "Previous Menu") {
						
						previousMenu = element;
					} else if (accessPaths?.includes(element.path)) {
						
						filterSidebar.push(element);
					}
				}
			});
			if (previousMenu) {
				filterSidebar.push(previousMenu);
			}
			return filterSidebar;
		}

		const filterSidebar = filterSidebarData(
			newSideBarData,
			lazerUser?.data.access
		);
		setAccessSideBarData(filterSidebar);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<nav className={sidebar ? "side-nav" : '"side-nav '}>
				<SidebarWrap>
					<div className="admin-title ">

						<img
							className="logo"
							src={require("../ML-LOGO1.png")}
							alt="Logo"
						/>

						{sidebar ? (
							<FaAngleRight
								className="toggle-icon"
								onClick={() => showSidebar()}
							/>
						) : (
							<FaAngleLeft
								className="toggle-icon"
								onClick={() => showSidebar()}
							/>
						)}
					</div>

					{(location.pathname.startsWith("/admin")
						? adminSidebar
						: accessSideBarData
					).map((item, index) => {
						return (
							<SubMenuComp
								item={item}
								key={index}
								sidebar={sidebar}
							/>
						);
					})}
				</SidebarWrap>
			</nav>
		</>
	);
};

export default SidebarComp;
