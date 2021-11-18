import React, { useState } from "react";
import { Input } from "./Input";

export const Checkbox = (props) => {
    return (
        <Input
            {...props}
            type="checkbox"
            checked={props.checked}
        />
    );
}