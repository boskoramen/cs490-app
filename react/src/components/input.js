import React, { useState } from "react";
import { Box } from "./box.js";

export const Input = (props) => {
    const [value, setValue] = useState(props.defaultValue);
    return (
        <Box>
            <input
                type={props.type ? props.type : "text"}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    
                    const onChange = props.onChange;
                    if(onChange) {
                        onChange();
                    }
                }}
            />
        </Box>
    );
}