import React from 'react';
import { useRouter } from 'next/router';

export default function ModalEnterpriseUpgrade({ target, modalref, onUpgrade, userData }) {
    const router = useRouter();

    const handleConfirm = async () => {
        try {
            // Get the customer ID from the user data
            const customerId = { customerId: userData?.id || 'default-customer-id' };
            
            if (onUpgrade) {
                await onUpgrade(customerId);
            }
            
            // Refresh the page on success
            router.reload();
        } catch (error) {
            console.error('Error upgrading to enterprise:', error);
            // You might want to show an error message to the user here
        }
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
                                <p className="modal-title">Confirm Enterprise Upgrade</p>
                            </div>
                            <div>
                                <p className="modal-text">
                                    Are you sure you want to upgrade this user to the Enterprise plan?
                                </p>
                                <p className="modal-text" style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
                                    This action will change the user&apos;s membership type to Enterprise and provide them with Enterprise-level features and support.
                                </p>
                            </div>
                            <div className="right">
                                <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleConfirm}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 