import React from "react";
import { parseProps } from "../util/helpers.js"

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
export const Button = (props) => {
    return (
        <button
            {...props} 
            style={{
                ...props.style,
                ...parseProps(props, validProps),
            }}
            onClick={() => {
                const onClick = props.onClick;
                if(onClick) {
                    onClick();
                }
            }}
        />
    );
}