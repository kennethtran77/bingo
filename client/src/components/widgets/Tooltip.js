import React, { useState } from "react";
import ExternalListener from "./ExternalListener";

import styles from "./Tooltip.module.css";

const Tooltip = ({
    content,
    direction = "top",
    style,
    showOnClick = false,
    children
}) => {
    const [active, setActive] = useState(false);

    const tooltip = (
        <div
            className={styles.tooltip}
            role='tooltip'
            tabIndex={0}
            aria-hidden={active}
            aria-live='polite'
            onMouseEnter={!showOnClick ? () => setActive(true) : null}
            onMouseLeave={!showOnClick ? () => setActive(false) : null}
            onKeyDown={(e) => {
                if (e.key === "Escape") setActive(false);
            }}
        >
            <span onClick={showOnClick ? () => setActive(prev => !prev) : null} >{children}</span>
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

    // Wrap tooltip component inside an ExternalListener if it is set
    // to show on click
    return showOnClick ? (
        <ExternalListener onClick={() => setActive(false)}>
            {tooltip}
        </ExternalListener>
    ) : (
        tooltip
    );
};

export default Tooltip;
