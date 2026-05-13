import React from 'react';
import styles from '../../../styles/styling/Templates/Preview.module.css';

const IntroductionBlock = ({properties}) => {
    const { block, elements } = properties;

    for (const property of block.properties) {
        const formatClasses = [];
          for (const propertyValue of property.propertyValues) {
            if (propertyValue.active && propertyValue.value === "Generate using WriteText.ai") {
              // elements.push(<p className={styles.overview}>{propertyValue.preview}</p>);
            }
            if (propertyValue.active && propertyValue.value === "Custom text") {
              // const customTextBlock = block.properties.find(property => property.propertyLabel === "Custom text");
              // const customTextValue = customTextBlock.propertyValues[0].preview;
              // elements.push(<p className={styles.overview}>{customTextValue}</p>);
            }
            if (propertyValue.active && (propertyValue.format === "H2" || propertyValue.format === "H3" || propertyValue.format === "H4" || propertyValue.format === "H5" || propertyValue.format === "H6")) {
              //get propertyValue from property.propertyValues
              const noneProperty = block.properties.find(property => property.propertyLabel === "Section heading (part 1)").propertyValues.find(property => property.valueLabel === "None");
              
              const aiGeneratedProperty = block.properties.find(property => property.propertyLabel === "Section heading (part 1)").propertyValues.find(property => property.valueLabel === "Generate using WriteText.ai");
              
              const customTextProperty = block.properties.find(property => property.propertyLabel === "Section heading (part 1)").propertyValues.find(property => property.valueLabel === "Custom text");

              if (aiGeneratedProperty.active) {
                const HeadingTag = propertyValue.format.toLowerCase();
                elements.push(<HeadingTag>{aiGeneratedProperty.preview}</HeadingTag>);
              }
              if (customTextProperty.active) {
                const customTextPropertyValue = block.properties.find(property => property.propertyLabel === "Custom text");
                const HeadingTag = propertyValue.format.toLowerCase();
                elements.push(<HeadingTag>{customTextPropertyValue.propertyValues[0].preview}</HeadingTag>);
              }
            }
            if (propertyValue.active && (propertyValue.format === "Bold" || propertyValue.format === "Italicized" || propertyValue.format === "Underlined")) {
              const propertyElement = React.createElement('p', {}, propertyValue.preview);
              const format = propertyValue.format.toLowerCase();
              if (propertyValue.format === "Bold") formatClasses.push(styles[format]);
              if (propertyValue.format === "Italicized") formatClasses.push(styles[format]);
              if (propertyValue.format === "Underlined") formatClasses.push(styles[format]);
              const existingElementIndex = elements.findIndex(element => 
                element.type === 'p' && element.props.children === propertyValue.preview
              );
              
              if (existingElementIndex === -1) {
                elements.push(React.createElement('p', { className: formatClasses.join(' ') }, propertyValue.preview));
              } else {
                elements[existingElementIndex] = React.createElement('p', { className: formatClasses.join(' ') }, propertyValue.preview);
              }
            } if (propertyValue.active && propertyValue.value === "Single") {
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

export default IntroductionBlock;
