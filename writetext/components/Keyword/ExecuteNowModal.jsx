import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
export default function ExecuteNowModal({ target, modalref, domain }) {
    const router = useRouter();
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
                            <div><p className="modal-title">Information</p></div>
                            <div className="d-flex mb-20">
                                <p className="modal-text mb-0 mr-20 executeModalText" style={{whiteSpace: 'normal'}}>A new report is ready. Click <Link href={`#`} data-bs-dismiss="modal" onClick={() => {
                                    
                                    router.push(`/keyword/report?domain=${domain}`);
                                }}>here</Link> to view.</p>
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
