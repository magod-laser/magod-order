/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Table, Tabs, Form } from "react-bootstrap";

// import Axios from "axios";
import DetailsTable from "./Tables/DetailsTable";
import MainTable from "./Tables/MainTable";
import { endpoints } from "../../../../../../api/constants";
import { postRequest } from "../../../../../../api/apiinstance";

import { toast } from "react-toastify";

export default function ProfarmaInvoiceList(props) {
  // console.log("propsss in proforma inv list", props);
  const nav = useNavigate();

  const [selectedProfarmaMainRow, setSelectedProfarmaMainRow] = useState({});
  const [filteredDetailsData, setFilteredDetailsData] = useState([]);

  const filterDetailsRow = (val) => {
    if (selectedProfarmaMainRow.ProfarmaID === val.ProfarmaID) {
      setSelectedProfarmaMainRow({});
      setFilteredDetailsData([]);
    } else {
      setSelectedProfarmaMainRow(val);
      const arr = props.profarmaInvDetails?.filter(
        (obj) => obj.ProfarmaID === val.ProfarmaID
      );
      console.log("arr", arr);
      
      setFilteredDetailsData(arr);
    }
  };

  // console.log("selectedItems", props.selectedItems);

  const createInvoice = () => {
    // console.log("createInvoice");
    // console.log("props.selectedItems", props.selectedItems);

    const hasZeroValue = props.selectedItems.some(
      (item) =>
        item.Qty_Ordered === 0 ||
        item.Qty_Ordered === "" ||
        item.JWCost === 0.0 ||
        item.JWCost === "0.00" ||
        item.JWCost === ""
    );

    if (hasZeroValue) {
      alert(
        "Invoice cannot be created as Qty_Ordered or JWCost has a value of 0."
      );
      return;
    }
    // --
    // const hasZeroMtrlValue = props.selectedItems.some(
    //   (item) =>
    //     item.MtrlCost === 0 ||
    //     item.MtrlCost === "" ||
    //     item.MtrlCost === 0.0 ||
    //     item.MtrlCost === "0.00" ||
    //     item.MtrlCost === ""
    // );

    // if (hasZeroMtrlValue) {
    //   alert(
    //     "Invoice cannot be created as Mtrl Cost has a value of 0 for Sales."
    //   );
    //   return;
    // }

    if (props.selectedItems.length > 0) {

      let flag = false;
     
      
      console.log('props.selectedItems',props.selectedItems);
      
const magodArr=props.selectedItems?.filter((obj)=>obj.Mtrl_Source==='Magod'||obj.Mtrl_Source==='magod')
const custArr=props.selectedItems?.filter((obj)=>obj.Mtrl_Source==='Customer'||obj.Mtrl_Source==='customer')


console.log("MA",magodArr);
console.log("CA",custArr);


if (magodArr?.length>0) {
console.log("magodArr", magodArr);

// -- checking mtrl cost 
const hasZeroMtrlValue = magodArr.some(
  (item) =>
    item.MtrlCost === 0 ||
    item.MtrlCost === "0" ||
    item.MtrlCost === 0.00 ||
    item.MtrlCost === "0.00" ||
    item.MtrlCost === ""
);

if (hasZeroMtrlValue) {
  alert("Invoice cannot be created as Mtrl Cost has a value of 0 for Sales.");
  // return;
}
else{
  let netTotal = 0;
  let InvType = "Sales";
  for (let i = 0; i < magodArr.length; i++) {
    const element = magodArr[i];

    netTotal = (
      parseFloat(netTotal || 0) +
      parseFloat(element.Qty_Ordered || 0) *
        (parseFloat(element.JWCost || 0) + parseFloat(element.MtrlCost || 0))
    ).toFixed(2);
  }

  const profarmaMainDataForMagod = {
    InvType: InvType,
    OrderNo: props.OrderData.Order_No,
    OrderDate: props.OrderData.Order_Date,
    Cust_Code: props.OrderCustData.Cust_Code,
    Cust_Name: props.OrderCustData.Cust_name || "",
    Cust_Address: props.OrderCustData.Address || "",
    Cust_Place: props.OrderCustData.City || "",
    Cust_State: props.OrderCustData.State || "",
    Cust_StateId: props.OrderCustData.StateId || "",
    PIN_Code: props.OrderCustData.Pin_Code || "",
    DelAddress: props.OrderCustData.Delivery || "",
    GSTNo: props.OrderCustData.GSTNo || "Unregistered",
    PO_No: props.OrderData.Purchase_Order || "",
    PO_Date: props.OrderData.Order_Date || "",
    Net_Total: netTotal || 0,
    AssessableValue: netTotal || 0,
    InvTotal: netTotal || 0,
    GrandTotal: netTotal || 0,
    Status: "Draft",
  };

  postRequest(
    endpoints.postCreateInvoice,
    {
      profarmaMainData: profarmaMainDataForMagod,
      profarmaDetailsData: magodArr,
    },
    (resp) => {
      if (resp) {
        if (resp.flag) {
          flag = true;
          toast.success(resp.message);
          // props.fetchData();
          // console.log("resp", resp);
        } else {
          toast.error(resp.message);
        }
      } else {
        toast.error("uncaught error in frontend");
      }
    }
  );
     

}



   

       


}

if (custArr?.length>0) {
  let netTotal=0;
let InvType = "Job Work";
  for (let i = 0; i < custArr.length; i++) {
    const element = custArr[i];
    
    netTotal = (
      parseFloat(netTotal||0) +
      parseFloat(element.Qty_Ordered||0) *
      (parseFloat(element.JWCost||0) )
    ).toFixed(2);


  }

     const profarmaMainDataForCust = {
        InvType: InvType,
        OrderNo: props.OrderData.Order_No,
        OrderDate: props.OrderData.Order_Date,
        Cust_Code: props.OrderCustData.Cust_Code,
        Cust_Name: props.OrderCustData.Cust_name || "",
        Cust_Address: props.OrderCustData.Address || "",
        Cust_Place: props.OrderCustData.City || "",
        Cust_State: props.OrderCustData.State || "",
        Cust_StateId: props.OrderCustData.StateId || "",
        PIN_Code: props.OrderCustData.Pin_Code || "",
        DelAddress: props.OrderCustData.Delivery || "",
        GSTNo: props.OrderCustData.GSTNo || "Unregistered",
        PO_No: props.OrderData.Purchase_Order || "",
        PO_Date: props.OrderData.Order_Date || "",
        Net_Total: netTotal || 0,
        AssessableValue: netTotal || 0,
        InvTotal: netTotal || 0,
        GrandTotal: netTotal || 0,
        Status: "Draft",
      };

      postRequest(
        endpoints.postCreateInvoice,
        {
          profarmaMainData: profarmaMainDataForCust,
          profarmaDetailsData: custArr,
        },
        (resp) => {
          if (resp) {
            if (resp.flag) {
              flag=true
              toast.success(resp.message);
              // props.fetchData();
              // console.log("resp", resp);
            } else {
              toast.error(resp.message);
            }
          } else {
            toast.error("uncaught error in frontend");
          }
        }
      );
   
   

       


}

// if(flag){
  props.fetchData();
// }

    
      // for (let i = 0; i < props.selectedItems.length; i++) {
      //   const element = props.selectedItems[i];
      //   if (element.Mtrl_Source === "Magod") {
      //     // InvType = "Sales";
      //   } else {
      //     // InvType = "Job Work";
      //   }

        
      // //   if (element.Mtrl_Source === "Magod") {
      // //     netTotal = (
      // //       parseFloat(netTotal) +
      // //       parseFloat(element.Qty_Ordered) *
      // //         (parseFloat(element.JWCost) + parseFloat(element.MtrlCost))
      // //     ).toFixed(2);
      // //   } else {
      // //     netTotal = (
      // //       parseFloat(netTotal) +
      // //       parseFloat(element.Qty_Ordered) * parseFloat(element.JWCost)
      // //     ).toFixed(2);
      // //   }
        
      // }

      
      // const profarmaMainData = {
      //   InvType: InvType,
      //   OrderNo: props.OrderData.Order_No,
      //   OrderDate: props.OrderData.Order_Date,
      //   Cust_Code: props.OrderCustData.Cust_Code,
      //   Cust_Name: props.OrderCustData.Cust_name || "",
      //   Cust_Address: props.OrderCustData.Address || "",
      //   Cust_Place: props.OrderCustData.City || "",
      //   Cust_State: props.OrderCustData.State || "",
      //   Cust_StateId: props.OrderCustData.StateId || "",
      //   PIN_Code: props.OrderCustData.Pin_Code || "",
      //   DelAddress: props.OrderCustData.Delivery || "",
      //   GSTNo: props.OrderCustData.GSTNo || "Unregistered",
      //   PO_No: props.OrderData.Purchase_Order || "",
      //   PO_Date: props.OrderData.Order_Date || "",
      //   Net_Total: netTotal || 0,
      //   AssessableValue: netTotal || 0,
      //   InvTotal: netTotal || 0,
      //   GrandTotal: netTotal || 0,
      //   Status: "Draft",
      // };

      // postRequest(
      //   endpoints.postCreateInvoice,
      //   {
      //     profarmaMainData: profarmaMainData,
      //     profarmaDetailsData: props.selectedItems,
      //   },
      //   (resp) => {
      //     if (resp) {
      //       if (resp.flag) {
      //         toast.success(resp.message);
      //         props.fetchData();
      //         // console.log("resp", resp);
      //       } else {
      //         toast.error(resp.message);
      //       }
      //     } else {
      //       toast.error("uncaught error in frontend");
      //     }
      //   }
      // );
   
   
    } else {
      toast.warning("Please select drawing to create profarma invoice");
    }
  };

  function deleteInvoice() {
    // console.log("delete invoice", selectedProfarmaMainRow.ProfarmaID);
    if (selectedProfarmaMainRow.ProfarmaID) {
      postRequest(
        endpoints.postDeleteInvoice,
        { ProfarmaID: selectedProfarmaMainRow.ProfarmaID },
        (resp) => {
          if (resp) {
            if (resp.flag) {
              toast.success(resp.message);
              props.fetchData();
              setFilteredDetailsData([]);
              setSelectedProfarmaMainRow({});
            } else {
              toast.error(resp.message || "uncaught error in backend");
            }
          } else {
            toast.error("uncaught error in frontend");
          }
        }
      );
    } else {
      toast.warning("Please select the profarma invoice");
    }
  }

  function openInvoice() {
    if (selectedProfarmaMainRow.ProfarmaID) {
      nav(`/Orders/${props.OrderData.Type}/ProformaInvoiceForm`, {
        state: selectedProfarmaMainRow.ProfarmaID,
      });
    } else {
      toast.warning("Please select the profarma invoice");
    }
  }


  

  return (
    <>
      <div>
        <div className="row d-flex justify-content-center p-2">
          <div className="col-md-2">
            <button
              className={
                props.selectedItems.length > 0
                  ? "button-style m-0"
                  : "button-style button-disabled m-0"
              }
              onClick={createInvoice}
            >
              Create Invoice
            </button>
          </div>
          <div className="col-md-2">
            <button
              disabled={selectedProfarmaMainRow.ProformaInvNo}
              className={
                selectedProfarmaMainRow.ProfarmaID &&
                !selectedProfarmaMainRow.ProformaInvNo
                  ? "button-style m-0"
                  : "button-style button-disabled m-0"
              }
              onClick={deleteInvoice}
            >
              Delete Invoice
            </button>
          </div>
          <div className="col-md-2">
            <button
              className={
                selectedProfarmaMainRow.ProfarmaID
                  ? "button-style m-0"
                  : "button-style button-disabled m-0"
              }
              onClick={openInvoice}
            >
              Open Invoice
            </button>
            {/* <Link
              to={`/Orders/${props.OrderData.Type}/ProfarmaInvoiceForm`}
              state={selectedProfarmaMainRow.ProfarmaID}
            >
              <button className="button-style m-0">Open Invoice</button>
            </Link> */}
          </div>
        </div>

        <div className="row">
          <div
            className="col-md-6"
            style={{ height: "300px", overflow: "auto" }}
          >
            <MainTable
              profarmaInvMain={props.profarmaInvMain}
              setSelectedProfarmaMainRow={setSelectedProfarmaMainRow}
              selectedProfarmaMainRow={selectedProfarmaMainRow}
              filterDetailsRow={filterDetailsRow}
            />
          </div>
          <div
            className="col-md-6"
            style={{ height: "300px", overflow: "auto" }}
          >
            <DetailsTable filteredDetailsData={filteredDetailsData} />
          </div>
        </div>
      </div>
    </>
  );
}
