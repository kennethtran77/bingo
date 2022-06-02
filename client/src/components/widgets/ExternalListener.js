import React, { useEffect, useRef } from "react";

/**
 * A wrapper component which can detect clicks outside of the
 * wrapped component
 */
const ExternalListener = ({ onClick, children }) => {
  const ref = useRef(null);

  // Alert clicks outside of element
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClick();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClick]);

  return <div ref={ref}>{children}</div>;
};

export default ExternalListener;
