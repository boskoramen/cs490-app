import React from "react";
import { Box } from "./Box.js";
import { parseProps } from "../util/helpers.js"
import styles from "../styles/main.scss";

const { flexContainer } = styles;
const validProps = [
    "flexDirection",
    "flexWrap",
    "flexGrow",
    "flexShrink",
    "justifyContent",
    "alignItems",
];

export const Flex = (props) => {
    return (
        <Box
            {...props}
            className={flexContainer}
            style={{
                ...props.style,
                ...parseProps(props, validProps),
            }}
        />
    );
}