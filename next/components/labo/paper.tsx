import {ReactNode} from "react";
import {css} from "@kuma-ui/core";

export const Paper = ({children, className = ''}: {
    children?: ReactNode,
    className?: string
}) => {
    return (
        <div className={`border border-outline bg-background ${className} ${css`
          position: relative;

          &:before {
            z-index: -1;
            position: absolute;
            bottom: -5px;
            right: -5px;
            width: 100%;
            height: 100%;
            border: 1px solid var(--outline);
            background-color: #f5f5f4;
            content: '';
          }
        `}`}>
            {children}
        </div>
    )
}
