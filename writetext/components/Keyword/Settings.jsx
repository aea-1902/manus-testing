import React, { useState, useEffect, useMemo, useRef } from 'react';
import router from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import apiService from '../../services/ApiService';
import styles from "../../styles/styling/Keyword.module.css";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import LoadingScreen from '../LoadingScreen';
import ExecuteModal from './ExecuteModal';
import ExecuteNowModal from './ExecuteNowModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { PolicyEnum } from '../../enum/PolicyType';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import FollowTooltip from '../FollowTooltip';
import { isValidUrl, addHttps } from '../../utils/helper';
import {MemberTypeEnum} from '../../enum/MemberType';
import RestoreSettingsModal from './RestoreSettingsModal';

const CustomNumberInput = ({ type = "", value, onChange, min, max, step = 1, disabled = false }) => {
    const [inputValue, setInputValue] = useState(value);

    // Create a debounced version of the onChange prop with validation
    const debouncedOnChange = useMemo(
        () => debounce((value) => {
            const numVal = Number(value.toString().replace(/,/g, ''));
            if (!isNaN(numVal) && Number.isInteger(numVal)) {
                if (min !== undefined && numVal < min) {
                    onChange(min);
                    setInputValue(min.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                    return;
                }
                if (max !== undefined && numVal > max) {
                    onChange(max);
                    setInputValue(max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                    return;
                }
                onChange(numVal);
            }
        }, 500),
        [onChange, min, max]
    );

    const handleChange = (e) => {
        const val = e.target.value;
        // Only allow whole numbers and commas
        if (/^[0-9,]*$/.test(val)) {
            setInputValue(val);
            debouncedOnChange(val);
        }
    };

    const handleIncrement = () => {
        const newInputValue = inputValue.toString();
        if (newInputValue.includes(',')) {
            const toNumberValue = newInputValue.replace(/,/g, '');
            const currentValue = Number(toNumberValue);
            const newValue = currentValue + step;
            const formattedValue = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            setInputValue(formattedValue);
            debouncedOnChange(newValue);
        }
        else {
            const currentValue = Number(newInputValue);
            const newValue = currentValue + step;
            const formattedValue = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            setInputValue(formattedValue);
            debouncedOnChange(newValue);
        }
        
    };

    const handleDecrement = () => {
        const newInputValue = inputValue.toString();
        if (newInputValue.includes(',')) { 
            const toNumberValue = newInputValue.replace(/,/g, '');
            const currentValue = Number(toNumberValue);
            const newValue = currentValue - step;
            const formattedValue = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            setInputValue(formattedValue);
            debouncedOnChange(newValue);
        }
        else {
            const currentValue = Number(newInputValue);
            const newValue = currentValue - step;
            const formattedValue = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            setInputValue(formattedValue);
            debouncedOnChange(newValue);
        }
    };

    // Update local state when prop value changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <div className={`${styles.spinnerContainer}`} style={{ position: 'relative', width: '75px', margin: '0 auto' }}>
            {type == "ndays" ? 
            <input
                disabled={disabled}
                type="text"
                value={inputValue}
                onChange={handleChange}
                style={{
                    width: '100%',
                    textAlign: 'center',
                    paddingRight: '20px',
                    appearance: 'textfield',
                    height: '32px'
                }}
                className={`form-control`}
            />
            :
            <input
                disabled={disabled}
                type="text"
                value={inputValue}
                onChange={handleChange}
                style={{
                    width: '100%',
                    textAlign: 'left',
                    paddingLeft: '6px',
                    appearance: 'textfield',
                    height: '32px'
                }}
                className={`form-control`}
            />
            }
            <div className={`${styles.spinnerContainerButtons}`}>
                <button
                    disabled={disabled}
                    type="button"
                    onClick={handleIncrement}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        padding: '0',
                        height: '100%',
                        cursor: disabled ? 'default' : 'pointer',
                        fontSize: '9px'
                    }}
                >▲</button>
                <button
                    disabled={disabled}
                    type="button"
                    onClick={handleDecrement}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        padding: '0',
                        height: '100%',
                        cursor: disabled ? 'default' : 'pointer',
                        fontSize: '9px'
                    }}

                >▼</button>
            </div>
        </div>
    );
};

const handleEnableChange = async (row, domainId, enabled, onUpdateRow, setExecuteModalDate) => {
    const updatedRow = {
        ...row,
        enabled,
        nextSchedule: enabled ? new Date(row.nextSchedule || new Date().setDate(new Date().getDate() + row.days)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : null
    };
    onUpdateRow(updatedRow);
    if (enabled) {
        //show bootstrap modal
        setExecuteModalDate(new Date(row.nextSchedule || new Date().setDate(new Date().getDate() + row.days)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}))
        const { Modal } = require("bootstrap")
        const modal = new Modal(document.getElementById('executeModal'));
        modal.show();
    }
}

const handleDaysChange = async (row, domainId, days, onUpdateRow) => {
    const updatedRow = {
        ...row,
        days
    };
    onUpdateRow(updatedRow);
}

const handleTopPositionKeywordsChange = async (row, domainId, topKeywords, variables, onUpdateRow) => {
    const estimatedCredits = calculateEstimatedCredits(topKeywords, variables);
    const updatedRow = {
        ...row,
        topKeywords,
        estimatedCredits
    };
    onUpdateRow(updatedRow);
}

const handleCountryChange = async (row, country, onUpdateRow) => {
    const updatedRow = {
        ...row,
        country
    };
    onUpdateRow(updatedRow);
}
const calculateEstimatedCredits = (topKeywords, variables) => {
    return Math.ceil(
        (topKeywords / variables.keywordsPerCredit) * variables.creditCost
    );
}

const handleExecuteNow = async (row, onExecuteNow, setExecuteModalDomain) => {
    const result = await onExecuteNow(row);
    setExecuteModalDomain(row.domain);
    const { Modal } = require("bootstrap")
    
    // Check if there's already a visible modal
    const existingModals = document.querySelectorAll('.modal.show');
    if (existingModals.length > 0) {
        return;
    }
    
    if (result?.data.error !== '' && result?.data.error !== null) {
        const errorElement = document.getElementById('executeNowModalError').querySelector('.executeModalText');
        if (errorElement) {
            const errorElementTitle = document.getElementById('executeNowModalError').querySelector('.modal-title');
            errorElementTitle.textContent = 'Action couldn\'t be completed';
            errorElement.innerHTML = result?.data.error.replace(/\n{2,}/g, '\n');
        }

        const modalError = new Modal(document.getElementById('executeNowModalError'));
        modalError.show();
    }
    else
    {
        const modal = new Modal(document.getElementById('executeNowModal'));
        modal.show();
    }
}

const Row = (props) => {
    const [countriesList, setCountriesList] = useState([]);
    const {rows, computationVariables, onUpdateRow, onExecuteNow, disabled} = props;
    const [executeModalDate, setExecuteModalDate] = useState(null);
    const [generatingReport, setGeneratingReport] = useState(false);
    const [executingRows, setExecutingRows] = useState({});
    const deleteModalRef = useRef(null);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [executeModalDomain, setExecuteModalDomain] = useState(null);

    useEffect(() => {
        apiService.get(`CountryModels/GetCountries`).then((res) => {
            const countryData = res.data.map(country => ({
                iso: country.iso,
                text: country.text
            }));
            // Remove duplicates and sort alphabetically by ISO code
            const uniqueCountries = [...new Set(countryData.map(c => JSON.stringify(c)))]
                .map(str => JSON.parse(str))
                .sort((a, b) => a.iso.localeCompare(b.iso))
                .map(country => `${country.iso} - ${country.text}`);
            setCountriesList(uniqueCountries);
        });
    }, []);

    const addFormatting = (input) => {
            let value = input.toString().replace(/,/g, "");
            if (!isNaN(value) && value !== "") {
                value = Number(value).toLocaleString();
            }
            return value;
    }

    const handleDeleteRow = (row) => {
        if (disabled) return;
        setRowToDelete(row);
        const { Modal } = require("bootstrap");
        const modal = new Modal(document.getElementById('deleteConfirmationModal'));
        modal.show();
    }

    const handleDeleteConfirm = async () => {
        if (!rowToDelete) return;
        
        try {
            await apiService.post(`KeywordSettings/Delete`, {
                DomainId: rowToDelete.domainId
            }).then((res) => {
                if (res.data) {
                    // Remove the row from the state
                    const updatedRows = rows.filter(r => r.domainId !== rowToDelete.domainId);
                    onUpdateRow(updatedRows);
                    setRowToDelete(null);
                }
            });
        } catch (error) {
            setRowToDelete(null);
        }
    }

    return (
        <>
        <ExecuteNowModal target="executeNowModal" domain={executeModalDomain} />
        <ExecuteNowModal target="executeNowModalError" domain={executeModalDomain} />
        <ExecuteModal target="executeModal" date={executeModalDate} />
        <DeleteConfirmationModal 
            target="deleteConfirmationModal" 
            modalref={deleteModalRef} 
            onDelete={handleDeleteConfirm} 
        />
        
        <Table className={`${disabled ? styles.disabled : ''}`} style={{display: 'block', maxWidth: '1110px'}}>
                <thead style={{border: 'transparent'}} className={`${styles.keywordSettingsTHead}`}>
                    <tr className={`${styles.keywordSettingsTableThRow}`}>
                      <th scope="col">Domain</th>
                      <th scope="col">Country</th>
                      <th scope="col">Enable</th>
                      <th scope="col">Every N days</th>
                      <th scope="col">Top position keywords</th>
                      <th scope="col">Estimated credits</th>
                      <th scope="col">Next schedule to execute</th>
                      <th></th>
                      <th></th>
                    </tr>
                </thead>
                <tbody style={{border: 'transparent'}} className={`${styles.keywordSettingsTBody}`}>
                
                {rows.length > 0 ?
            rows.map((row, index) => (
                <React.Fragment key={index}>
                <tr key={index} className={`${styles.keywordSettingsTableTbodyRow}`}>
                    <td>{!disabled && isValidUrl(row.domain) ? <Link className={`${disabled ? styles.disabled : ''}`} href={addHttps(row.domain)} target="_blank" rel="noopener noreferrer">{row.domain}</Link> : row.domain}</td>
                    <td>
                        <Form.Label className={`mb-0`}>{row.country}</Form.Label>
                    </td>
                    <td>
                        <Form.Check disabled={disabled} type="switch" id="enable-switch" checked={row.enabled} onChange={(e) => handleEnableChange(row, row.domain, e.target.checked, onUpdateRow, setExecuteModalDate)} />
                    </td>
                    <td>
                        <CustomNumberInput disabled={disabled} type="ndays" value={row.days} onChange={(value) => handleDaysChange(row, row.domain, value, onUpdateRow)} min={1} max={365} step={1} />
                    </td>
                    <td>
                        
                        <CustomNumberInput disabled={disabled} 
                            value={addFormatting(row.topKeywords)} 
                            onChange={(value) => handleTopPositionKeywordsChange(
                                row,
                                row.domain, 
                                value, 
                                computationVariables,
                                onUpdateRow
                            )} 
                            min={10} 
                            max={10000} 
                            step={1} 
                        />
                    </td>
                    <td>
                        <Form.Label className={`mb-0`}>{row.estimatedCredits}</Form.Label>
                    </td>
                    <td>
                        
                        <Form.Label className={`mb-0`}>{row.nextSchedule ? new Date(row.nextSchedule).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : '-'}</Form.Label>
                    </td>
                    <td>
                        <button 
                            className={`btn btn-primary ${styles.executeButton}`} 
                            style={{height: '40px', fontSize: '14px', padding: '0 12px', width: '111px'}} 
                            onClick={() => {
                                const rowKey = `${row.domain}-${row.country}`;
                                setExecutingRows(prev => ({...prev, [rowKey]: true}));
                                handleExecuteNow(row, onExecuteNow, setExecuteModalDomain).finally(() => {
                                    setExecutingRows(prev => ({...prev, [rowKey]: false}));
                                });
                            }} 
                            disabled={executingRows[`${row.domain}-${row.country}`] || disabled}
                        >
                            {executingRows[`${row.domain}-${row.country}`] ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="ms-2">Running..</span>
                                </>
                            ) : (
                                "Execute now"
                            )}
                        </button>
                    </td>
                    <td>
                        <span className={`${styles.keywordSettingsRowTrash} ${disabled ? styles.disabled : ''}`} onClick={() => handleDeleteRow(row)}></span>
                    </td>
                </tr>
                </React.Fragment>
                ))
                :
                <tr style={{display: 'flex'}}>
                    <td colSpan="9" style={{margin: '0 auto',textAlign: 'center', fontSize: '14px', fontFamily: "DM Sans", fontWeight: '400', lineHeight: '19px'}}>Link a new webshop or restore a deleted domain.</td>
                </tr>
                }
                </tbody>
            </Table>
        
        </>
    )
    
}

export default function Settings({userData, reloadAccount}) {
    const [loading, setLoading] = useState(true);
    const [domainRows, setDomainRows] = useState([]);
    const [settingsRows, setSettingsRows] = useState([]);
    const [creditCalculationVariables, setCreditCalculationVariables] = useState([]);
    const [trackAcrossWebshops, setTrackAcrossWebshops] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [deletedSettings, setDeletedSettings] = useState([]);
    const restoreModalRef = useRef(null);

    const router = useRouter();

    useEffect(() => {
        getKeywordSettings();
    }, []);
    const getKeywordSettings = async () => {
        apiService.get(`KeywordSettings`).then((res) => {
 
         if (res.data) {
             const { domains, urls, creditsAndCost, trackAcrossWebshops, domainsForRestoration } = res.data;
             setDomainRows(domains);
             setCreditCalculationVariables(creditsAndCost);
             setTrackAcrossWebshops(trackAcrossWebshops);
             setDeletedSettings(domainsForRestoration);
 
             // Create settings rows by mapping urls and merging with domain data
             const mappedSettings = domains.map(domainData => {
                 return {
                     domainId: domainData.domainId || '',
                     urlId: domainData.urlId,
                     domain: domainData.value,
                     enabled: domainData.enabled || false,
                     days: domainData.dayInterval || 30,
                     topKeywords: domainData.limit || 1000,
                     estimatedCredits: calculateEstimatedCredits(domainData.limit || 1000, creditsAndCost),
                     nextSchedule: domainData.nextGeneration || null,
                     country: domainData.countryCode || 'US'
                 };
             });
             //sort mappedSettings by domain
             mappedSettings.sort((a, b) => a.domain.localeCompare(b.domain));
             setSettingsRows(mappedSettings);
             setLoading(false);
         }
        });
    }
    
    const getDeletedSettings = async () => {
        const result = await apiService.get(`KeywordSettings/ForRestoration`);
        setDeletedSettings(result.data);
    }

    const handleRowUpdate = (updatedRow) => {
        if (Array.isArray(updatedRow)) {
            // Handle array of rows (for deletion)
            setSettingsRows(updatedRow);
        } else {
            // Handle single row update - match both domain and country code
            const updatedRows = settingsRows.map(row =>     
                row.domain === updatedRow.domain && row.country === updatedRow.country ? updatedRow : row
            );
            setSettingsRows(updatedRows);
            handleSaveSettings(updatedRow);
        }

        getDeletedSettings();
    };

    const handleTrackAcrossWebshopsChange = async (e) => {
        //update the trackAcrossWebshops state
        setTrackAcrossWebshops(e.target.checked);
        //update the database
        await apiService.post(`KeywordSettings/UpdateTrackKeywordAcrossDomains?value=${e.target.checked}`);
    }

    const handleSaveSettings = async (row) => {
        try {
            const payload = {
                DomainId: row.domainId || null,
                UrlId: row.urlId,
                Value: row.domain,
                Enabled: row.enabled,
                DayInterval: row.days,
                Limit: row.topKeywords,
                CountryCode: row.country
            };

            await apiService.post('KeywordSettings', payload).then((res) => {
                if (res.data) {
                    if (res.data.domainId) {
                        setSettingsRows(prevRows => 
                            prevRows.map(r => 
                                r.domain === row.domain && r.country === row.country ? { 
                                    ...r, 
                                    domainId: res.data.domainId,
                                    nextSchedule: res.data.nextGeneration 
                                } : r
                            )
                        );
                    }
                }
            });

        } catch (error) {
            console.error('Error saving keyword settings:', error);
        }
    };

    const handleExecuteNow = async (row) => {
        
        const payload = {
            DomainId: row.domainId || null,
            UrlId: row.urlId,
            Value: row.domain,
            Enabled: row.enabled,
            DayInterval: row.days,
            Limit: row.topKeywords,
            CountryCode: row.country
        };

        const result = await apiService.post(`KeywordSettings/ExecuteNow`,payload);
        
        
        await getKeywordSettings();

        await reloadAccount(); 
        
        return result;
    }
    const AcceptPolicy = () => {
        apiService.post(`Policies/AcceptPolicy?type=${PolicyEnum.TermsOfService}`).then((res) => {
            if (res.data) {
                router.reload();
            }
        });
    }
    const openRestoreModal = () => {
        const modalElement = document.getElementById('restoreSettingsModal');
            const { Modal } = require("bootstrap");
            const modal = new Modal(modalElement);
            modal.show();
    }
    const handleRestoreSetting = async (restoredSettings) => {

        await apiService.post(`KeywordSettings/Restore`, {
            Domains: restoredSettings.map(setting => ({
                Domain: setting.domain,
                CountryCode: setting.countryCode
            }))
        }).then((res) => {
            getKeywordSettings();
        });
    };

if (loading) return <LoadingScreen />
if (userData) 
  return (      
    <>
    <RestoreSettingsModal 
        target="restoreSettingsModal" 
        modalref={restoreModalRef} 
        show={showRestoreModal} 
        onHide={() => setShowRestoreModal(false)} 
        onRestore={handleRestoreSetting}
        deletedSettings={deletedSettings}
    />
    <div className='keyword-settings'>
        {/* {(settingsRows.length > 0 || deletedSettings.length > 0) && */}
        <div className="header">
            <p className={`${styles.keywordSubheader}`} style={{marginBottom: '20px'}}>Manage how WriteText.ai tracks keyword performance across your webshops. Here, you can enable or disable tracking for each store, decide how often keyword checks should run (like every 30 days), and set how many top-ranking keywords you want to monitor. WriteText.ai checks for all ranking pages, including product pages, category pages, and other types of content on your site. If you run multiple stores, you can toggle &quot;Track across webshops&quot; to compare keyword performance between them. You&apos;ll also see an estimate of the credits needed for upcoming checks and the scheduled date for the next execution.</p>
            <p className={`${styles.keywordSubheader}`} style={{marginBottom: '42px'}}><b>Note: </b>If you&apos;re not seeing a specific webshop you recently added (e.g., a new language), make sure to visit the WriteText.ai page for that webshop first—this step is required for it to be detected. If the webshop does not appear on this list after 24 hours, visit the WriteText.ai page for that webshop again.</p>
        </div>
        {/* } */}
        
        {!userData.account.hasAcceptedLatestTerms && 
              <div className='header-tos'>
                <div>
                  <p className='tos-title'>We&apos;ve updated our terms</p>
                  <p className='tos-text' style={{marginBottom: '0px'}}>To continue using our services—including access to new features <b>like keyword cannibalization tracking</b>—you must review and accept our updated <Link href='/terms/Policy' target='_blank'>Terms of Service.</Link> By clicking <b>I agree</b>, you confirm your acceptance of the updated Terms, which are required to use these features.</p>
                </div>
                <div className="d-flex ml-auto mt-auto"><button className="btn btn-primary tos-btn"  onClick={AcceptPolicy}>I agree</button> </div>
              </div>
              }
              
        {userData.credit.membershipType == MemberTypeEnum.FREE &&
              <div className='header-tos'>
              <div>
                <p className='tos-title'>This is a Pro feature.</p>
                <p className='tos-text' style={{marginBottom: '0px', marginRight: '0px'}}>To view detailed keyword cannibalization insights—including affected pages and competing keywords—you&apos;ll need access to Premium features. These insights help streamline your SEO efforts by eliminating internal competition and boosting the right pages.</p>
              </div>
              
              <div style={{marginTop: 'auto'}}><button className="btn btn-primary tos-btn"  onClick={() => router.push('/premium')} style={{width: '190px'}}>Go to Plans & Credits</button> </div>
                </div>
        }
        <div>
        <div>
                    {(settingsRows.length > 0 || deletedSettings.length > 0) ? (
                        !userData.account.hasAcceptedLatestTerms ? (
                            <FollowTooltip content="You need to review and agree to our updated Terms of Service before you can continue using. Once you accept the updated Terms, refresh this page.">
                                <div className={`${userData.credit.membershipType == MemberTypeEnum.FREE ? styles.disabled : ''}`}>
                                    <div className={`d-flex ${styles.disabled}`}>
                                        {deletedSettings.length > 0 &&
                                        <div className="d-flex align-items-center">
                                            <button 
                                                className="btn btn-link" 
                                                style={{padding: '0', marginRight: '10px', fontSize: '14px', fontFamily: "DM Sans", fontWeight: '400', lineHeight: '19px', textDecoration: 'none'}}
                                                onClick={() => openRestoreModal()}
                                                disabled={userData.credit.membershipType == MemberTypeEnum.FREE || !userData.account.hasAcceptedLatestTerms}
                                            >
                                                <Image src="/images/ic_restore_domains.svg" alt="Restore domains" width={12} height={12} />
                                                <span style={{marginLeft: '6px'}}>Restore domains</span>
                                            </button>
                                        </div>
                                        }
                                        <div className='d-flex align-items-center ms-auto' style={{height: '26px'}}>
                                            <span className='mr-14' style={{fontSize: '14px', fontFamily: "DM Sans", fontWeight: '400', lineHeight: '19px'}}>Track across webshops</span>
                                            <Form.Check disabled={userData.credit.membershipType == MemberTypeEnum.FREE || !userData.account.hasAcceptedLatestTerms} type="switch" id="track-across-webshops" className="d-flex" checked={trackAcrossWebshops} onChange={handleTrackAcrossWebshopsChange} style={{marginTop: '0px'}}/>
                                        </div>
                                    </div>
                                    <Row 
                                        rows={settingsRows} 
                                        computationVariables={creditCalculationVariables}
                                        onUpdateRow={handleRowUpdate}
                                        onExecuteNow={handleExecuteNow}
                                        disabled={true}
                                    />
                                </div>
                            </FollowTooltip>
                        
                        ) : (
                            <div className={`${userData.credit.membershipType == MemberTypeEnum.FREE ? styles.disabled : ''}`}>
                            <div className={`d-flex ${userData.credit.membershipType == MemberTypeEnum.FREE ? styles.disabled : ''}`}>
                                {deletedSettings.length > 0 &&
                                <div className="d-flex align-items-center">
                                    <button 
                                        className="btn btn-link" 
                                        style={{padding: '0', marginRight: '10px', fontSize: '14px', fontFamily: "DM Sans", fontWeight: '400', lineHeight: '19px', textDecoration: 'none'}}
                                        onClick={() => openRestoreModal()}
                                        disabled={userData.credit.membershipType == MemberTypeEnum.FREE}
                                    >
                                        <Image src="/images/ic_restore_domains.svg" alt="Restore domains" width={12} height={12} />
                                        <span style={{marginLeft: '6px'}}>Restore domains</span>
                                        </button>
                                    </div>
                                }
                                <div className='d-flex align-items-center ms-auto' style={{height: '26px'}}>
                                    <span className='mr-14' style={{fontSize: '14px', fontFamily: "DM Sans", fontWeight: '400', lineHeight: '19px'}}>Track across webshops</span>
                                    <Form.Check disabled={userData.credit.membershipType == MemberTypeEnum.FREE} type="switch" id="track-across-webshops" className="d-flex" checked={trackAcrossWebshops} onChange={handleTrackAcrossWebshopsChange} style={{marginTop: '0px'}}/>
                                </div>
                            </div>
                            <Row 
                                rows={settingsRows} 
                                computationVariables={creditCalculationVariables}
                                onUpdateRow={handleRowUpdate}
                                onExecuteNow={handleExecuteNow}
                                disabled={userData.credit.membershipType == MemberTypeEnum.FREE}
                            />
                        </div>
                        )
                    ) : (
                        <>
                            <div className={`${styles.emptyState}`}>
                                <div
                                    style={{
                                        width: '220px',
                                        height: '165px',
                                        backgroundImage: 'url(/images/empty-webshop.png)',
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                    role="img"
                                    aria-label="Empty state illustration"
                                />
                                <div className={`${styles.emptyStateContent}`}>
                                    <h3>Get started by linking your webshop/s</h3>
                                    <p>To manage keyword tracking, you&apos;ll first need to link at least one webshop to your account.</p>
                                    <p>Once linked, you&apos;ll be able to set tracking preferences and schedule keyword checks.</p>
                                </div>
                            </div>
                            <div className='d-flex'>
                                <input type="button" className="btn btn-primary center plugin" value="Go to Downloads" onClick={() => router.push("/downloads")}/>
                            </div>
                        </>
                    )}
                </div>

        
        </div>
        
    </div>
    </>
  );
}