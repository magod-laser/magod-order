import React from "react";
import { Modal } from "react-bootstrap";
export default function OkayModal(props) {
  const { setSmShow, smShow, message } = props;
  

  const handleOkClick = () => {
    setSmShow(false);
  };
  return (
    <div>
      {" "}
      <Modal
        {...props}
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
           message
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <button
            className="button-style "
            style={{ width: "75px" }}
            onClick={handleOkClick}
          >
            OK
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
