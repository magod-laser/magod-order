import React from "react";
import Modal from "react-bootstrap/Modal";

export const TimeoutWarningModal = ({ isOpen, onRequestClose }) => {
  const onLogOffCall = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="row mt-1">
      <Modal show={isOpen} size="sm">
        <Modal.Header
          className="justify-content-md-center"
          style={{
            paddingTop: "10px",
            backgroundColor: "#283E81",
            color: "#ffffff",
          }}
        >
          <Modal.Title> Session Timeout</Modal.Title>
        </Modal.Header>

        <Modal.Body className="justify-content-md-center">
          You're being timed out due to inactivity. Please choose to stay signed
          in or to logoff. Otherwise, you will be logged off automatically
        </Modal.Body>

        <Modal.Footer>
          {" "}
          <div className="row justify-content-md-center ">
            <button
              className="button-style"
              type="submit"
              style={{ width: "100px" }}
              onClick={onRequestClose}
            >
              StayIn
            </button>

            <button
              className="button-style"
              style={{ width: "100px", backgroundColor: "gray" }}
              variant="secondary"
              onClick={onLogOffCall}
            >
              logout
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
