import React from 'react';
import styles from '../../../styles/styling/Templates/Preview.module.css';

const SubtitleTaglineBlock = ({properties}) => {
    const { block, elements } = properties;
    
    for (const property of block.properties) {
        const formatClasses = [];
          for (const propertyValue of property.propertyValues) {
              if (elements.length === 0) {
                  elements.push(<div className={``}>{propertyValue.preview}</div>);
              }
              if (propertyValue.active && (propertyValue.format === "Bold" || propertyValue.format === "Italicized" || propertyValue.format === "Underlined")) {
                  
                  const format = propertyValue.format.toLowerCase();
                  if (propertyValue.format === "Bold") formatClasses.push(styles[format]);
                  if (propertyValue.format === "Italicized") formatClasses.push(styles[format]);
                  if (propertyValue.format === "Underlined") formatClasses.push(styles[format]);
                  // Create a new element with the combined classes instead of modifying existing one
                  elements[0] = React.cloneElement(elements[0], {
                    className: formatClasses.join(' ')
                  });
              }
              if (propertyValue.active && propertyValue.value === "Single") {
                elements.push(<br />);
              }
              if (propertyValue.active && propertyValue.value === "Paragraph") {
                  elements.push(<br />);
                  elements.push(<br />);
              }
              if (propertyValue.active && propertyValue.value === "[N] lines") {
                  const linkBreakProperty = block.properties.find(property => property.propertyLabel === "[N] lines");
                  const propertyValue = linkBreakProperty.propertyValues[0].value;
                  for (let i = 0; i < propertyValue; i++) {
                      elements.push(<br />);
                  }
              }
          }
      }
      return <>{elements}</>;
}

export default SubtitleTaglineBlock;
