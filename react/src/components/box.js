import React from "react";
import { parseProps } from "../util/helpers"

const validProps = [
    "backgroundColor",
    "height",
    "width",
    "padding",
    "borderStyle",
    "borderWidth",
    "borderColor",
    "fontStyle",
    "fontWeight",
    "color",
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