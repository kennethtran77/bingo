import React from 'react';

import Popup from 'reactjs-popup';

import './Options.css'

const MathjaxOption = ({ enabled, setEnabled }) => {
    return (
        <Popup
            trigger={<span className="more"></span>}
            position="right top"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            arrow={false}
        >
            <div className="options-menu">
                <div
                    className="option"
                    onClick={() => setEnabled(!enabled)}
                >
                    { enabled ? 'Disable' : 'Enable'} MathJax
                </div>
            </div>
        </Popup>
    );
};

export default MathjaxOption;