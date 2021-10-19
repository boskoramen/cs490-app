import React from "react";
import UserPage from "./UserPage";
import { Link } from "react-router-dom";

const StudentPage = (props) => {
    return (
        <UserPage pageTitle="Student Page">
            <Link to="/create_question">
                Create Question
            </Link>
        </UserPage>
    );
}

export default StudentPage;