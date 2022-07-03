import { useLayoutEffect } from "react";

/**
 * A hook that calls a function when outside of the element is clicked.
 * @param {Function} onClick the function to execute
 * @param {Ref} ref the ref object to hook onto
 * @param {Boolean} active whether the listener is active
 */
const useExternalListener = ( onClick, ref, active = true ) => {
    useLayoutEffect(() => {
        if (!active) {
            return;
        }

        const handleClick = e => {
            if (ref.current) {
                /**
                 * Returns whether `target` is an element contained by any descendant of `element` 
                 * @param {*} element 
                 * @param {*} target 
                 * @returns a boolean
                 */
                const elementInDescendants = (element, target) => {
                    for (const child of element.childNodes) {
                        if (element.contains(target)) {
                            return true;
                        }

                        return elementInDescendants(child, target);
                    }

                    return false;
                }

                // execute the onClick function when an element besides ref and all its descendants is clicked
                if (!elementInDescendants(ref.current, e.target)) {
                    onClick();
                }
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, onClick]);
}

export default useExternalListener;