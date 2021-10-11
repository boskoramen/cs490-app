import React from "react";
import { Button } from "../components/Button.js";
import CodingPracticePage from "./CodingPracticePage.js";

const UserPage = (props) => {
    return (
        <CodingPracticePage {...props}>
            <Button>
                Log Out
            </Button>
            {props.children}
        </CodingPracticePage>
    );
}

export default UserPage;