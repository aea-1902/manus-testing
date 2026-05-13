import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/styling/FollowTooltip.module.css';

const FollowTooltip = ({ children, content, disabled = false }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isPositioned, setIsPositioned] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const tooltipRef = useRef(null);
    const initialMousePos = useRef(null);

    const updatePosition = (e) => {
        if (!tooltipRef.current) return;

        // Get the tooltip dimensions
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        // Calculate position with offset to prevent tooltip from being too close to cursor
        const x = e.clientX;
        const y = e.clientY + 20;

        // Check if tooltip would go off screen
        const maxX = window.innerWidth - tooltipRect.width - 10;
        const maxY = window.innerHeight - tooltipRect.height - 10;
        const minX = 10; // Minimum distance from left edge
        const minY = 10; // Minimum distance from top edge

        // Ensure tooltip stays within screen boundaries
        setPosition({
            x: Math.min(Math.max(x, minX), maxX),
            y: Math.min(Math.max(y, minY), maxY)
        });
        setIsPositioned(true);
    };

    const handleMouseMove = (e) => {
        if (!isVisible || disabled) return;
        updatePosition(e);
    };

    const handleMouseEnter = (e) => {
        if (disabled) return;
        setIsPositioned(false);
        initialMousePos.current = { x: e.clientX, y: e.clientY };
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
        setIsPositioned(false);
    };

    // Effect to handle initial positioning
    useEffect(() => {
        if (isVisible && initialMousePos.current && !isPositioned) {
            const timer = setTimeout(() => {
                const e = {
                    clientX: initialMousePos.current.x,
                    clientY: initialMousePos.current.y
                };
                updatePosition(e);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isVisible, isPositioned]);

    useEffect(() => {
        if (isVisible) {
            window.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isVisible]);

    // Render tooltip using portal to ensure it's always on top
    const renderTooltip = () => {
        if (!isVisible || !content) return null;

        const tooltipElement = (
            <div 
                ref={tooltipRef}
                className={styles.tooltip}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    opacity: isPositioned ? 1 : 0,
                    pointerEvents: 'none',
                    position: 'fixed', // Ensure tooltip is positioned relative to viewport
                    zIndex: 99999, // Ensure tooltip appears above all other elements
                    transition: 'opacity 0.1s ease-in-out' // Smooth fade in
                }}
            >
                {content}
            </div>
        );

        // Use portal to render tooltip at document body level
        return createPortal(tooltipElement, document.body);
    };

    return (
        <div 
            className={styles.tooltipContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {renderTooltip()}
        </div>
    );
};

export default FollowTooltip; 