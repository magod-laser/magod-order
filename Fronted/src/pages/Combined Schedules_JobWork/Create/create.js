import React, { useEffect, useState } from "react";
import PrepareScheduleTab from "./PrepareScheduleTab";
import CombinedScheduleDetailsTab from "./CombinedScheduleDetailsTab";
import { Form, Tab, Tabs } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { getRequest, postRequest } from "../../api/apiinstance";
import { endpoints } from "../../api/constants";

export default function Create({ type }) {
  //disable button

  const [disablebutton, setDisableButton] = useState(true);

  console.log("disablebutton is", disablebutton);

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

  //set data for first table
  const [beforecombine, setBeforeCombine] = useState([]);
  const onclickofLeftShiftButton = () => {
    setBeforeCombine(selectedRows);
    setRowSelectLeft(selectedRows);
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
  const [custName, setCustName] = useState("");
  const selectCust = async (event) => {
    // Update custCode using the setCustCode function from useState
    setCustCode(event[0]?.Cust_Code);
    setCustName(event[0]?.Cust_name);
    postRequest(
      endpoints.rightTabledata,
      {
        custCode: event[0]?.Cust_Code,
      },
      (response) => {
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
        setPrepareScheduleData([]);
        setBeforeCombine([]);
        setSelectedRows([]);
      }
    );
  };

  useEffect(() => {}, [custCode]);

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
  const [rowSelectEnable, setRowSelectEnable] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState({});
  const [preapreScheduleData, setPrepareScheduleData] = useState([]);
  const onclickpreapreScheduleButton = () => {
    setRowSelectEnable(true);
    postRequest(
      endpoints.prepareSchedule,
      {
        ScheduleId: selectedRowIndex?.ScheduleId,
      },
      (response) => {
        setPrepareScheduleData(response);
        setDisableButton(false);
      }
    );
  };

  const [selectedSalesContact, setSelectedSalesContact] = useState("");
  useEffect(() => {
    // Set default value when component mounts
    if (oderSchedule.length > 0) {
      setSelectedSalesContact(oderSchedule[0]?.SalesContact);
    }
  }, [oderSchedule]);

  //sales
  const [beforecombineSales, setBeforeCombineSales] = useState([]);

  return (
    <div>
      <h4 className="title">Combined Schedule Creator</h4>

      <div className="row">
        <div className="col-md-4">
          {type === "JobWork" ? (
            <div className="d-flex field-gap">
              <label className="form-label label-space">
                Customer Name{" "}
                <span
                  style={{
                    color: "#f20707",
                    fontWeight: "bold",
                  }}
                >
                  *
                </span>
              </label>

              {1 > 0 ? (
                <Typeahead
                  className="ip-select mt-1"
                  id="basic-example"
                  options={custdata}
                  placeholder="Select Customer"
                  onChange={(label, event) => selectCust(label)}
                />
              ) : (
                ""
              )}
            </div>
          ) : null}
          <label className="form-label">Selected Schedules </label>
        </div>

        <div className="d-flex col-md-4 field-gap">
          <label className="form-label label-space">Sales Contact</label>
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

        <div className="d-flex field-gap col-md-4">
          <label className="form-label label-space">Completion Date</label>
          <input
            className="in-field mt-1"
            name="Completion Date"
            type="date"
            value={displayDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <Tabs className="nav-tabs tab_font mt-1">
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
            type={type}
            setOrderSchedule={setOrderSchedule}
            beforecombineSales={beforecombineSales}
            setBeforeCombineSales={setBeforeCombineSales}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            rowSelectEnable={rowSelectEnable}
            setRowSelectEnable={setRowSelectEnable}
            disablebutton={disablebutton}
            setDisableButton={setDisableButton}
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
            custName={custName}
            type={type}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
