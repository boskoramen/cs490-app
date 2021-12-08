import React, { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import StudentPage from "../pages/StudentPage";
import InstructorPage from "../pages/InstructorPage";
import MasterContext from "../reducer/context";
import CreateExamPage from "../pages/CreateExamPage";
import CreateQuestionPage from "../pages/CreateQuestionPage";

// Makes sure user has access to a user page and then directs them to the appropriate user page
const UserPageHandler = (props) => {
    const { state, dispatch } = useContext(MasterContext);

    if(!state.isLoggedIn) {
        return <Redirect to="/login" />;
    }
    return <CreateQuestionPage />;
    return (
        state.userType === "student" ?
        <StudentPage /> :
        <InstructorPage />
    );
}

export default UserPageHandler;