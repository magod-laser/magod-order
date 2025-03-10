import React from "react";
import { Form, Tabs, Tab } from "react-bootstrap";
import PrepareSchedule from "./Components/PrepareSchedule";
import CombinedScheduleDetails from "./Components/CombinedScheduleDetails";

function SalesScheduleCreator() {
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <Form.Group>
            <Form.Label>
              Magod Laser: Combined Sales Schedule Creator
            </Form.Label>
          </Form.Group>
        </div>

        <div className="col-md-6">
          <div className="row">
            <div className="col-md-4 mb-2 col-sm-12">
              <label className="form-label">Sales Contact</label>
            </div>

            <div className="col-md-8  mb-2 col-sm-12">
              <Form.Select id="" className="ip-select">
                <option value="option1">option 1</option>
                <option value="option2">option 2</option>
                <option value="option3">option 3</option>
              </Form.Select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-2 col-sm-12">
              <label className="form-label">Completion Date</label>
            </div>

            <div className="col-md-8  mb-2 col-sm-12">
              <input
                className="in-fields mt-2"
                name="UnistallDate"
                type="date"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div>
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className=" tab_font mt-4"
          >
            <Tab
              eventKey="home"
              title="  Prepare Schedule"
              style={{ margin: "0px" }}
            >
              <PrepareSchedule />
            </Tab>
            <Tab eventKey="profile" title=" Combined Schedule Details">
              <CombinedScheduleDetails />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default SalesScheduleCreator;
