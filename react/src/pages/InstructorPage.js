import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Box } from "../components/Box";
import { Flex } from "../components/Flex";
import { Button } from "../components/Button";
import { queryServer } from "../util/helpers";
import cookie from "react-cookies";
import { actions } from "../reducer/constants";
import MasterContext from "../reducer/context";
import { generateHeaderComp } from "../util/helpers.js";
import styles from "../styles/main.scss";

const { roundButton, codingPracticeTitleButton } = styles;

const InstructorPage = (props) => {
    const { dispatch } = useContext(MasterContext);
    const [ localState, setLocalState ] = useState({
        exams: [],
        checkedExams: false,
        redirectTo: null,
    });
    const { exams, checkedExams, redirectTo } = localState;
    const history = useHistory();
    const headerComponents = props.headerComponents || [];

    if(redirectTo !== null) {
        return <Redirect to={redirectTo} />;
    }

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

    const CreateQuestionButton = (props) => (
        <Button
            className={codingPracticeTitleButton}
            onClick={() => {
                setLocalState({
                    ...localState,
                    redirectTo: '/create_question'
                });
            }}
        >
            Create Question
        </Button>
    );

    const userID = cookie.load('userID');
    if(!checkedExams) {
        queryServer('get_all_exam', {
            instructor_id: userID,
        }, setExams);
    }

    return (
        <UserPage
            pageTitle="Instructor Page"
            headerComponents={[
                ...headerComponents,
                generateHeaderComp(CreateQuestionButton),
            ]}
        >
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
                        <Box
                            className={roundButton}
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
                        </Box>
                    ))}
                </Flex>
            </Flex>
        </UserPage>
    );
}

export default InstructorPage;