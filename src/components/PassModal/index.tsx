import { createPortal } from 'react-dom';
import ModalContainer from '../ModalContainer';
import style from './passModal.module.css'

interface PassModalProps {
    currentTurn: 0 | 1;
}

export default function PassModal({ currentTurn }: PassModalProps) {
    return (
        createPortal(
            <ModalContainer>
                <h3 className={style.modalText}>
                    {currentTurn ? "Player" : "Computer"}'s Pass
                </h3>
            </ModalContainer>,
            document.body
        )
    )
}