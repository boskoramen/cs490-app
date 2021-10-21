import React from "react";
import UserPage from "./UserPage";
import { Link } from "react-router-dom";

const StudentPage = (props) => {
    return (
        <UserPage pageTitle="Student Page">
            <Link to="/exam_picker">
                Take an Exam
            </Link>
        </UserPage>
    );
}

export default StudentPage;