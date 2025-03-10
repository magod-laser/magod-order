import React from 'react'
import ScheduleList from './ScheduleListTab/ScheduleList'
import ProfarmaInvoiceList from './ProfarmaInvoiceListTab/ProfarmaInvoiceList'
import MaterialPlanner from './MaterialPlannerTab/MaterialPlanner'
import { Tab, Tabs } from 'react-bootstrap'
import OrderDetails from './OrderDetailsTab/OrderDetails'

export default function FindOrderBodyTabs() {
  return (
    <div className='mt-4'>
        <Tabs>
            <Tab eventKey="orderdetails" title="Order Details">
              <OrderDetails/>
            </Tab>
            <Tab eventKey="scheduleList" title="Schedule List">
              <ScheduleList/>
            </Tab>
            <Tab eventKey="profarmaInvoiceList" title="Profarma Invoice List">
               <ProfarmaInvoiceList/>
            </Tab>
            <Tab eventKey="materialPlanner" title="Material Planner">
               <MaterialPlanner/>
            </Tab>
        </Tabs>
      
    </div>
  )
}
