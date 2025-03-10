import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../api/constants";
import { getRequest } from "../../../api/apiinstance";

export default function CombinedScheduleListClosed({ type }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  console.log("type closed form is", type);
  const navigate = useNavigate();

  // sorting function for table headings of the table
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...scheduleListClosed];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (sortConfig.key === "JW_Rate" || sortConfig.key === "Mtrl_rate") {
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

  //ScheduleList Orders
  const [scheduleListClosed, setScheduleListClosed] = useState([]);
  const getScheduleListData = () => {
    if (type === "JobWork") {
      getRequest(endpoints.ScheduleListClosed, (response) => {
        console.log(response);
        setScheduleListClosed(response);
      });
    } else {
      getRequest(endpoints.ScheduleListClosedSales, (response) => {
        console.log(response);
        setScheduleListClosed(response);
      });
    }
  };

  useEffect(() => {
    getScheduleListData();
  }, []);

  //row select
  const [selectedRow, setSelectedRow] = useState({});
  const rowSelectFunc = (item, index) => {
    let list = { ...item, index: index };
    setSelectedRow(list);
  };

  // console.log(selectedRow);

  const handleClick = () => {
    const path =
      type === "JobWork"
        ? "/Orders/JobWork/ScheduleList/Closed/OpenDetailForm"
        : "/Orders/Sales/ScheduleList/Closed/OpenDetailForm";

    navigate(path, { state: { selectedRow: selectedRow } });
  };

  return (
    <div>
      <h4 className="title">Combined Schedule List</h4>
      <div className="">
        <button className="button-style" onClick={handleClick}>
          Open
        </button>
      </div>
      <div className="mt-1" style={{ overflowY: "scroll" }}>
        <Table
          striped
          className="table-data border"
          style={{ border: "1px", height: "350px", overflowY: "scroll" }}
        >
          <thead className="tableHeaderBGColor">
            <tr>
              {/* <th>Selected</th> */}
              <th onClick={() => requestSort("OrdSchNo")}>Schedule No</th>
              <th onClick={() => requestSort("Cust_name")}>Customer</th>
              <th onClick={() => requestSort("schTgtDate")}>Target Date</th>
              <th onClick={() => requestSort("Delivery_Date")}>
                Delivary Date
              </th>
              <th onClick={() => requestSort("Schedule_Status")}>Status</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData().map((item, key) => {
              return (
                <>
                  <tr
                    onClick={() => rowSelectFunc(item, key)}
                    className={
                      key === selectedRow?.index ? "selcted-row-clr" : ""
                    }
                  >
                    {" "}
                    {/* <td>
                      <input type="checkbox" />
                    </td> */}
                    <td>{item.OrdSchNo}</td>
                    <td>{item.Cust_name}</td>
                    <td>
                      {new Date(item.schTgtDate).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      {new Date(item.Delivery_Date).toLocaleDateString("en-GB")}
                    </td>
                    <td>{item.Schedule_Status}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
