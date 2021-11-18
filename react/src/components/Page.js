import React from "react";
import { Box } from "./Box.js";
import styles from "../styles/main.scss";

const { page } = styles;

export const Page = (props) => {
    return (
        <Box
            {...props}
            className={page}
        />
    );
}
