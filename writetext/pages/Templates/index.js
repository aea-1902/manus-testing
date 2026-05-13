import React, { useState, useEffect, useRef } from "react";
import Body from "../../components/Body";
import Content from "../../components/Content";
import styles from "../../styles/styling/Templates/Templates.module.css";
import { TemplateTypeEnum } from "../../enum/TemplateType";
import ApiService from "../../services/ApiService";
import { useRouter } from 'next/router';
import DeleteConfirmationModal from "../../components/Template/DeleteConfirmationModal";
import FollowToolTip from "../../components/FollowTooltip";
import { isWindowNotMaximized } from "../../utils/browserUtils";
import ModalWarnings from "../../components/Template/ModalWarnings";
import Link from "next/link";
import Image from "next/image";
import { MemberTypeEnum } from "../../enum/MemberType";

export default function Templates({ userData }) {
  const router = useRouter();
  const [userTemplates, setUserTemplates] = useState([]);
  const deleteModalRef = useRef(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [isNotMaximized, setIsNotMaximized] = useState(false);
  const [isAnyExpanded, setIsAnyExpanded] = useState(false);
  const [collapsedBlocks, setCollapsedBlocks] = useState({});
  const masterCollapseRefs = useRef({});
  const [masterOpen, setMasterOpen] = useState({});
  const [masterTemplates, setMasterTemplates] = useState([]);
  const [errorMessage, setErrorMessage] = useState({
    title: '',
    message: ''
  });
  const deleteErrorModalRef = useRef(null);
  useEffect(() => {
    const initTemplates = async () => {
      const templates = await ApiService.get('/Templates/company/templates');
      
      // Define the desired sort order
      const sortOrder = [
        'PageTitle',
        'ProductDescription', 
        'Excerpt',
        'CategoryPageTitle',
        'CategoryDescription'
      ];
      
      // Sort templates according to the specified order
      const sortedTemplates = templates.data.sort((a, b) => {
        const aIndex = sortOrder.indexOf(a.templateType);
        const bIndex = sortOrder.indexOf(b.templateType);
        return aIndex - bIndex;
      });
      
      setUserTemplates(sortedTemplates);
      getMasterTemplates();
      
      // Load accordion states from localStorage or set defaults
      const localStorageKey = 'templatesAccordionStates';
      let savedStates = {};
      
      try {
        const saved = localStorage.getItem(localStorageKey);
        if (saved) {
          savedStates = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Error loading accordion states from localStorage:', error);
      }
      
      // Initialize collapsedBlocks state
      const initialCollapsedState = {};
      sortedTemplates.forEach((item, index) => {
        if (savedStates[item.templateType] !== undefined) {
          // Use saved state if available
          initialCollapsedState[item.templateType] = savedStates[item.templateType];
        } else {
          // Default: first accordion expanded (false = expanded), others collapsed (true = collapsed)
          initialCollapsedState[item.templateType] = index !== 0;
        }
      });
      
      setCollapsedBlocks(initialCollapsedState);
      
      // Save initial state to localStorage if not already saved
      if (Object.keys(savedStates).length === 0) {
        try {
          localStorage.setItem(localStorageKey, JSON.stringify(initialCollapsedState));
        } catch (error) {
          console.error('Error saving initial accordion states to localStorage:', error);
        }
      }
    }
    initTemplates();

    // Check window state on mount and on resize
    const handleResize = () => {
      const check = isWindowNotMaximized();
      console.log('Window state check:', check); // Debug log
      setIsNotMaximized(check);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Initialize Bootstrap collapse
    const { Collapse } = require('bootstrap');
    const collapseElements = document.querySelectorAll('.accordion-collapse');
    collapseElements.forEach(element => {
      new Collapse(element, {
        toggle: false
      });
    });

    const checkExpandedState = () => {
      const expanded = Array.from(collapseElements).some(element => element.classList.contains('show'));
      setIsAnyExpanded(expanded);
    };

    // Check initial state
    checkExpandedState();

    // Add mutation observer to watch for changes in the accordion
    const observer = new MutationObserver(checkExpandedState);
    const accordion = document.getElementById('masterTemplatesList');
    if (accordion) {
      observer.observe(accordion, { 
        attributes: true, 
        childList: true, 
        subtree: true,
        attributeFilter: ['class']
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);
  const getMasterTemplates = async () => {
    const masterTemplates = await ApiService.get('/Templates/master');
    setMasterTemplates(masterTemplates.data);
  }
  const handleEdit = (templateId, templateType) => {
    router.push({
      pathname: '/templates/edit/[templateType]/[id]',
      query: { templateType, id: templateId }
    });
  };

  const handleAdd = (templateType) => {
    sessionStorage.setItem('addTemplateType', templateType);
    sessionStorage.removeItem('templateObjects');

    // Close all accordions first
    const allCollapsed = {};
    userTemplates.forEach(item => {
      allCollapsed[item.templateType] = true; // true = collapsed
    });
    
    // Open only the accordion for the selected template type
    allCollapsed[templateType] = false; // false = expanded
    
    // Update localStorage
   
    const localStorageKey = 'templatesAccordionStates';
    localStorage.setItem(localStorageKey, JSON.stringify(allCollapsed));
    
    // Update state
    setCollapsedBlocks(allCollapsed);

    router.push('/templates/add');
  };

  const handleDeleteClick = (templateId) => {
    setTemplateToDelete(templateId);
    const { Modal } = require("bootstrap");
    const modal = new Modal(document.getElementById('deleteConfirmationModal'));
    modal.show();
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;
    try {
      const refreshedTemplates = await ApiService.get('/Templates/company/templates');
      const hasWebshops = (templateId) => 
        refreshedTemplates.data.flatMap(type => type.templates)
          .find(template => template.id === templateId)?.webshops?.length > 0;
      //check if the templateToDelete has webshops assigned to it
      if (hasWebshops(templateToDelete)) {
        //show a modal message, lets use the ModalWarning component
        setErrorMessage({
          title: 'Template can\'t be deleted',
          message: 'Template is assigned to a webshop.'
        });
        const { Modal } = require("bootstrap");
        const modal = new Modal(document.getElementById('deleteError'));
        modal.show();
        return;
      }

      await ApiService.delete(`/Templates/user/${templateToDelete}/delete`);
      // Refresh the templates list
      const templates = await ApiService.get('/Templates/company/templates');
      
      // Apply the same sorting logic
      const sortOrder = [
        'PageTitle',
        'ProductDescription', 
        'Excerpt',
        'CategoryPageTitle',
        'CategoryDescription'
      ];
      
      const sortedTemplates = templates.data.sort((a, b) => {
        const aIndex = sortOrder.indexOf(a.templateType);
        const bIndex = sortOrder.indexOf(b.templateType);
        return aIndex - bIndex;
      });
      
      setUserTemplates(sortedTemplates);
      setTemplateToDelete(null);
    } catch (error) {
      console.error('Error deleting template:', error);
      setTemplateToDelete(null);
    }
  };

  const handleClone = async (templateId) => {
    try {
      await ApiService.post(`/Templates/user/${templateId}/clone`);
      // Refresh the templates list after cloning
      const templates = await ApiService.get('/Templates/company/templates');
      setUserTemplates(templates.data);
    } catch (error) {
      console.error('Error cloning template:', error);
    }
  };

  const handleToggleCollapse = (templateType) => {
    setCollapsedBlocks(prev => {
      const newState = {
        ...prev,
        [templateType]: !prev[templateType]
      };
      
      // Save to localStorage
      try {
        const localStorageKey = 'templatesAccordionStates';
        localStorage.setItem(localStorageKey, JSON.stringify(newState));
      } catch (error) {
        console.error('Error saving accordion states to localStorage:', error);
      }
      
      return newState;
    });
  };

  const expandCollapseAll = () => {
    const newState = !isAnyExpanded;
    const blocks = {};
    userTemplates.forEach(item => {
      blocks[item.templateType] = newState;
    });
    
    // Save to localStorage
    try {
      const localStorageKey = 'templatesAccordionStates';
      localStorage.setItem(localStorageKey, JSON.stringify(blocks));
    } catch (error) {
      console.error('Error saving accordion states to localStorage:', error);
    }
    
    setCollapsedBlocks(blocks);
    setIsAnyExpanded(newState);
  };

  const handleMasterToggle = (templateType) => {
    if (masterCollapseRefs.current[templateType]) {
      masterCollapseRefs.current[templateType].classList.toggle('show');
      setMasterOpen(prev => ({
        ...prev,
        [templateType]: !prev[templateType]
      }));
    }
  };

  const handleMasterClone = async (templateType, templateId) => {
    //this will route to master/[templateType]/[id]
    router.push(`/templates/master/${templateType}/${templateId}`);
  }

  const handleMasterView = (templateType, templateId) => {
    router.push(`/templates/master/${templateType}/preview/${templateId}`);
  }
  const hasProAccess = () => {
    return userData.credit.hasProAccess;
  }

  const isFreeTrial = () => {
    return userData.credit.membershipType == MemberTypeEnum.FREETRIAL;
  }

  const isFreeTrialEnded = () => {
    const freeTrialExpiration = new Date(userData.credit.subscriptionExpiration);
    const today = new Date();
    return userData.credit.membershipType == MemberTypeEnum.FREETRIAL && freeTrialExpiration <= today;
  }

  if (userData && userTemplates.length > 0) {
    return (
      <Body>
        <Content>
          <ModalWarnings
            target="deleteError"
            modalref={deleteErrorModalRef}
            title={errorMessage.title}
            warningMessage={errorMessage.message}
          />
          <div className={` d-flex flex-column`}>
            <div className={`${styles.templatesContainer} ${styles.templatesMain} ${isNotMaximized ? styles.notMaximized : ''}`}>
              <div className='d-flex' style={{marginBottom: '15px'}}>
                <div>
                  <div className={`header`}> 
                    <p style={{marginBottom: '0'}}>Templates</p>
                  </div>
                </div>
              </div>
              
              <div>
                  <p className={`templates-info mb-30`}>Here is where you can create and manage templates for different content types. For some, WriteText.ai provides AI-optimized, industry-specific templates based on ecommerce best practices. These appear under the &quot;WriteText.ai templates&quot; section when available. <br></br><br></br>You can also create your own custom templates using the &quot;Create new template&quot; button. Use the icons to clone, edit, or delete your templates. To assign templates to specific webshops, go to the <Link href="/webshops" target="_blank" className={`${styles.templatesInfoLink}`}>Linked webshops</Link> menu.</p>
              </div>
              {isFreeTrial() && isFreeTrialEnded() &&
                <div className={`header-tos free-trial-banner`}>
                    <div>
                      <p className="banner-title">Your free trial has ended.</p>
                      <p className="banner-text mb-0" style={{maxWidth: "740px"}}>To continue using Templates, purchase a credit bundle under Starter or subscribe to the Pro plan.</p>
                    </div>
                    <div className='ms-auto mt-auto' style={{marginRight: '35px'}}>
                      <button className="btn btn-primary" onClick={() => router.push('/premium')} style={{width: '188px'}}>Go to Plans & Credits</button>
                    </div>
                </div>
              }
             
              <div className="accordion" id="collapsibleList">
                {userTemplates.map((item, index) => (
                  <div className={`accordion-item ${styles.templatesRow}`} key={index}>
                    <h2 className="accordion-header" style={{borderBottom: 'none'}}>
                      <button
                        className={`accordion-button accordion-button-large ${styles.accordionButtonCustomTemplates} ${collapsedBlocks[item.templateType] ? 'collapsed' : ''} ${(isFreeTrial() && isFreeTrialEnded()) ? 'disabled' : ''}`}
                        type="button"
                        onClick={(isFreeTrial() && isFreeTrialEnded()) ? undefined : () => handleToggleCollapse(item.templateType)}
                        disabled={(isFreeTrial() && isFreeTrialEnded())}
                      >
                        <div className={`${styles.templatesRowTitle} d-flex w-100`}>
                          <div style={{height: 'auto', margin: 'auto', marginLeft: '0px'}}>
                            {TemplateTypeEnum[item.templateType]} templates
                          </div>
                          <div style={{marginLeft: 'auto', marginRight: '50px'}}>
                            <input
                              type="button"
                              className={`btn btn-primary btn-create-template font-14 h-45`}
                              value="Create new template"
                              data-template-type={item.templateType}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdd(item.templateType);
                              }}
                              disabled={(isFreeTrial() && isFreeTrialEnded())}
                            />
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div className="ms-auto">
                </div>
                    <div 
                      className={`accordion-collapse collapse${collapsedBlocks[item.templateType] ? '' : ' show'}`}
                    >
                      <div className="accordion-body" style={{backgroundColor: '#F6F6F6', padding: '20px', minHeight: '120px'}}>
                        <div className={`${styles.templatesRowTable} ${(isFreeTrial() && isFreeTrialEnded()) ? styles.disabled : ''}`}>
                          {item.templates.length > 0 ? (
                            <div className={`${styles.templatesRowTableCustomTemplates}`}>
                              <div className={`${styles.templatesRowTableHeader}`}>
                                <div className={`${styles.templatesRowTableHeaderTitle}`}>Custom templates</div>
                                <div className={`${styles.templatesRowTableHeaderWebshops}`}>Webshop/s using this template</div>
                                <div className={`${styles.templatesRowTableHeaderActions}`}></div>
                              </div>
                              <div className={`${styles.templatesRowTableBody}`}>
                                {item.templates.map((template, index) => (
                                  <div key={index} className={`${styles.templatesRowTableBodyRow}`}>
                                      <div className={`${styles.templatesRowTableBodyRowName}`} 
                                        onClick={() => {router.push(`/templates/edit/${item.templateType}/${template.id}`)}}>
                                          <div className={`${styles.templatesRowTableBodyRowRowsWebshopUrls}`}>
                                            <FollowToolTip content={template.name}><p>{template.name}</p></FollowToolTip>
                                          </div>
                                      </div>
                                    <div className={`${styles.templatesRowTableBodyRowUrls}`}>
                                      {template.webshops.length > 0 && template.webshops.map((webshop, index) => (
                                          <div key={index} className={`${styles.templatesRowTableBodyRowRowsWebshopUrls}`}>{webshop.url}</div>
                                      ))}
                                    </div>
                                    <div className={`${styles.templatesRowTableBodyRowButtons}`}>
                                      <div className={`d-flex`} style={{marginLeft: 'auto', gap: '10px'}}>
                                        <FollowToolTip content="Clone template">
                                          <div 
                                            className={`${styles.templatesRowTableBodyRowRowsIcons} ${styles.templatesRowTableBodyRowRowsClone}`}
                                            onClick={() => handleClone(template.id)}
                                          ></div>
                                        </FollowToolTip>
                                        <FollowToolTip content="Edit template">
                                          <div 
                                            className={`${styles.templatesRowTableBodyRowRowsIcons} ${styles.templatesRowTableBodyRowRowsEdit}`}
                                            onClick={() => {router.push(`/templates/edit/${item.templateType}/${template.id}`)}}
                                          ></div>
                                        </FollowToolTip>
                                        { template.webshops.length == 0 ? (
                                        <FollowToolTip content="Delete template">
                                          <div 
                                            className={`${styles.templatesRowTableBodyRowRowsIcons} ${styles.templatesRowTableBodyRowRowsDelete}`}
                                            onClick={() => handleDeleteClick(template.id)}
                                          ></div>
                                        </FollowToolTip>
                                        ) : (
                                          <FollowToolTip content="This template can't be deleted because it's currently assigned to a webshop.">
                                            <div 
                                              className={`${styles.templatesRowTableBodyRowRowsIcons} ${styles.templatesRowTableBodyRowRowsDelete} ${styles.templatesRowTableBodyRowRowsDeleteDisabled}`}
                                            ></div>
                                          </FollowToolTip>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className={`${styles.templatesNoTemplates}`}>No {TemplateTypeEnum[item.templateType].toLowerCase()} templates yet.<br></br><br></br> To create one, click &quot;Create new template&quot;.</div>
                          // masterTemplates.filter(t => t.type === item.templateType && t.isDefault == false).length > 0 
                          //     ? <div className={`${styles.templatesNoTemplates}`}>To create a new template, click &quot;Create New Template&quot; or choose from the WriteText.ai templates on the side.</div>
                          //     : <div className={`${styles.templatesNoTemplates}`}>There are currently no {TemplateTypeEnum[item.templateType].toLowerCase()} templates. Click Create new template and select {TemplateTypeEnum[item.templateType]} from the list.</div> 
                          )
                          }
                          <div className={`vl`}></div>
                          <div className={styles.masterTemplatesLabel}>
                                {/* Master templates collapsible using Bootstrap accordion pattern */}
                                <div>
                                  <div>
                                    <h2>
                                        <div className="d-flex align-items-center w-100">
                                          <Image src="/images/ico_master_templates.svg" alt="dropdown" width={20} height={20} />
                                          <p className={styles.masterTemplatesHeaderText}>
                                            WriteText.ai default templates
                                          </p>
                                          
                                        </div>
                                    </h2>
                                    
                            {masterTemplates.filter(t => t.type === item.templateType && t.isDefault == false).length > 0 ? (
                            
                                <div className={styles.masterTemplatesGrid}>
                                {/* Dynamic master templates */}
                                  {masterTemplates
                                  .filter(t => t.type === item.templateType && t.isDefault == false)
                                  .map((template) => (
                                    <div key={template.id} className={`${styles.masterTemplateNameWithIcon}`}>
                                      <div className={`${styles.masterTemplateNameWithIconText}`} onClick={() => handleMasterClone(template.type, template.id)} style={{cursor: 'pointer'}}> {template.label}</div>
                                      <div style={{display: 'flex', marginLeft: 'auto', gap: '10px'}}>
                                        <FollowToolTip content="Start from this template">
                                          <div 
                                            className={`${styles.templatesRowTableBodyRowRowsIcons} ${styles.templatesRowTableBodyRowRowsClone}`}
                                            onClick={() => handleMasterClone(template.type, template.id)}
                                          ></div>
                                        </FollowToolTip>
                                        <FollowToolTip content="View template">
                                          <div 
                                            className={`${styles.templatesRowTableBodyRowRowsIcons} ${styles.templatesRowTableBodyRowRowsView}`}
                                            onClick={() => handleMasterView(template.type, template.id)}
                                          ></div>
                                        </FollowToolTip>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                          ) : 
                          <>
                          <div className={`${styles.templatesNoMasterTemplates}`}>There are currently no templates.</div>
                          </>
                          }
                              </div>
                            </div>
                              
                          </div>

                            
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DeleteConfirmationModal 
            target="deleteConfirmationModal" 
            modalref={deleteModalRef} 
            onDelete={handleDeleteConfirm} 
          />
        </Content>
      </Body>
    );
  }
}