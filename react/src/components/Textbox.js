import React from "react";
import { Input } from "./Input";

export const Textbox = (props) => {
    return (
        <Input
            {...props}
            type="textbox"
        />
    );
}