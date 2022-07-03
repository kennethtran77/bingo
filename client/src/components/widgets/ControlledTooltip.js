import React, { useRef } from "react";
import useExternalListener from "./ExternalListener";

import styles from "./Tooltip.module.css";

const ControlledTooltip = ({
    content,
    direction = "top",
    style,
    active,
    setActive,
    onKeyDown = e => { },
    onClick = () => { },
    children
}) => {
    const childRef = useRef(null);

    // Alert clicks outside of element
    useExternalListener(() => setActive(false), childRef, active);

    return (
        <div
            ref={childRef}
            className={styles.tooltip}
            onKeyDown={(e) => onKeyDown(e)}
            role='tooltip'
            tabIndex={active ? 0 : -1}
            aria-hidden={active}
            aria-live='polite'
        >
            <span onClick={onClick}>{children}</span>
            {Boolean(active) && (
                <div
                    className={`${styles["tooltip-content"]} ${styles[direction]}`}
                    style={style}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default ControlledTooltip;
