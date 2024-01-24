import XButton from "../Buttons/XButton";
import style from "./modalHeader.module.css";

interface ModalHeaderProps {
    title: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function ModalHeader({ title, onClick }: ModalHeaderProps) {
    return (
        <>
            <div className={style.topSection}>
                <XButton onClick={onClick} />
            </div>
            <h3 className={style.modalTitle}>{title}</h3>
        </>
        
    )
}