import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import { queryServer, addClassNames } from "../util/helpers";
import { useHistory } from "react-router-dom";
import cookie from "react-cookies";
import MasterContext from "../reducer/context";
import { actions } from "../reducer/constants";
import styles from "../styles/main.scss";

const { roundButton } = styles;

const StudentPage = (props) => {
    const { dispatch } = useContext(MasterContext);
    const [ localState, setLocalState ] = useState({
        exams: null
    });
    const {
        exams,
    } = localState;
    const history = useHistory();

    const userID = cookie.load('userID');

    const handleGetExams = (res) => {
        let newExams;
        if(!res.data) {
            newExams = [];
        } else {
            newExams = res.data;
        }

        setLocalState({
            ...localState,
            exams: newExams,
        });
    }

    if(!exams) {
        queryServer('get_all_exam', {
            usertype: 'student',
            id: userID,
        }, handleGetExams);
    }
    return (
        <UserPage pageTitle="Student Page">
            <Flex
                flexDirection="column"
            >
                <Box>
                    To Take:
                </Box>
                <Flex>
                    {exams?.not_taken.map((exam, idx) => (
                        <div
                            classNames={addClassNames(roundButton)}
                            key={idx}
                        >
                            <a
                                onClick={() => {
                                    history.push('/take_exam');
                                    dispatch({type: actions.takeExam, value: exam.exam_id});
                                }}
                            >
                                {exam.name}
                            </a>
                        </div>
                    ))}
                </Flex>
                <Box>
                    Reviewed:
                </Box>
                <Flex>
                    {exams?.taken.map((exam, idx) => (
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
                                    history.push('/view_exam_results');
                                    dispatch({type: actions.seeResults, value: exam});
                                }}
                            >
                                {exam.name}
                            </a>
                        </div>
                    ))}
                </Flex>
            </Flex>
        </UserPage>
    );
}

export default StudentPage;