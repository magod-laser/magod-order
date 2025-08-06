import React from "react";

import {  Modal} from "react-bootstrap";

function AlertModal(props) {

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "14px" }}>{props.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ fontSize: "12px" }}>
        <p>{props.message}</p>
      </Modal.Body>

      <Modal.Footer>
        <button
          className="button-style group-button"
          onClick={(e) => {
            props.firstbutton(e);
          }}
        >
          {props.firstbuttontext}
        </button>
        {props.secondbuttontext ? (
          <button
            className="button-style group-button"
            onClick={() => {
              props.secondbutton();
            }}
          >
            {props.secondbuttontext}
          </button>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AlertModal;
