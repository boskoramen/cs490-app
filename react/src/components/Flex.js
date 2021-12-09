import React from "react";
import { Box } from "./Box.js";
import { parseProps, addClassNames } from "../util/helpers.js"
import styles from "../styles/main.scss";
import { flexProps } from "../util/constants.js";

const { flexContainer, flexContainerVertical } = styles;

export const Flex = (props) => {
    let classNames = [flexContainer];
    if(props.flexDirection == 'column') {
        classNames.push(flexContainerVertical);
    }
    return (
        <Box
            {...props}
            classNames={addClassNames(flexContainer, props.classNames)}
            style={{
                ...props.style,
                ...parseProps(props, flexProps),
            }}
        />
    );
}