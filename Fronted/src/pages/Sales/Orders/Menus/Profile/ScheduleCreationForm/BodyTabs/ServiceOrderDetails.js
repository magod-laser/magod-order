import React, { useState } from "react";
import ServiceImportOldOrder from "./Buttons/ServiceImportOldOrder";
import ServiceDrawing from "./DrawingOrderDetailsTabs/ServiceDrawing";
import ServiceOrderDetailsForm from "./DrawingOrderDetailsTabs/ServiceOrderDetailsForm";
import { Tab, Tabs, Table } from "react-bootstrap";
import ServiceImportParameters from "./Buttons/ServiceImportParameters";
import { Link } from "react-router-dom";
import AlertModal from "../../Components/Alert";

function ServiceOrderDetails() {
  let [importParameters, setImportParameters] = useState(false);
  let [importOldOrder, setImportOldOrder] = useState(false);

  let openModal1 = (e) => {
    e.preventDefault();
    setImportParameters(true);
  };

  let closeModal1 = () => {
    setImportParameters(false);
  };

  let openModal2 = (e) => {
    e.preventDefault();
    setImportOldOrder(true);
  };

  let closeModal2 = () => {
    setImportOldOrder(false);
  };

  return (
    <div>
      <div className="row mt-2">
        {/* <div className="col-md-2 mt-2 col-sm-12">
      <button className="button-style" onClick={openModal1}>
        Import DWG
      </button>
    </div> */}
        {/* <div className="col-md-2 mt-2 col-sm-12">
      <Link to="/Orders/importExcelForm">
        <button className="button-style ">Import EXCEL</button>
      </Link>
    </div> */}
        <div className="col-md-2 mt-2 col-sm-12">
          <Link to="/Orders/Service/ImportQtn">
            <button className="button-style ">Import Qtn</button>
          </Link>
        </div>
        <div className="col-md-2 mt-2 col-sm-12">
          <button className="button-style " onClick={openModal2}>
            Import Old Order
          </button>
        </div>
        <div className="col-md-2 mt-2 col-sm-12">
          <button className="button-style ">Delete</button>
        </div>
        <div className="col-md-2 mt-2 col-sm-12">
          <button className="button-style " onClick={openModal1}>
            Bulk Change
          </button>
        </div>
        <div className="col-md-2 mt-2 col-sm-12">
          <button className="button-style ">Select All</button>
        </div>
        <div className="col-md-2 mt-2 col-sm-12">
          <button className="button-style ">Reverse</button>
        </div>
        <div className="col-md-2 mt-2 col-sm-12">
          <Link to="/Orders/Service/EditDxf">
            <button className="button-style">Edit Dxf</button>
          </Link>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6 col-sm-12">
          <div className="row">
            <div style={{ overflowX: "scroll", overflowY: "scroll" }}>
              <Table
                striped
                className="table-data border"
                style={{ border: "1px", height: "860px" }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th>Select</th>
                    <th style={{ whiteSpace: "nowrap" }}>Drawing/Part Name</th>
                    <th style={{ whiteSpace: "nowrap" }}>Dwg Exists</th>
                    <th>Material</th>
                    <th>Operation</th>
                    <th>Source</th>
                    <th style={{ whiteSpace: "nowrap" }}>Insp Level</th>
                    <th>Tolerance</th>
                    <th style={{ whiteSpace: "nowrap" }}>Packing Level</th>
                    <th style={{ whiteSpace: "nowrap" }}>JW Cost</th>
                    <th style={{ whiteSpace: "nowrap" }}>Mtrl Cost</th>
                    <th style={{ whiteSpace: "nowrap" }}>Unit Rate</th>
                    <th style={{ whiteSpace: "nowrap" }}>Qty Ordered</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody className="tablebody"></tbody>
              </Table>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <Tabs>
            <Tab eventKey="drawing" title="Drawing">
              <ServiceDrawing />
            </Tab>
            <Tab eventKey="orderDetailsForm" title="Order Details">
              <ServiceOrderDetailsForm />
            </Tab>
          </Tabs>
        </div>
      </div>

      <ServiceImportParameters
        importParameters={importParameters}
        setImportParameters={setImportParameters}
        // onHide={(e) => setImportParameters(e)}
        firstbutton={closeModal1}
        // title="magod_findOrder"
        //  firstbuttontext="Ok"
      />

      <ServiceImportOldOrder
        importOldOrder={importOldOrder}
        setImportOldOrder={setImportOldOrder}
        firstbutton={closeModal2}
      />
    </div>
  );
}

export default ServiceOrderDetails;
