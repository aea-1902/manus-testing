import React, { useState, useEffect } from "react";
import Image from "next/image";
import Body from "../../../../../components/Body";
import Content from "../../../../../components/Content";
import styles from "../../../../../styles/styling/Templates/Templates.module.css";
import TextFormatting from "../../../../../components/Template/Properties/TextFormatting";
import TextStructure from "../../../../../components/Template/Properties/TextStructure";
import ContentDropdown from "../../../../../components/Template/Properties/ContentDropDown";
import NumberInput from "../../../../../components/Template/Properties/NumberInput";
import SingleSelectOption from "../../../../../components/Template/Properties/SingleSelectOption";
import PreviewTemplate from "../../../../../components/Template/PreviewTemplate";
import { BlockPropertyTypeEnum } from "../../../../../enum/BlockType";
import TextField from "../../../../../components/Template/Properties/TextField";
import MultilineTextField from "../../../../../components/Template/Properties/MultilineTextField";
import Checkbox from "../../../../../components/Template/Properties/Checkbox";
import LoadingScreen from "../../../../../components/LoadingScreen";
import ApiService from "../../../../../services/ApiService";
import { useRouter } from 'next/router';

// Wrapper component to make properties non-interactive
const NonInteractiveWrapper = ({ children, className = "" }) => {
  return (
    <div 
      className={`${className} ${styles.previewOnly}`}
      style={{ 
        pointerEvents: 'none',
        userSelect: 'none'
      }}
      onClick={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      onKeyDown={(e) => e.preventDefault()}
      onFocus={(e) => e.preventDefault()}
      onBlur={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
};

export default function MasterTemplatePreview({ userData }) {
  const router = useRouter();
  const { templateType, id } = router.query;
  const [templateObjects, setTemplateObjects] = useState([]);
  const [generatedPreview, setGeneratedPreview] = useState();
  const [templateName, setTemplateName] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [isNotMaximized, setIsNotMaximized] = useState(false);
  const [isAnyExpanded, setIsAnyExpanded] = useState(false);
  const [collapsedBlocks, setCollapsedBlocks] = useState({});
  const blocksContainerRef = React.useRef(null);

  useEffect(() => {
    const initTemplate = async () => {
      if (!templateType || !id) return;

      setLoading(true);
      try {
        // Get the master template
        const masterTemplate = await getMasterTemplate({ id });
        
        // Initialize error and warning messages for each block
        masterTemplate.blocks.forEach(block => {
        // if (!block.warningMessage) {
            block.warningMessage = [];
          // }
          // if (!block.errorMessage) {
            block.errorMessage = [];
          // }
        });
        
        setTemplateObjects([masterTemplate]);
        setTemplateName(masterTemplate.label || "");
        const templateObjectCopy = JSON.parse(JSON.stringify(masterTemplate));
        //remove all warningMessages and errorMEssages on templateObjectCopy
        templateObjectCopy.blocks.forEach(block => {
          delete block.warningMessage;
          block.errorMessage = '';
        });
        // Generate preview
        const preview = await ApiService.post(`/Templates/master/${id}/preview-with-credits`, templateObjectCopy);
        setGeneratedPreview(preview.data);
      } catch (error) {
        console.error('Error loading template:', error);
      } finally {
        setLoading(false);
      }
    };

    initTemplate();
  }, [templateType, id]);

  const getMasterTemplate = async (template) => {
    const response = await ApiService.get(`/Templates/master/${template.id}/model`);
    return response.data;
  }

  const handleBack = () => {
    router.push(`/templates`);
  };

  const hasPropertyTypeNone = (block) => {
    const groups = block.groups;
    const properties = groups.flatMap(group => group.properties);
    if (properties.length > 1)
    {
      const hasNone = properties[1].type === BlockPropertyTypeEnum.None;
      return hasNone;
    }
    return false;
  }
  
  const expandCollapseAll = () => {
    const updatedCollapsedBlocks = { ...collapsedBlocks };
    templateObjects[0].blocks.forEach(block => {
      updatedCollapsedBlocks[block.id] = isAnyExpanded ? false : true;
    });
    setCollapsedBlocks(updatedCollapsedBlocks);
    
    setIsAnyExpanded(!isAnyExpanded);
  }
  
  const handleToggleCollapse = (blockId) => {
    const updatedCollapsedBlocks = { ...collapsedBlocks };
    updatedCollapsedBlocks[blockId] = !updatedCollapsedBlocks[blockId];
    setCollapsedBlocks(updatedCollapsedBlocks);

     const allValues = Object.values(updatedCollapsedBlocks);
     const allTrue = allValues.every(value => value === true);
     const allFalse = allValues.every(value => value === false);
     
     if (allTrue) {
       setIsAnyExpanded(true);
     } else if (allFalse) {
       setIsAnyExpanded(false);
     }

  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!userData) {
    return null;
  }
  return (
    <Body>
      <Content>
        <div className={`${styles.templatesContainerAdd} d-flex`}>
          <div className={`${styles.templatesContainerLeft} ${isNotMaximized ? styles.notMaximized : ''}`}>
            <p className='mb-14 font-24 d-flex'>
              <p className={`${styles.backBtn}`} onClick={handleBack}></p>
              <p className={`${styles.templateInput}`}style={{border: 'none', margin: '0px', lineHeight: 'normal'}}>{templateName}</p>
            </p>
            <div className="mb-3 d-flex justify-content-end">
            <button 
                        className={styles.collapseExpandLinkBtn}
                        onClick={expandCollapseAll}
                      >
                        {isAnyExpanded ? 'Collapse all' : 'Expand all'}
                      </button>
            </div>
            {loading ? (
              <LoadingScreen />
            ) : (
              <div className="accordion" id="collapsibleList" >
                <div ref={blocksContainerRef}>
                  {(templateObjects.length > 0 && templateObjects[0].blocks) && templateObjects[0].blocks.map((block, blockIndex) => (
                    <React.Fragment key={`block-${blockIndex}-${block.id}`}>
                      <div 
                        data-id={blockIndex}
                        className={`${styles.accordionItemParent} `}
                      >
                        <div className={`${styles.accordionItem}`}>
                          <h2 className={`accordion-header d-flex align-items-center ${styles.accordionHeader}`}>
                               
                          <button className={`accordion-button ${hasPropertyTypeNone(block) ? styles.disableAccordion : ''} ${styles.accordionButtonCustom} ${collapsedBlocks[block.id] ? '' : 'collapsed'} ${block.errorMessage.length > 0 ? styles.hasError : ''} }`} 
                            type="button" 
                            onClick={(e) => {
                              handleToggleCollapse(block.id);
                            }}
                          >     
                              {block.label}
                              {(block.id.includes('image') || block.id.includes('custom')) && 
                                !hasProAccess() && <Image src="/images/ic_pro.svg" alt="pro" width={49} height={19} style={{marginLeft: '10px'}} />
                              }
                            </button>
                          </h2>
                          <div id={`collapse-${blockIndex}`} className={`accordion-collapse collapse${collapsedBlocks[block.id] ? ' show' : ''}`}>
                            <div className={`accordion-body ${styles.accordionBody}`}>
                              <div className={styles.propertyGroup}>
                                    {block.groups.map((group, groupIndex) => (
                                        <>
                                          {group.label && group.label != '' && <p className={styles.groupLabel}>{group.label}</p>}
                                          {group.properties[0].groupLabel != '' && <p className={styles.groupLabel}>{group.properties[0].groupLabel}</p>}
                                          <div key={groupIndex} className={` ${group.id === "target_length" ? `d-flex` : ''}`}>
                                            {group.properties.map((property, propertyIndex) => (
                                              property.id !== "enabled" && 
                                                <React.Fragment key={propertyIndex}>
                                                  {property.id === "min" && <div className={styles.numberWrapperLabel}><p style={{float: 'left'}}>{property.label}</p></div>}
                                                  <NonInteractiveWrapper>
                                                    <div id={`property-${block.id}-${property.id}-${propertyIndex}`} className={`d-flex flex-column ${styles.accordionElements} ${(property.id === "heading_text" || property.id === "spacing") && `${styles.hasDependentProperties}`} ${property.id === "min" || property.id === "max" ? `${styles.numberWrapper}` : ''}`}>
                                                      
                                                      <div className={`d-flex`}>
                                                        
                                                       
                                                        {property.id !== "min" && property.id !== "max" && property.id !== "include" && <p className={styles.propertyLabel} style={{marginLeft: group.properties[0].groupLabel === '' ? 0 : undefined, marginRight: group.properties[0].groupLabel === '' ? 28 : undefined}}>{property.label}</p>}
                                                        {(() => {
                                                          switch (property.type) {
                                                            case BlockPropertyTypeEnum.NumberField:
                                                              return <NumberInput 
                                                                block={block}
                                                                values={property.values.length > 0 ? property.values[0] : property.defaultValues[0]} 
                                                                properties={group.properties}
                                                                property={property}
                                                                label={property.label}
                                                                group={group}
                                                                preview={true}
                                                              />;
                                                            case BlockPropertyTypeEnum.MultiSelectOption:
                                                              return (
                                                                <TextFormatting 
                                                                  block={block}
                                                                  label={property.label} 
                                                                  properties={property.options} 
                                                                  values={property.values.length > 0 ? property.values : property.defaultValues[0]}
                                                                  blockIndex={blockIndex} 
                                                                  propertyIndex={propertyIndex} 
                                                                  property={property}
                                                                />
                                                              );
                                                            case BlockPropertyTypeEnum.Dropdown:
                                                              return (
                                                                <ContentDropdown 
                                                                  block={block}
                                                                  label={property.label} 
                                                                  options={property.options} 
                                                                  defaultValue={property.values.length > 0 ? property.values[0] : property.defaultValues[0]} 
                                                                  blockIndex={blockIndex} 
                                                                  propertyIndex={propertyIndex}
                                                                  propertyId={property.id}
                                                                  properties={group.properties}
                                                                  group={group}
                                                                  preview={true}
                                                                />
                                                              );
                                                            case BlockPropertyTypeEnum.TextField:
                                                              return (
                                                                <TextField 
                                                                  block={block}
                                                                  label={property.label}
                                                                  value={property.values.length > 0 ? property.values[0] : property.defaultValues[0] || ""}
                                                                  blockId={block.id}
                                                                  blockIndex={blockIndex}
                                                                  propertyIndex={propertyIndex}
                                                                  propertyId={property.id}
                                                                  group={group}
                                                                  preview={true}
                                                                />
                                                              );
                                                            case BlockPropertyTypeEnum.MultilineTextField:
                                                              return (
                                                                <MultilineTextField
                                                                  label={property.label}
                                                                  value={property.values.length > 0 ? property.values[0] : property.defaultValues[0] || ""}
                                                                  block={block}
                                                                  blockId={block.id}
                                                                  blockIndex={blockIndex}
                                                                  propertyIndex={propertyIndex}
                                                                  propertyId={property.id}
                                                                  group={group}
                                                                  preview={true}
                                                                />
                                                              );
                                                            case BlockPropertyTypeEnum.SingleSelectOption:
                                                              return (
                                                                <SingleSelectOption 
                                                                  block={block}
                                                                  label={property.label} 
                                                                  options={property.options} 
                                                                  defaultValue={property.defaultValues[0]} 
                                                                  blockIndex={blockIndex}
                                                                  propertyIndex={propertyIndex}
                                                                  propertyId={property.id}
                                                                  values={property.values}
                                                                  errorMessage={block.errorMessage}
                                                                  properties={property.options} 
                                                                />
                                                              );
                                                            case BlockPropertyTypeEnum.Checkbox:
                                                              return (
                                                                block.id.includes('image') && (
                                                                  <Checkbox
                                                                    block={block}
                                                                    blockIndex={blockIndex}
                                                                    property={property}
                                                                    propertyIndex={propertyIndex}
                                                                    preview={true}
                                                                  />
                                                                )
                                                              );
                                                              
                                                            default:
                                                              return null;
                                                          }
                                                        })()}
                                                      </div>
                                                    </div>
                                                  </NonInteractiveWrapper>
                                                </React.Fragment>
                                                
                                            ))}
                                          </div>
                                            
                                          {groupIndex !== block.groups.length - 1 && group.id !== 'enabled' && (
                                          <hr className={styles.groupSeparator} />
                                          )}
                                        </>
                                    ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.templatesContainerRight}>
            <PreviewTemplate
              title="TEMPLATE PREVIEW"
              subtitle="This is just a preview but the actual generated text will follow your webshop's stylesheets."
              credits={generatedPreview?.credits || 0}
              content={generatedPreview}
              maximized={!isNotMaximized}
              isSaveDisabled={true}
              isPreview={true}
              templateType={templateName}
            />
          </div>
        </div>
      </Content>
    </Body>
  );
}
