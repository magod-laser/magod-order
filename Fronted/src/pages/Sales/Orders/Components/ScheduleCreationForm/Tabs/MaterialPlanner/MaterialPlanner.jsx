import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Table } from "react-bootstrap";
export default function MaterialPlanner() {
  return (
    <>
      <div>
        <div className="row justify-content-center">
          <div className="col-md-2 col-sm-12">
            <button className="button-style "> Create DXF WS</button>
          </div>
          <div className="col-md-2 col-sm-12">
            <button className="button-style ">Create Parts WS</button>
          </div>
          <div className="col-md-2 col-sm-12">
            <button className="button-style ">Read WS</button>
          </div>
          <div className="col-md-2 col-sm-12">
            <button className="button-style ">Print Estimate</button>
          </div>
          <div className="mt-1" style={{ overflowY: "scroll" }}>
            <Table
              striped
              className="table-data border"
              style={{ border: "1px", height: "200px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th>Task No</th>
                  <th>Material</th>
                  <th>Source</th>
                  <th>Operation</th>
                  <th>Dwgs</th>
                  <th>Total Parts</th>
                </tr>
              </thead>
              <tbody className="tablebody">
                <tr>
                  <th>Task No</th>
                  <th>Material</th>
                  <th>Source</th>
                  <th>Operation</th>
                  <th>Dwgs</th>
                  <th>Total Parts</th>
                </tr>{" "}
                <tr>
                  <th>Task No</th>
                  <th>Material</th>
                  <th>Source</th>
                  <th>Operation</th>
                  <th>Dwgs</th>
                  <th>Total Parts</th>
                </tr>{" "}
                <tr>
                  <th>Task No</th>
                  <th>Material</th>
                  <th>Source</th>
                  <th>Operation</th>
                  <th>Dwgs</th>
                  <th>Total Parts</th>
                </tr>
                {/* {ordCustTaskData.length > 0 ? (
                          ordCustTaskData.map((ordcusttask, index) => {
                            return (
                              <tr
                                key={ordcusttask.index}
                                onClick={() => selectItem(ordcusttask)}
                              >
                                <td>{ordcusttask["TaskNo"]}</td>
                                <td>{ordcusttask["Mtrl_Code"]}</td>
                                <td>{ordcusttask["CustMtrl"]}</td>
                                <td>{ordcusttask["Operation"]}</td>
                                <td>{ordcusttask["NoOfDwgs"]}</td>
                                <td>{ordcusttask["TotalParts"]}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colspan={6}>No Items Added</td>
                          </tr>
                        )} */}
              </tbody>
            </Table>
          </div>

          <div className="d-flex mt-1 field-gap">
            <div className="col-md-4 col-sm-12">
              <Table
                striped
                className="table-data border"
                style={{
                  border: "1px",
                  height: "155px",
                  overflowY: "scroll",
                }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th>Length(mm)</th>
                    <th>Width(mm)</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody className="tablebody">
                  <tr>
                    <th>Length(mm)</th>
                    <th>Width(mm)</th>
                    <th>Quantity</th>
                  </tr>{" "}
                  <tr>
                    <th>Length(mm)</th>
                    <th>Width(mm)</th>
                    <th>Quantity</th>
                  </tr>{" "}
                  <tr>
                    <th>Length(mm)</th>
                    <th>Width(mm)</th>
                    <th>Quantity</th>
                  </tr>
                  {/* {ordDimensData.length > 0 ? (
                            ordDimensData.map((orddimens, index) => {
                              return (
                                <tr
                                  key={orddimens.index}
                                  onClick={() => selectItem(orddimens)}
                                >
                                  <td>{orddimens["Length"]}</td>
                                  <td>{orddimens["Width"]}</td>
                                  <td>{orddimens["Quantity"]}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colspan={3}>No Items Added</td>
                            </tr>
                          )} */}
                </tbody>
              </Table>
            </div>
            <div className="col-md-4 col-sm-12">
              <Form>
                <div className="ip-box form-bg">
                  <label className="form-label">Task No</label>

                  <div className="row">
                    <div className="col-md-2">
                      <div>
                        <label className="form-label">Length</label>
                      </div>
                      <div>
                        <label className="form-label">Width</label>
                      </div>
                      <div>
                        <label className="form-label">Quantity</label>
                      </div>
                    </div>
                    <div className="col-md-10">
                      <div>
                        <input className="input-field" type="text" />
                      </div>
                      <div>
                        <input className="input-field" type="text" />
                      </div>
                      <div>
                        <input className="input-field mb-4" type="text" />
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
