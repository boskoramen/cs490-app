import React from "react";
import { Button } from "../components/Button.js";
import CodingPracticePage from "./CodingPracticePage.js";
import { Flex } from "../components/Flex.js";
import { actions } from "../reducer/constants.js";

const headerFunction = (props, dispatch) => {
    return (
        <Flex width={props.width ? props.width : "1080px"} justifyContent="space-between">
            <div>
                {props.pageTitle}
            </div>
            <Button
                onClick={() => dispatch({type: actions.setLoggedIn, value: false})}
            >
                Log Out
            </Button>
        </Flex>
    );
}

const UserPage = (props) => {
    return (
        <CodingPracticePage {...props} headerFunction={headerFunction} />
    );
}

export default UserPage;