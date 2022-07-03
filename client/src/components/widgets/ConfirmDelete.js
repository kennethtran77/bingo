import React from 'react';
import Button from './Button';

const ConfirmDelete = ({ title, confirm, undo }) => {
    return (
        <div className="container secondary">
            <div className="flex space-between">
                <div className="center-flex">
                    <p>Are you sure you want to <span style={{color: 'red'}}>delete</span> <strong>{title}</strong>?</p>
                </div>
                <div className="center-flex gap">
                    <Button text="Delete" onClick={confirm} background />
                    <Button text="Cancel" onClick={undo} />
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;