import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import StudentExamPickerPage from "../pages/StudentExamPickerPage";
import InstructorExamPickerPage from "../pages/InstructorExamPickerPage";
import MasterContext from "../reducer/context";

// Makes sure user has access to a user page and then directs them to the appropriate user page
const ExamPickerPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        !state.isLoggedIn ?
        <Redirect to="/" />
        : state.userType == 'student' ?
            <StudentExamPickerPage />
            : <InstructorExamPickerPage />
    );
}

export default ExamPickerPageHandler;