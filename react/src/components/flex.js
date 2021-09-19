import React from "react";
import { Box } from "./box.js";
import styles from "../styles/main.scss";

const { flexContainer } = styles;

const parseProps = (props) => {
    const validProps = [
        "flexDirection",
        "flexWrap",
        "flexGrow",
        "flexShrink",
        "justifyContent",
        "alignItems",
    ];
    let style = {};
    console.log('iterating....');
    for(const prop in props) {
        console.log('valid prop: ' + prop);
        if(prop in validProps) {
            console.log('valid prop: ' + prop);
            style[prop] = props[prop];
        }
    }
    return style;
}

export const Flex = (props) => {
    return (
        <Box 
            className={flexContainer}
            style={{
                ...props.style,
                ...parseProps(props),
            }}
            {...props}
        />
    );
}