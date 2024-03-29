import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-regular-svg-icons";

export const StarIcon = (props: {
    className?: string
}) => {
    return (
        <FontAwesomeIcon icon={faStar} className={props.className}/>
    );
};
