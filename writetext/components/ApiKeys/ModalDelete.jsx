import Image from "next/image"
import { useRouter } from 'next/router'
export default function ModalDelete({target, modalref, prompt, onDelete}) {
  const router = useRouter()
    let title = "Delete token"
    
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
                ></button></div>
              </div>
              <div className="modal-body">
                <div><p className="modal-title">{title}</p></div>
                <div className="mb-20">
                  <p className="modal-text mb-10">Are you sure you want to delete this token?</p>
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
  