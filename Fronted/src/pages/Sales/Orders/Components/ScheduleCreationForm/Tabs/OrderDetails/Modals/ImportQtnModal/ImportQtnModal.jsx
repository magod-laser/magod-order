import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import IQMTable from "./elements/IQMTable";
import IQMFormHeader from "./elements/IQMFormHeader";
import {
  getRequest,
  postRequest,
} from "../../../../../../../../api/apiinstance";
import { endpoints } from "../../../../../../../../api/constants";
import { toast } from "react-toastify";

export default function ImportExcelModal(props) {
  const [qtnListData, setQtnListData] = useState([]);
  const [selectedQtn, setSelectedQtn] = useState({});
  const [filteredQtnListData, setFilteredQtnListData] = useState([]);

  let QtnFormatt = props?.OrderData?.Type;

  const closeModal = () => {
    props.setImportQtnMdl(false);
    setSelectedQtn({});
    setFilteredQtnListData([]);
  };
  //   useEffect(()=>{
  //     console.log("props?.OrderData?.Type",props?.OrderData?.Type);
  //   },[props.OrderData?.Type])
  // // console.log("props?.OrderData?.Type",props?.OrderData?.Type);
  useEffect(() => {
    if (props?.OrderData?.Type) {
      // Ensure Type is defined before making the request
      postRequest(
        endpoints.getQtnList,
        { QtnFormat: props.OrderData.Type },
        (QtnData) => {
          let arr = QtnData.qtnList.map((element) => ({
            ...element,
            label: element.QtnNo,
            value: element.QtnNo,
          }));
          setQtnListData(arr);
        }
      );
    }
  }, [props.OrderData?.Type]);

  useEffect(() => {
    postRequest(
      endpoints.getQtnList,
      { QtnFormat: props?.OrderData?.Type },
      (QtnData) => {
        let arr = [];
        for (let i = 0; i < QtnData.qtnList.length; i++) {
          const element = QtnData.qtnList[i];
          element.label = element.QtnNo;
          element.value = element.QtnNo;
          arr.push(element);
        }
        setQtnListData(arr);
      }
    );
  }, []);

  function handleChangeQtn(qtnId) {
    setFilteredQtnListData([]);
    postRequest(
      endpoints.getQtnDataByQtnID,
      { qtnId: qtnId, QtnFormat: props?.OrderData?.Type },
      (qtnItemData) => {
        console.log("qtnItemData.qtnItemList", qtnItemData.qtnItemList);

        setFilteredQtnListData(qtnItemData.qtnItemList);
        if (qtnItemData.qtnItemList.length === 0) {
          toast.warning("No data found for the Selected Quotation");
        }
      }
    );
  }

  function loadQuotationFunc() {
    if (filteredQtnListData.length > 0) {
      let arr = [];

      for (let i = 0; i < filteredQtnListData?.length; i++) {
        const element = filteredQtnListData[i];

        console.log("2703-element", element);
        

        let dataArranged = {
          Order_No: props.OrderData.Order_No,
          Order_Srl: i + 1,
          Cust_Code: props.OrderData.Cust_Code,
          // DwgName: element.Name,
          DwgName: QtnFormatt === "Service" ? element.Name : element.Dwg_Name,
          // Mtrl_Code: element.Material,
          Mtrl_Code:  QtnFormatt === "Service" ? element.Material : element.mtrl_code,
          MProcess: "Process 1",
          Mtrl_Source: selectedQtn.QtnType === "Sales" ? "Magod" : "Customer",
          // Qty_Ordered: element.Quantity,
          Qty_Ordered:
            QtnFormatt === "Service" ? element.Quantity : element.Qty,
          InspLevel: "Insp1",
          PackingLevel: "Pkng1",
          // UnitPrice: (
          //   parseFloat(element.BasePrice) - parseFloat(element.DiscountAmount)
          // ).toFixed(2),
          UnitPrice:
            QtnFormatt === "Service"
              ? (
                  parseFloat(element.BasePrice) -
                  parseFloat(element.DiscountAmount)
                ).toFixed(2)
              : (
                  parseFloat(element.Unit_JobWork_Cost) +
                  parseFloat(element.Unit_Material_cost)
                ).toFixed(2),
          UnitWt: parseFloat(0).toFixed(2),
          Order_Status: "Received",
          // JWCost: (
          //   parseFloat(element.BasePrice) - parseFloat(element.DiscountAmount)
          // ).toFixed(2),

          JWCost:
            QtnFormatt === "Service"
              ? (
                  parseFloat(element.BasePrice) -
                  parseFloat(element.DiscountAmount)
                ).toFixed(2)
              : parseFloat(element.Unit_JobWork_Cost),
          // MtrlCost: parseFloat(0).toFixed(2),
          MtrlCost:
            QtnFormatt === "Service"
              ? parseFloat(0).toFixed(2)
              : parseFloat(element.Unit_Material_cost),
          Operation: element.Operation,
          tolerance: "Standard(+/-0.1mm)- 100 Microns",
        };
        arr.push(dataArranged);
      }
      console.log("arr", arr);

      postRequest(
        endpoints.postDetailsDataInImportQtn,
        {
          detailsData: arr,
          QtnNo :selectedQtn?.QtnNo,
          New_Order_No : props?.OrderData?.Order_No

        },
        (detailsDataInImportAtn) => {
          // console.log("detailsDataInImportAtn", detailsDataInImportAtn);
          if (detailsDataInImportAtn.result) {
            props.setOrdrDetailsData(arr);
            toast.success("Import Quotation Successful");
            closeModal();
            props.fetchData();
          } else {
            toast.warning("uncaught backend error");
          }
        }
      );
    } else {
      toast.warning("Please select Quotation Number");
    }
  }


  console.log("==setSelectedQtn",selectedQtn?.QtnNo
    );
  console.log("==props?.OrderData?",props?.OrderData?.Order_No);
  
  return (
    <>
      <Modal
        show={props.importQtnMdl}
        onHide={closeModal}
        style={{ background: "#4d4d4d57" }}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Import Quotation Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <IQMFormHeader
            qtnListData={qtnListData}
            setSelectedQtn={setSelectedQtn}
            selectedQtn={selectedQtn}
            setFilteredQtnListData={setFilteredQtnListData}
            // func
            handleChangeQtn={handleChangeQtn}
          />
          <div className="p-1"></div>
          <div className="row">
            <div className="col-md-12">
              <IQMTable
                filteredQtnListData={filteredQtnListData}
                QtnFormatt={QtnFormatt}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-row justify-content-end">
          <button className="button-style m-0 me-3" onClick={loadQuotationFunc}>
            Load Quotation
          </button>

          <button
            className="button-style m-0"
            // style={{ background: "rgb(173, 173, 173)" }}
            onClick={closeModal}
          >
            Exit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
