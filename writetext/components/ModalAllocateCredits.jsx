import React from 'react'
import Image from 'next/image'

export default function ModalAllocateCredits({ target, modalref, onConfirm, credits, price, tax, invoiceNumber }) {
  const SSR = typeof window === 'undefined'
  
  if (SSR) return null

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
              <div className='close-btn-container'>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
            </div>
            <div className="modal-body">
              <div>
                <p className="modal-title">Allocate Credits</p>
              </div>
              <div>
                <p className="modal-text">
                  Are you sure you want to allocate <strong>{credits}</strong> credits for <strong>USD {price}</strong>?
                  {tax && parseFloat(tax) > 0 && ` (Tax: USD ${tax})`}
                  {invoiceNumber && ` (Invoice: ${invoiceNumber})`}
                </p>
              </div>
              <div className="right">
                <button className="btn mr-8" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-primary" onClick={onConfirm} data-bs-dismiss="modal">Allocate Credits</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 