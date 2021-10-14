import React, { useState } from "react";
import { Box } from "./Box.js";

export const Input = (props) => {
    const [value, setValue] = useState(props.defaultValue);
    const [receivedInput, setReceivedInput] = useState(false);
    const [type, setType] = useState(props.type ? props.type : "text");
    return (
        type === "textbox" ? 
        <textarea
            onChange={(e) => {
                const target = e.target.value;
                setValue(target);
                if(target) {
                    setReceivedInput(true);
                }
                const onChange = props.onChange;
                if(onChange) {
                    onChange(target);
                }
            }}
            onFocus={(e) => {
                if(!receivedInput) {
                    setValue("");
                }                    
            }}
            onBlur={(e) => {
                if(!value) {
                    if(props.isPassword) {
                        setType("text");
                    }
                    setReceivedInput(false);
                    setValue(props.defaultValue);
                }
            }}
        /> :
        <Box>
            <input
                type={type}
                value={value}
                onChange={(e) => {
                    const target = e.target.value;
                    setValue(target);
                    if(target) {
                        if(props.isPassword) {
                            setType("password");
                        }
                        setReceivedInput(true);
                    }
                    
                    const onChange = props.onChange;
                    if(onChange) {
                        onChange(target);
                    }
                }}
                onFocus={(e) => {
                    if(!receivedInput) {
                        setValue("");
                    }                    
                }}
                onBlur={(e) => {
                    if(!value) {
                        if(props.isPassword) {
                            setType("text");
                        }
                        setReceivedInput(false);
                        setValue(props.defaultValue);
                    }
                }}
            />
        </Box>
    );
}