import React, { useState } from "react";
import { boxProps } from "../util/constants.js";
import { parseProps, addClassNames } from "../util/helpers.js"
import { Box } from "./Box.js";
import classNames from "classnames";

export const Input = (props) => {
    const defaultValue = props.defaultValue || '';
    const [ focused, setFocused ] = useState(false);
    const { onChange, onClick, onFocus, onBlur } = props;
    let value = props.value === undefined ? '' : props.value;
    let type = props.type ? props.type : "text";
    if(value === '') {
        if(!focused) {
            if(props.isPassword) {
                type = 'text';
            }
            value = defaultValue;
        }
    } else if(props.isPassword) {
        type = 'password';
    }

    const newProps = {
        value,
        onChange: (e) => {
            const target = e.target.value;
            if(onChange) {
                onChange(target);
            }
        },
        onClick: (e) => {
            if(onClick) {
                onClick();
            }
        },
        onFocus: (e) => {
            if(onFocus) {
                onFocus();
            }
            setFocused(true);
        },
        onBlur: (e) => {
            if(onBlur) {
                onBlur();
            }
            setFocused(false);
        },
        style: {
            ...props.style,
            ...parseProps(props, boxProps),
        },
    }

    return (
        type === "textbox" ?
        <textarea
            {...newProps}
            className={classNames(props.classNames)}
        /> :
        <Box>
            <input
                {...newProps}
                type={type}
                checked={props.checked}
                className={classNames(props.classNames)}
            />
        </Box>
    );
}