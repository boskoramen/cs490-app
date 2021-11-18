import React from 'react';
import { parseProps } from '../util/helpers'
import { pickHTMLProps } from 'react-sanitize-dom-props';
// TODO: implement classNames per https://stackoverflow.com/questions/38382153/multiple-classnames-with-css-modules-and-react
// import classNames from 'classnames';

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