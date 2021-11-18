import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import TestResultsPage from "../pages/TestResultsPage";
import MasterContext from "../reducer/context";

// Makes sure user has access to a user page and then directs them to the appropriate user page
const TestResultsPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        !state.isLoggedIn || state.userType != 'student' || !state.gradeTest ?
        <Redirect to="/" />
        : <TestResultsPage />
    );
}

export default TestResultsPageHandler;