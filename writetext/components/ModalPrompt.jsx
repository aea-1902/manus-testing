import Image from "next/image"
import { useRouter } from 'next/router'
export default function ModalPrompt({target, modalref, prompt, hasChanges = true}) {
  const router = useRouter()
    let title = ""
    let text = ""
    
    if (target=="installation")
    {
      title = "";
        text="Payment has been confirmed! Kindly wait for an email with instructions on how to proceed with the next steps."
    }
    else if (target == "prompt")
    {
      title = ""
      text = `${prompt} has been updated.`
    }
    else
    {
      title = "Update";
      text = hasChanges ? "Details successfully updated." : "No changes were made.";
    }
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
                <div className="d-flex mb-20">
                  {target == "installation" || target == "prompt" ?
                  <p className="succes-payment-icon"><Image src="/images/ic_success.svg" height={30} width={30}></Image></p> : null}
                  <p className="modal-text mb-0 mr-20">{text}</p>
                  </div>
                {router.pathname.toLowerCase() == "/account" && <div className="right"><button className="btn btn-primary" data-bs-dismiss="modal" onClick={()=> router.reload()}>Ok</button> </div>}
                {router.pathname.toLowerCase() != "/account" && <div className="right"><button className="btn btn-primary" data-bs-dismiss="modal">OK</button> </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  