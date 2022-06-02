import React from "react";
import DeleteButton from "./DeleteButton";

import WarningIcon from '@mui/icons-material/Warning';

import style from './Modal.module.css'

const Modal = (props) => {
    const hide = () => {
        props.setActive(false);
    }

    const getIcon = (type) => {
        switch (type) {
            case 'warning':
                return <WarningIcon color='warning' />;
            default:
                return null;
        }
    }

    return (
        <>
            {props.children}
            {props.active &&
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
            { props.active &&
                <div className={style.modal} >
                    <DeleteButton className={style['delete']} onClick={hide} ariaLabel="Close Modal" tooltip="Close Modal" />
                    <div className={style.content}>
                        { getIcon(props.type) }
                        <span>{props.content}</span>
                    </div>
                </div>
            }
        </>
    );
};

export default Modal;