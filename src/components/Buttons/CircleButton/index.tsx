import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import style from "./circleButton.module.css";

interface CircleButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    isDisabled: boolean;
    icon: "save" | "restart";
}

export default function CircleButton({ onClick, isDisabled, icon }: CircleButtonProps) {
    return (
        <button onClick={onClick} className={style.circleButton} disabled={isDisabled}>
            <FontAwesomeIcon className={style.icon} icon={icon === "save" ? faFloppyDisk : faArrowRotateLeft} size="sm"/>
        </button>
    )
}