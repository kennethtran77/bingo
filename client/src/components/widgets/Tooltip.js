import React, { useState, useRef, useCallback } from "react";
import useExternalListener from "./ExternalListener";

import styles from "./Tooltip.module.css";

const Tooltip = ({
    content,
    direction = "top",
    style,
    showOnClick = false,
    toggleOnClick = true,
    children
}) => {
    const childRef = useRef(null);
    const [active, setActive] = useState(false);

    // Alert clicks outside of element
    useExternalListener(() => setActive(false), childRef, active);

    const handleClick = useCallback(() => {
        if (showOnClick) {
            setActive(prev => toggleOnClick ? !prev : true);
        }
    });

    return (
        <div
            ref={childRef}
            className={styles.tooltip}
            role='tooltip'
            tabIndex={active ? 0 : -1}
            aria-hidden={active}
            aria-live='polite'
            onMouseEnter={!showOnClick ? () => setActive(true) : null}
            onMouseLeave={!showOnClick ? () => setActive(false) : null}
            onKeyDown={(e) => {
                if (e.key === "Escape") setActive(false);
            }}
        >
            <span onClick={handleClick} >
                {children}
            </span>
            {active && (
                <div
                    className={`${styles["tooltip-content"]} ${styles[direction]}`}
                    id={children.props.id}
                    style={style}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
