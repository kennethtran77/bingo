import React, { useState, useRef, useEffect, forwardRef } from 'react';

const AutosizingInput = (props, ref) => {
    const [width, setWidth] = useState(0);
    const spanRef = useRef(null);

    const updateDimensions = () => {
        if (spanRef && spanRef.current)
            setWidth(spanRef.current.scrollWidth);

        if (ref && ref.current) {
            ref.current.style.height = '0px';
            ref.current.style.height = ref.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        updateDimensions();
    });
    
    return (
        <>
            <span
                ref={spanRef}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    zIndex: -10,
                    fontFamily: props.inputstyle.fontFamily,
                    fontSize: props.inputstyle.fontSize,
                    lineHeight: props.inputstyle.minHeight,
                    wordBreak: 'break-all'
                }}
            >
                {props.value}
            </span>
            <textarea
                ref={ref}
                style={{
                    ...props.inputstyle,
                    resize: 'none',
                    overflow: 'hidden',
                    width: width + 30 + 'px',
                    minWidth: '10px',
                    maxWidth: '100%',
                    lineHeight: props.inputstyle.minHeight,
                    padding: 'auto 0'
                }}
                { ...props }
            />
        </>
    );
};

export default forwardRef(AutosizingInput);