/** @format */



import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { Link, useLocation } from "react-router-dom";

import * as FaIcons from "react-icons/fa";

import * as AiIcons from "react-icons/ai";

import SubMenuComp from "./SubNavComp";

import { IconContext } from "react-icons/lib";

import { customerSidebar, adminSidebar } from "../components/SidebarData";

import { FaAngleRight, FaAngleLeft, FaAngleDown } from "react-icons/fa";

const NavIcon = styled.div`
	margin-left: 2rem;

	font-size: 2rem;

	height: 80px;

	display: flex;

	justify-content: flex-start;

	align-items: center;
`;

const SidebarWrap = styled.div`
	width: 100%;

	background-color: #263159;
`;

const SidebarComp = () => {
	const location = useLocation();

	const [sidebar, setSidebar] = useState(true);
	const [newSideBarData, setNewSideBarData] = useState(customerSidebar);
	const [accessSideBarData, setAccessSideBarData] = useState([]);

	function showSidebar() {
		setSidebar(!sidebar);
	}
	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("LazerUser"));
		setLazerUser(user);
	}, []);

	let [lazerUser, setLazerUser] = useState(
		JSON.parse(localStorage.getItem("LazerUser"))
	);


	useEffect(() => {
		function filterSidebarData(data, accessPaths) {
			const filterSidebar = [];

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
					// Directly check for the "Previous Menu"
					if (element.title === "Previous Menu") {
						console.log("entering into privious menus click");
						console.log("element", element);
						console.log("element.path", element.path);
						console.log("filterSidebar-before", filterSidebar);
						filterSidebar.push(element);
						console.log("filterSidebar-after", filterSidebar);
					} else if (accessPaths?.includes(element.path)) {
						filterSidebar.push(element);
					}
				}
			});
			return filterSidebar;
		}

		const filterSidebar = filterSidebarData(
			newSideBarData,
			lazerUser?.data?.access
		);
		setAccessSideBarData(filterSidebar);
	}, []);

	return (
		<>
			<nav className={sidebar ? "side-nav" : '"side-nav '}>
				<SidebarWrap>
					<div className="admin-title ">
						{/* {sidebar && 'M A G O D'} */}

						<img
							className="logo"
							src={require("../ML-LOGO1.png")}
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
