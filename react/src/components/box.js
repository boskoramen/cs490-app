import React from "react";
import { parseProps } from "../util/helpers.js"

const validProps = [
    "backgroundColor",
    "height",
    "width",
]
export const Box = (props) => {
    return (
        <div 
            {...props}
            style={{
                ...props.style,
                ...parseProps(props, validProps),
            }}
        />
    );
}