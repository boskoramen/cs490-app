import React from "react";
import { Box } from "./Box.js";
import { parseProps, addClassNames } from "../util/helpers.js"
import styles from "../styles/main.scss";
import { flexProps } from "../util/constants.js";

const { flexContainer } = styles;

export const Flex = (props) => {
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