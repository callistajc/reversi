import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import style from "./xButton.module.css";

interface XButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function XButton({ onClick }: XButtonProps) {
    return (
        <button onClick={onClick} className={style.closeButton}>
            <FontAwesomeIcon icon={faX} size="xl" />
        </button>
    )
}