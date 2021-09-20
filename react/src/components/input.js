import React, { useState } from "react";
import { Box } from "./box.js";

export const Input = (props) => {
    const [value, setValue] = useState(props.defaultValue);
    const [receivedInput, setReceivedInput] = useState(false);
    return (
        <Box>
            <input
                type={props.type ? props.type : "text"}
                value={value}
                onChange={(e) => {
                    const target = e.target.value;
                    setValue(target);
                    if(target) {
                        setReceivedInput(true);
                    }
                    
                    const onChange = props.onChange;
                    if(onChange) {
                        onChange();
                    }
                }}
                onFocus={(e) => {
                    if(!receivedInput) {
                        setValue("");
                    }                    
                }}
                onBlur={(e) => {
                    if(!value) {
                        setReceivedInput(false);
                        setValue(props.defaultValue);
                    }
                }}
            />
        </Box>
    );
}