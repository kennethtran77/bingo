import React from 'react';

import Popup from 'reactjs-popup';

const Alert = ({ message, open, setOpen }) => {
    const close = () => setOpen(false);
 
    return (
        <Popup open={open} closeOnDocumentClick onClose={close}>
            <div>
                <span className="x" onClick={close}></span>
                <p>{message}</p>
            </div>
        </Popup>
    );
};

export default Alert;