import React from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import ProductionScheduleCreationTab from './ProductionScheduleCreationTab'
import FindOldPart from './FindOldPart'
import MaterialInfo from './MaterialInfo'
import OrderInfo from './OrderInfo'

export default function FindOrderHeaderTabs() {
  return (
    <div className='mt-4'>
        <Tabs>
            <Tab eventKey="orderInfo" title="Order Info">
                <OrderInfo/>
            </Tab>
            <Tab eventKey="productionScheduleCreation" title="Production Schedule Creation">
               <ProductionScheduleCreationTab/>
            </Tab>
            <Tab eventKey="findOldPart" title="Find Old Part">
                <FindOldPart/>
            </Tab>
            <Tab eventKey="materialInfo" title="Material Info">
                 <MaterialInfo/>
            </Tab>
        </Tabs>
      
    </div>
  )
}
