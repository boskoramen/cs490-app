import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import StudentPage from "../pages/StudentPage";
import InstructorPage from "../pages/InstructorPage";
import MasterContext from "../reducer/context";

// Makes sure user has access to a user page and then directs them to the appropriate user page
const UserPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    if(!state.isLoggedIn) {
        return <Redirect to="/login" />;
    }
    return (
        state.userType === "student" ?
        <StudentPage /> :
        <InstructorPage />
    );
}

export default UserPageHandler;