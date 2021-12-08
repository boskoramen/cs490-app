import React, { useContext } from "react";
import CodingPracticePage from "./CodingPracticePage.js";
import { Button } from "../components/Button.js";
import { actions } from "../reducer/constants.js";
import { generateHeaderComp, addClassNames } from "../util/helpers.js";
import MasterContext from "../reducer/context.js";
import styles from "../styles/main.scss";
import cookie from "react-cookies";

const { codingPracticeTitleButton } = styles;

const UserPage = (props) => {
    const { dispatch } = useContext(MasterContext);
    const headerComponents = props.headerComponents || [];

    const LogoutButton = (props) => (
        <Button
            classNames={addClassNames(codingPracticeTitleButton)}
            onClick={() => {
                cookie.remove('sesID');
                cookie.remove('userID');
                dispatch({type: actions.setLoggedIn, value: false});
            }}
        >
            Log Out
        </Button>
    );

    return (
        <CodingPracticePage
            {...props}
            headerComponents={[
                ...headerComponents,
                generateHeaderComp(LogoutButton),
            ]}
        />
    );
}

export default UserPage;