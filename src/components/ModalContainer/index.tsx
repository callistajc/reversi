import { ReactNode } from 'react';
import style from './modalContainer.module.css'

interface ModalContainerProps {
    children: ReactNode;
}

export default function ModalContainer({ children }: ModalContainerProps) {
    return (
        <div className={style.modalBackground}>
            <div className={style.modal}>
                {children}
            </div>
        </div>
    )
}