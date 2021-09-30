import React from 'react';
import { parseProps } from '../util/helpers'
import { pickHTMLProps } from 'react-sanitize-dom-props';

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
            {...pickHTMLProps(props)}
            style={{
                ...props.style,
                ...parseProps(props, validProps),
            }}
        />
    );
}