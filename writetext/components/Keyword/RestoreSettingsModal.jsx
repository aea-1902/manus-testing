import React, { useState, useEffect } from 'react';
import styles from "../../styles/styling/Keyword.module.css";
import Link from 'next/link';
import { isValidUrl, addHttps } from '../../utils/helper';

const RestoreSettingsModal = ({ target, modalref, show, onHide, onRestore, deletedSettings }) => {
    const [selectedSettings, setSelectedSettings] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (show) {
            // Reset selections when modal is shown
            setSelectedSettings([]);
            setSelectAll(false);
        }
    }, [show]);

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            setSelectedSettings(deletedSettings.map(setting => setting));
        } else {
            setSelectedSettings([]);
        }
    };

    const handleSelectSetting = (row) => {
        const newSelectedSettings = [...selectedSettings];
        if (newSelectedSettings.includes(row)) {
            newSelectedSettings.splice(newSelectedSettings.indexOf(row), 1);
        } else {
            newSelectedSettings.push(row);
        }
        setSelectedSettings(newSelectedSettings);

        if (newSelectedSettings.length == 0) {
            setSelectAll(false);
        }
        else {
            setSelectAll(true);
        }
    };

    const handleRestore = async () => {
        onRestore(selectedSettings);
        // clear the selected settings
        setSelectedSettings([]);
        const modalElement = document.getElementById(target);
        const { Modal } = require("bootstrap");
        const modal = Modal.getInstance(modalElement);
        modal.hide();
        setSelectAll(false);
    };


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
                        <div className="mb-20"><p className="modal-title">Restore domains</p></div>
                        {deletedSettings.length === 0 ? (
                            <div className="text-center">
                                <p>No deleted settings found.</p>
                            </div>
                        ) : (
                            <>
                                <table className={`table`}>
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                    className={`${styles.checkboxSelectAll} ${selectedSettings.length == deletedSettings.length ? styles.all : styles.partial}`}
                                                />
                                            </th>
                                            <th>Domain</th>
                                            <th style={{textAlign: 'center'}}>Country</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deletedSettings.map((setting, index) => (
                                            <tr key={index} style={{border: 'transparent'}}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSettings.includes(setting)}
                                                        onChange={() => handleSelectSetting(setting)}
                                                        className={styles.checkbox}
                                                    />
                                                </td>
                                                <td>
                                                    {isValidUrl(setting.domain) ? 
                                                        <Link href={addHttps(setting.domain)} target="_blank" rel="noopener noreferrer">
                                                            {setting.domain}
                                                        </Link> : 
                                                        setting.domain
                                                    }
                                                </td>
                                                <td style={{textAlign: 'center'}}>{setting.countryCode}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-end" style={{marginTop: '48px'}}>
                                    <button className="btn me-2" data-bs-dismiss="modal">Cancel</button>
                                    <button className="btn btn-primary" onClick={handleRestore} disabled={selectedSettings.length === 0}>
                                        Restore
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default RestoreSettingsModal; 