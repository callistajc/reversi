import style from './button.module.css'

interface ButtonProps {
    name: string
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function Button({ name, onClick }: ButtonProps) {
    return (
        <button onClick={onClick} className={style.button}>{name}</button>
    )
}