//this is the modal that is used to execute the keyword check

import React from 'react';
import Image from 'next/image';

export default function ExecuteModal({ target, modalref, date }) {
    return (
        <div className="d-flex justify-content-center align-items-center" ref={modalref}>
            <div
          className="modal fade"
          id={target}
          tabIndex="-1"
          aria-labelledby={target}
          aria-hidden="true"
            >
        <div className="modal-dialog mtp-15">
            <div className="modal-content">
              <div className="modal-header">
                <div className="close-btn-container">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button></div>
              </div>
              <div className="modal-body">
                <div><p className="modal-title">Information</p></div>
                <div className="d-flex mb-20">
                  <p className="modal-text mb-0 mr-20 executeModalText">The keyword check would run on {date}. If you want to run it now, click the &quot;Execute now&quot; button.</p>
                </div>
                <div className="right">
                    <button className="btn btn-primary" data-bs-dismiss="modal">OK</button> 
                </div>
              </div>
            </div>
          </div>
            </div>
        </div>
    );
}