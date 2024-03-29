import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-regular-svg-icons";
import {css} from "@kuma-ui/core";
import {ReactNode} from "react";

export const StarIcon = (props: {
    className?: string
}) => {
    return (
        <FontAwesomeIcon icon={faStar} className={props.className}/>
    );
};

export const LanguageIcon = (props: MaterialSymbolProp) => {
    return (
        <MaterialSymbol {...props}>
            language
        </MaterialSymbol>
    );
};

export const CallIcon = (props: MaterialSymbolProp) => {
    return (
        <MaterialSymbol {...props}>
            call
        </MaterialSymbol>
    );
};

export const MailIcon = (props: MaterialSymbolProp) => {
    return (
        <MaterialSymbol {...props}>
            mail
        </MaterialSymbol>
    );
};

type MaterialSymbolProp = {
    className?: string,
    size?: 20 | 24 | 48
}

const MaterialSymbol = ({className = '', size = 24, children}: MaterialSymbolProp & {
    children: ReactNode
}) => {
    return (
        <span className={`material-symbols-outlined ${className} ${
            size === 20 ? css`
          font-size: 20px !important;
        ` : size === 24 ? css`
          font-size: 24px !important;
        ` : css`
          font-size: 40px !important;
        `
        }`}>
            {children}
        </span>
    );
};
