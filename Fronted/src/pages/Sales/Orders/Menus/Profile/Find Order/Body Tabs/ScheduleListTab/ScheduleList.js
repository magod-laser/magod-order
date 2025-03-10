import React, { useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AlertModal from '../../../Components/Alert';

export default function ScheduleList() {
  let [alertModal, setAlertModal] = useState(false);

  let openModal = (e) => {
    e.preventDefault();
    setAlertModal(true);
  };

  let closeModal = () => {
    setAlertModal(false);
  };
  return (
    <div>
        <div className='row mt-3'>
            <div className='col-md-2 col-sm-12'>
              <button className="button-style " onClick={openModal}>Delete Schedule</button>
            </div>
            <div className='col-md-2 col-sm-12'>
               <Link to={"/Orders/FindSchedule"}><button className="button-style ">Open Schedule</button></Link>
            </div>
        </div>
      
      <div className='row  mt-3'>
        <div className='col-md-5 col-sm-12' style={{overflowY: "scroll" }}>
        <Table
            striped
            className="table-data border "
            style={{ border: "1px", height: "400px" }}
          >
            <thead className="tableHeaderBGColor">
              <tr>
                <th>Type</th>
                <th>No</th>
                <th>Status</th>
                <th>Delivery</th>
                <th></th>               
              </tr>
            </thead>
            <tbody className="tablebody"></tbody>
          </Table>

        </div>
        <div className='col-md-7 col-sm-12' style={{overflowY: "scroll" }}>
        <Table
            striped
            className="table-data border"
            style={{ border: "1px", height: "400px", overflowY: "scroll" }}
          >
            <thead className="tableHeaderBGColor">
              <tr>
                <th>Dwg Name</th>
                <th>Mtrl Code</th>
                <th>Operation</th>
                <th>Scheduled</th>
                <th>Produced</th>
                <th>Packed</th>  
                <th>Delivered</th> 
                <th>JW Cost</th>  
                <th>Mtrl Cost</th>          
              </tr>
            </thead>
            <tbody className="tablebody"></tbody>
          </Table>
        </div>

      </div>
      <AlertModal
        show={alertModal}
        onHide={(e) => setAlertModal(e)}
        firstbutton={closeModal}
        title="magod_Order"
        message="Select Draft Schedules to Delete"
        firstbuttontext="Ok"
      />
    </div>
  )
}
