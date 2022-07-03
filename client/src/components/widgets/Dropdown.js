import React, { useRef, useState } from "react";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import styles from "./Dropdown.module.css";
import useExternalListener from "./ExternalListener";

/**
 * items is an array of item objects of form { value: <String>, display: <String> }
 * onChange is a function that takes an item object and updates the state in the parent component
 */
const Dropdown = ({ items, currItem, onChange = () => {}, disabled = false, headerStyle = {} }) => {
    const [expanded, setExpanded] = useState(false);
    const ref = useRef(null);

    useExternalListener(() => setExpanded(false), ref);

    return (
        <div
            ref={ref}
            className={styles.dropdown}
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    setExpanded(false);
                }
            }}
        >
            <div
                className={`${styles.header} ${expanded ? styles.active : null}`}
                onClick={disabled ? null : () => setExpanded((prev) => !prev)}
                style={headerStyle}
                tabIndex={0}
            >
                <span className={styles.current}>{currItem.display}</span>
                <span className={styles.chevron}>
                    { expanded ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                </span>
            </div>
            {expanded && (
                <ul className={styles.list}>
                    { !items.length ? (
                        <li key={`empty-list-item`}>No options available</li>
                    ) : items.map((item, index) => (
                        <li
                            key={`list-item-${index}`}
                            className={`${currItem.value === item.value ? styles.active : null}`}
                            tabIndex={0}
                            onClick={() => {
                                setExpanded(false);
                                // pass newly selected item to parent component
                                onChange(item);
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    setExpanded(false);
                                    // pass newly selected item to parent component
                                    onChange(item);
                                }
                            }}
                        >
                            {item.display}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
