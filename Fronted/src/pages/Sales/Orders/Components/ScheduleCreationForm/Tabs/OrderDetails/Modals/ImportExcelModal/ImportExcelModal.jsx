/** @format */

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import Modal from "react-bootstrap/Modal";
import IETable from "./elements/IETable";
import IEFormHeader from "./elements/IEFormHeader";
import { toast } from "react-toastify";
import Set from "./Modals/Set";

export default function ImportExcelModal(props) {
	const [importedExcelData, setImportedExcelData] = useState([]);
	const [orderTotal, setOrderTotal] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);

	const [settingModal, setSettingModal] = useState(false);

	useEffect(() => {
		let total = 0;
		for (let i = 0; i < importedExcelData.length; i++) {
			const element = importedExcelData[i];

			total = (
				parseFloat(total) +
				parseFloat(element.Order_Qty || 0) *
					(parseFloat(element.Source === "Magod" ? element.Mtrl_Cost || 0 : 0) +
						parseFloat(element.JW_Cost || 0))
			).toFixed(2);
		}
		setOrderTotal(total);
	}, [importedExcelData]);

	const closeModal = () => {
		props.setImportExcelModal(false);
		setImportedExcelData([]);
		setOrderTotal(0);
		setSelectedRows([]);
		setSettingModal(false);
	};

	function exportModifiedExcel() {
		let excelTemplateArray = [];

		for (let i = 0; i < importedExcelData.length; i++) {
			const element = importedExcelData[i];
			let obj = {
				Dwg_Name: element.Dwg_Name,
				Mtrl_Code: element.Mtrl_Code,
				Source: element.Source,
				Operation: element.Operation,
				Order_Qty: parseFloat(element.Order_Qty || 0).toFixed(2),
				JW_Cost: parseFloat(element.JW_Cost || 0).toFixed(2),
				Mtrl_Cost: parseFloat(element.Mtrl_Cost || 0).toFixed(2),
			};

			excelTemplateArray.push(obj);
		}

		var wb = XLSX.utils.book_new();
		var ws = XLSX.utils.json_to_sheet(excelTemplateArray);

		XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
		XLSX.writeFile(wb, "Modified Customer Order Template.xlsx");
		toast.success("Export modified excel successful");
	}

	const materialSource = [
		{
			label: "Magod",
		},
		{
			label: "Customer",
		},
	];

	function exportExcelTemplate() {
		const excelTemplateArray = [
			{
				Dwg_Name: "",
				Mtrl_Code: "",
				Source: "",
				Operation: "",
				Order_Qty: "",
				JW_Cost: "",
				Mtrl_Cost: "",
			},
		];

		var wb = XLSX.utils.book_new();
		var ws = XLSX.utils.json_to_sheet(excelTemplateArray);

		XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
		XLSX.writeFile(wb, "Import Customer Order Template.xlsx");
		toast.success("Export excel template successful");
	}


	console.log("props.procdata-excelmdl",props.procdata);
	
	return (
		<>
			<Modal
				show={props.importExcelModal}
				onHide={closeModal}
				style={{ background: "#4d4d4d57" }}
				fullscreen>
				<Modal.Header closeButton>
					<Modal.Title style={{ fontSize: "14px" }}>
						Import from Excel
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<IEFormHeader
						setImportedExcelData={setImportedExcelData}
						importedExcelData={importedExcelData}
						orderTotal={orderTotal}
						OrderData={props.OrderData}
						mtrldata={props.mtrldata}
						procdata={props.procdata}
						setSettingModal={setSettingModal}
						selectedRows={selectedRows}
						setOrdrDetailsData={props.setOrdrDetailsData}
						closeModal={closeModal}
						exportExcelTemplate={exportExcelTemplate}
						fetchData={props.fetchData}
					/>
					<IETable
						importedExcelData={importedExcelData}
						setImportedExcelData={setImportedExcelData}
						mtrldata={props.mtrldata}
						procdata={props.procdata}
						materialSource={materialSource}
						setSelectedRows={setSelectedRows}
						selectedRows={selectedRows}
						OrdrDetailsData={props.OrdrDetailsData}
						// setOrdrDetailsData={props.setOrdrDetailsData}
					/>
				</Modal.Body>
				<Modal.Footer className="d-flex justify-content-between">
					<div
						className="d-flex justify-content-between"
						style={{ width: "30%" }}>
						<button
							className="button-style m-0"
							style={{ width: "auto" }}
							onClick={() => {
								exportExcelTemplate();
							}}>
							Download Excel Template
						</button>
						<button
							className="button-style m-0"
							style={{ width: "auto" }}
							onClick={exportModifiedExcel}
							disabled={importedExcelData.length < 1}>
							Download Modified Excel
						</button>
					</div>
					<button
						className="button-style m-0"
						style={{ width: "60px", background: "rgb(173, 173, 173)" }}
						onClick={closeModal}>
						Exit
					</button>
				</Modal.Footer>
			</Modal>
			<Set
				settingModal={settingModal}
				setSettingModal={setSettingModal}
				mtrldata={props.mtrldata}
				procdata={props.procdata}
				importedExcelData={importedExcelData}
				setImportedExcelData={setImportedExcelData}
				setSelectedRows={setSelectedRows}
				selectedRows={selectedRows}
			/>
		</>
	);
}
