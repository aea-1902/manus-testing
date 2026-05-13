import React, {useEffect, useState} from 'react'

export default function ModalGenerateKey({target,modalref,generatedKey}) {
    const [keyValue, setKeyValue] = useState('')
    function copyText(e){
        navigator.clipboard.writeText(e)

        const copyMessage = document.querySelector('.copy-message');
        // add show class to copyMessage
        copyMessage.classList.add('show');
        // remove show class after 2 seconds
        setTimeout(() => {
            copyMessage.classList.remove('show');
        }, 2000);
    }
    useEffect(() => {
        setKeyValue(generatedKey)
    }, [generatedKey])
  return (
    <div className="d-flex justify-content-center align-items-center" ref={modalref}>
        <div
        className="modal fade"
        id={target}
        tabIndex="-1"
        aria-labelledby={target}
        aria-hidden="true"
        >
        <div className="modal-dialog mtp-15 keys-modal created-key">
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
            <div className="mb-20"><p className="modal-title">New secret key created</p></div>
                {/* <div className="right"><button className="btn btn-primary" data-bs-dismiss="modal">Ok</button> </div> */}
            </div>
            <div><p className='font-14 modal-title-sub'>Copy the secret key below and store it securely. We will not display this key again. In the event that you lose copy of this key, you may generate a new secret key.</p></div>
            <div className="form-group d-flex mb-48">
                <div className="form-floating w-100">
                    <input id="key_id" className="form-control" type="text" readOnly={true} value={keyValue}/>
                    <span id="key_copy" className="key_copy" onClick={e => copyText(keyValue)}>
                    <span className="copy-message"><span></span>Copied!</span></span>
                </div>
            </div>
            
            <div className="right"> 
                <button className="btn btn-primary font-14" data-bs-dismiss="modal">Done</button>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}
