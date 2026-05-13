import React from 'react';

const H1Popup = ({target, modalref, templateType}) => {
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
            <div><p className="modal-title">Heads up!</p></div>
            <div>
              {!templateType.toLowerCase().includes('category') && <p className="modal-text">Before adding an H1 to your template, check if the product page already includes one (e.g., product title). Multiple H1 tags can negatively impact SEO.</p>}
              {templateType.toLowerCase().includes('category') && <p className="modal-text">Before adding an H1 to your template, check if the category page already includes one (e.g., category title). Multiple H1 tags can negatively impact SEO.</p>}
            </div>
            <div className="right"><button className="btn btn-primary" data-bs-dismiss="modal">I understand</button> </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default H1Popup;
