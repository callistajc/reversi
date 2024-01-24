import { ReactNode, useState } from "react";
import style from "./tooltip.module.css";

interface TooltipProps {
    children: ReactNode;
    description: string;
}

export default function Tooltip({ children, description }: TooltipProps) {
    const [active, setActive] = useState(false);

    const showTooltip = () => {
        setActive(true);
    };
    
      const hideTooltip = () => {
        setActive(false);
    };

    return (
        <div className={style.container} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
            {children}
            {active && (
                <div className={style.tip}>
                    {description}
                </div>
            )}
        </div>
    )
}