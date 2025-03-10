import React from 'react'
import { Form } from 'react-bootstrap'

import { Button, Modal } from 'react-bootstrap'

export default function ImportParameters({setImportParameters, importParameters}) {

  const handleClose=()=>{
    setImportParameters(false)
  }
  return (
    <div>
        <Modal show={importParameters}>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title><b>Import Parameters</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>   
            <h5><b>Enter Default Parameters for Import</b></h5>
        <Form>
            <div className='row'>
                <div className='col-md-4 col-sm-12'>
                   <label  className="form-label">Material Code</label>
                </div>
                <div className='col-md-6 col-sm-12'>
                <select id="" className="ip-select">
                    <option value="option1">option 1</option>
                    <option value="option2">option 2</option>
                    <option value="option3">option 3</option>
                  </select>
                </div>
                <div className='col-md-2 col-sm-12 mt-3'>
                <input type="checkbox" className="checkBoxStyle" />
                </div>
            </div>

            <div className='row'>
                <div className='col-md-4 col-sm-12'>
                   <label  className="form-label">Process</label>
                </div>
                <div className='col-md-6 col-sm-12'>
                <select id="" className="ip-select">
                    <option value="option1">option 1</option>
                    <option value="option2">option 2</option>
                    <option value="option3">option 3</option>
                  </select>
                </div>
                <div className='col-md-2 col-sm-12 mt-3'>
                <input type="checkbox" className="checkBoxStyle" />
                </div>
            </div>

            <div className='row'>
                <div className='col-md-4 col-sm-12'>
                   <label  className="form-label">Source</label>
                </div>
                <div className='col-md-6 col-sm-12'>
                <select id="" className="ip-select">
                    <option value="option1">option 1</option>
                    <option value="option2">option 2</option>
                    <option value="option3">option 3</option>
                  </select>
                </div>
                <div className='col-md-2 col-sm-12 mt-3'>
                <input type="checkbox" className="checkBoxStyle" />
                </div>
            </div>
            <div className='row'>
                <div className='col-md-4 col-sm-12'>
                   <label  className="form-label">Tolerance</label>
                </div>
                <div className='col-md-6 col-sm-12'>
                <select id="" className="ip-select">
                    <option value="option1">option 1</option>
                    <option value="option2">option 2</option>
                    <option value="option3">option 3</option>
                  </select>
                </div>
                <div className='col-md-2 col-sm-12 mt-3'>
                <input type="checkbox" className="checkBoxStyle" />
                </div>
            </div>

            <div className='row'>
                <div className='col-md-4 col-sm-12'>
                   <label  className="form-label">Insp Level</label>
                </div>
                <div className='col-md-6 col-sm-12'>
                <select id="" className="ip-select">
                    <option value="option1">option 1</option>
                    <option value="option2">option 2</option>
                    <option value="option3">option 3</option>
                  </select>
                </div>
                <div className='col-md-2 col-sm-12 mt-3'>
                <input type="checkbox" className="checkBoxStyle" />
                </div>
            </div>

            <div className='row'>
                <div className='col-md-4 col-sm-12'>
                   <label  className="form-label">Packing Level</label>
                </div>
                <div className='col-md-6 col-sm-12'>
                <select id="" className="ip-select">
                    <option value="option1">option 1</option>
                    <option value="option2">option 2</option>
                    <option value="option3">option 3</option>
                  </select>
                </div>
                <div className='col-md-2 col-sm-12 mt-3'>
                <input type="checkbox" className="checkBoxStyle" />
                </div>
            </div>

            <div className='row'>
                <div className='col-md-4 col-sm-12'>
                   <label  className="form-label">Quantity</label>
                </div>
                <div className='col-md-6 col-sm-12'>
                <input type='text'/>
                </div>
                <div className='col-md-2 col-sm-12 mt-3'>
                <input type="checkbox" className="checkBoxStyle" />
                </div>
            </div>

            <div className='row'>
                <div className='col-md-4 col-sm-12'>
              <label  className="form-label">Rate Cutting</label>
                </div>
                <div className='col-md-2 col-sm-12'>
                <input type='number'/>
                </div>
                <div className='col-md-4 col-sm-12'>
                <label  className="form-label">Piercing</label>
                </div>
                <div className='col-md-2 col-sm-12' style={{marginLeft:"-80px"}}>
                <input type='number'/>
                </div>
            </div>
            <div className=" row justify-content-center mt-3">
        <button className="button-style " style={{width:"100px"}}>Ok</button>
        </div>
            
        </Form>
        </Modal.Body>
        {/* <Modal.Footer>
        
        <div className=" row justify-content-center">
          
        </div>
        <div className=" row justify-content-center">
        
        </div>
        </Modal.Footer> */}
      </Modal>
      
    </div>
  )
}
