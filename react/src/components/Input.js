import React, { useState } from "react";
import { boxProps } from "../util/constants.js";
import { parseProps, addClassNames } from "../util/helpers.js"
import { Box } from "./Box.js";

export const Input = (props) => {
    const defaultValue = props.defaultValue || '';
    const [ focused, setFocused ] = useState(false);

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
            const onChange = props.onChange;
            if(onChange) {
                onChange(target);
            }
        },
        onClick: (e) => {
            const onClick = props.onClick;
            if(onClick) {
                onClick();
            }
        },
        onFocus: (e) => {
            setFocused(true);
        },
        onBlur: (e) => {
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
        /> :
        <Box>
            <input
                {...newProps}
                type={type}
                checked={props.checked}
            />
        </Box>
    );
}