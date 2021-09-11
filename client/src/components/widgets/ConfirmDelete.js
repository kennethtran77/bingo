import React from 'react';

const ConfirmDelete = ({ title, confirm, undo }) => {
    return (
        <div className="container secondary">
            <div className="flex space-between">
                <div className="center-flex">
                    <p>Are you sure you want to <span style={{color: 'red'}}>delete</span> <strong>{title}</strong>?</p>
                </div>
                <div className="center-flex">
                    <button className="small-button h-margin" onClick={confirm}>Yes</button>
                    <button className="small-button h-margin" onClick={undo}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;