import React from 'react';
import styles from '../../../styles/styling/Templates/Preview.module.css';
const H1ProductTitleBlock = ({properties}) => {
    const { block, elements } = properties;
    
    for (const property of block.properties) {
        for (const propertyValue of property.propertyValues) {
            
            if (propertyValue.active && propertyValue.format === "H1") {
                elements.push(<h1 className={styles.title}>{propertyValue.preview}</h1>);
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
};

export default H1ProductTitleBlock;