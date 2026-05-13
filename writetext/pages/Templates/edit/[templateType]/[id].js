import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Body from "../../../../components/Body";
import Content from "../../../../components/Content";
import ErrorMessage from "../../../../components/Template/ErrorMessage";
import styles from "../../../../styles/styling/Templates/Templates.module.css";
import { Dropdown, Form } from 'react-bootstrap';
import InfoAlert from "../../../../components/Template/InfoAlert";
import AlertMessage from "../../../../components/Template/AlertMessage";
import WarningMessage from "../../../../components/Template/WarningMessage";
import TextFormatting from "../../../../components/Template/Properties/TextFormatting";
import TextStructure from "../../../../components/Template/Properties/TextStructure";
import ContentDropdown from "../../../../components/Template/Properties/ContentDropDown";
import NumberInput from "../../../../components/Template/Properties/NumberInput";
import SingleSelectOption from "../../../../components/Template/Properties/SingleSelectOption";
import TemplateFor from "../../../../components/Template/Properties/TemplateFor";
import PreviewTemplate from "../../../../components/Template/PreviewTemplate";
import { BlockPropertyTypeEnum, BlockMessagesEnum } from "../../../../enum/BlockType";
import Sortable from 'sortablejs';
import TextField from "../../../../components/Template/Properties/TextField";
import MultilineTextField from "../../../../components/Template/Properties/MultilineTextField";
import Checkbox from "../../../../components/Template/Properties/Checkbox";
import LoadingScreen from "../../../../components/LoadingScreen";
import LoadingContent from "../../../../components/LoadingContent";
import { TemplateTypeEnum } from "../../../../enum/TemplateType";
import ApiService from "../../../../services/ApiService";
import { useRouter } from 'next/router';
import { isWindowNotMaximized } from "../../../../utils/browserUtils";
import FollowTooltip from "../../../../components/FollowTooltip";
import H1Popup from "../../../../components/Template/H1Popup";
import ErrorPopup from "../../../../components/Template/ErrorPopup";
import ModalWarnings from "../../../../components/Template/ModalWarnings";
import { useToastr } from "../../../../components/Toastr/ToastrContext";
import { ToastrProvider } from "../../../../components/Toastr/ToastrContext";

export default function EditTemplatePage(props) {
  return (
    <ToastrProvider>
      <EditTemplate {...props} />
    </ToastrProvider>
  );
}

export function EditTemplate({ userData }) {
  const router = useRouter();
  const { id, templateType } = router.query;
  const { showToast } = useToastr();
  const [masterTemplates, setMasterTemplates] = useState([]);
  const [templateSelection, setTemplateSelection] = useState(["Select template/s"]);
  const [template, setTemplate] = useState("");
  const [templateObjects, setTemplateObjects] = useState([]);
  const [generatedPreview, setGeneratedPreview] = useState();
  const [templateName, setTemplateName] = useState(""); 
  const [debouncedTemplateName, setDebouncedTemplateName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isNotMaximized, setIsNotMaximized] = useState(false);
  const [imageBlock, setImageBlock] = useState([]);
  const blocksContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const sortableRef = useRef(null);
  const [isAnyExpanded, setIsAnyExpanded] = useState(false);
  const [imageBlockAllowed, setImageBlockAllowed] = useState(true);
  const [hasEnabledBlock, setHasEnabledBlock] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [symbolBlockAllowed, setSymbolBlockAllowed] = useState(true);
  const [symbolBlock, setSymbolBlock] = useState([]);
  const [collapsedBlocks, setCollapsedBlocks] = useState({});
  const [customBlock, setCustomBlock] = useState([]);
  const [customBlockAllowed, setCustomBlockAllowed] = useState(true);
  const [isMultilineTextFieldInLimit, setIsMultilineTextFieldInLimit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageBlockMax, setIsImageBlockMax] = useState(false);
  const [isSymbolBlockMax, setIsSymbolBlockMax] = useState(false);
  const [isCustomBlockMax, setIsCustomBlockMax] = useState(false);
  const [modalWarningTitle, setModalWarningTitle] = useState("");
  const [modalWarningMessage, setModalWarningMessage] = useState("");
  const [templateNameError, setTemplateNameError] = useState(false);
  const [redirectedFromAdd, setRedirectedFromAdd] = useState(false);
  const warningModalRef = useRef(null);

  
  useEffect(() => {
    // Check window state on mount and on resize
    const handleResize = () => {
      const check = isWindowNotMaximized();
      console.log('Window state check:', check); // Debug log
      //setIsNotMaximized(check);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    
    const initTemplates = async () => { 
      setLoading(true);
      try {
        // Load the existing template
        let templateData = await ApiService.get(`/Templates/user/${id}/model`);
        templateData.data.blocks.forEach(block => {
          block.groups.forEach(group => {
            group.properties.forEach(property => {
              if (property.id === 'enabled') {
                property.values = [property.values[0] === 'true' ? 'true' : 'false'];
              }
            });
          });
        });
        
        let updatedTemplateObjects = [templateData.data];  
        updatedTemplateObjects = isKeywordBlockEnabled(updatedTemplateObjects);
        updatedTemplateObjects[0].blocks.forEach(block => {
          if (!block.warningMessage)
          {
            block.warningMessage = [];
          }
          if (!block.errorMessage)
          {
            block.errorMessage = [];
          }
          headingHasContentText(block);
        });
        setTemplateName(templateData.data.label);
        setTemplate(templateData.data.label);

        validateAllHeadings(updatedTemplateObjects);
        setTemplateObjects(updatedTemplateObjects);
        validateAllImageBlocksImageToInclude(updatedTemplateObjects);
        // Load master templates for selection
        const masterTemplates = await getMasterTemplates();
        setMasterTemplates(masterTemplates);
        const labels = ["Select template/s"];
        const keys = Object.values(masterTemplates).map(item => item.label);
        labels.push(...keys);
        setTemplateSelection(labels);
        const selectedMaster = masterTemplates.find(p => p.type === templateType);
        setSelectedTemplate(selectedMaster.label);

        const blockTypes = await checkBlockTypes(templateType);
        setImageBlock(blockTypes.image.block);
        setImageBlockAllowed(blockTypes.image.allowed);
        setSymbolBlock(blockTypes.symbol.block);
        setSymbolBlockAllowed(blockTypes.symbol.allowed); 
        setCustomBlock(blockTypes.custom.block);
        setCustomBlockAllowed(blockTypes.custom.allowed);

        const blocksMax = await blockTypeCountMax(updatedTemplateObjects,blockTypes);

        setIsImageBlockMax(blocksMax.imageBlockMax);
        setIsSymbolBlockMax(blocksMax.symbolBlockMax);
        setIsCustomBlockMax(blocksMax.customBlockMax);
        saveDraft([templateData.data], 'initTemplates');

        
        const redirectedFromAdd = sessionStorage.getItem('redirectedFromAdd');
        if (redirectedFromAdd === 'true') {
          setRedirectedFromAdd(true);
          // The user came from add
          //sessionStorage.removeItem('redirectedFromAdd');
        }else{
          setRedirectedFromAdd(false);
        }
      } catch (error) {
        console.error('Error loading template:', error);
        router.push('/Templates');
      } finally {
        setLoading(false);
      }
    }

    initTemplates();
  }, [router.isReady, id, templateType]);

  useEffect(() => {
    if (redirectedFromAdd) {
      showToast({
        type: 'success',
        message: 'Saved successfully.',
        duration: 3000,
        position: 'top-center',
        closeOnClick: true
      });
      sessionStorage.removeItem('redirectedFromAdd');
    }
  }, [redirectedFromAdd]);

  // Add effect to initialize Sortable
  useEffect(() => {
    if (blocksContainerRef.current && isDataLoaded && templateObjects.length > 0) {
      initializeSortable();
      // isKeywordBlockEnabled();
    }
  }, [blocksContainerRef.current, isDataLoaded, templateObjects]);

  // Add effect to set data loaded state
  useEffect(() => {
    if (templateObjects.length > 0) {
      setIsDataLoaded(true);
    } else {
      setIsDataLoaded(false);
    }
  }, [templateObjects]);

  useEffect(() => {
    const checkExpandedState = () => {
      const collapseElements = document.querySelectorAll('.accordion-collapse');
      const expanded = Array.from(collapseElements).some(element => element.classList.contains('show'));
      setIsAnyExpanded(expanded);
    };
    checkExpandedState();
    const observer = new MutationObserver(checkExpandedState);
    const accordion = document.getElementById('collapsibleList');
    if (accordion) {
      observer.observe(accordion, { 
        attributes: true, 
        childList: true, 
        subtree: true,
        attributeFilter: ['class']
      });
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Set up modal event listeners
    const modalElement = document.getElementById('modalWarnings');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        const templateNameInput = document.getElementById('templateNameInput');
        if (templateNameInput) {
          templateNameInput.focus();
        }
      });
    }

    // Cleanup
    return () => {
      if (modalElement) {
        modalElement.removeEventListener('hidden.bs.modal', () => {});
      }
    };
  }, []);
  const initializeSortable = () => {
    if (!templateObjects.length || !templateObjects[0]?.blocks) {
      return;
    }

    if (sortableRef.current) {
      sortableRef.current.destroy();
    }

    sortableRef.current = new Sortable(blocksContainerRef.current, {
      animation: 150,
      handle: `.${styles.templatesRowTableBodyRowRowsIconsSort}`,
      filter: `.${styles.templatesRowTableBodyRowRowsIconsSortDisabled}`,
      ghostClass: styles.sortableGhost,
      dragClass: styles.sortableDrag,
      onMove: (evt) => {
        // Get the first block element
        const firstBlock = blocksContainerRef.current.firstElementChild;
        
        if (firstBlock.dataset.isMovable === 'true')
        {
          return true;
        }
        // If trying to move before the first block
        if (evt.related === firstBlock) {
          return false;
        }
        
        // If trying to move the first block
        if (evt.dragged === firstBlock) {
          return false;
        }
        
        return true;
      },
      onEnd: (evt) => {
        if (!templateObjects.length || !templateObjects[0]?.blocks) {
          return;
        }

        // Don't allow moving the first block or moving to the first position
        
        if (evt.item.dataset.isMovable === 'false')
        {
          if (evt.oldIndex === 0 || evt.newIndex === 0) {
            evt.from.insertBefore(evt.item, evt.from.children[evt.oldIndex]);
            return;
          }
        }

        const updatedTemplateObjects = [...templateObjects];
        const blocks = [...updatedTemplateObjects[0].blocks];
        
        // Get all block elements in their current DOM order
        const blockElements = Array.from(blocksContainerRef.current.children);
        
        // Create new array based on DOM order
        const newBlocks = blockElements
          .map(element => {
            const blockIndex = parseInt(element.getAttribute('data-id'));
            return blocks[blockIndex];
          })
          .filter(block => block !== undefined); // Filter out any undefined blocks

        if (newBlocks.length !== blocks.length) {
          console.error('Block count mismatch after reordering');
          return;
        }

        console.log('New block order:', newBlocks.map(b => b.label));
        
        // Remap collapse state to new order using block.id
        setCollapsedBlocks(prev => {
          const newState = {};
          newBlocks.forEach(block => {
            newState[block.id] = prev[block.id] || false;
          });
          return newState;
        });

        updatedTemplateObjects[0].blocks = newBlocks;
        validateAllHeadings(updatedTemplateObjects);
        setTemplateObjects(updatedTemplateObjects);
        
        // Validate heading hierarchy after sorting
        
        saveDraft(updatedTemplateObjects, 'handleSort');
      }
    });
  };

 
  const validateAllHeadings = (template) => {
    if (!template || !template[0] || !template[0].blocks) return;
    const blocks = template[0].blocks;

    // Helper: get heading level
    const getHeadingLevel = (block) => {
      const headingProperty = block.groups
        .find(g => g.properties.some(p => p.id === 'heading_text_tag'))
        ?.properties.find(p => p.id === 'heading_text_tag');
      if (!headingProperty) return null;
      const value = headingProperty.values[0] || headingProperty.defaultValues[0];
      if (!value) return null;
      const match = value.match(/h(\d+)/i);
      return match ? parseInt(match[1]) : null;
    };

    // Helper: is block relevant for heading validation
    const isBlockRelevant = (block) => {
      if (!block) return false;
      // Must be enabled
      const enabledGroup = block.groups.find(g => g.id === 'enabled');
      const enabledProp = enabledGroup?.properties.find(p => p.id === 'enabled');
      if (!enabledProp || enabledProp.values[0] !== 'true') return false;
      // If image block, must be included
      if (block.id.includes('image')) {
        const imageGroup = block.groups.find(g => g.id === 'image');
        const includeProp = imageGroup?.properties.find(p => p.id === 'include');
        if (!includeProp || includeProp.values[0].toLowerCase() !== 'true') return false;
      }
      // Must have a heading (not 'none')
      const sectionHeadingGroup = block.groups.find(g => g.id === 'section_heading');
      const headingTextProp = sectionHeadingGroup?.properties.find(p => p.id === 'heading_text');
      if (!headingTextProp || headingTextProp.values[0]?.trim().toLowerCase() === 'none') return false;
      return true;
    };

    // Clear heading warnings for image blocks with include=false
    blocks.forEach(block => {
      if (block.id.includes('image')) {
        const imageGroup = block.groups.find(g => g.id === 'image');
        const includeProp = imageGroup?.properties.find(p => p.id === 'include');
        const contentSourceValue = block.groups.find(g => g.id === 'section_heading').properties.find(p => p.id === 'heading_text').values[0];
        if (includeProp && includeProp.values[0].toLowerCase() === 'false' || contentSourceValue.toLowerCase() === 'none') {
          block.warningMessage = block.warningMessage.filter(w => w.propertyId !== 'heading_text_tag');
        }
      }
      else
      {
        if (block.warningMessage.some(w => w.propertyId === 'heading_text_tag')) {
          const propertyWarningMessage = block.warningMessage.find(w => w.propertyId === 'heading_text_tag');
          block.warningMessage.splice(block.warningMessage.indexOf(propertyWarningMessage), 1);
        }
      }
    });

    // 1. Filter relevant blocks
    const relevantBlocks = blocks.filter(isBlockRelevant);

    // 2. Iterate and validate
    for (let i = 0; i < relevantBlocks.length; i++) {
      const current = relevantBlocks[i];
      const currentLevel = getHeadingLevel(current);
      // Remove any previous warning for heading hierarchy
      current.warningMessage = current.warningMessage.filter(w => w.propertyId !== 'heading_text_tag');
      if (i === 0) {
        // First block: should be H1 or H2
        if (currentLevel > 2) {
          current.warningMessage.push({ message: BlockMessagesEnum.Heading_Error, propertyId: 'heading_text_tag' });
        }
      } else {
        const previous = relevantBlocks[i - 1];
        const previousLevel = getHeadingLevel(previous);
        if (currentLevel > previousLevel + 1) {
          current.warningMessage.push({ message: BlockMessagesEnum.Heading_Error, propertyId: 'heading_text_tag' });
        }
      }
    }
  };
  const isKeywordBlockEnabled = (template) => {
    //if (!templateObjects || !templateObjects[0]?.blocks) return;
    const updatedTemplateObjects = [...template];
    const blocks = updatedTemplateObjects[0].blocks;

    // Find all keyword blocks
    const keywordBlock = blocks.filter(block => block.id === 'keyword');
    // Check if there are any enabled generate blocks
    const hasEnabledGenerateBlock = blocks.some(block => 
      block.id === 'generate' && 
      block.groups
        .find(g => g.id === 'enabled')
        ?.properties
        .find(p => p.id === 'enabled')
        ?.values[0] === 'true'
    );

    const hasEnabledKeywordBlock = keywordBlock.some(block => 
      block.id === 'keyword' &&
      block.groups
        .find(g => g.id === 'enabled')
        ?.properties
        .find(p => p.id === 'enabled')
        ?.values[0] === 'true'
    );

    const hasEnabledProductNameBlock = blocks.some(block => 
      block.id === 'name' &&
      block.groups
        .find(g => g.id === 'enabled')
        ?.properties
        .find(p => p.id === 'enabled')
        ?.values[0] === 'true'
    );
    const warningMessage = `Using any combination of AI-generated title, primary keyword, and ${templateType.toLowerCase().includes('category') ? 'category name' : 'product name'} may result in redundancy in the final output, as these elements can already contain or repeat parts of each other.`;
    blocks.forEach(block => {
      if (block.id === 'keyword' || block.id === 'generate' || block.id === 'name') {
        const enabledBlocksCount = [hasEnabledGenerateBlock, hasEnabledKeywordBlock, hasEnabledProductNameBlock].filter(Boolean).length;
        if (enabledBlocksCount >= 2) {
          if (block.id === 'keyword') {
            if (hasEnabledKeywordBlock) {
              if (!block.warningMessage?.some(w => w.propertyId === 'keyword')) {
                block.warningMessage = block.warningMessage || [];
                block.warningMessage.push({ message: warningMessage, propertyId: 'keyword'});
              }
              else
              {
                const propertyWarningMessage = block.warningMessage?.find(w => w.propertyId === 'keyword');
                if (propertyWarningMessage) {
                  propertyWarningMessage.message = warningMessage;
                }
              }
            }
            if (!hasEnabledKeywordBlock) {
              if (!block.warningMessage?.some(w => w.propertyId === 'keyword')) {
                block.warningMessage = block.warningMessage || [];
                block.warningMessage.push({ message: '', propertyId: ''});
              }
              else
              {
                const propertyWarningMessage = block.warningMessage?.find(w => w.propertyId === 'keyword');
                if (propertyWarningMessage) {
                  propertyWarningMessage.message = '';
                }
              }
            }
          }
          if (block.id === 'name') {
            if (hasEnabledProductNameBlock) {
              if (!block.warningMessage?.some(w => w.propertyId === 'name')) {
                block.warningMessage = block.warningMessage || [];
                block.warningMessage.push({ message: warningMessage, propertyId: 'name'});
              }
              else
              {
                const propertyWarningMessage = block.warningMessage?.find(w => w.propertyId === 'name');
                if (propertyWarningMessage) {
                  propertyWarningMessage.message = warningMessage;
                }
              }
            }
            if (!hasEnabledProductNameBlock) {
              if (!block.warningMessage?.some(w => w.propertyId === 'name')) {
                block.warningMessage = block.warningMessage || [];
                block.warningMessage.push({ message: '', propertyId: ''});
              }
              else
              {
                const propertyWarningMessage = block.warningMessage?.find(w => w.propertyId === 'name');
                if (propertyWarningMessage) {
                  propertyWarningMessage.message = '';
                }
              }
            }
          }

          if (block.id === 'generate') {
            if (hasEnabledGenerateBlock) {
              if (!block.warningMessage?.some(w => w.propertyId === 'generate')) {
                block.warningMessage = block.warningMessage || [];
                block.warningMessage.push({ message: warningMessage, propertyId: 'generate'});
              }
              else
              {
                const propertyWarningMessage = block.warningMessage?.find(w => w.propertyId === 'generate');
                if (propertyWarningMessage) {
                  propertyWarningMessage.message = warningMessage;
                }
              }
            }
            if (!hasEnabledGenerateBlock) {
              if (!block.warningMessage?.some(w => w.propertyId === 'generate')) {
                block.warningMessage = block.warningMessage || [];
                block.warningMessage.push({ message: '', propertyId: ''});
              }
              else
              {
                const propertyWarningMessage = block.warningMessage?.find(w => w.propertyId === 'generate');
                if (propertyWarningMessage) {
                  propertyWarningMessage.message = '';
                }
              }
            }
          }
        } else {
          if (!block.warningMessage?.some(w => w.propertyId === block.id)) {
            block.warningMessage = block.warningMessage || [];
            block.warningMessage.push({ message: '', propertyId: block.id});
          }
          else
          {
            const propertyWarningMessage = block.warningMessage?.find(w => w.propertyId === block.id);
            if (propertyWarningMessage) {
              propertyWarningMessage.message = '';
            }
          }
        }
      }
    });
    //setTemplateObjects(updatedTemplateObjects);
    return updatedTemplateObjects;
  }

  const validateAllImageBlocksImageToInclude = async (template) => {
    let blocks = [...template[0].blocks];
    
    // Get all image blocks
    const imageBlocks = blocks.filter(block => 
      block.id.includes('image') && 
      block.groups.find(g => g.id === 'enabled')?.properties.find(p => p.id === 'enabled')?.values[0] === 'true'
    );
    
    // Clear all warning messages first
    // imageBlocks.forEach(block => {
    //   //splice the warning message  
    //   if (block.warningMessage.some(w => w.propertyId === 'choice')) {
    //     const propertyWarningMessage = block.warningMessage.find(w => w.propertyId === 'choice');
    //     block.warningMessage.splice(block.warningMessage.indexOf(propertyWarningMessage), 1);
    //   }
    // });

    // For each image block
    imageBlocks.forEach(async block => {
      // Find the image group and choice property
      const imageGroup = block.groups.find(g => g.id === 'image');
      if (!imageGroup) return;

      const choiceProperty = imageGroup.properties.find(p => p.id === 'choice');
      if (!choiceProperty) return;

      const choiceValue = choiceProperty.values[0];
      if (!choiceValue) return;

      // Find other blocks with the same choice value
      const duplicateBlocks = await new Promise(resolve => {
        const duplicates = imageBlocks.filter(otherBlock => {
        if (otherBlock.id === block.id) return false; // Skip self
        
        const otherImageGroup = otherBlock.groups.find(g => g.id === 'image');
        if (!otherImageGroup) return false;

        const otherChoiceProperty = otherImageGroup.properties.find(p => p.id === 'choice');
        if (!otherChoiceProperty) return false;

        if (otherChoiceProperty.values[0] === choiceValue) {
            if (otherChoiceProperty.values[0].toLowerCase().includes('random') && choiceValue.toLowerCase().includes('random'))
            {
              return false;
            }
            return true;
          }
          return false;
        });
        resolve(duplicates);
        });
      // If there are duplicates, add warning message
      if (duplicateBlocks.length > 0) {
        if (!block.warningMessage.some(w => w.propertyId === 'choice')) {
          block.warningMessage.push({ message: BlockMessagesEnum.Image_Include_Warning, propertyId: 'choice'});
        }
        else
        {
          const propertyWarningMessage = block.warningMessage.find(w => w.propertyId === 'choice');
          propertyWarningMessage.message = BlockMessagesEnum.Image_Include_Warning;
        }
      }
      else
      {
        if (block.warningMessage.some(w => w.propertyId === 'choice')) {
          const propertyWarningMessage = block.warningMessage.find(w => w.propertyId === 'choice');
          block.warningMessage.splice(block.warningMessage.indexOf(propertyWarningMessage), 1);
        }
      }
    });
  }
  const getMasterTemplates = async () => {
    const response = await ApiService.get('/Templates/master');
    return response.data;
  }

  const getMasterTemplate = async (template) => {
    const response = await ApiService.get(`/Templates/master/${template.id}/model`);
    return response.data;
  }
  
  

  const handleCheckboxChange = async (index, blockIndex, blockEnabled) => {
    if (blockIndex == 0 && !blockEnabled) {
      if (templateObjects[0].blocks[blockIndex].id === 'title') {
        const { Modal } = require("bootstrap")
        const myModals = new Modal("#message");
        
        // Create a Promise that resolves when the user clicks "I understand"
        const modalPromise = new Promise((resolve) => {
          const modalElement = document.getElementById('message');
          const understandButton = modalElement.querySelector('.btn-primary');
          let isConfirmed = false;
          
          const handleConfirm = () => {
            isConfirmed = true;
            understandButton.removeEventListener('click', handleConfirm);
          };
          
          const handleModalHidden = () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);
            understandButton.removeEventListener('click', handleConfirm);
            resolve(isConfirmed);
          };
          
          understandButton.addEventListener('click', handleConfirm);
          modalElement.addEventListener('hidden.bs.modal', handleModalHidden);
        });
        
        myModals.show();
        
        // Wait for user response
        const confirmed = await modalPromise;
        if (!confirmed) {
          return; // Exit if user didn't confirm
        }
      }
    }
    
    let updatedTemplateObjects = [...templateObjects];
    updatedTemplateObjects[0].blocks[blockIndex].groups.find(g=>g.id === 'enabled').properties.find(p=>p.id === 'enabled').values = [(!blockEnabled).toString()]
    
    if (updatedTemplateObjects[0].blocks[blockIndex].id !== 'title') {
      const blockToUpdate = updatedTemplateObjects[0].blocks[blockIndex];
      const warningMessageToUpdate = blockToUpdate.warningMessage.find(w => w.propertyId === blockToUpdate.id);
      if (warningMessageToUpdate) {
        warningMessageToUpdate.message = updatedTemplateObjects[0].blocks[blockIndex].groups.some(g=>g.id === 'section_heading') ? updatedTemplateObjects[0].blocks[blockIndex].groups.find(g=>g.id === 'section_heading').properties.find(p => p.id === 'heading_text_custom').values[0].trim() === '' ? `${updatedTemplateObjects[0].blocks[blockIndex].groups.find(g=>g.id === 'section_heading').properties.find(p => p.id === 'heading_text').label} is empty or contains only whitespace` : '' : '';
      }
    }
    validateAllHeadings(updatedTemplateObjects);
    if (updatedTemplateObjects[0].blocks[blockIndex].id === 'keyword' || updatedTemplateObjects[0].blocks[blockIndex].id === 'generate' || updatedTemplateObjects[0].blocks[blockIndex].id === 'name')  {
      updatedTemplateObjects = isKeywordBlockEnabled(updatedTemplateObjects);
    }
    setTemplateObjects(updatedTemplateObjects);
    const block = updatedTemplateObjects[0].blocks[blockIndex];
    let validateallImageBlocks = true;
    let foundProperty = null;
    for (const group of block.groups) {
      foundProperty = group.properties.find(p => p.id === 'choice');
      if (foundProperty) {
        if (foundProperty.values[0].toLowerCase().includes('random')) {
          //remove warning message
          const propertyWarningMessage = block.warningMessage.find(w => w.propertyId === propertyId);
          if (propertyWarningMessage) {
            block.warningMessage.splice(block.warningMessage.indexOf(propertyWarningMessage), 1);
          }
          validateallImageBlocks = false;
        }
        break;
      }
    }
    if(validateallImageBlocks) {
      validateAllImageBlocksImageToInclude(updatedTemplateObjects);
    }
    saveDraft(updatedTemplateObjects, 'handleCheckboxChange');
    setHasEnabledBlock(updatedTemplateObjects[0].blocks.some(block => block.groups.find(g => g.id === 'enabled')?.properties.find(p => p.id === 'enabled')?.values[0] === 'true'));
  };


  const handleNumberFieldChange = (index, blockIndex, groupIndex, propertyIndex, value) => {
    if (isNaN(value) || value < 0) {
      return;
    }
    const updatedTemplateObjects = [...templateObjects];
    const block = updatedTemplateObjects[index].blocks[blockIndex];
    const property = block.groups[groupIndex].properties[propertyIndex];
    property.values = [value];
    setTemplateObjects(updatedTemplateObjects);
    saveDraft(updatedTemplateObjects, 'handleNumberFieldChange');
  };

  const handleDropdownChange = (blockIndex, propertyIndex, value, propertyId) => {
    const updatedTemplateObjects = [...templateObjects];
    const block = updatedTemplateObjects[0].blocks[blockIndex];
    let validateallImageBlocks = true;
    let foundProperty = null;
    for (const group of block.groups) {
      foundProperty = group.properties.find(p => p.id === propertyId);
      if (foundProperty) {
        foundProperty.values = [value];
        // if (foundProperty.values[0].toLowerCase().includes('random')) {
        //   //remove warning message
        //   const propertyWarningMessage = block.warningMessage.find(w => w.propertyId === propertyId);
        //   if (propertyWarningMessage) {
        //     block.warningMessage.splice(block.warningMessage.indexOf(propertyWarningMessage), 1);
        //   }
        //   validateallImageBlocks = false;
        // }
        break;
      }
    }
    validateAllHeadings(updatedTemplateObjects);
    headingHasContentText(block);
    //hasEmptyPrompt(block);
    setTemplateObjects(updatedTemplateObjects);
    //if(validateallImageBlocks) {
      validateAllImageBlocksImageToInclude(updatedTemplateObjects);
    //}
    saveDraft(updatedTemplateObjects, 'handleDropdownChange');

  };

  const handleTextFormattingChange = (blockIndex, propertyId, propertyIndex, updatedProperties) => {
    const updatedTemplateObjects = [...templateObjects];
    const block = updatedTemplateObjects[0].blocks[blockIndex];
    for (const group of block.groups) {
      let foundProperty = null;
      foundProperty = group.properties.find(p => p.id === propertyId);
      if (foundProperty) {
        const selectedIds = updatedProperties
          .filter(prop => prop.values && prop.values.length > 0)
          .map(prop => prop.id);
        foundProperty.values = selectedIds;
        group.properties[propertyIndex] = foundProperty;
      }
    }
    setTemplateObjects(updatedTemplateObjects);
    saveDraft(updatedTemplateObjects, 'handleTextFormattingChange');
  };

  const handleSingleSelectChange = (blockIndex, propertyIndex, updatedProperties, propertyId) => {
    const updatedTemplateObjects = [...templateObjects];
    if (!updatedTemplateObjects[0]?.blocks?.[blockIndex]) {
      console.error('Invalid block index:', blockIndex);
      return;
    }
    const block = updatedTemplateObjects[0].blocks[blockIndex];
    let foundProperty = null;
    for (const group of block.groups) {
      foundProperty = group.properties.find(p => p.id === propertyId);
      if (foundProperty) {
        const selectedOption = updatedProperties.find(prop => prop.values && prop.values.length > 0);
        foundProperty.values = selectedOption ? [selectedOption.id] : [];
        break;
      }
    }
    if (!foundProperty) {
      console.error('Property not found with ID:', propertyId);
      return;
    }
    if(propertyId !== 'structure') {
      validateAllHeadings(updatedTemplateObjects);
    }
    // headingHasContentText(block);
    // hasEmptyPrompt(block);
    setTemplateObjects(updatedTemplateObjects);
    saveDraft(updatedTemplateObjects, 'handleSingleSelectChange');
  };

  const handleTextStructureChange = (blockIndex, propertyIndex, options) => {
    const updatedTemplateObjects = [...templateObjects];
    const block = updatedTemplateObjects[0].blocks[blockIndex];
    updatedTemplateObjects[0].blocks[blockIndex].properties[propertyIndex].propertyValues = options;
    setTemplateObjects(updatedTemplateObjects);
    saveDraft(updatedTemplateObjects, 'handleTextStructureChange');
  };

  const handlePropertyCheckboxChange = (blockIndex, propertyIndex, propertyId, value) => {
    const updatedTemplateObjects = [...templateObjects];
    const block = updatedTemplateObjects[0].blocks[blockIndex];
    let foundProperty = null;
    for (const group of block.groups) {
      foundProperty = group.properties.find(p => p.id === propertyId);
      if (foundProperty) {
        foundProperty.values = [(value).toString()];
        break;
      }
    }
    validateAllHeadings(updatedTemplateObjects);
    validateAllImageBlocksImageToInclude(updatedTemplateObjects);
    headingHasContentText(block);
    setTemplateObjects(updatedTemplateObjects);
    saveDraft(updatedTemplateObjects, 'handlePropertyCheckboxChange');
  }
  const handleTextFieldChange = (blockIndex, propertyIndex, propertyId, value, group) => {
    const updatedTemplateObjects = [...templateObjects];
    const block = updatedTemplateObjects[0].blocks[blockIndex];
    let foundProperty = null;
    for (const group of block.groups) {
      foundProperty = group.properties.find(p => p.id === propertyId);
      if (foundProperty) {
        foundProperty.values = [value];
        break;
      }
    }
    
    if (value.trim() !== '') {
      validateAllHeadings(updatedTemplateObjects);
    }
    if (propertyId === 'name') {
      foundProperty = group.properties.find(p => p.id === propertyId);
      if (value.trim() === '') {
        addBlockError(block, 'name', `${foundProperty.label} cannot be empty. Please enter content.`);
      } else {
        removeBlockError(block, 'name');
      }
    }
    else
    {
      headingHasContentText(block);
      if (propertyId === 'prompt')
        hasEmptyPrompt(block);
    }
    setTemplateObjects(updatedTemplateObjects);
    saveDraft(updatedTemplateObjects, 'handleTextFieldChange');
  };

  const handleTemplateTitleChange = (value) => {
    setTemplateName(value);
    // Clear error state when user enters valid content
    if (value.trim() !== '' && templateNameError) {
      setTemplateNameError(false);
    }
    // Set error state when input becomes empty
    if (value.trim() === '') {
      setTemplateNameError(true);
    }
  };
  const saveDraft = async (object, fromcaller) => {
   // if (template == '') return;
    
    const templateId = object[0].id;
    if (templateId !== '') {
            
    const templateObjectCopy = JSON.parse(JSON.stringify(object));
    //remove all warningMessages and errorMEssages on templateObjectCopy
    templateObjectCopy[0].blocks.forEach(block => {
      delete block.warningMessage;
      block.errorMessage = '';
    });

        try {
          const preview = await ApiService.post(`/Templates/user/${templateId}/preview-with-credits`, templateObjectCopy[0]);
          setGeneratedPreview(preview.data);
        } catch (error) {
          setGeneratedPreview(null);
        }
      }
  };

  const handleCancel = () => {
    router.push('/Templates');
  };

  const save = async () => {
    if(!templateName || templateName.trim() === '' ) {
      setModalWarningTitle("Action required");
      setModalWarningMessage("Please enter a name for your template before saving changes.");
      setTemplateNameError(true);
      const { Modal } = require("bootstrap");
      if (!warningModalRef.current) {
        warningModalRef.current = new Modal("#modalWarnings");
      }
      warningModalRef.current.show();
      
      // Set focus to template name input after showing the modal
      setTimeout(() => {
        const templateNameInput = document.getElementById('templateNameInput');
        if (templateNameInput) {
          templateNameInput.focus();
        }
      }, 100);
      
      return;
    }
    
    if(!templateObjects || templateObjects.length === 0 || !hasEnabledBlocks()) {
      setModalWarningTitle("Action required");
      setModalWarningMessage("Please enable at least one block before saving changes.");
      const { Modal } = require("bootstrap");
      const warningModal = new Modal("#modalWarnings");
      warningModal.show();
      return;
    }
      const enabledBlocks = templateObjects[0].blocks.filter(block => {
        const enabledGroup = block.groups.find(group => group.id === "enabled");
        if (!enabledGroup) return false;
        const enabledProperty = enabledGroup.properties.find(prop => prop.id === "enabled");
        if (!enabledProperty) return false;
        return enabledProperty.values[0] === "true";
      });
      
      // Check brand validation first before calling headingHasContentText
      if (enabledBlocks.some(b => b.id === 'brand'))
      {
        const brandBlock = enabledBlocks.find(b=>b.id === 'brand');
        const brandNameValue = brandBlock.groups.find(g=>g.id === 'name').properties.find(p=>p.id === 'name').values[0];
        const hasErrors = brandNameValue.trim() === '';
        if (hasErrors) {
          // Set the error message on the brand block
          addBlockError(brandBlock, 'name', `${brandBlock.groups.find(g=>g.id === 'name').properties.find(p => p.id === 'name').label} cannot be empty. Please enter content.`);
          setTemplateObjects([...templateObjects]); // Update the state to show the error
          setModalWarningTitle("Action required");
          setModalWarningMessage("Please enter a brand name before saving changes.");
          const { Modal } = require("bootstrap");
          const warningModal = new Modal("#modalWarnings");
          warningModal.show();
          return;
        }
      }

      if (enabledBlocks.some(b=>b.id.includes('custom')))
      {
        const customPromptBlocks = enabledBlocks.filter(b=>b.id.includes('custom'));
        let hasEmptyPrompts = false;
        customPromptBlocks.forEach(block => {
          if(hasEmptyPrompt(block)) {
            hasEmptyPrompts = true;
          }
        });
        if (hasEmptyPrompts) {
          setModalWarningTitle("Action required");
          setModalWarningMessage("Please enter a prompt before saving changes.");
          const { Modal } = require("bootstrap");
          const warningModal = new Modal("#modalWarnings");
          warningModal.show();
          return;
        }
      }
      
      let hasEmptyContentText = false;
      enabledBlocks.forEach(block => {
        if (!headingHasContentText(block)) {
          hasEmptyContentText = true;
          return;
        }
      });
      if (hasEmptyContentText) {
        setModalWarningTitle("Action required");
        setModalWarningMessage("The template contains errors and cannot be saved. Please review and correct all errors before saving changes.");
        const { Modal } = require("bootstrap");
        const warningModal = new Modal("#modalWarnings");
        warningModal.show();
        return;
      }
    
    setLoading(true);
    
    const templateObjectCopy = JSON.parse(JSON.stringify(templateObjects));
    //remove all warningMessages and errorMEssages on templateObjectCopy
    templateObjectCopy[0].blocks.forEach(block => {
      delete block.warningMessage;
      delete block.errorMessage;
    });
    

    const templateData = {
        Name: templateName,
        Model: templateObjectCopy[0]
      }
      await ApiService.post(`/Templates/user/${id}/update`, templateData).then(response => {
        setLoading(false);
        showToast({
          type: 'success',
          message: 'Saved successfully.',
          duration: 3000,
          position: 'top-center',
          closeOnClick: true
        });
        // router.push('/Templates');
      }).catch(error => {
        setLoading(false);
        setErrorMessage(error.response.data.error);
        const { Modal } = require("bootstrap");
        const errorModal = new Modal("#errorMessage");
        errorModal.show();
      });
  };

  const getImageBlock = async (templateType) => {
    const response = await ApiService.get(`/Templates/blocktemplates/Image?contentType=${templateType}`);
    return response.data;
  }

  const getSymbolBlock = async (templateType) => {
    const response = await ApiService.get(`/Templates/blocktemplates/Symbol?contentType=${templateType}`);
    return response.data;
  }

  const getCustomBlock = async (templateType) => {
    const response = await ApiService.get(`/Templates/blocktemplates/Custom?contentType=${templateType}`);
    return response.data;
  }
  const checkBlockTypes = async (selectedTemplateType) => {
    try {
      const [imageBlockResult, symbolBlockResult, customBlockResult] = await Promise.all([
        getImageBlock(selectedTemplateType),
        getSymbolBlock(selectedTemplateType),
        getCustomBlock(selectedTemplateType)
      ]);

      return {
        image: {
          block: imageBlockResult.length > 0 ? imageBlockResult[imageBlockResult.length - 1] : [],
          allowed: imageBlockResult.length > 0 ? imageBlockResult[imageBlockResult.length - 1].allowableTypes.includes(selectedTemplateType) : false,
          maxCount: imageBlockResult.length > 0 ? imageBlockResult[imageBlockResult.length - 1].max : 0
        },
        symbol: {
          block: symbolBlockResult.length > 0 ? symbolBlockResult[symbolBlockResult.length - 1] : [],
          allowed: symbolBlockResult.length > 0 ? symbolBlockResult[symbolBlockResult.length - 1].allowableTypes.includes(selectedTemplateType) : false,
          maxCount: symbolBlockResult.length > 0 ? symbolBlockResult[symbolBlockResult.length - 1].max : 0
        },
        custom: {
          block: customBlockResult.length > 0 ? customBlockResult[customBlockResult.length - 1] : [],
          allowed: customBlockResult.length > 0 ? customBlockResult[customBlockResult.length - 1].allowableTypes.includes(selectedTemplateType) : false,
          maxCount: customBlockResult.length > 0 ? customBlockResult[customBlockResult.length - 1].max : 0
        }
      };
    } catch (error) {
      console.error('Error checking block types:', error);
      return {
        image: { block: [], allowed: false, maxCount: 0 },
        symbol: { block: [], allowed: false, maxCount: 0 },
        custom: { block: [], allowed: false, maxCount: 0 }
      };
    }
  };

    
  const blockTypeCountMax = async (template, blockTypes) => {
    //count block instances on template blocks
    const customLength = template[0].blocks.filter(b=>b.id.includes('custom')).length;
    const imageLength = template[0].blocks.filter(b=>b.id.includes('image')).length
    const symbolLength = template[0].blocks.filter(b=>b.id.includes('symbol')).length

    return {
      customBlockMax: customLength == blockTypes.custom.maxCount,
      imageBlockMax: imageLength == blockTypes.image.maxCount,
      symbolBlockMax: symbolLength == blockTypes.symbol.maxCount
    }
  }

  const handleAddImageBlock = async (blockIndex) => {
    const imageBlockObjects = Array.isArray(imageBlock) ? imageBlock : [imageBlock];
    const imageBlocksMax = imageBlockObjects[0].max
    // Create a deep copy of the block object
    const block = JSON.parse(JSON.stringify(imageBlockObjects[0].block));
    block.warningMessage = [];
    block.errorMessage = [];

    //get epoch time
    const epochTime = Date.now();
    block.id = `image_${epochTime}`;

    //count all image blocks in templateObjects, if it is equal to imageBlocksMax, return
    let imageBlocksCount = templateObjects[0].blocks.filter(block => block.id.includes('image')).length;
    if(imageBlocksCount == imageBlocksMax) {
      return;
    } 
    
    // Get all currently selected include values
    const selectedIncludes = templateObjects[0].blocks
      .filter(block => block.id.includes('image'))
      .map(block => {
        const imageGroup = block.groups.find(g => g.id === 'image');
        if (!imageGroup) return null;
        const includeProperty = imageGroup.properties.find(p => p.id === 'choice');
        return includeProperty ? includeProperty.values[0] : null;
      })
      .filter(value => value !== null);

    // Find the first available option that hasn't been selected
    const imageGroup = block.groups.find(g => g.id === 'image');
    if (imageGroup) {
      const includeProperty = imageGroup.properties.find(p => p.id === 'choice');
      if (includeProperty && includeProperty.options) {
        const firstUnusedOption = includeProperty.options.find(option => !selectedIncludes.includes(option.id));
        if (firstUnusedOption) {
          includeProperty.values = [firstUnusedOption.id];
        }
      }
    }

    
    //add block to templateObjects at blockIndex
    const updatedTemplateObjects = [...templateObjects];
    updatedTemplateObjects[0].blocks.splice(blockIndex + 1, 0, block);
      
    //checking of image blocks are max
    imageBlocksCount = templateObjects[0].blocks.filter(block => block.id.includes('image')).length;
    setIsImageBlockMax(imageBlocksCount == imageBlocksMax);

    setTemplateObjects(updatedTemplateObjects);
    saveDraft(updatedTemplateObjects, 'handleAddImageBlock');
  };

  const handleAddSymbolBlock = async (blockIndex) => {
    const symbolBlockObjects = Array.isArray(symbolBlock) ? symbolBlock : [symbolBlock];
    const symbolBlocksMax = symbolBlockObjects[0].max
    // Create a deep copy of the block object
    const block = JSON.parse(JSON.stringify(symbolBlockObjects[0].block));
    
    block.warningMessage = [];
    block.errorMessage = [];

    //get epoch time
    const epochTime = Date.now();
    block.id = `symbol_${epochTime}`;

    //count all symbol blocks in templateObjects, if it is equal to symbolBlocksMax, return
    let symbolBlocksCount = templateObjects[0].blocks.filter(block => block.id.includes('symbol')).length;
    if(symbolBlocksCount == symbolBlocksMax) {
      return;
    }

    //add block to templateObjects at blockIndex
    const updatedTemplateObjects = [...templateObjects];
    updatedTemplateObjects[0].blocks.splice(blockIndex + 1, 0, block);

    //checking of symbol blocks are max
    symbolBlocksCount = templateObjects[0].blocks.filter(block => block.id.includes('symbol')).length;
    setIsSymbolBlockMax(symbolBlocksCount == symbolBlocksMax);

    setTemplateObjects(updatedTemplateObjects);
    saveDraft(updatedTemplateObjects, 'handleAddSymbolBlock');
  }

  const handleAddCustomBlock = async (blockIndex) => {
    const customBlockObjects = Array.isArray(customBlock) ? customBlock : [customBlock];
    const customBlocksMax = customBlockObjects[0].max

    // Create a deep copy of the block object
    const block = JSON.parse(JSON.stringify(customBlockObjects[0].block));
    block.warningMessage = [];
    block.errorMessage = [];

    //get epoch time
    const epochTime = Date.now();
    block.id = `custom_${epochTime}`;

    //count all custom blocks in templateObjects, if it is equal to customBlocksMax, return
    let customBlocksCount = templateObjects[0].blocks.filter(block => block.id.includes('custom')).length;
    if(customBlocksCount == customBlocksMax) {
      return;
    }

    //add block to templateObjects at blockIndex
    const updatedTemplateObjects = [...templateObjects];
    updatedTemplateObjects[0].blocks.splice(blockIndex + 1, 0, block);

    //checking of custom blocks are max
    customBlocksCount = templateObjects[0].blocks.filter(block => block.id.includes('custom')).length;
    setIsCustomBlockMax(customBlocksCount == customBlocksMax);

    setTemplateObjects(updatedTemplateObjects);
    validateAllHeadings(updatedTemplateObjects);
    saveDraft(updatedTemplateObjects, 'handleAddCustomBlock');
  }

  const handleDeleteBlock = async (blockIndex) => {
    const updatedTemplateObjects = [...templateObjects];
    updatedTemplateObjects[0].blocks.splice(blockIndex, 1); 
    const blockTypes = await checkBlockTypes(templateType);
    const imageBlocksCount = templateObjects[0].blocks.filter(block => block.id.includes('image')).length;
    const symbolBlocksCount = templateObjects[0].blocks.filter(block => block.id.includes('symbol')).length;
    const customBlocksCount = templateObjects[0].blocks.filter(block => block.id.includes('custom')).length;
    if(imageBlocksCount != blockTypes.image.maxCount) {
      setIsImageBlockMax(false);
    }
    if(symbolBlocksCount != blockTypes.symbol.maxCount) {
      setIsSymbolBlockMax(false);
    }
    if(customBlocksCount != blockTypes.custom.maxCount) {
      setIsCustomBlockMax(false);
    }
    setImageBlock(blockTypes.image.block);
    setImageBlockAllowed(blockTypes.image.allowed);
    setSymbolBlock(blockTypes.symbol.block);
    setSymbolBlockAllowed(blockTypes.symbol.allowed); 
    setCustomBlock(blockTypes.custom.block);
    setCustomBlockAllowed(blockTypes.custom.allowed);
    validateAllHeadings(updatedTemplateObjects);
    validateAllImageBlocksImageToInclude(updatedTemplateObjects);
    setTemplateObjects(updatedTemplateObjects);
    const blocksMax = await blockTypeCountMax(updatedTemplateObjects,blockTypes);

    setIsImageBlockMax(blocksMax.imageBlockMax);
    setIsSymbolBlockMax(blocksMax.symbolBlockMax);
    setIsCustomBlockMax(blocksMax.customBlockMax);
    
    saveDraft(updatedTemplateObjects, 'handleDeleteBlock');
  };
  const hasEnabledBlocks = () => {
    try
    {
      const blocks = templateObjects[0].blocks;
      const enabledBlocks = blocks.filter(block => block.groups.find(g=>g.id === 'enabled').properties.find(p=>p.id === 'enabled').values[0] === 'true');
      return enabledBlocks.length > 0;
    } catch (error) {
      return true;
    }
  }
  
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

  // Helper functions for managing block errors
  const addBlockError = (block, propertyId, message) => {
    if (!block.errorMessage.some(e => e.propertyId === propertyId)) {
      block.errorMessage.push({ message, propertyId });
    } else {
      const errorMessage = block.errorMessage.find(e => e.propertyId === propertyId);
      errorMessage.message = message;
    }
  };

  const removeBlockError = (block, propertyId) => {
    const errorToRemove = block.errorMessage?.find(e => e.propertyId === propertyId);
    if (errorToRemove) {
      block.errorMessage.splice(block.errorMessage.indexOf(errorToRemove), 1);
    }
  };

  const clearBlockErrors = (block) => {
    block.errorMessage = [];
  };

  const hasBlockErrors = (block) => {
    return block.errorMessage.some(e => e.message !== '');
  };

  const getPropertyError = (block, propertyId) => {
    const error = block.errorMessage.find(e => e.propertyId === propertyId);
    return error ? error.message : '';
  };

  const expandCollapseAll = () => {
    const updatedCollapsedBlocks = { ...collapsedBlocks };
    templateObjects[0].blocks.forEach(block => {
      if(!hasPropertyTypeNone(block))
      {
        updatedCollapsedBlocks[block.id] = isAnyExpanded ? false : true;
      }
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
  
  const isBlockEnabled = (blockParam) => {
    // If block is null/undefined, return true as default
    if (!blockParam) return true;


    // Find the enabled group
    const enabledGroupProperties = blockParam.groups.find(g=>g?.id === 'enabled')?.properties;
    if (!enabledGroupProperties) return true;

    // Find the enabled property
    const enabledProperty = enabledGroupProperties?.find(prop => prop.id === 'enabled');
    if (!enabledProperty){
      return true;
    }
    // Return true if the value is 'true', false otherwise
    return enabledProperty.values[0] === 'true';
  }
  const headingHasContentText = (block) => {
    
    const groups = block.groups;
    const properties = groups.flatMap(group => group.properties);
    
    if (block.id.includes('custom'))
    {
      if (properties.find(p=>p.id === 'heading_text').values[0] === 'none')
      {
        removeBlockError(block, 'heading_text_custom');
        return true;
      }
    }
    if (block.id.includes('image'))
    {
      if (properties.find(p=>p.id === 'include').values[0] === 'false')
      {
        removeBlockError(block, 'heading_text_custom');
        return true;
      }
    }
    if (block.id === 'conclusion')
    {
      // Special case for conclusion block - both heading_text and content_text are required
      const headingTextProperty = properties.find(p => p.id === 'heading_text');
      const contentTextProperty = properties.find(p => p.id === 'content_text');
      let hasErrors = false;
      
      // Check heading_text
      if (headingTextProperty) {
        const headingValue = headingTextProperty.values[0];
        const isHeadingTextCustom = headingValue?.trim() === 'custom';
        
        if (isHeadingTextCustom) {
          const headingCustomProperty = properties.find(p => p.id === 'heading_text_custom');
          if (headingCustomProperty && (!headingCustomProperty.values[0] || headingCustomProperty.values[0].trim() === '')) {
            addBlockError(block, 'heading_text_custom', `${headingTextProperty.label} cannot be empty. Please enter content or select a different content source.`);
            hasErrors = true;
          } else {
            removeBlockError(block, 'heading_text_custom');
          }
        } else {
          removeBlockError(block, 'heading_text_custom');
        }
      }
      
      // Check content_text
      if (contentTextProperty) {
        const contentValue = contentTextProperty.values[0];
        const isContentTextCustom = contentValue?.trim() === 'custom';
        
        if (isContentTextCustom) {
          const contentCustomProperty = properties.find(p => p.id === 'context_text_custom');
          if (contentCustomProperty && (!contentCustomProperty.values[0] || contentCustomProperty.values[0].trim() === '')) {
            addBlockError(block, 'context_text_custom', `${contentTextProperty.label} cannot be empty. Please enter content or select a different content source.`);
            hasErrors = true;
          } else {
            removeBlockError(block, 'context_text_custom');
          }
        } else {
          removeBlockError(block, 'context_text_custom');
        }
      }
      
      return !hasErrors;
    }
    const textFields = properties.filter(property => property.type === BlockPropertyTypeEnum.TextField);
    if (textFields.length === 0) {
      return true;
    }
    const hasEmptyText = textFields.some(p=>p.values[0] == undefined || p.values[0].trim() === '');
    const isHeadingTextCustom = properties.some(p => p.id === "heading_text") ? properties.find(p=>p.id === "heading_text").values[0].trim() == 'custom'  ? true : false : false;
    
    const errorText = properties.some(p => p.id === "heading_text") && `${properties.find(p => p.id === "heading_text").label} cannot be empty. Please enter content or select a different content source.`;

    if (isHeadingTextCustom) {
      if (hasEmptyText) {
        addBlockError(block, 'heading_text_custom', errorText);
      } else {
        removeBlockError(block, 'heading_text_custom');
      }
    } else {
      removeBlockError(block, 'heading_text_custom');
    }
    
    return isHeadingTextCustom ? !hasEmptyText : true;
  }
  
  const hasEmptyPrompt = (block) => {
    const groups = block.groups;
    const properties = groups.flatMap(group => group.properties);
    
    const textFields = properties.filter(property => property.id === 'prompt');
    if (textFields.length === 0){
      return false;
    }

    const hasEmptyText = textFields.some(p=>p.values[0] == undefined || p.values[0].trim() === '');
    const errorText = `Prompt cannot be empty.`;
    
    if (hasEmptyText) {
      addBlockError(block, 'prompt', errorText);
    } else {
      removeBlockError(block, 'prompt');
    }
    
    return hasEmptyText;
  }
  // if (loading) {
  //   return <LoadingScreen />;
  // }

  if (!userData) {
    return null;
  }
  
  const hasWarningMessages = (block) => {
    if (block.warningMessage.length === 0) {
      return false;
    }
    return block.warningMessage.some(w => w.message !== '');
  }

  const propertyWarningMessage = (block, propertyId) => {
    const message = block.warningMessage.find(w => w.propertyId === propertyId);
    if (message) {
      if (message.message !== '') {
        return true;
      }
    }
    return false;
  }

  const hasProAccess = () => {
    return userData.credit.hasProAccess;
  }
  return (
    <Body>
      <Content>
      {/* {loading && <LoadingContent />} */}
      <H1Popup target="message" templateType={selectedTemplate} />
      <ErrorPopup target="errorMessage" errorMessage={errorMessage} />
      <ModalWarnings target="modalWarnings" title={modalWarningTitle} warningMessage={modalWarningMessage} />
        <div className={`${styles.templatesContainerAdd}`}>
          <div className={`d-flex ${styles.stickyElement}`}>
            <div>
              <p className='mb-14 font-24 d-flex'>
                <p className={`${styles.backBtn}`} onClick={handleCancel}></p>
                <input id='templateNameInput' className={`form-control ${styles.templateInput} ${templateNameError ? styles.hasTemplateError : ''}`} type="text" placeholder="Enter template name…" value={templateName} onChange={(e) => handleTemplateTitleChange(e.target.value)} />
              </p>
            </div>
            <div className="ms-auto mb-20">
                  <input 
                    id='save' 
                    type="submit" 
                    className="btn btn-primary submit-button ms-auto" 
                    value="Save changes" 
                    onClick={save} 
                    style={{width: '137px'}} 
                  />
            </div>
          </div>
          <div className="d-flex">
            <div className={`${styles.templatesContainerLeft} ${isNotMaximized ? styles.notMaximized : ''}`}>
            {selectedTemplate !== '' &&
                selectedTemplate.toLowerCase() !== 'select template/s' &&
                selectedTemplate.toLowerCase() !== 'product meta title' &&
                selectedTemplate.toLowerCase() !== 'category meta title' && (
                  <>
                    {selectedTemplate.toLowerCase() !== 'category description' && (
                      <InfoAlert
                        message={`<b>Tip:</b> For high-quality text, select the main product image for analysis and all relevant attributes when generating text in the ecommerce platform. More information improves output; less reduces text quality.`}
                      />  
                    )}
                    {selectedTemplate.toLowerCase() === 'category description' && (
                      <InfoAlert
                        message={`<b>Tip:</b> For high-quality text, select &quot;Category Image&quot; and set representative products when generating text in your ecommerce platform. These inputs help guide the AI during text generation—more context improves output quality, while less may reduce it.`}
                      />
                    )}
                  </>
              )}
                    <div className="d-flex justify-content-end" style={{marginBottom: '15px', marginTop: '15px'}}>
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
                            key={`block-${blockIndex}-${block.id}`} 
                            data-id={blockIndex}
                            data-first-block={blockIndex === 0}
                            data-is-movable={block.isMovable}
                            className={`${styles.accordionItemParent}`}
                            // className={`${styles.accordionItemParent} ${!block.isMovable ? styles.templatesRowTableBodyRowRowsIconsSortDisabled : ''}`}
                          >
                            <div className={`${styles.accordionItem}`}>
                              <h2 className={`accordion-header d-flex align-items-center ${styles.accordionHeader} ${(isBlockEnabled(block) && hasBlockErrors(block)) ?  styles.hasError : isBlockEnabled(block) &&  hasWarningMessages(block) ? styles.hasWarning : ''}`}>
                                
                                <input type="checkbox" 
                                className={`me-2 ${styles.templatesCheckbox}`} 
                                checked={!block?.groups?.find(g=>g?.id === 'enabled')?.properties ? true : block?.groups?.find(g=>g?.id === 'enabled')?.properties?.find(p=>p?.id === 'enabled')?.values?.[0] === 'true' ? true : false}
                                onChange={() => handleCheckboxChange(0, blockIndex, !block?.groups?.find(g=>g?.id === 'enabled')?.properties ? true : block?.groups?.find(g=>g?.id === 'enabled')?.properties?.find(p=>p?.id === 'enabled')?.values?.[0] === 'true' ? true : false)}
                                disabled={!block?.groups?.find(g=>g?.id === 'enabled')?.properties}
                                style={{borderColor : !block?.groups?.find(g=>g?.id === 'enabled')?.properties ? '#E0E0E0' : '#0066CC', opacity: !block?.groups?.find(g=>g?.id === 'enabled')?.properties ? 0.5 : 1}}
                                />
                                
                                <button className={`accordion-button ${hasPropertyTypeNone(block) ? styles.disableAccordion : ''} ${styles.accordionButtonCustom} ${collapsedBlocks[block.id] ? '' : 'collapsed'} ${(isBlockEnabled(block) && hasBlockErrors(block)) ?  styles.hasError : isBlockEnabled(block) &&  hasWarningMessages(block) ? styles.hasWarning : ''} ${block.groups.find(g=>g.id === 'enabled') && block.groups.find(g=>g.id === 'enabled').properties.find(p=>p.id === 'enabled').values[0] !== 'true' ? styles.disabled : ''}`} 
                                    type="button" 
                                    onClick={(e) => {
                                      !hasPropertyTypeNone(block) && handleToggleCollapse(block.id);
                                    }}
                                  >    
                                  {block.label}

                                  {isBlockEnabled(block) && hasBlockErrors(block) && <Image src={'/images/ico_exclamation_red.svg'} width={16} height={16} style={{marginLeft: '8px'}}/>}
                                  {(isBlockEnabled(block) && (block.id === 'keyword' || block.id === 'generate' || block.id === 'name') && (hasWarningMessages(block))) && <FollowTooltip content={block.warningMessage.find(w => w.propertyId === block.id).message}><Image className={`${styles.imageIcon}`} src={'/images/ico_exclamation_orange.svg'} width={16} height={16} style={{marginLeft: '8px'}}/> </FollowTooltip>}
                                    {(isBlockEnabled(block) && (block.id !== 'keyword' && block.id !== 'generate' && block.id !== 'name') && (hasWarningMessages(block))) && <Image src={'/images/ico_exclamation_orange.svg'} width={16} height={16} style={{marginLeft: '8px'}}/>}

                                  {block != null && block.helpText !== '' && (block.warningMessage.length == 0 && !hasBlockErrors(block)) && (block.id.includes('image') || block.id.includes('symbol') || block.id.includes('custom')) && <FollowTooltip content={block.helpText}><Image className={`${styles.imageIcon}`} src="/images/ico_image_block_info.svg" width={16} height={16} alt="Image" style={{marginLeft: '8px'}}/> </FollowTooltip>}
                                  {(block.id.includes('image') || block.id.includes('custom')) && 
                                    !hasProAccess() && <Image src="/images/ic_pro.svg" alt="pro" width={49} height={19} style={{marginLeft: '10px'}} />
                                  }
                                  {block != null && (block.id.includes('image') || block.id.includes('symbol') || block.id.includes('custom')) && (
                                    <div className={`ms-auto`}>
                                      <FollowTooltip content="Delete">
                                        <Image className={`${styles.trashIcon}`} src="/images/ic_trash.svg" width={16} height={16} alt="Delete" onClick={() => handleDeleteBlock(blockIndex)} style={{marginLeft: 'auto', marginRight: '32px'}}/>
                                      </FollowTooltip>
                                    </div>
                                  )}
                                </button>
                                <div className={`${styles.templatesRowTableBodyRowRowsIcons} ${!block.isMovable ? styles.templatesRowTableBodyRowRowsIconsSortDisabled : styles.templatesRowTableBodyRowRowsIconsSort}`}></div>
                              </h2>
                              <div id={`collapse-${blockIndex}`} className={`accordion-collapse collapse${collapsedBlocks[block.id] ? ' show' : ''}`}>
                                <div data-id={block.id}
                                 className={`accordion-body ${styles.accordionBody} ${(block.id.includes('image') || block.id.includes('custom')) && !hasProAccess() ? styles.disableBlock : ''}`}>
                                  {blockIndex === 0 && block.id === 'title' && (
                                      <AlertMessage message={selectedTemplate.toLowerCase() === 'category description' ? BlockMessagesEnum.H1_Alert_Category : BlockMessagesEnum.H1_Alert} />
                                  )}
                                  {isBlockEnabled(block) && block.errorMessage.map((error, index) => {
                                    if (error.message !== '') {
                                      return <ErrorMessage key={index} message={error.message} index={index} />
                                    }
                                   })}
                                  {isBlockEnabled(block) && block.warningMessage.map((message, index) => {
                                    if (message.message !== '') {
                                      return <WarningMessage key={index} message={message.message} index={index} />
                                    }
                                  })}

                                  <div className={styles.propertyGroup}>
                                    {block.groups.map((group, groupIndex) => (
                                      <>
                                          
                                          {group.label && group.label != '' && <p className={styles.groupLabel}>{group.label}</p>}
                                          {group.properties[0].groupLabel != '' && <p className={styles.groupLabel}>{group.properties[0].groupLabel}</p>}
                                          <div key={groupIndex} className={` ${group.id === "target_length" ? `d-flex` : ''}`}>
                                            {group.properties.map((property, propertyIndex) => (
                                              property.id !== "enabled" && 
                                                <>
                                                  {property.id === "min" && <div className={styles.numberWrapperLabel}><p style={{float: 'left'}}>{property.label}</p></div>}
                                                  <div id={`property-${block.id}-${property.id}-${propertyIndex}`} key={propertyIndex} className={`d-flex flex-column ${styles.accordionElements} ${(property.id === "heading_text" || property.id === "spacing") && `${styles.hasDependentProperties}`} ${property.id === "min" || property.id === "max" ? `${styles.numberWrapper}` : ''}`}>
                                                  
                                                  <div className={`d-flex`}>
                                                    {property.id === "name" && <p id={`label-${block.id}-${property.id}-${propertyIndex}`} className={`${styles.propertyLabel}`} style={{marginLeft: group.properties[0].groupLabel === '' ? 0 : undefined, marginRight: group.properties[0].groupLabel === '' ? 28 : undefined, marginTop: 6 }} >{property.label}</p>}
                                                    {(property.id !== 'name' && property.id !== "min" && property.id !== "max" && property.id !== "include" && property.id !== "research") && <p id={`label-${block.id}-${property.id}-${propertyIndex}`} className={`${styles.propertyLabel} ${property.id === 'prompt' && `mt-0`} ${isBlockEnabled(block) &&  property.id === 'heading_text_tag' ? propertyWarningMessage(block,property.id) ? styles.hasWarning : '' : ''} ${isBlockEnabled(block) && propertyWarningMessage(block, property.id) ? styles.hasWarning : ''}`} style={{marginLeft: group.properties[0].groupLabel === '' ? 0 : undefined, marginRight: group.properties[0].groupLabel === '' ? 28 : undefined} } >{property.label}</p>}
                                                    {(() => {
                                                      switch (property.type) {
                                                        case BlockPropertyTypeEnum.NumberField:
                                                          return <NumberInput 
                                                            block={block}
                                                            values={property.values.length > 0 ? property.values[0] : property.defaultValues[0]} 
                                                            onChange={(value) => handleNumberFieldChange(0, blockIndex, groupIndex, propertyIndex, value)}
                                                            properties={group.properties}
                                                            property={property}
                                                            group={group}
                                                            label={property.label}
                                                            parentId={`${block.id}-${property.id}-${propertyIndex}`}
                                                          />;
                                                        case BlockPropertyTypeEnum.MultiSelectOption:
                                                          return (
                                                            <TextFormatting 
                                                              block={block}
                                                              label={property.label} 
                                                              properties={property.options} 
                                                              values={property.values}
                                                              onChange={handleTextFormattingChange} 
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
                                                              onChange={handleDropdownChange} 
                                                              blockIndex={blockIndex} 
                                                              propertyIndex={propertyIndex}
                                                              propertyId={property.id}
                                                              properties={group.properties}
                                                              group={group}
                                                              showChoiceTooltip={!selectedTemplate.toLowerCase().includes('category')}
                                                              
                                                            />
                                                          );
                                                        case BlockPropertyTypeEnum.TextField:
                                                          return (
                                                            <TextField 
                                                              label={property.label}
                                                              value={property.values.length > 0 ? property.values[0] : property.defaultValues[0] || ""}
                                                              onChange={handleTextFieldChange}                                                   
                                                              blockId={block.id}
                                                              blockIndex={blockIndex}
                                                              propertyIndex={propertyIndex}
                                                              propertyId={property.id}
                                                              group={group}
                                                              block={block}
                                                            />
                                                          );
                                                        case BlockPropertyTypeEnum.MultilineTextField:
                                                          return (
                                                            <MultilineTextField
                                                              label={property.label}
                                                              value={property.values.length > 0 ? property.values[0] : property.defaultValues[0] || ""}
                                                              onChange={handleTextFieldChange}
                                                              block={block}
                                                              blockId={block.id}
                                                              blockIndex={blockIndex}
                                                              propertyIndex={propertyIndex}
                                                              propertyId={property.id}
                                                              group={group}
                                                              setIsMultilineTextFieldInLimit={setIsMultilineTextFieldInLimit}
                                                            />
                                                          );
                                                        case BlockPropertyTypeEnum.SingleSelectOption:
                                                          return (
                                                            <>
                                                              
                                                              <SingleSelectOption 
                                                                label={property.label} 
                                                                options={property.options} 
                                                                defaultValue={property.defaultValues[0]} 
                                                                onChange={handleSingleSelectChange}
                                                                blockIndex={blockIndex}
                                                                propertyIndex={propertyIndex}
                                                                propertyId={property.id}
                                                                values={property.values}
                                                                warningMessage={isBlockEnabled(block) ? propertyWarningMessage(block, property.id) ? block.warningMessage.find(w => w.propertyId === property.id).message : '' : ''}
                                                                properties={property.options} 
                                                                block={block}
                                                              />
                                                            </>
                                                          );
                                                        case BlockPropertyTypeEnum.Checkbox:
                                                        return (
                                                          (block.id.includes('image') || block.id.includes('symbol') || block.id.includes('custom')) &&  (
                                                          <Checkbox
                                                            block={block}
                                                            blockIndex={blockIndex}
                                                            property={property}
                                                            propertyIndex={propertyIndex}
                                                            onChange={handlePropertyCheckboxChange}
                                                            preview={false}
                                                          />
                                                          )
                                                        )
                                                        default:
                                                          (()=>{

                                                          })
                                                          return null;
                                                      }
                                                    })()}
                                                  </div>
                                                </div>
                                                </>
                                                
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
                          {(imageBlockAllowed || customBlockAllowed || symbolBlockAllowed) && (
                      <div className={styles.blockSeparator}>
                              {((!isImageBlockMax && imageBlockAllowed) || (!isSymbolBlockMax && symbolBlockAllowed) || (!isCustomBlockMax && customBlockAllowed)) && <hr />}
                        <div className="d-flex" style={{gap: '50px', margin: 'auto'}}>
                          {imageBlockAllowed && !isImageBlockMax && (
                            <button 
                              className={styles.addImageBlockBtn}
                               onClick={() => handleAddImageBlock(blockIndex)}
                            >
                            <Image src="/images/ico_add_image.svg" width={8} height={8} alt="Add image block" style={{marginRight: '6px'}} />
                            Add image block
                            </button>
                          )}
                          {customBlockAllowed && !isCustomBlockMax && (
                            <button 
                              className={`${styles.addImageBlockBtn} ${styles.addCustomBlockBtn}`}
                            onClick={() => handleAddCustomBlock(blockIndex)}
                          >
                            <Image src="/images/ico_add_image.svg" width={8} height={8} alt="Add image block" style={{marginRight: '6px'}} />
                            Add custom prompt
                            </button>
                            )}
                          {symbolBlockAllowed && !isSymbolBlockMax && (
                          
                            <button 
                              className={styles.addImageBlockBtn}
                              onClick={() => handleAddSymbolBlock(blockIndex)}  
                            >
                              <Image src="/images/ico_add_image.svg" width={8} height={8} alt="Add separator" style={{marginRight: '6px'}} />
                              Add separator
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                          
                          
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
              )}
              {(imageBlockAllowed || customBlockAllowed || symbolBlockAllowed) && (
                <div className="d-flex">
                  <div className="d-flex m-auto" style={{gap: '50px'}}>
                    {imageBlockAllowed && !isImageBlockMax && (
                    <div className="mt-3 d-flex justify-content-center">
                      <button 
                        className={styles.addImageBlockLinkBtn}
                        onClick={() => handleAddImageBlock(templateObjects[0].blocks.length - 1)}
                      >
                        <Image src="/images/ico_add_image_md.svg" width={10} height={10} alt="Add image block" style={{marginRight: '6px', marginBottom: '3px'}} />
                        Add image block
                      </button>
                    </div>
                    )}
                    {customBlockAllowed && !isCustomBlockMax && (
                    <div className="mt-3 d-flex justify-content-center">
                      <button 
                        className={styles.addImageBlockLinkBtn}
                        onClick={() => handleAddCustomBlock(templateObjects[0].blocks.length - 1)}
                      >
                        <Image src="/images/ico_add_image_md.svg" width={10} height={10} alt="Add custom prompt" style={{marginRight: '6px', marginBottom: '3px'}} />
                        Add custom prompt
                      </button>
                    </div>
                    )}
                    {symbolBlockAllowed && !isSymbolBlockMax && (
                      <div className="mt-3 d-flex justify-content-center">
                        <button 
                          className={styles.addImageBlockLinkBtn}
                          onClick={() => handleAddSymbolBlock(templateObjects[0].blocks.length - 1)}
                        >
                          <Image src="/images/ico_add_image_md.svg" width={10} height={10} alt="Add separator" style={{marginRight: '6px', marginBottom: '3px'}} />
                          Add separator
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
                
                
            </div>
            
            <div className={styles.templatesContainerRight}>
              <div className={styles.templatePreview}>
                <PreviewTemplate content={generatedPreview} saveChanges={save} isSaveDisabled={!templateName || templateName.trim() === '' || !templateObjects || templateObjects.length === 0} 
                    isPreview={false}
                    templateType={selectedTemplate}
                    />
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Body>
  );
} 