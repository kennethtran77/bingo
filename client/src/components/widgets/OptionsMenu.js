import React from 'react';

import Popup from 'reactjs-popup';

import './Options.css'

const OptionsMenu = ({ options, displayPreview, togglePreview }) => {
    return (
        <Popup
            trigger={<span className="more"></span>}
            position="right top"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            arrow={false}
        >
            { options && options.includes('latexDisplay') && <div className="options-menu">
                <div
                    className="option"
                    onClick={togglePreview}
                >
                    { displayPreview ? 'Hide ' : 'Show '} Preview
                </div>
            </div> }
        </Popup>
    );
};

export default OptionsMenu;