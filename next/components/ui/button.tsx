import {ReactNode} from "react";

export const Button = ({children, onClick}: {
    children: ReactNode,
    onClick?: () => void
}) => {
    return (
        <button onClick={onClick}
            className={'py-2 px-4 rounded border border-material-outline-variant transition-all hover:bg-slate-100'}>
            {children}
        </button>
    );
}
