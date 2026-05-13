import React from 'react';

export default function DeleteConfirmationModal({ target, modalref, onDelete }) {
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
                            <div><p className="modal-title">Delete template</p></div>
                            <div style={{marginBottom: '54px'}}>
                                <p className="modal-text mb-10">Are you sure you want to delete this template?</p>
                            </div>
                            <div className="right">
                                <button className="btn mr-8" data-bs-dismiss="modal" style={{height: '44px', width: '91px'}}>Cancel</button>
                                <button className="btn btn-danger" data-bs-dismiss="modal" onClick={onDelete} style={{height: '44px', width: '91px'}}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 