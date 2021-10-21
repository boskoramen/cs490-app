import React, { useState } from "react";
import { Box } from "./Box.js";

export const Input = (props) => {
    const defaultValue = props.defaultValue || '';
    const [ focused, setFocused ] = useState(false);

    let value = props.value || '';
    let type = props.type ? props.type : "text";
    if(!value) {
        if(!focused) {
            if(props.isPassword) {
                type = 'text';
            }
            value = defaultValue;
        }
    } else if(props.isPassword) {
        type = 'password';
    }
    
    return (
        type === "textbox" ? 
        <textarea
            onChange={(e) => {
                const target = e.target.value;
                const onChange = props.onChange;
                if(onChange) {
                    onChange(target);
                }
            }}
            onFocus={(e) => {
                setFocused(true);                  
            }}
            onBlur={(e) => {
                setFocused(false);
            }}
        /> :
        <Box>
            <input
                type={type}
                value={value}
                onChange={(e) => {
                    const target = e.target.value;                    
                    const onChange = props.onChange;
                    if(onChange) {
                        onChange(target);
                    }
                }}
                onFocus={(e) => {
                    setFocused(true);               
                }}
                onBlur={(e) => {
                    setFocused(false);
                }}
            />
        </Box>
    );
}