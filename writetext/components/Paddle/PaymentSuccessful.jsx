
export default function PaymentSuccessfulModal({target, modalref}) {
    
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
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                
                <div className="mb-20"><p className="modal-title">Payment successful</p></div>
                <div><p className="modal-text">Your transaction has been successfully completed. The page will reload shortly to finalize the process. If it doesn&apos;t reload automatically, you can refresh the page manually or close this dialog.</p></div>
                
                <div className="right"><button className="btn btn-primary" data-bs-dismiss="modal">Ok</button> </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  