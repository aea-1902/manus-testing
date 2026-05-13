import React from 'react';

export default function ModalCreditsRequired({ target, modalref }) {
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
                                ></button>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div><p className="modal-title">Action required</p></div>
                            <div><p className="modal-text">No. of credits required</p></div>
                            <div className="right"><button className="btn btn-danger" data-bs-dismiss="modal">OK</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 