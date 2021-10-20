import React from "react";
import UserPage from "./UserPage";
import { Link } from "react-router-dom";
import { Flex } from "../components/Flex";

const InstructorPage = (props) => {
    return (
        <UserPage pageTitle="Instructor Page">
            <Flex flexDirection="column">
                <Link to="/create_question">
                    Create Question
                </Link>
                <Link to="/create_exam">
                    Create Exam
                </Link>
            </Flex>
        </UserPage>
    );
}

export default InstructorPage;