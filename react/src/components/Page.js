import React from "react";
import { Box } from "./Box.js";

export const Page = (props) => {
    return (
        <Box 
            {...props}
            width={props.width === undefined ? "100%" : props.width}
        />
    );
}
