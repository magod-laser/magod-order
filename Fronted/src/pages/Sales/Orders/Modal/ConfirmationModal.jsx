// /** @format */

// import React, { useEffect, useState } from "react";
// import Modal from "react-bootstrap/Modal";
// import { toast } from "react-toastify";

// export default function ConfirmationModal(props) {
// 	const closeModal = () => {
// 		props.setConfirmModalOpen(false);
// 	};

// 	function yesClicked() {
// 		console.log("Yes button clicked"); // Debug log
// 		console.log("yesClickedFunc:", props.yesClickedFunc); // Check if function exists

// 		// props.yesClickedFunc();
// 		if (typeof props.yesClickedFunc === "function") {
// 			console.log("yesClickedFunc is  a function!");
			
// 			props.yesClickedFunc();


			
// 		} else {
// 			console.log("yesClickedFunc is not a function!");
// 		}
	
// 		closeModal();
// 	}

// 	return (
// 		<>
// 			<Modal
// 				show={props.confirmModalOpen}
// 				onHide={closeModal}
// 				style={{ background: "#4d4d4d57" }}>
// 				<Modal.Header closeButton>
// 					<Modal.Title style={{ fontSize: "14px" }}>
// 						Confirmation Message
// 					</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body >
// 					<span style={{ fontSize: "12px" }}>{props.message}</span>
// 				</Modal.Body>
// 				<Modal.Footer className="d-flex flex-row justify-content-end">
// 					<button
// 						className="button-style m-0 me-3"
// 						onClick={yesClicked}>
// 						Yes
// 					</button>

// 					<button
// 						className="button-style m-0"
// 						onClick={closeModal}>
// 						No
// 					</button>
// 				</Modal.Footer>
// 			</Modal>
// 		</>
// 	);
// }


/** @format */
import React from "react";
import Modal from "react-bootstrap/Modal";

export default function ConfirmationModal({ 
    confirmModalOpen, 
    setConfirmModalOpen, 
    yesClickedFunc, 
    message 
}) {
    const closeModal = () => {
        setConfirmModalOpen(false);
    };

    const yesClicked = () => {
        console.log("Yes button clicked"); // Debug log

        if (typeof yesClickedFunc === "function") {
            console.log("yesClickedFunc is a function! Executing...");
            yesClickedFunc();
        } else {
            console.error("yesClickedFunc is not a function!");
        }

        closeModal();
    };

    return (
        <Modal show={confirmModalOpen} onHide={closeModal} style={{ background: "#4d4d4d57" }}>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: "14px" }}>Confirmation Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span style={{ fontSize: "12px" }}>{message}</span>
            </Modal.Body>
            <Modal.Footer className="d-flex flex-row justify-content-end">
                <button className="button-style m-0 me-3" onClick={yesClicked}>
                    Yes
                </button>
                <button className="button-style m-0" onClick={closeModal}>
                    No
                </button>
            </Modal.Footer>
        </Modal>
    );
}
