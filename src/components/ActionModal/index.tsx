import { ReactNode } from "react";
import { createPortal } from "react-dom";
import ModalContainer from "../ModalContainer";
import ModalHeader from "../ModalHeader";
import Button from "../Buttons/Button";
import style from "./actionModal.module.css";

interface ActionModalProps {
  title: string;
  children: ReactNode;
  buttonText: string;
  onClick: () => void;
  shouldShowModal: boolean;
  onClose?: () => void;
}

export default function ActionModal({ title, children, buttonText, onClose, onClick, shouldShowModal }: ActionModalProps) {
  return (shouldShowModal ? createPortal(
    <ModalContainer>
      <ModalHeader title={title} onClick={onClose ? onClose : onClick} />
      {children}
      <div className={style.modalButton}>
        <Button name={buttonText} onClick={onClick} />
      </div>
    </ModalContainer>,
    document.body
  ) : null)
}