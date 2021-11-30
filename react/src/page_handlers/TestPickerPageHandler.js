import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import TestPickerPage from "../pages/TestPickerPage";
import MasterContext from "../reducer/context";

// Makes sure user has access to a user page and then directs them to the appropriate user page
const TestPickerPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        state.isLoggedIn && state.userType == 'instructor' && state.examID ?
        <TestPickerPage />
        : <Redirect to="/" />
    );
}

export default TestPickerPageHandler;