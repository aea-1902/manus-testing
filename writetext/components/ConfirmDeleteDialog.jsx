import React, { useImperativeHandle, useRef, useState } from "react";
import { useRouter } from "next/router";

const DeleteDialog = React.forwardRef(({ target }, ref) => {
  const router = useRouter();
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
    if (resolveDialog) resolveDialog(false); // Return "No"
    setResolveDialog(null); // Reset the state
  };

  const handleConfirm = () => {
    if (resolveDialog) resolveDialog(true); // Return "Yes"
    setResolveDialog(null); // Reset the state
  };

  // Expose the showModal function to the parent via ref
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
            <p className="modal-title">Delete email</p>
            <p className="modal-text mb-10">
              Are you sure you want to delete?
            </p>
            <div className="right">
              <button
                className="btn mr-8"
                data-bs-dismiss="modal"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DeleteDialog.displayName = 'DeleteDialog';
export function useDeleteDialog() {
  const dialogRef = useRef();

  const showDialog = async () => {
    if (dialogRef.current) {
      return dialogRef.current.showModal();
    }
  };

  return {
    DeleteDialogComponent: (
      <DeleteDialog ref={dialogRef} target="deleteModal" />
    ),
    showDialog,
  };
}
