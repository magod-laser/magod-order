import React, { useEffect, useState } from "react";
import PrepareScheduleTab from "./PrepareScheduleTab";
import CombinedScheduleDetailsTab from "./CombinedScheduleDetailsTabSales";
import { Form, Tab, Tabs } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import Popup from "../../Components/Popup";
import axios from "axios";
import { postRequest, getRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";

export default function CreateSales() {
  //get sales contact list
  const [salesContactList, setSalesContactList] = useState([]);
  const getSalesContactList = () => {
    getRequest(endpoints.getSalesContact, (response) => {
      setSalesContactList(response);
    });
  };

  useEffect(() => {
    getSalesContactList();
  }, []);

  //Completion DATE
  const [displayDate, setDisplayDate] = useState(getTodayDateString());
  const [storedDate, setStoredDate] = useState(getTodayDateTimeString());

  function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getTodayDateTimeString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const hours = today.getHours().toString().padStart(2, "0");
    const minutes = today.getMinutes().toString().padStart(2, "0");
    const seconds = today.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    // Update the storedDate whenever displayDate changes
    const formattedDate = displayDate.split("/").reverse().join("-");
    setStoredDate(`${formattedDate} ${getTodayDateTimeString().split(" ")[1]}`);
  }, [displayDate]);

  const handleDateChange = (e) => {
    // Update the displayDate whenever the user selects a date
    setDisplayDate(e.target.value);
  };

  //set Customer
  const [custdata, setCustdata] = useState([]);

  useEffect(() => {
    getRequest(endpoints.allcustomerdata, (custdetdata) => {
      // console.log("custdetdata is",custdetdata);
      for (let i = 0; i < custdetdata.length; i++) {
        custdetdata[i].label = custdetdata[i].Cust_name;
      }
      setCustdata(custdetdata);
    });
  }, []);

  const [oderSchedule, setOrderSchedule] = useState([]);
  const [custCode, setCustCode] = useState(""); // Use state hook to manage custCode
  const selectCust = async (event) => {
    // Update custCode using the setCustCode function from useState
    setCustCode(event[0]?.Cust_Code);
    console.log(event[0]?.Cust_Code);
    postRequest(endpoints.rightTabledata, {
      custCode: event[0]?.Cust_Code,
    }).then((response) => {
      for (let i = 0; i < response.length; i++) {
        let datesplit = response[i].schTgtDate.split(" ");
        let ScheduleDate = datesplit[0].split("-");
        let finalDay =
          ScheduleDate[2] + "/" + ScheduleDate[1] + "/" + ScheduleDate[0];
        response[i].schTgtDate = finalDay;
      }
      for (let i = 0; i < response.length; i++) {
        let datesplit1 = response[i].Delivery_Date.split(" ");
        let Delivery_Date = datesplit1[0].split("-");
        let finalDay1 =
          Delivery_Date[2] + "/" + Delivery_Date[1] + "/" + Delivery_Date[0];
        response[i].Delivery_Date = finalDay1;
      }
      setOrderSchedule(response);
    });
  };

  useEffect(() => {}, [custCode]); // useEffect to log custCode when it changes

  //row Select for right table
  const [selectedRows, setSelectedRows] = useState([]);
  const handleCheckboxChange = (index, item) => {
    const updatedSelection = [...selectedRows];
    const selectedItemIndex = updatedSelection.findIndex(
      (selectedItem) => selectedItem.ScheduleId === item.ScheduleId
    );
    if (selectedItemIndex !== -1) {
      // If the item is already selected, remove it
      updatedSelection.splice(selectedItemIndex, 1);
    } else {
      // If the item is not selected, add it
      updatedSelection.push(item);
    }
    setSelectedRows(updatedSelection);
  };

  //set data for first table
  const [beforecombine, setBeforeCombine] = useState([]);
  const onclickofLeftShiftButton = () => {
    setBeforeCombine(selectedRows);
    setRowSelectLeft(selectedRows);
    // setSelectAllChecked1(true);
  };

  //rowselect left table
  const [rowselectleft, setRowSelectLeft] = useState([]);
  const handleCheckboxChangeLeft = (index, item) => {
    const updatedSelection1 = [...rowselectleft];
    const selectedItemIndex = updatedSelection1.findIndex(
      (selectedItem) => selectedItem.ScheduleId === item.ScheduleId
    );
    if (selectedItemIndex !== -1) {
      // If the item is already selected, remove it
      updatedSelection1.splice(selectedItemIndex, 1);
    } else {
      // If the item is not selected, add it
      updatedSelection1.push(item);
    }
    setRowSelectLeft(updatedSelection1);
  };

  //ONCLICK PrepareSchedule Button
  const [preapreScheduleData, setPrepareScheduleData] = useState([]);
  const onclickpreapreScheduleButton = () => {
    postRequest(endpoints.prepareSchedule, {
      scheduleid: rowselectleft[0].ScheduleId,
    }).then((response) => {
      setPrepareScheduleData(response);
    });
  };

  const [selectedSalesContact, setSelectedSalesContact] = useState("");
  useEffect(() => {
    // Set default value when component mounts
    if (oderSchedule.length > 0) {
      setSelectedSalesContact(oderSchedule[0]?.SalesContact || "");
    }
  }, [oderSchedule]);

  console.log("selectedSalesContact", selectedSalesContact);
  return (
    <div>
      <h4 className="title">Combined Schedule Creator</h4>

      <div className="row mt-3">
        <div className="col-md-4">
          <div>
            <label className="form-label">Customer Name</label>
            <label
              style={{
                color: "#f20707",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              *
            </label>
            {1 > 0 ? (
              <Typeahead
                id="basic-example"
                options={custdata}
                placeholder="Select Customer"
                onChange={(label, event) => selectCust(label)}
              />
            ) : (
              ""
            )}
          </div>

          <h5 style={{ marginLeft: "130px", marginTop: "15px" }}>
            Selected Schedules{" "}
          </h5>
        </div>

        <div className="col-md-4">
          <label className="form-label">Sales Contact</label>
          <select
            id="gstpan"
            className="ip-select mt-1"
            value={selectedSalesContact}
            onChange={(e) => setSelectedSalesContact(e.target.value)}
          >
            <option value="" disabled>
              Select Sales Contact
            </option>
            {salesContactList.map((item, key) => (
              <option key={key} value={item.Name}>
                {item.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Completion Date</label>
          <input
            name="Completion Date"
            type="date"
            value={displayDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <Tabs className=" tab_font mt-4">
        <Tab eventKey="prepareSchedule" title="Prepare Schedule">
          <PrepareScheduleTab
            oderSchedule={oderSchedule}
            custCode={custCode}
            rowselectleft={rowselectleft}
            setRowSelectLeft={setRowSelectLeft}
            handleCheckboxChangeLeft={handleCheckboxChangeLeft}
            beforecombine={beforecombine}
            setBeforeCombine={setBeforeCombine}
            onclickofLeftShiftButton={onclickofLeftShiftButton}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            handleCheckboxChange={handleCheckboxChange}
            preapreScheduleData={preapreScheduleData}
            setPrepareScheduleData={setPrepareScheduleData}
            onclickpreapreScheduleButton={onclickpreapreScheduleButton}
            selectedSalesContact={selectedSalesContact}
            storedDate={storedDate}
          />
        </Tab>
        <Tab
          eventKey="combinedScheduleDetails"
          title="Combine Schedule Details"
        >
          <CombinedScheduleDetailsTab
            beforecombine={beforecombine}
            preapreScheduleData={preapreScheduleData}
            salesContactList={salesContactList}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
