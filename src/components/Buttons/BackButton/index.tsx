import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import style from './backButton.module.css'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

interface BackButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>
    size: SizeProp
}

export default function BackButton({ onClick, size }: BackButtonProps) {
    return (
        <button onClick={onClick} className={style.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} size={size} />
        </button>
    )
}