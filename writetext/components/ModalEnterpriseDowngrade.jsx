import React from 'react';
import { useRouter } from 'next/router';

export default function ModalEnterpriseDowngrade({ target, modalref }) {
    const router = useRouter();

    const handleConfirm = () => {
        // Refresh the page
        router.reload();
    };

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
                            <div>
                                <p className="modal-title">Confirm downgrade</p>
                            </div>
                            <div>
                                <p className="modal-text">
                                    This will downgrade the user from Enterprise to their previous plan-either Starter or Pro, depending on their subscription history. Once downgraded, they&apos;ll lose access to Enterprise features such as unlimited credits, priority support, and full automation.
                                </p>
                                <p className="modal-text" style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
                                    Are you sure you want to proceed?
                                </p>
                            </div>
                            <div className="right">
                                <button className="btn mr-8" data-bs-dismiss="modal">Cancel</button>
                                <button className="btn btn-danger" data-bs-dismiss="modal" onClick={handleConfirm}>Yes, downgrade user</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 