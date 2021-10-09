import React from "react";
import CodingPracticePage from "./CodingPracticePage.js";

export const InstructorPage = (props) => {
    console.log(`instructor page cookie: ${document.cookie}`);
    return (
        <CodingPracticePage pageTitle="Instructor Page"/>
    );
}