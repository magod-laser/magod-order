import React from "react";
import {
  // Container,
  // Row,
  // Col,
  // Form,
  Button,
  // Card,
  Modal,
} from "react-bootstrap";

function Popup(props) {
  // const [show, setShow] = useState(props.show);

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title style={{fontSize:'14px'}}>{props.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{fontSize:'12px'}}>
        <p>{props.message}</p>
      </Modal.Body>

      <Modal.Footer>
        <button
          className="group-button button-style"
          onClick={() => {
            props.firstbutton();
          }}
        >
          {props.firstbuttontext}
        </button>
        {/* <Button
          variant="secondary"
          onClick={() => {
            props.secondbutton();
          }}
        >
          {props.secondbuttontext}
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default Popup;
