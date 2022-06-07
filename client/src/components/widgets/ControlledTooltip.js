import React from "react";
import ExternalListener from "./ExternalListener";

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
    const tooltip = (
        <div
            className={styles.tooltip}
            onKeyDown={(e) => onKeyDown(e)}
            role='tooltip'
            tabIndex={active ? 0 : -1}
            aria-hidden={active}
            aria-live='polite'
        >
            <span onClick={onClick} >{children}</span>
            {active && (
                <div
                    className={`${styles["tooltip-content"]} ${styles[direction]}`}
                    style={style}
                >
                    {content}
                </div>
            )}
        </div>
    );

    return (
        <ExternalListener onClick={() => setActive(false)}>
            {tooltip}
        </ExternalListener>
    );
};

export default ControlledTooltip;
