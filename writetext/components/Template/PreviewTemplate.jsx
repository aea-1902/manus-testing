import React from 'react';
import Image from 'next/image'
import FollowTooltip from '../FollowTooltip';
import styles from '../../styles/styling/Templates/Preview.module.css';
const   PreviewTemplate = ({
  title = "PRODUCT DESCRIPTION PREVIEW",
  subtitle = "This is just a preview but the actual generated text will follow your webshop's stylesheets.",
  credits = 8,
  content = [],
  maximized = false,
  saveChanges = () => {},
  isSaveDisabled = false,
  isPreview = false,
  templateType = ""
}) => {
  // Helper function to get property value from content
  if (templateType === "Select template") {
    return (
      <>
    
    <div className={`${styles.productDescription} `}>
        
      <div className={styles.contentCard}>
        {content && content.output && content.output !== '' ? <div dangerouslySetInnerHTML={{ __html: content.output }} /> : <div className={`${styles.noContent}`}><div className="m-auto">Your preview will appear here once you’ve selected an item from the “Create a template for” dropdown.</div></div>}
      </div>
    </div>
    </>
  )
  }
  return (
    <>
    
    <div style={{display: 'none'}}>   
      <img src='https://writetextaistorage.z6.web.core.windows.net/image_placeholder.png' alt="Preview Image" width="0" height="0" />
    </div>
    <div className={`${styles.productDescription} `}>
      <div className={styles.header}>
          {templateType.toLowerCase() !== 'product meta title' && templateType.toLowerCase() !== 'category meta title' &&
          <>
        <div className={`d-flex`}>
          <div className={`d-flex ms-auto mb-14`}>
          <div className={`${styles.credits} ${isPreview && 'mt-0'}`}>
             MAXIMUM CREDIT USAGE  : {content && content.credits ? content.credits : 0}
           </div>
           <FollowTooltip content="The maximum number of credits used by this template for text generation (excluding keyword analysis) may vary and could be lower depending on whether product research is selected and the complexity of the task."><Image className={`${styles.imageIcon}`} src="/images/ico_image_block_info.svg" width={16} height={16} alt="Image" style={{marginLeft: '8px'}}/> </FollowTooltip>
 
          </div>
        </div>
          </>
  }
        <div className={styles.headerLeft}>
          <p className={styles.title}>{(templateType !== "" && templateType !== "Select template" ? templateType + " PREVIEW" : '')}</p>
          {templateType.toLowerCase() !== 'product meta title' && templateType.toLowerCase() !== 'category meta title' && <p className={styles.subtitle}>{subtitle}</p>}
          {(templateType.toLowerCase() === 'product meta title' || templateType.toLowerCase() === 'category meta title') && <p className={`${styles.subtitle}`}>When building templates for meta titles, keep in mind that the best practice is to stay within <b>60 characters</b>. For example, if your brand name is long, you may have limited space for additional elements. Text beyond 60 characters may be truncated in search engine result pages (SERPs).</p>}
        </div>
        </div>

      <div className={styles.contentCard}>
        {content && content.output && content.output !== '' ? <div className='w-100' dangerouslySetInnerHTML={{ __html: content.output }} /> : <div className={`${styles.noContent} w-100`}><div className="m-auto">Start by selecting template section to see the preview here.</div></div>}
      </div>
    </div>
    </>
    
  );
};

export default PreviewTemplate;
