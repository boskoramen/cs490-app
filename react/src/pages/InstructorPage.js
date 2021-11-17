import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Link, useHistory } from "react-router-dom";
import { Flex } from "../components/Flex";
import { queryServer } from "../util/helpers";
import cookie from "react-cookies";
import { actions } from "../reducer/constants";
import MasterContext from "../reducer/context";

const InstructorPage = (props) => {
    const { dispatch } = useContext(MasterContext);
    const [ localState, setLocalState ] = useState({
        exams: [],
        checkedExams: false,
    });
    const { exams, checkedExams } = localState;
    const history = useHistory();

    const setExams = (res) => {
        if(!res.data) {
            return;
        }

        setLocalState({
            ...localState,
            exams: res.data,
            checkedExams: true,
        });
    }

    const userID = cookie.load('userID');
    if(!checkedExams) {
        queryServer('get_all_exam', {
            instructor_id: userID,
        }, setExams);
    }

    return (
        <UserPage pageTitle="Instructor Page">
            <Flex flexDirection="column">
                <div>
                    Section 001
                </div>
                <Link to="/create_exam">
                    Create Exam
                </Link>
                <div>
                    Exams:
                </div>
                <Flex>
                    {exams.map((exam, idx) => (
                        <div
                            style={{
                                border: "2px solid red",
                                borderRadius: "5px",
                                padding: "5px"
                            }}
                            key={idx}
                        >
                            <a
                                onClick={() => {
                                    history.push('/review_exam_results');
                                    dispatch({type: actions.seeTests, value: exam.exam_id});
                                }}
                            >
                                {exam.name}
                            </a>
                        </div>
                    ))}
                </Flex>
                <Link to="/create_question">
                    Create Question
                </Link>
                <Link to="/exam_picker">
                    Review Exam
                </Link>
            </Flex>
        </UserPage>
    );
}

export default InstructorPage;