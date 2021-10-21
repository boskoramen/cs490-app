import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import ExamPickerPage from "../pages/ExamPickerPage";
import MasterContext from "../reducer/context";

// Makes sure user has access to a user page and then directs them to the appropriate user page
const ExamPickerPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        !state.isLoggedIn && state.userType != 'student' ?
        <Redirect to="/" />
        : <ExamPickerPage />
    );
}

export default ExamPickerPageHandler;