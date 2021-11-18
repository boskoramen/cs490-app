import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Textbox } from "../components/Textbox";
import { queryServer } from "../util/helpers";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import MasterContext from "../reducer/context";
import AceEditor from "react-ace";
import { Button } from "../components/Button";

import "ace-builds/src-noconflict/mode-python";

const { max, min } = Math;

const ReviewTestPage = (props) => {
    const { state } = useContext(MasterContext);
    const { test } = state;
    const {
        username, test_answer_data,
    } = test;
    const [ localState, setLocalState ] = useState({
        currentExamQuestion: null,
        success: false,
        currentAnswerIdx: 0,
        feedback: {}
    });
    const {
        success, currentAnswerIdx, feedback
    } = localState;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const currentAnswer = test_answer_data[currentAnswerIdx];
    const testCaseData = JSON.parse(currentAnswer.test_case_score);
    return (
        !success ?
        <UserPage pageTitle="Review Exam" {...props}>
            <Flex flexDirection="column">
                {test_answer_data.length > 1 &&
                <Button
                    onClick={() => {
                        const newIdx = (currentAnswerIdx + 1) < test_answer_data.length ? currentAnswerIdx + 1 : 0;
                        const newTestAnswerId = test_answer_data[newIdx].test_answer_id
                        setLocalState({
                            ...localState,
                            currentAnswerIdx: newIdx,
                            currentExamQuestion: null,
                            feedback: {
                                ...feedback,
                                [newTestAnswerId]: {
                                    ...feedback[newTestAnswerId],
                                    ...(feedback[newTestAnswerId]?.feedback ? {} : {feedback: ''})
                                }
                            },
                        });
                    }}
                >
                    Next
                </Button>
                }
                <AceEditor
                    mode="python"
                    name="code-editor"
                    readOnly={true}
                    value={currentAnswer.answer || ""}
                    height="200px"
                />
                <div>
                    Feedback:
                </div>
                <Textbox
                    value={feedback[currentAnswer.test_answer_id]?.feedback || ''}
                    onChange={(value) => {
                        const curFeedback = feedback[currentAnswer.test_answer_id];
                        setLocalState({
                            ...localState,
                            feedback: {
                                ...feedback,
                                [currentAnswer.test_answer_id]: {
                                    ...curFeedback,
                                    feedback: value,
                                }
                            }
                        });
                    }}
                />
                <Flex
                    flexDirection="column"
                >
                    {Object.keys(testCaseData.constraints).map((constraint) => {
                        return (
                            <Flex
                                key={constraint}
                                backgroundColor="gray"
                            >
                                <Box
                                >
                                    Constraint {constraint}:
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {testCaseData.constraints[constraint]}
                                </Box>
                            </Flex>
                        );
                    })}
                    {Object.keys(testCaseData.test_case).map((testCase) => {
                        return (
                            <Flex
                                key={testCase}
                                backgroundColor="gray"
                            >
                                <Box
                                >
                                    Test Case {testCase}:
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {testCaseData.test_case[testCase].individual_score}
                                </Box>
                            </Flex>
                        );
                    })}
                </Flex>
                <Button
                    onClick={() => {
                        if(currentAnswer && Object.keys(feedback).length === test_answer_data.length) {
                            queryServer('add_many_feedback', {
                                id: userID,
                                sesID: sesID,
                                test_id: testID,
                                feedback_list: test_answer_data.map((answer) => ({
                                    test_answer_id: answer.test_answer_id,
                                    feedback: feedback[answer.test_answer_id].feedback,
                                    point: feedback[answer.test_answer_id].points,
                                    status: 'grouper',
                                })),
                            }, () => {
                                setLocalState({...localState, success: true});
                                queryServer('get_test', {
                                    id: userID,
                                    sesID: sesID,
                                    test_id: testID
                                }, (res) => {
                                    queryServer('update_score', {
                                        id: userID,
                                        sesID: sesID,
                                        student_id: res[0].student_id,
                                        test_id: testID,
                                    }, () => {setLocalState({...localState, success: true});});
                                });
                            });
                        }
                    }}
                >
                    Submit
                </Button>
            </Flex>
        </UserPage>
        : <Redirect to="/"/>
    );
};

export default ReviewTestPage;