import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WebshopCustomDropdown from './WebshopDropdown';
import styles from '../styles/styling/WebshopCustomDropdown.module.css';
import { TemplateTypeEnum } from '../enum/TemplateType';

const Webshop = ({index, platform,webshop, onchange, verify, ondelete, isadmin, onTemplateChange = () => {}, templates = [], selectedTemplate = {}, webshopTemplate = {}}) => {
  const handleTemplateChange = (urlId, type, e) => {
    // e is now an array of template names or empty GUID, not a CSV string
    // const emptyGuid = "00000000-0000-0000-0000-000000000000";
    
    // Check if the array contains the empty GUID (indicating "No template" is selected)
    // if (e.includes(emptyGuid)) {
    //   onTemplateChange(urlId, type, [emptyGuid]);
    // } else {
    //   // Handle regular template selections
    //   const templateIds = templates.find(t=>t.templateType === type).templates.filter(t=> e.includes(t.name)).map(t=>t.id);
    //   onTemplateChange(urlId, type, templateIds);
    // }
    
    // e is now an array of template names, not a CSV string
    const templateIds = templates.find(t=>t.templateType === type).templates.filter(t=> e.includes(t.name)).map(t=>t.id);
    onTemplateChange(urlId, type, templateIds);
  }

  const getSelectedTemplateName = (type) => {
    if (selectedTemplate.length == 0) {
      return [];
    }
    try {
      const webshopTemplate = selectedTemplate.find(t=>t.urlId === webshop.urlId);
      // const emptyGuid = "00000000-0000-0000-0000-000000000000";
      
      const templateIds = webshopTemplate.selections[type];
      
      // Handle both array and single value for backward compatibility
      const templateIdArray = Array.isArray(templateIds) ? templateIds : [templateIds];
      
      // Check if the selection contains the empty GUID (indicating "No template" is selected)
      // if (templateIdArray.length === 1 && (templateIdArray[0] === emptyGuid || templateIdArray[0]?.id === emptyGuid)) {
      //   return [emptyGuid];
      // }
      
      const templateGroup = templates.find(t => t.templateType === type);
      if (!templateGroup) return [];
      
      const selectedTemplates = templateIdArray
        .map(templateId => {
          const template = templateGroup.templates.find(t => t.id === templateId.id || t.id === templateId);
          return template ? template.name : null;
        })
        .filter(name => name !== null);
      
      return selectedTemplates;
    } catch (error) {
      return [];
    }
  }
if (selectedTemplate)
  return (
    <>
        <div key={`parent_${webshop.urlId}`} id={`parent_${webshop.urlId}`} className='webshop d-flex form-group'>
            <div className='w-100' style={{gap: '15px', marginRight: '14px'}}>
              <div className="form-floating mr-14 w-100 d-flex">
                <p className={`url-index ${platform.toLowerCase()}`}>{index + 1}</p>
                <input id={webshop.urlId} type='text' className={`form-control ${webshop.verifiedAt != null ? "verified" : null}`} defaultValue={webshop.domain} onChange={onchange} readOnly={webshop.domain != '' ? true : false} />
                <label htmlFor={webshop.id} hidden>{webshop.id}</label>
              </div>
            </div>
            
            
            
            <div style={{height: '35px', marginTop: 'auto', marginBottom: webshop.deletedAt != null ? 'auto' : '0px'}}>
              { webshop.deletedAt == null &&
              <span  className='delete-icon' data-bs-toggle="modal" data-bs-target="#deleteWebshop" onClick={ondelete}><Image id={webshop.urlId} src='/images/remove.svg' width={12} height={12} alt='remove'></Image></span>
              
              }
            {isadmin && webshop.deletedAt != null &&
              <button id={webshop.urlId} className='btn btn-danger' data-bs-toggle="modal" data-bs-target="#deregisterWebshop" data-domain={webshop.domain} onClick={ondelete}>Deregister</button>
            }
            </div>
        </div>
        {webshop.deletedAt == null &&
        <div key={`parent_templates_${webshop.urlId}`} id={`parent_templates_${webshop.urlId}`} className={`d-flex mb-14 ${styles.webshopAndTemplateContainer}`} style={{gap: '15px'}}>
              
        <div className='templates-arrow'></div>
              <div className='w-100' style={{maxWidth: '160px'}}>
               <div className='font-13 mb-14 sub-p'>
                  Product meta title
                </div>
                
                <div>
                  <WebshopCustomDropdown
                    options={templates.find(t => t.templateType === "PageTitle")?.templates.map(t => t.name) || []}
                    placeholder="Select template/s"
                    className={styles.templateDropdown}
                    onChange={(e) => handleTemplateChange(webshop.urlId, "PageTitle", e)}
                    value={getSelectedTemplateName("PageTitle")}
                    templateType="PageTitle"
                  />
                </div>
              </div>
              <div className='w-100' style={{maxWidth: '160px'}}>
                
                <div className='font-13 mb-14 sub-p'>
                  Product description
                </div>
                
                <div>
                  <WebshopCustomDropdown
                    options={templates.find(t => t.templateType === "ProductDescription")?.templates.map(t => t.name) || []}
                    placeholder="Select template/s"
                    className={styles.templateDropdown}
                    onChange={(e) => handleTemplateChange(webshop.urlId, "ProductDescription", e)}
                    value={getSelectedTemplateName("ProductDescription")}
                    templateType="ProductDescription"
                  />
                </div>
              </div>
              {platform.toLowerCase() != "shopify" &&
              <div className='w-100' style={{maxWidth: '160px'}}>
                <div className='font-13 mb-14 sub-p'>
                Product short description
                </div>
                <div>
                  <WebshopCustomDropdown
                    options={templates.find(t => t.templateType === "Excerpt")?.templates.map(t => t.name) || []}
                    placeholder="Select template/s"
                    className={styles.templateDropdown}
                    onChange={(e) => handleTemplateChange(webshop.urlId, "Excerpt", e)}
                    value={getSelectedTemplateName("Excerpt")}
                    templateType="Excerpt"
                  />
                </div>
              </div>
              }
              <div className='w-100' style={{maxWidth: '160px'}}>
                <div className='font-13 mb-14 sub-p'>
                  Category meta title
                </div>
                <div>
                  <WebshopCustomDropdown
                    options={templates.find(t => t.templateType === "CategoryPageTitle")?.templates.map(t => t.name) || []}
                    placeholder="Select template/s"
                    className={styles.templateDropdown}
                    onChange={(e) => handleTemplateChange(webshop.urlId, "CategoryPageTitle", e)}
                    value={getSelectedTemplateName("CategoryPageTitle")}
                    templateType="CategoryPageTitle"
                  />
                </div>
              </div>
              <div className='w-100' style={{maxWidth: '160px'}}>
                <div className='font-13 mb-14 sub-p'>
                  Category description
                </div>
                <div>
                  <WebshopCustomDropdown
                    options={templates.find(t => t.templateType === "CategoryDescription")?.templates.map(t => t.name) || []}
                    placeholder="Select template/s"
                    className={styles.templateDropdown}
                    onChange={(e) => handleTemplateChange(webshop.urlId, "CategoryDescription", e)}
                    value={getSelectedTemplateName("CategoryDescription")}
                    templateType="CategoryDescription"
                  />
                </div>
              </div>
              
            </div>
}            
    </>
  )
}

export default Webshop