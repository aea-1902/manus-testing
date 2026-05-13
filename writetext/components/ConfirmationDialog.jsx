import React, { useImperativeHandle, useRef, useState } from "react";

const ConfirmationDialog = React.forwardRef(({ target, title, message, confirmText = "Yes", cancelText = "Cancel" }, ref) => {
  const modalRef = useRef(null);
  const [resolveDialog, setResolveDialog] = useState(null);

  const showModal = () => {
    const { Modal } = require("bootstrap")
    const modal = new Modal(modalRef.current);
    modal.show();

    return new Promise((resolve) => {
      setResolveDialog(() => resolve);
    });
  };

  const handleCancel = () => {
    if (resolveDialog) resolveDialog(false);
    setResolveDialog(null);
  };

  const handleConfirm = () => {
    if (resolveDialog) resolveDialog(true);
    setResolveDialog(null);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  return (
    <div
      className="modal fade"
      id={target}
      tabIndex="-1"
      ref={modalRef}
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
              onClick={handleCancel}
            ></button>
          </div>
          <div className="modal-body">
            <p className="modal-title">{title}</p>
            <p className="modal-text mb-10">{message}</p>
            <div className="right">
              <button
                className="btn mr-8"
                data-bs-dismiss="modal"
                onClick={handleCancel}
              >
                {cancelText}
              </button>
              <button
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ConfirmationDialog.displayName = 'ConfirmationDialog';

export function useConfirmationDialog() {
  const dialogRef = useRef();

  const showDialog = async () => {
    if (dialogRef.current) {
      return dialogRef.current.showModal();
    }
  };

  return {
    ConfirmationDialogComponent: (
      <ConfirmationDialog ref={dialogRef} target="confirmationModal" />
    ),
    showDialog,
  };
} 