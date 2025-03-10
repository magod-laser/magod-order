import React from 'react'
import OrderDetailsTableTab from './OrderDetailsTableTab'
import DrawingTab from './DrawingTab'
import OrderDetailsFormTab from './OrderDetailsFormTab'
import { Tab, Tabs } from 'react-bootstrap'
import ImportParameters from './ButtonTabs/ImportParameters'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ImportOldOrder from './ButtonTabs/ImportOldOrder'

export default function OrderDetails() {

  let [importParameters, setImportParameters] = useState(false);

  let openModal1 = (e) => {
    e.preventDefault();
    setImportParameters(true);
  };

  let closeModal1 = () => {
    setImportParameters(false);
  };

  let [importOldOrder, setImportOldOrder] = useState(false);

  let openModal2 = (e) => {
    e.preventDefault();
    setImportOldOrder(true);
  };

  let closeModal2 = () => {
    setImportOldOrder(false);
  };



  return (
    <div>
      <div className='row mt-2'>
      <div className='col-md-2 mt-2 col-sm-12'>
            <button className="button-style" onClick={openModal1}>Import DWG</button>
            </div>
            <div className='col-md-2 mt-2 col-sm-12'>
              <Link to="/Orders/Profile/FindOrder/ImportExcelForm"><button className="button-style " >Import EXCEL</button></Link>
            </div>
            <div className='col-md-2 mt-2 col-sm-12'>
              <Link to="/Orders/Profile/FindOrder/ImportQtn"> <button className="button-style ">Import Qtn</button></Link>
            </div>
            <div className='col-md-2 mt-2 col-sm-12'>
            <button className="button-style " onClick={openModal2}>Import Old Order</button>
            </div>
            <div className='col-md-2 mt-2 col-sm-12'>
            <button className="button-style " >Delete</button>
            </div>
            <div className='col-md-2 mt-2 col-sm-12'>
            <button className="button-style " onClick={openModal1}>Bulk Change</button>
            </div>
            <div className='col-md-2 mt-2 col-sm-12'>
            <button className="button-style ">Select All</button>
            </div>
            <div className='col-md-2 mt-2 col-sm-12'>
            <button className="button-style " >Reverse</button>
            </div>
            <div className='col-md-2 mt-2 col-sm-12'>
              <Link to={"/Orders/Profile/FindOrder/EditDXF"}><button className="button-style " >Edit Dxf</button></Link>   
            </div>
      </div>
        <div className='row mt-4'>
            <div className='col-md-6 col-sm-12'>
              <OrderDetailsTableTab/>
            </div >
            <div className='col-md-6 col-sm-12'>
              <Tabs>
                <Tab eventKey="drawing" title="Drawing">
                    <DrawingTab/>
                </Tab>
                <Tab eventKey="orderDetailsForm" title="Order Details">
                    <OrderDetailsFormTab/>
                </Tab>
              </Tabs>
            </div>

        </div>
         
      <ImportParameters
      importParameters={importParameters}
      setImportParameters={setImportParameters}
      // onHide={(e) => setImportParameters(e)}
      firstbutton={closeModal1}
      // title="magod_findOrder"
      //  firstbuttontext="Ok"
       />

      <ImportOldOrder
      importOldOrder={importOldOrder}
      setImportOldOrder={setImportOldOrder}
      firstbutton={closeModal2}/>
    </div>
  )
}
