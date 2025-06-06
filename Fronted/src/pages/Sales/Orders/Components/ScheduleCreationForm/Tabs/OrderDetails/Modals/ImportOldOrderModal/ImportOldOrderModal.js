/** @format */

import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import {
  getRequest,
  postRequest,
} from "../../../../../../../../api/apiinstance";
import { endpoints } from "../../../../../../../../api/constants";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../../../../Modal/ConfirmationModal";

// ConfirmationModal

export default function ImportOldOrderModal(props) {
  const [selectedOldOrder, setSelectedOldOrder] = useState({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
 // const [orderdwg, setOrderDwg] = useState([]);


console.log("new orders DWG Names:", props.OrdrDetailsData.map(item => item.DwgName));
  //  let orderdwg = props.OrdrDetailsData.map(item => item.DwgName);

  const closeModal = () => {
    props.setImportOldOrdrMdl(false);
    setSelectedOldOrder({});
    // setSelectedQtn({});
    // setFilteredQtnListData([]);
  };

  // console.log("props...", props);

  // function loadOldOrder() {
  // 	const newArray = props.oldOrderDetailsData?.filter(
  // 		(obj) => obj.Order_No === selectedOldOrder.Order_No
  // 	);

  // 	// console.log("newArray", newArray);
  // 	props.setOrdrDetailsData(newArray);
  // 	closeModal();
  // 	toast.success("Import old order successfull");
  // }

  // API FOR INSERION OF OL ORDER INTO ORDER DETAILS TABLE
  const loadOldOrder = () => {
    if (!selectedOldOrder || !selectedOldOrder.Order_No) {
      toast.warning("Please select an old order properly");
      return;
    }

    console.log("selectedOldOrder:", selectedOldOrder);
    console.log("props.oldOrderDetailsData:", props.oldOrderDetailsData);

    // Filtering the old order details
    const newArray = props.oldOrderDetailsData?.filter(
      (obj) => obj.Order_No === selectedOldOrder.Order_No
    );
    console.log("newArray", newArray);

    if (!newArray || newArray.length === 0) {
      toast.warning("No data found for the selected old order");
      return;
    }

    console.log("Filtered Order Data:", newArray);

    // Transforming data to match required structure
    let arr = newArray.map((element, index) => ({
      Order_No: props.OrderData.Order_No,
      Cust_Code: props.OrderData.Cust_Code,
      Order_Srl: index + 1,
      DwgName: element.DwgName || "",
      Mtrl_Code: element.Mtrl_Code || "",
      MProcess: "Process 1",
      Operation: element.Operation || "",
      Mtrl_Source: element.Mtrl_Source || "",
      InspLevel: "Insp1",
      tolerance: "Standard(+/-0.1mm)- 100 Microns",
      PackingLevel: "Pkng1",
      Delivery_Date: element.Delivery_Date || null,
      JWCost: parseFloat(element.JWCost || 0).toFixed(2),
      MtrlCost: parseFloat(element.MtrlCost || 0).toFixed(2),
      UnitPrice: (
        parseFloat(
          element.Mtrl_Source === "Magod" ? element.MtrlCost || 0 : 0
        ) + parseFloat(element.JWCost || 0)
      ).toFixed(2),
      Qty_Ordered: element.Qty_Ordered || 0,
      //   QtyScheduled:element.QtyScheduled ||0,
      QtyScheduled: 0,
      Total: (
        parseFloat(element.Qty_Ordered || 0) *
        (parseFloat(
          element.Mtrl_Source === "Magod" ? element.MtrlCost || 0 : 0
        ) +
          parseFloat(element.JWCost || 0))
      ).toFixed(2),
    }));

    console.log("Transformed Order Data:", arr);

    // API CALL TO INSERT DATA
    postRequest(
      endpoints.postDetailsDataInImportOldOrder,
      { detailsData: arr, Old_Order_No:selectedOldOrder.Order_No,
        New_Order_No:props.OrderData.Order_No  },
      (response) => {
        if (response.result) {
          props.setOrdrDetailsData(arr);
          closeModal();
          toast.success("Import old order successfull");
          props.fetchData();
        } else {
          toast.warning("Error importing old order data.");
        }
      }
    );
  };

  function loadOldOrderValidations() {
    if (selectedOldOrder.Order_No) {
      setConfirmModalOpen(true);
      // Suresh 14-05-2025
//       let srcfolder = process.env.REACT_APP_SERVER_FILES +"\\" + selectedOldOrder.Order_No + "\\DXF"
//       let dstfolder = process.env.REACT_APP_SERVER_FILES +"\\" + props.OrderData.Order_No + "\\DXF"

// //console.log("props.OrdrDetailsData : ", props.OrdrDetailsData);

//    //   let orderdwg = Array.isArray(props.OrdrDetailsData) ? props.OrdrDetailsData.map(item => item.DwgName) : [];

//     //  console.log("props.OrdrDetailsData. : ",props.OrdrDetailsData)
//       console.log("orderdwg - 1 : ", orderdwg)
      
      const checkingdxffilesimportoldorder = postRequest(endpoints.checkdxffilesimportoldorder,{
        Old_Order_No:selectedOldOrder.Order_No,
        New_Order_No:props.OrderData.Order_No  })
     
      // const checkingdxffilesimportoldorder = postRequest(endpoints.orderCopyDxf, 
      //   {srcfolder, dstfolder, orderdwg})
      // // Suresh 14-05-25
        console.log("checkingdxffilesimportoldorder",checkingdxffilesimportoldorder);

    } else {
      toast.warning("Please select the order to import");
    }

  }

  // useEffect(()=>{
    // const checkingdxffilesimportoldorder = postRequest(endpoints.checkdxffilesimportoldorder,{
    //   Old_Order_No:selectedOldOrder.Order_No,
    //   New_Order_No:props.OrderData.Order_No  })
    //   console.log("checkingdxffilesimportoldorder",checkingdxffilesimportoldorder);
  // },[selectedOldOrder.Order_No])
 const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSort = (key) => {
    // console.log("entering into the request sort");
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
        // console.log("filterdata loggedin sorted data;;", filteredData);
    const dataCopy = [...props.oldOrderListData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Order_No" 
         
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopy;
  };
console.log("props.oldOrderListData",props.oldOrderListData);


  return (
    <>
      <Modal
        show={props.importOldOrdrMdl}
        onHide={closeModal}
        style={{ background: "#4d4d4d57" }}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Import Old Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: "0px" }}>
          <Table
            striped
            className="table-data border"
            // style={{ border: "1px" }}
          >
            <thead className="tableHeaderBGColor">
              <tr>
                <th>SL No</th>
                <th   onClick={() => requestSort("Order_No")}>Order No</th>
                <th   onClick={() => requestSort("Purchase_Order")}>PO No</th>
              </tr>
            </thead>
            <tbody className="tablebody">
              {props.oldOrderListData?.length > 0 ? (
                // props.oldOrderListData?.map((val, key) => (
                  sortedData()?.map((val, key) => (
                  <>
                    <tr
                      key={key}
                      onClick={(e) => {
                        setSelectedOldOrder(val);
                      }}
                      className={
                        selectedOldOrder.Order_No === val.Order_No
                          ? "rowSelectedClass"
                          : ""
                      }
                    >
                      <td>{key + 1}</td>
                      <td>{val.Order_No}</td>
                      <td>{val.Purchase_Order}</td>
                    </tr>
                  </>
                ))
              ) : (
                <tr
                // key={key}
                // onClick={(e) => {
                //   setSelectedOldOrder(val);
                // }}
                // className={
                //   selectedOldOrder.Order_No === val.Order_No
                //     ? "rowSelectedClass"
                //     : ""
                // }
                >
                  <td></td>
                  <td>No old order found</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-row justify-content-end">
          <button
            className="button-style m-0 me-3"
            style={{ width: "auto" }}
            onClick={loadOldOrderValidations}
          >
            Load
          </button>

          <button
            className="button-style m-0"
            style={{ width: "60px"}}
            onClick={closeModal}
          >
            Exit
          </button>
        </Modal.Footer>
      </Modal>

      <ConfirmationModal
        confirmModalOpen={confirmModalOpen}
        setConfirmModalOpen={setConfirmModalOpen}
        message="Are you sure to import the selected order"
        yesClickedFunc={loadOldOrder}
      />
    </>
  );
}
