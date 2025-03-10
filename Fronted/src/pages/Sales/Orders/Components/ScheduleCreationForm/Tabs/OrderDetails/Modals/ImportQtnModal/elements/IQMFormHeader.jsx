import React, { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";

export default function IQMFormHeader(props) {
  return (
    <>
      <div className="row">
        <div className="d-flex field-gap col-md-3">
          <label className="form-label label-space">Quotation No</label>
          <Typeahead
            className="ip-select in-field"
            id=""
            options={props.qtnListData}
            placeholder="Select any option"
            onChange={(selected) => {
              props.setSelectedQtn(selected[0]);
              props.handleChangeQtn(selected[0]?.QtnID || "");
            }}
          />
        </div>
        <div className="d-flex field-gap col-md-5">
          <label className="form-label label-space">Customer Name</label>
          <input
            value={props.selectedQtn?.CustomerName}
            disabled
            className="in-field"
          />
        </div>
        <div className="d-flex field-gap col-md-2">
          <label className="form-label label-space">Quotation Type</label>
          <input
            value={props.selectedQtn?.QtnType}
            disabled
            className="in-field"
          />
        </div>
        <div className="d-flex field-gap col-md-2">
          <label className="form-label label-space">Valid UpTo</label>
          <input
            value={props.selectedQtn?.Printable_ValidUpTo}
            disabled
            className="in-field"
          />
        </div>
      </div>
    </>
  );
}
