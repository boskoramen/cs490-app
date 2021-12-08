import React from "react";
import { parseProps } from "../util/helpers.js"
import { pickHTMLProps } from 'react-sanitize-dom-props';
import classNames from 'classnames';

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
            {...pickHTMLProps(props)}
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
            className={classNames(props.classNames)}
        />
    );
}