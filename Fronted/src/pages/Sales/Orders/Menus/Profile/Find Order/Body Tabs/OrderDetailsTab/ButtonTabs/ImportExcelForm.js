import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function ImportExcelForm() {
  return (
    <div>
      
        <div className='row'>
            <div className='col-md-3 col-sm-12'>
            <button  className="button-style ">Update Para</button>
            </div>
            <div className='col-md-3 col-sm-12'>
             <button  className="button-style ">Set Material</button>
            </div>
            <div className='col-md-3 col-sm-12'>
             <button  className="button-style ">Set Operation</button>
            </div>
            
        </div>

        <div className='row mt-3'>
            <div className='col-md-3 col-sm-12'>
            <button  className="button-style ">Load Excel</button>
            </div>
            <div className='col-md-3 col-sm-12'>
             <button  className="button-style ">Compare</button>
            </div>
            <div className='col-md-3 col-sm-12'>
                <Link to="/Orders/Profile/FindOrder/ScheduleCreationForm"><button  className="button-style ">Load to Order</button></Link>
            </div>
        </div>

        <div className='row mt-3'>
            <div className='col-md-1 col-sm-12'>
             <label className="form-label" style={{whiteSpace:"nowrap"}}>Order Total</label>
            </div>
            <div className='col-md-1 col-sm-12'>
                <input type='number'/>
            </div>
        </div>

        <div>
        <Table striped
              className="table-data border mt-2"
              style={{ border: "1px",height:"200px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th>Drawing Name</th>
                  <th>Mtrl Code</th>
                  <th>Source</th>
                  <th>Operation</th>
                  <th>Order Qty</th>
                  <th>JW Cost</th>
                  <th>Mtrl Cost</th>
                  <th>Unit Price</th>
                </tr>
              </thead>
              <tbody className="tablebody"></tbody>
            </Table>

        </div>
      
    </div>
  )
}
