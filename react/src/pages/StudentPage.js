import React from "react";
import UserPage from "./UserPage";
import { queryServer } from "../util/helpers";
import { Link } from "react-router-dom";
import cookie from "react-cookies";

const StudentPage = (props) => {
    const userID = cookie.load('userID');
    queryServer('get_all_exam', {
        usertype: 'student',
        id: userID,
    });
    return (
        <UserPage pageTitle="Student Page">
            <Link to="/exam_picker">
                Take an Exam
            </Link>
        </UserPage>
    );
}

export default StudentPage;