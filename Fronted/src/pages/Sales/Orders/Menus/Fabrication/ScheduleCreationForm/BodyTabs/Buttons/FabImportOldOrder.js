import React from "react";
import { Button, Modal, Table } from "react-bootstrap";

export default function FabImportOldOrder({
  importOldOrder,
  setImportOldOrder,
}) {
  const handleClose = () => {
    setImportOldOrder(false);
  };
  return (
    <div>
      <Modal show={importOldOrder}>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title>
            <h4>Import Old Order</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div style={{ overflowY: "scroll" }}>
              <Table
                striped
                className="table-data border"
                style={{ border: "1px", height: "200px" }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th>Order No</th>
                    <th>PO No</th>
                  </tr>
                </thead>
                <tbody className="tablebody"></tbody>
              </Table>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <button className="button-style" onClick={handleClose}>
                  Save
                </button>
              </div>
              <div className="col-md-6 col-sm-12">
                <button className="button-style" onClick={handleClose}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
        <Button variant="primary" type='submit' >
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}
