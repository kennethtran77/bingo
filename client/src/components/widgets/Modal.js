import React from "react";
import DeleteButton from "./DeleteButton";

import style from './Modal.module.css'

const Modal = ({ children, active, type, setActive }) => {
    const hide = () => {
        setActive(false);
    }

    return (
        <>
            {active &&
                <div
                    className={style["modal-back"]}
                    onClick={hide}
                    onKeyPress={e => {
                        if (e.key === 'Escape') {
                            hide();
                        }
                    }}
                />
            }
            { active &&
                <div className={style.modal} >
                    <DeleteButton className={style['delete']} onClick={hide} ariaLabel="Close Modal" tooltip="Close Modal" background />
                    {children}
                </div>
            }
        </>
    );
};

export default Modal;