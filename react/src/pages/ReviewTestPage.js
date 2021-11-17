import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Textbox } from "../components/Textbox";
import { queryServer } from "../util/helpers";
import { Flex } from "../components/Flex";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import MasterContext from "../reducer/context";
import AceEditor from "react-ace";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

import "ace-builds/src-noconflict/mode-python";

const { max, min } = Math;

const ReviewTestPage = (props) => {
    const { state } = useContext(MasterContext);
    const { testID } = state;
    const [ localState, setLocalState ] = useState({
        answerPool: null,
        currentExamQuestion: null,
        success: false,
        currentAnswerIdx: 0,
        feedback: {}
    });
    const {
        answerPool, currentExamQuestion, success,
        currentAnswerIdx, feedback
    } = localState;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const currentAnswer = answerPool && answerPool[currentAnswerIdx];

    const populateAnswerPool = (res) => {
        if(!res.data) {
            // TODO: add error handling
            return;
        }
        setLocalState({
            ...localState,
            answerPool: res.data,
        });
    }

    const setExamQuestion = (res) => {
        if(!res.data) {
            // TODO: add error handling
            return;
        }
        const newExamQuestion = res.data[0];
        setLocalState({
            ...localState,
            currentExamQuestion: newExamQuestion,
            feedback: {
                ...feedback,
                [currentAnswer.test_answer_id]: {
                    ...feedback[currentAnswer.test_answer_id],
                    ...(feedback[currentAnswer.test_answer_id]?.point_value ? {} : {point_value: newExamQuestion.point_value}),
                }
            }
        });
    }

    if(!answerPool) {
        queryServer('get_test_answer', {
            id: userID,
            sesID: sesID,
            test_id: testID,
        }, populateAnswerPool);
    } else if(!answerPool.length) {
        console.log('INVALID TEST');
    } else if(currentExamQuestion === null) {
        queryServer('get_exam_question', {
            id: userID,
            sesID: sesID,
            exam_question_id: currentAnswer.exam_question_id
        }, setExamQuestion);
    }

    return (
        !success ?
        <UserPage pageTitle="Review Exam" {...props}>
            {currentAnswer &&
            <Flex flexDirection="column">
                {answerPool && answerPool.length > 1 &&
                <Button
                    onClick={() => {
                        const newIdx = (currentAnswerIdx + 1) < answerPool.length ? currentAnswerIdx + 1 : 0;
                        const newTestAnswerId = answerPool[newIdx].test_answer_id
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
                    height={200}
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
                <div>
                    Points:
                </div>
                <Input
                    type="number"
                    value={(feedback[currentAnswer.test_answer_id] && feedback[currentAnswer.test_answer_id].points) || 0}
                    onChange={(value) => {
                        const curFeedback = feedback[currentAnswer.test_answer_id];
                        setLocalState({
                            ...localState,
                            feedback: {
                                ...feedback,
                                [currentAnswer.test_answer_id]: {
                                    ...curFeedback,
                                    points: max(0, min(currentExamQuestion.point_value, Number(value))),
                                }
                            }
                        });
                    }}
                />
                <Button
                    onClick={() => {
                        if(currentAnswer && Object.keys(feedback).length === answerPool.length) {
                            queryServer('add_many_feedback', {
                                id: userID,
                                sesID: sesID,
                                test_id: testID,
                                feedback_list: answerPool.map((answer) => ({
                                    test_answer_id: answer.test_answer_id,
                                    feedback: feedback[answer.test_answer_id].feedback,
                                    point: feedback[answer.test_answer_id].points,
                                    status: 'grouper',
                                })),
                            }, () => {
                                setLocalState({...localState, success: true});
                                console.log('get test')
                                queryServer('get_test', {
                                    id: userID,
                                    sesID: sesID,
                                    test_id: testID
                                }, (res) => {
                                    console.log('update score');
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
            }
        </UserPage>
        : <Redirect to="/"/>
    );
};

export default ReviewTestPage;