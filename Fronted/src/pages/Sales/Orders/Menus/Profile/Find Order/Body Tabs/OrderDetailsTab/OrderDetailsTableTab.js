import React from 'react'
import { Table } from 'react-bootstrap'

export default function OrderDetailsTableTab() {
  return (
    <div>
        <div className='row'>
            
            <div style={{overflowX:"scroll",overflowY:"scroll"}}>
            <Table
            striped
            className="table-data border"
            style={{ border: "1px",height:"860px"}}
          >
            <thead className="tableHeaderBGColor">
              <tr>
                <th>Select</th>
                <th style={{whiteSpace:"nowrap"}}>Drawing/Part Name</th>
                <th style={{whiteSpace:"nowrap"}}>Dwg Exists</th>
                <th>Material</th>
                <th>Operation</th>
                <th>Source</th>
                <th style={{whiteSpace:"nowrap"}}>Insp Level</th>
                <th>Tolerance</th>
                <th style={{whiteSpace:"nowrap"}}>Packing Level</th>
                <th>LOC</th>
                <th>Pierces</th>
                <th style={{whiteSpace:"nowrap"}}>JW Cost</th>
                <th style={{whiteSpace:"nowrap"}}>Mtrl Cost</th>
                <th style={{whiteSpace:"nowrap"}}>Unit Rate</th>
                <th style={{whiteSpace:"nowrap"}}>Qty Ordered</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody className="tablebody"></tbody>
          </Table>

            </div>
            
        </div>
      
    </div>
  )
}
