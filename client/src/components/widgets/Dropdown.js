import React, { useState } from "react";

import styles from "./Dropdown.module.css";

import ExternalListener from "./ExternalListener";

/**
 * items is an array of item objects of form { value: <String>, display: <String> }
 * onChange is a function that takes an item object and updates the state in the parent component
 */
const Dropdown = ({ items, currItem, onChange = () => {}, disabled = false, headerStyle = {} }) => {
    const [displayList, setDisplayList] = useState(false);

    return (
        <ExternalListener onClick={() => setDisplayList(false)}>
            <div
                className={styles.dropdown}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setDisplayList(false);
                    }
                }}
            >
                <div
                    className={`${styles.header} ${displayList ? styles.active : null}`}
                    onClick={disabled ? null : () => setDisplayList((prev) => !prev)}
                    style={headerStyle}
                    tabIndex={0}
                >
                    <span className={styles.current}>{currItem.display}</span>
                    <span
                        className={styles.chevron}
                        style={
                            displayList
                                ? {
                                    transform: `rotate(180deg)`
                                }
                                : {}
                        }
                    >
                        ᐯ
                    </span>
                </div>
                {displayList && (
                    <ul className={styles.list}>
                        { !items.length ? (
                            <li key={`empty-list-item`}>No options available</li>
                        ) : items.map((item, index) => (
                            <li
                                key={`list-item-${index}`}
                                className={`${currItem.value === item.value ? styles.active : null}`}
                                tabIndex={0}
                                onClick={() => {
                                    setDisplayList(false);
                                    // pass newly selected item to parent component
                                    onChange(item);
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        setDisplayList(false);
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
        </ExternalListener>
    );
};

export default Dropdown;
