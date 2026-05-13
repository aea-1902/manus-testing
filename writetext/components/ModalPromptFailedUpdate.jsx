
export default function ModalPromptFailedUpdate({target, modalref, errorMessage}) {
    let title = ""

    title = "There is a problem updating your account.";
    if (errorMessage != '')
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
                <div><p className="modal-title">{title}</p></div>
                <div><p className="modal-text">{errorMessage}</p></div>
                <div className="right"><button className="btn btn-danger" data-bs-dismiss="modal">Ok</button> </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  