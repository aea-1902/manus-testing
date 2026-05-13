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
                            <div className="mb-20">
                                <p className="modal-text mb-10"><b>Warning:</b> Deleting this webshop will permanently remove all associated keyword tracking reports. This action cannot be undone. Please confirm that you want to proceed.</p>
                            </div>
                            <div className="right">
                                <button className="btn mr-8" data-bs-dismiss="modal">Cancel</button>
                                <button className="btn btn-danger" data-bs-dismiss="modal" onClick={onDelete}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 