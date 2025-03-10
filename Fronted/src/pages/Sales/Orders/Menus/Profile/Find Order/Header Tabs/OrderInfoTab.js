import React from 'react'

export default function OrderInfoTab() {
  return (
    <div>
        <Form className="form mt-2">
        <div className="ip-box ">
        <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4 mb-2 col-sm-12">
                  <label className="form-label">Order Type</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    
                    type="text"
                    style={{ borderRadius: "0" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-4  mb-2 col-sm-12">
                  <label className="form-label">Delivery Date</label>
                </div>
                <div className="col-md-8  mb-2 col-sm-12">
                  <input
                    
                    type="text"
                    style={{ borderRadius: "0" }}
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
            
        </Form>
      
    </div>
  )
}
